import * as skillService from '../services/skill.service.js';

// ─── Skills (global catalog) ─────────────────────────

export async function getCategories(req, res, next) {
  try {
    const categories = await skillService.getCategories();
    res.json(categories);
  } catch (error) { next(error); }
}

export async function searchSkills(req, res, next) {
  try {
    const result = await skillService.searchSkills(req.query);
    res.json(result);
  } catch (error) { next(error); }
}

export async function getSkillById(req, res, next) {
  try {
    const skill = await skillService.getSkillById(parseInt(req.params.id));
    res.json(skill);
  } catch (error) { next(error); }
}

export async function getTrendingSkills(req, res, next) {
  try {
    const skills = await skillService.getTrendingSkills();
    res.json(skills);
  } catch (error) { next(error); }
}

// ─── User Skills (personal listings) ─────────────────

export async function addUserSkill(req, res, next) {
  try {
    const userSkill = await skillService.addUserSkill(req.user.id, req.body);
    res.status(201).json(userSkill);
  } catch (error) { next(error); }
}

export async function getMySkills(req, res, next) {
  try {
    const skills = await skillService.getUserSkills(req.user.id);
    res.json(skills);
  } catch (error) { next(error); }
}

export async function updateUserSkill(req, res, next) {
  try {
    const skill = await skillService.updateUserSkill(req.params.id, req.user.id, req.body);
    res.json(skill);
  } catch (error) { next(error); }
}

export async function removeUserSkill(req, res, next) {
  try {
    const result = await skillService.removeUserSkill(req.params.id, req.user.id);
    res.json(result);
  } catch (error) { next(error); }
}
