import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../utils/validators.js';

const router = Router();

router.get('/me', authenticate, userCtrl.getMe);
router.put('/me', authenticate, validate(updateProfileSchema), userCtrl.updateMe);
router.delete('/me', authenticate, userCtrl.deleteMe);
router.get('/:id', authenticate, userCtrl.getProfile);

export default router;
