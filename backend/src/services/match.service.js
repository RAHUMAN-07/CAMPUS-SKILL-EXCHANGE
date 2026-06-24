import prisma from '../config/database.js';

/**
 * Search for teachers of a specific skill with basic ranking
 * Phase 1: rank by rating + session count
 * Phase 2: weighted multi-factor scoring
 */
export async function searchTeachers({ skillId, level, page = 1, limit = 10 }) {
  const where = {
    skillId,
    type: 'TEACH',
    isActive: true,
  };
  if (level) where.proficiencyLevel = level;

  const [results, total] = await Promise.all([
    prisma.userSkill.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            university: true,
            bio: true,
            profilePhotoUrl: true,
            location: true,
            availability: true,
            trustScore: true,
            totalPoints: true,
            _count: {
              select: {
                teachingSessions: { where: { status: 'COMPLETED' } },
                reviewsReceived: true,
              },
            },
          },
        },
        skill: { include: { category: true } },
      },
      orderBy: [
        { avgRating: 'desc' },
        { sessionCount: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.userSkill.count({ where }),
  ]);

  // Compute a basic match score for Phase 1
  const maxRating = 5;
  const maxTrust = 100;

  const ranked = results.map(r => {
    const ratingScore = (r.avgRating / maxRating) * 40;
    const trustScore = (r.user.trustScore / maxTrust) * 30;
    const experienceScore = Math.min(r.sessionCount / 20, 1) * 20;
    const hasAvailability = r.user.availability && Object.keys(r.user.availability).length > 0 ? 10 : 0;

    const matchScore = Math.round(ratingScore + trustScore + experienceScore + hasAvailability);

    return {
      ...r,
      matchScore: Math.min(matchScore, 100),
    };
  });

  // Sort by match score
  ranked.sort((a, b) => b.matchScore - a.matchScore);

  return {
    results: ranked,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Get recommended matches for a user based on their LEARN skills
 */
export async function getRecommendations(userId) {
  // Find what the user wants to learn
  const learnSkills = await prisma.userSkill.findMany({
    where: { userId, type: 'LEARN', isActive: true },
    select: { skillId: true, proficiencyLevel: true },
  });

  if (learnSkills.length === 0) {
    return [];
  }

  const skillIds = learnSkills.map(s => s.skillId);

  // Find teachers for those skills (excluding self)
  const teachers = await prisma.userSkill.findMany({
    where: {
      skillId: { in: skillIds },
      type: 'TEACH',
      isActive: true,
      userId: { not: userId },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          university: true,
          bio: true,
          profilePhotoUrl: true,
          trustScore: true,
          availability: true,
        },
      },
      skill: { include: { category: true } },
    },
    orderBy: [{ avgRating: 'desc' }, { sessionCount: 'desc' }],
    take: 10,
  });

  return teachers.map(t => ({
    ...t,
    matchScore: Math.round(
      ((t.avgRating / 5) * 40) +
      ((t.user.trustScore / 100) * 30) +
      (Math.min(t.sessionCount / 10, 1) * 30)
    ),
  }));
}
