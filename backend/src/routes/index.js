import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import skillRoutes from './skill.routes.js';
import sessionRoutes from './session.routes.js';
import reviewRoutes from './review.routes.js';
import matchRoutes from './match.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/sessions', sessionRoutes);
router.use('/reviews', reviewRoutes);
router.use('/match', matchRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
