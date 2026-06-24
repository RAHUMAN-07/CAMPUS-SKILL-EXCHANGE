import { Router } from 'express';
import * as skillCtrl from '../controllers/skill.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSkillSchema, searchSkillsSchema } from '../utils/validators.js';

const router = Router();

// Public skill catalog
router.get('/categories', skillCtrl.getCategories);
router.get('/trending', skillCtrl.getTrendingSkills);
router.get('/search', validate(searchSkillsSchema, 'query'), skillCtrl.searchSkills);
router.get('/:id', skillCtrl.getSkillById);

// User skills (authenticated)
router.post('/user-skills', authenticate, validate(createUserSkillSchema), skillCtrl.addUserSkill);
router.get('/user-skills/my', authenticate, skillCtrl.getMySkills);
router.put('/user-skills/:id', authenticate, skillCtrl.updateUserSkill);
router.delete('/user-skills/:id', authenticate, skillCtrl.removeUserSkill);

export default router;
