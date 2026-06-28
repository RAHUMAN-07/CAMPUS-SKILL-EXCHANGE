import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get user wallet balance and transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { totalPoints: true }
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      balance: user?.totalPoints || 0,
      transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

export default router;
