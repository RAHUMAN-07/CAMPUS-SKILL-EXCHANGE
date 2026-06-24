import { Router } from 'express';
import * as reviewCtrl from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema, replyToReviewSchema } from '../utils/validators.js';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), reviewCtrl.createReview);
router.get('/user/:userId', authenticate, reviewCtrl.getUserReviews);
router.get('/session/:sessionId', authenticate, reviewCtrl.getSessionReviews);
router.post('/:id/reply', authenticate, validate(replyToReviewSchema), reviewCtrl.replyToReview);

export default router;
