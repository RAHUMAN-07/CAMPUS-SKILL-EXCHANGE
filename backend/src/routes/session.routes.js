import { Router } from 'express';
import * as sessionCtrl from '../controllers/session.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSessionSchema } from '../utils/validators.js';

const router = Router();

router.post('/', authenticate, validate(createSessionSchema), sessionCtrl.createSession);
router.get('/', authenticate, sessionCtrl.getSessions);
router.get('/:id', authenticate, sessionCtrl.getSessionById);
router.put('/:id/accept', authenticate, sessionCtrl.acceptSession);
router.put('/:id/decline', authenticate, sessionCtrl.declineSession);
router.put('/:id/cancel', authenticate, sessionCtrl.cancelSession);
router.put('/:id/confirm', authenticate, sessionCtrl.confirmSession);

export default router;
