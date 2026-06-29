import prisma from '../config/database.js';

/**
 * Search for teachers of a specific skill with basic ranking
 * Phase 1: rank by rating + session count
 * Phase 2: weighted multi-factor scoring
 */
export async function searchTeachers({ skillId, skill, category, level, page = 1, limit = 10 }) {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const where = {
    role: 'STUDENT',
    userSkills: {
      some: {
        type: 'TEACH',
        isActive: true,
        ...(skillId ? { skillId: parseInt(skillId, 10) } : {}),
        ...(level ? { proficiencyLevel: level } : {}),
        // Merge skill.name + skill.category into a single `skill:` block
        ...((skill || category) ? {
          skill: {
            ...(skill ? { name: { contains: skill, mode: 'insensitive' } } : {}),
            ...(category ? {
              category: {
                name: { contains: category, mode: 'insensitive' }
              }
            } : {}),
          }
        } : {}),
      }
    }
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        userSkills: {
          where: { type: 'TEACH', isActive: true },
          include: { skill: { include: { category: true } } }
        },
        teachingSessions: {
          where: { status: 'COMPLETED' },
          select: { id: true }
        }
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.user.count({ where }),
  ]);

  const formatted = users.map(u => {
    const teachSkills = u.userSkills || [];
    const ratings = teachSkills.filter(s => s.avgRating > 0).map(s => s.avgRating);
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) : 0;
    const totalSessions = u.teachingSessions.length;

    // Calculate matchScore
    const maxTrust = 100;
    const ratingScore = (avgRating / 5) * 40;
    const trustScore = (u.trustScore / maxTrust) * 30;
    const experienceScore = Math.min(totalSessions / 20, 1) * 20;
    let parsedAvailability = {};
    try {
      if (u.availability) {
        parsedAvailability = typeof u.availability === 'string' ? JSON.parse(u.availability) : u.availability;
      }
    } catch {}
    const hasAvailability = parsedAvailability && Object.keys(parsedAvailability).length > 0 ? 10 : 0;
    const matchScore = Math.min(Math.round(ratingScore + trustScore + experienceScore + hasAvailability), 100);

    return {
      id: u.id,
      name: u.name,
      university: u.university,
      bio: u.bio,
      profilePhotoUrl: u.profilePhotoUrl,
      trustScore: u.trustScore,
      teachSkills,
      avgRating,
      totalSessions,
      matchScore,
    };
  });

  // Sort by match score
  formatted.sort((a, b) => b.matchScore - a.matchScore);

  return {
    results: formatted,
    teachers: formatted,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
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
