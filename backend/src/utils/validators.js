import { z } from 'zod';

// ─── AUTH SCHEMAS ─────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  university: z.string().min(2, 'University name is required').max(200),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ─── USER SCHEMAS ─────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  university: z.string().min(2).max(200).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().optional(),
  availability: z
    .object({
      weekdays: z.array(z.string()).optional(),
      timeSlots: z.array(z.string()).optional(),
    })
    .optional(),
});

// ─── SKILL SCHEMAS ────────────────────────────────────

export const createUserSkillSchema = z.object({
  skillId: z.number().int().positive().optional(),
  skillName: z.string().min(1).optional(),
  type: z.enum(['TEACH', 'LEARN']),
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
  description: z.string().max(500).optional(),
  preferredDuration: z.coerce.number().refine(val => [30, 60, 120].includes(val), {
    message: 'Duration must be 30, 60, or 120 minutes',
  }).optional().default(60),
}).refine(data => data.skillId !== undefined || data.skillName !== undefined, {
  message: "Either skillId or skillName must be provided",
  path: ["skillId"],
});

export const updateUserSkillSchema = z.object({
  proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional(),
  description: z.string().max(500).optional(),
  preferredDuration: z.coerce.number().refine(val => [30, 60, 120].includes(val), {
    message: 'Duration must be 30, 60, or 120 minutes',
  }).optional(),
  isActive: z.boolean().optional(),
});

// ─── SESSION SCHEMAS ──────────────────────────────────

export const createSessionSchema = z.object({
  teacherId: z.string().uuid(),
  skillId: z.number().int().positive(),
  userSkillId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime({ message: 'Invalid date format. Use ISO 8601.' }),
  durationMinutes: z.number().int().refine(val => [30, 60, 120].includes(val), {
    message: 'Duration must be 30, 60, or 120 minutes',
  }),
  topic: z.string().max(200).optional(),
  message: z.string().max(500).optional(),
});

export const cancelSessionSchema = z.object({
  reason: z.string().max(500).optional(),
});

// ─── REVIEW SCHEMAS ───────────────────────────────────

export const createReviewSchema = z.object({
  sessionId: z.string().uuid(),
  overallRating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(500),
});

export const replyToReviewSchema = z.object({
  reply: z.string().min(5, 'Reply must be at least 5 characters').max(500),
});

// ─── SEARCH / QUERY SCHEMAS ──────────────────────────

export const searchSkillsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  trending: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const searchMatchSchema = z.object({
  skillId: z.coerce.number().int().positive().optional(),
  skill: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(20).default(10),
});

export const getUserSessionsSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']).optional(),
  role: z.enum(['teacher', 'student']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
