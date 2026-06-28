import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Simple admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

router.use(authenticate, requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalSessions = await prisma.session.count();
    const activeSessions = await prisma.session.count({ where: { status: 'IN_PROGRESS' } });
    const totalSkills = await prisma.skill.count();

    res.json({ totalUsers, totalSessions, activeSessions, totalSkills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, emailVerified: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
