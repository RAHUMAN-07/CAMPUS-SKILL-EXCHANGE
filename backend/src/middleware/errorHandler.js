import env from '../config/env.js';

/**
 * Global error handler middleware
 * Catches all unhandled errors and returns a consistent JSON response
 */
export function errorHandler(err, req, res, _next) {
  // Log the error
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Prisma-specific errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'A record with this value already exists',
      field: err.meta?.target?.[0],
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
}
