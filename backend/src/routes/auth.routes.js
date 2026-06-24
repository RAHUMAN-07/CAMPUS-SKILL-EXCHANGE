import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authCtrl.register);
router.post('/login', authLimiter, validate(loginSchema), authCtrl.login);
router.post('/refresh', validate(refreshTokenSchema), authCtrl.refresh);
router.post('/logout', authCtrl.logout);
router.post('/verify-email', authCtrl.verifyEmail);

export default router;
