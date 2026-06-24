import prisma from '../config/database.js';

/**
 * Get full user profile
 */
export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      bio: true,
      profilePhotoUrl: true,
      location: true,
      availability: true,
      phone: true,
      emailVerified: true,
      trustScore: true,
      totalPoints: true,
      role: true,
      createdAt: true,
      userSkills: {
        where: { isActive: true },
        include: { skill: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          teachingSessions: { where: { status: 'COMPLETED' } },
          learningSessions: { where: { status: 'COMPLETED' } },
          reviewsReceived: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

/**
 * Get public profile (limited fields)
 */
export async function getPublicProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      createdAt: true,
      userSkills: {
        where: { isActive: true, type: 'TEACH' },
        include: { skill: { include: { category: true } } },
      },
      _count: {
        select: {
          teachingSessions: { where: { status: 'COMPLETED' } },
          reviewsReceived: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateProfile(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      bio: true,
      profilePhotoUrl: true,
      location: true,
      availability: true,
      phone: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Delete user account (GDPR)
 */
export async function deleteAccount(userId) {
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'Account deleted successfully' };
}
