import env from './env.js';

const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://campus-skill-exchange-one.vercel.app',
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow any Vercel preview deployment URL
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
