import { Router } from 'express';
import * as matchCtrl from '../controllers/match.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { searchMatchSchema } from '../utils/validators.js';

const router = Router();

router.get('/search', validate(searchMatchSchema, 'query'), matchCtrl.searchTeachers);
router.get('/recommendations', authenticate, matchCtrl.getRecommendations);

export default router;
