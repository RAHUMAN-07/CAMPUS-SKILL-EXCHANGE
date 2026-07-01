import prisma from '../config/database.js';

/**
 * List all skill categories
 */
export async function getCategories() {
  return prisma.skillCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { skills: true } } },
  });
}

/**
 * Search/list skills with filters
 */
export async function searchSkills({ query, categoryId, trending, page = 1, limit = 20 }) {
  const where = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { tags: { contains: query.toLowerCase(), mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (trending) where.isTrending = true;

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      where,
      include: {
        category: true,
        _count: { select: { userSkills: { where: { type: 'TEACH', isActive: true } } } },
      },
      orderBy: [{ listingCount: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.skill.count({ where }),
  ]);

  return {
    skills,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single skill with teacher count and details
 */
export async function getSkillById(skillId) {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: {
      category: true,
      userSkills: {
        where: { type: 'TEACH', isActive: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              university: true,
              profilePhotoUrl: true,
              trustScore: true,
              bio: true,
              availability: true,
            },
          },
        },
        orderBy: { avgRating: 'desc' },
      },
    },
  });

  if (!skill) {
    const error = new Error('Skill not found');
    error.statusCode = 404;
    throw error;
  }

  return skill;
}

/**
 * Get trending skills
 */
export async function getTrendingSkills() {
  return prisma.skill.findMany({
    where: { isTrending: true },
    include: {
      category: true,
      _count: { select: { userSkills: { where: { type: 'TEACH', isActive: true } } } },
    },
    orderBy: { listingCount: 'desc' },
    take: 10,
  });
}

// ─── USER SKILLS ──────────────────────────────────────

/**
 * Add a skill to user profile
 */
export async function addUserSkill(userId, { skillId, skillName, type, proficiencyLevel, description, preferredDuration }) {
  let resolvedSkillId = skillId;

  if (!resolvedSkillId && skillName) {
    const matchedSkill = await prisma.skill.findFirst({
      where: { name: { equals: skillName.trim(), mode: 'insensitive' } }
    });

    if (!matchedSkill) {
      const error = new Error(`Skill "${skillName}" was not found in our catalog. Try "Python", "React.js", "Figma", "Guitar", or "Spanish".`);
      error.statusCode = 404;
      throw error;
    }
    resolvedSkillId = matchedSkill.id;
  }

  // Verify skill exists
  const skill = await prisma.skill.findUnique({ where: { id: resolvedSkillId } });
  if (!skill) {
    const error = new Error('Skill not found');
    error.statusCode = 404;
    throw error;
  }

  const userSkill = await prisma.userSkill.create({
    data: {
      userId,
      skillId: resolvedSkillId,
      type,
      proficiencyLevel,
      description: description || '',
      preferredDuration: preferredDuration || 60,
    },
    include: { skill: { include: { category: true } } },
  });

  // Update listing count
  await prisma.skill.update({
    where: { id: resolvedSkillId },
    data: { listingCount: { increment: 1 } },
  });

  return userSkill;
}
/**
 * Get current user's skills
 */
export async function getUserSkills(userId) {
  return prisma.userSkill.findMany({
    where: { userId },
    include: { skill: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Update a user skill
 */
export async function updateUserSkill(userSkillId, userId, data) {
  const existing = await prisma.userSkill.findUnique({ where: { id: userSkillId } });
  if (!existing || existing.userId !== userId) {
    const error = new Error('Skill listing not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.userSkill.update({
    where: { id: userSkillId },
    data,
    include: { skill: { include: { category: true } } },
  });
}

/**
 * Remove a skill from profile
 */
export async function removeUserSkill(userSkillId, userId) {
  const existing = await prisma.userSkill.findUnique({ where: { id: userSkillId } });
  if (!existing || existing.userId !== userId) {
    const error = new Error('Skill listing not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.userSkill.delete({ where: { id: userSkillId } });

  // Decrement listing count
  await prisma.skill.update({
    where: { id: existing.skillId },
    data: { listingCount: { decrement: 1 } },
  });

  return { message: 'Skill removed from profile' };
}
