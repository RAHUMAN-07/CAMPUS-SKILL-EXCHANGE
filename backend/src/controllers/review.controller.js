import * as reviewService from '../services/review.service.js';

export async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
  } catch (error) { next(error); }
}

export async function getUserReviews(req, res, next) {
  try {
    const result = await reviewService.getUserReviews(req.params.userId, req.query);
    res.json(result);
  } catch (error) { next(error); }
}

export async function getSessionReviews(req, res, next) {
  try {
    const reviews = await reviewService.getSessionReviews(req.params.sessionId);
    res.json(reviews);
  } catch (error) { next(error); }
}

export async function replyToReview(req, res, next) {
  try {
    const review = await reviewService.replyToReview(req.params.id, req.user.id, req.body.reply);
    res.json(review);
  } catch (error) { next(error); }
}
