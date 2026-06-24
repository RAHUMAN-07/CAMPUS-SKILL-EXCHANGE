import * as userService from '../services/user.service.js';

export async function getMe(req, res, next) {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) { next(error); }
}

export async function updateMe(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (error) { next(error); }
}

export async function getProfile(req, res, next) {
  try {
    const user = await userService.getPublicProfile(req.params.id);
    res.json(user);
  } catch (error) { next(error); }
}

export async function deleteMe(req, res, next) {
  try {
    const result = await userService.deleteAccount(req.user.id);
    res.json(result);
  } catch (error) { next(error); }
}
