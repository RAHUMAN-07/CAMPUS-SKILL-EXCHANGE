import * as matchService from '../services/match.service.js';

export async function searchTeachers(req, res, next) {
  try {
    const result = await matchService.searchTeachers(req.query);
    res.json(result);
  } catch (error) { next(error); }
}

export async function getRecommendations(req, res, next) {
  try {
    const recommendations = await matchService.getRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) { next(error); }
}
