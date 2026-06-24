import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import env from './config/env.js';

const app = express();

// ─── SECURITY ─────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ─── PARSING ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── LOGGING ──────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── RATE LIMITING ────────────────────────────────────
app.use('/api', generalLimiter);

// ─── STATIC FILES ─────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── ROUTES ───────────────────────────────────────────
app.use('/api', routes);

// ─── ROOT ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Campus Skill Exchange API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// ─── ERROR HANDLING ───────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
