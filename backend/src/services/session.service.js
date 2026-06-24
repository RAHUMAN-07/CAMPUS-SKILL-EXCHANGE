import prisma from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new session request (student → teacher)
 */
export async function createSession(studentId, { teacherId, skillId, userSkillId, scheduledAt, durationMinutes, topic, message }) {
  // Verify teacher has this skill as TEACH
  const teacherSkill = await prisma.userSkill.findFirst({
    where: { userId: teacherId, skillId, type: 'TEACH', isActive: true },
  });

  if (!teacherSkill) {
    const error = new Error('Teacher does not offer this skill');
    error.statusCode = 400;
    throw error;
  }

  // Can't book session with yourself
  if (studentId === teacherId) {
    const error = new Error('Cannot book a session with yourself');
    error.statusCode = 400;
    throw error;
  }

  // Generate a unique meeting link (placeholder)
  const meetingLink = `https://meet.campusskill.exchange/${uuidv4().slice(0, 8)}`;

  const session = await prisma.session.create({
    data: {
      teacherId,
      studentId,
      skillId,
      userSkillId: userSkillId || teacherSkill.id,
      scheduledAt: new Date(scheduledAt),
      durationMinutes,
      topic: topic || null,
      message: message || null,
      meetingLink,
    },
    include: {
      teacher: { select: { id: true, name: true, email: true, profilePhotoUrl: true } },
      student: { select: { id: true, name: true, email: true, profilePhotoUrl: true } },
      skill: { include: { category: true } },
    },
  });

  // Create notification for teacher
  await prisma.notification.create({
    data: {
      userId: teacherId,
      type: 'SESSION_REQUEST',
      title: 'New Session Request',
      message: `${session.student.name} wants to learn ${session.skill.name} from you!`,
      data: { sessionId: session.id },
    },
  });

  return session;
}

/**
 * Get user's sessions with filters
 */
export async function getUserSessions(userId, { status, role, page = 1, limit = 20 }) {
  const where = {
    OR: [{ teacherId: userId }, { studentId: userId }],
  };

  if (status) where.status = status;
  if (role === 'teacher') {
    delete where.OR;
    where.teacherId = userId;
  }
  if (role === 'student') {
    delete where.OR;
    where.studentId = userId;
  }

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where,
      include: {
        teacher: { select: { id: true, name: true, profilePhotoUrl: true, university: true } },
        student: { select: { id: true, name: true, profilePhotoUrl: true, university: true } },
        skill: { include: { category: true } },
        reviews: { select: { id: true, reviewerId: true, overallRating: true } },
      },
      orderBy: { scheduledAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.session.count({ where }),
  ]);

  return {
    sessions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Get session detail
 */
export async function getSessionById(sessionId, userId) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      teacher: { select: { id: true, name: true, email: true, profilePhotoUrl: true, university: true, trustScore: true } },
      student: { select: { id: true, name: true, email: true, profilePhotoUrl: true, university: true, trustScore: true } },
      skill: { include: { category: true } },
      reviews: {
        include: { reviewer: { select: { id: true, name: true, profilePhotoUrl: true } } },
      },
    },
  });

  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  // Only participants can view session details
  if (session.teacherId !== userId && session.studentId !== userId) {
    const error = new Error('Not authorized to view this session');
    error.statusCode = 403;
    throw error;
  }

  return session;
}

/**
 * Accept a session request (teacher only)
 */
export async function acceptSession(sessionId, userId) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });

  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.teacherId !== userId) throw Object.assign(new Error('Only the teacher can accept'), { statusCode: 403 });
  if (session.status !== 'PENDING') throw Object.assign(new Error('Session is not pending'), { statusCode: 400 });

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'ACCEPTED' },
    include: {
      teacher: { select: { id: true, name: true } },
      student: { select: { id: true, name: true } },
      skill: true,
    },
  });

  // Notify student
  await prisma.notification.create({
    data: {
      userId: session.studentId,
      type: 'SESSION_ACCEPTED',
      title: 'Session Accepted!',
      message: `${updated.teacher.name} accepted your ${updated.skill.name} session!`,
      data: { sessionId },
    },
  });

  return updated;
}

/**
 * Decline a session request (teacher only)
 */
export async function declineSession(sessionId, userId) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });

  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.teacherId !== userId) throw Object.assign(new Error('Only the teacher can decline'), { statusCode: 403 });
  if (session.status !== 'PENDING') throw Object.assign(new Error('Session is not pending'), { statusCode: 400 });

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: 'Declined by teacher' },
    include: { teacher: { select: { name: true } }, student: { select: { id: true } }, skill: true },
  });

  await prisma.notification.create({
    data: {
      userId: session.studentId,
      type: 'SESSION_DECLINED',
      title: 'Session Declined',
      message: `${updated.teacher.name} couldn't accept your ${updated.skill.name} session. Try another teacher!`,
      data: { sessionId },
    },
  });

  return updated;
}

/**
 * Cancel a session (either party)
 */
export async function cancelSession(sessionId, userId, reason) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });

  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (session.teacherId !== userId && session.studentId !== userId) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }
  if (['COMPLETED', 'CANCELLED'].includes(session.status)) {
    throw Object.assign(new Error('Session cannot be cancelled'), { statusCode: 400 });
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: reason || 'Cancelled by participant' },
  });

  // Notify the other party
  const otherUserId = session.teacherId === userId ? session.studentId : session.teacherId;
  await prisma.notification.create({
    data: {
      userId: otherUserId,
      type: 'SESSION_CANCELLED',
      title: 'Session Cancelled',
      message: 'A session has been cancelled.',
      data: { sessionId },
    },
  });

  return updated;
}

/**
 * Confirm session completion (both parties must confirm)
 */
export async function confirmSession(sessionId, userId) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });

  if (!session) throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  if (!['ACCEPTED', 'IN_PROGRESS'].includes(session.status)) {
    throw Object.assign(new Error('Session must be accepted first'), { statusCode: 400 });
  }

  const isTeacher = session.teacherId === userId;
  const isStudent = session.studentId === userId;
  if (!isTeacher && !isStudent) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });

  const updateData = {};
  if (isTeacher) updateData.teacherConfirmed = true;
  if (isStudent) updateData.studentConfirmed = true;

  // Check if both will be confirmed
  const bothConfirmed =
    (isTeacher && session.studentConfirmed) ||
    (isStudent && session.teacherConfirmed);

  if (bothConfirmed) {
    updateData.status = 'COMPLETED';
    updateData.completedAt = new Date();
  } else {
    updateData.status = 'IN_PROGRESS';
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: updateData,
    include: {
      teacher: { select: { id: true, name: true } },
      student: { select: { id: true, name: true } },
      skill: true,
    },
  });

  if (bothConfirmed) {
    // Update session counts on user skills
    await prisma.userSkill.updateMany({
      where: { userId: session.teacherId, skillId: session.skillId, type: 'TEACH' },
      data: { sessionCount: { increment: 1 } },
    });

    // Notify both parties
    const notificationData = {
      type: 'SESSION_COMPLETED',
      title: 'Session Completed! 🎉',
      message: `Your ${updated.skill.name} session is complete. Leave a review!`,
      data: { sessionId },
    };
    await prisma.notification.createMany({
      data: [
        { ...notificationData, userId: session.teacherId },
        { ...notificationData, userId: session.studentId },
      ],
    });
  }

  return updated;
}
