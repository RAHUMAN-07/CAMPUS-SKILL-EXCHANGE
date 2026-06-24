import * as sessionService from '../services/session.service.js';

export async function createSession(req, res, next) {
  try {
    const session = await sessionService.createSession(req.user.id, req.body);
    res.status(201).json(session);
  } catch (error) { next(error); }
}

export async function getSessions(req, res, next) {
  try {
    const result = await sessionService.getUserSessions(req.user.id, req.query);
    res.json(result);
  } catch (error) { next(error); }
}

export async function getSessionById(req, res, next) {
  try {
    const session = await sessionService.getSessionById(req.params.id, req.user.id);
    res.json(session);
  } catch (error) { next(error); }
}

export async function acceptSession(req, res, next) {
  try {
    const session = await sessionService.acceptSession(req.params.id, req.user.id);
    res.json(session);
  } catch (error) { next(error); }
}

export async function declineSession(req, res, next) {
  try {
    const session = await sessionService.declineSession(req.params.id, req.user.id);
    res.json(session);
  } catch (error) { next(error); }
}

export async function cancelSession(req, res, next) {
  try {
    const session = await sessionService.cancelSession(req.params.id, req.user.id, req.body?.reason);
    res.json(session);
  } catch (error) { next(error); }
}

export async function confirmSession(req, res, next) {
  try {
    const session = await sessionService.confirmSession(req.params.id, req.user.id);
    res.json(session);
  } catch (error) { next(error); }
}
