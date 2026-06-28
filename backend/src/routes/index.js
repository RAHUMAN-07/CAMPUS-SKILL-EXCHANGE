import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import skillRoutes from './skill.routes.js';
import sessionRoutes from './session.routes.js';
import reviewRoutes from './review.routes.js';
import matchRoutes from './match.routes.js';
import messageRoutes from './message.routes.js';
import communityRoutes from './community.routes.js';
import walletRoutes from './wallet.routes.js';
import adminRoutes from './admin.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/sessions', sessionRoutes);
router.use('/reviews', reviewRoutes);
router.use('/match', matchRoutes);
router.use('/messages', messageRoutes);
router.use('/communities', communityRoutes);
router.use('/wallet', walletRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
