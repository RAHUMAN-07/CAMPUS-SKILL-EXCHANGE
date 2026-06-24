import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) { next(error); }
}

export async function refresh(req, res, next) {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    res.json(result);
  } catch (error) { next(error); }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.body.refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) { next(error); }
}

export async function verifyEmail(req, res, next) {
  try {
    const result = await authService.verifyEmail(req.body.token);
    res.json(result);
  } catch (error) { next(error); }
}
