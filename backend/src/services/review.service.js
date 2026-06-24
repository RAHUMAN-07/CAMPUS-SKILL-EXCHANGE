import prisma from '../config/database.js';

/**
 * Submit a review for a completed session
 */
export async function createReview(reviewerId, { sessionId, overallRating, comment }) {
  // Verify session exists and is completed
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.status !== 'COMPLETED') {
    throw Object.assign(new Error('Can only review completed sessions'), { statusCode: 400 });
  }

  // Determine reviewee (the other party)
  const isTeacher = session.teacherId === reviewerId;
  const isStudent = session.studentId === reviewerId;
  if (!isTeacher && !isStudent) {
    throw Object.assign(new Error('Not a participant in this session'), { statusCode: 403 });
  }
  const revieweeId = isTeacher ? session.studentId : session.teacherId;

  // Check if already reviewed
  const existing = await prisma.review.findUnique({
    where: { sessionId_reviewerId: { sessionId, reviewerId } },
  });
  if (existing) throw Object.assign(new Error('You already reviewed this session'), { statusCode: 409 });

  // Create the review (public after 48 hours)
  const publishedAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const review = await prisma.review.create({
    data: {
      sessionId,
      reviewerId,
      revieweeId,
      overallRating,
      comment,
      publishedAt,
    },
    include: {
      reviewer: { select: { id: true, name: true, profilePhotoUrl: true } },
      session: { include: { skill: true } },
    },
  });

  // Update the reviewee's average rating on their user skill
  await updateUserSkillRating(revieweeId, session.skillId);

  // Notify the reviewee
  await prisma.notification.create({
    data: {
      userId: revieweeId,
      type: 'NEW_REVIEW',
      title: 'New Review',
      message: `You received a ${overallRating}-star review!`,
      data: { reviewId: review.id, sessionId },
    },
  });

  return review;
}

/**
 * Get reviews for a user
 */
export async function getUserReviews(userId, { page = 1, limit = 20 }) {
  const now = new Date();
  const where = {
    revieweeId: userId,
    OR: [
      { isPublic: true },
      { publishedAt: { lte: now } },
    ],
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        reviewer: { select: { id: true, name: true, profilePhotoUrl: true } },
        session: { include: { skill: { include: { category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Get reviews for a session
 */
export async function getSessionReviews(sessionId) {
  return prisma.review.findMany({
    where: { sessionId },
    include: {
      reviewer: { select: { id: true, name: true, profilePhotoUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Reply to a review
 */
export async function replyToReview(reviewId, userId, reply) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw Object.assign(new Error('Review not found'), { statusCode: 404 });
  if (review.revieweeId !== userId) {
    throw Object.assign(new Error('Only the reviewee can reply'), { statusCode: 403 });
  }
  if (review.reply) throw Object.assign(new Error('Already replied to this review'), { statusCode: 409 });

  return prisma.review.update({
    where: { id: reviewId },
    data: { reply, repliedAt: new Date(), isPublic: true },
    include: {
      reviewer: { select: { id: true, name: true, profilePhotoUrl: true } },
    },
  });
}

// ─── HELPERS ──────────────────────────────────────────

async function updateUserSkillRating(userId, skillId) {
  const reviews = await prisma.review.findMany({
    where: {
      revieweeId: userId,
      session: { skillId },
    },
    select: { overallRating: true },
  });

  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
    await prisma.userSkill.updateMany({
      where: { userId, skillId, type: 'TEACH' },
      data: { avgRating: Math.round(avg * 100) / 100, reviewCount: reviews.length },
    });
  }
}
