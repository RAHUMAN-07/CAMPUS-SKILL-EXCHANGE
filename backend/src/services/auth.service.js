import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, parseDuration } from '../utils/jwt.js';
import { sendVerificationEmail } from './email.service.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import env from '../config/env.js';

/**
 * Register a new user
 */
export async function register({ email, password, name, university, bio, location, phone }) {
  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password & generate verification token
  const passwordHash = await hashPassword(password);
  const emailVerifyToken = uuidv4();

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      university,
      bio: bio || '',
      location: location || '',
      phone: phone || null,
      emailVerifyToken,
    },
    select: {
      id: true,
      email: true,
      name: true,
      university: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  // Send verification email (non-blocking — don't fail registration if email fails)
  try {
    await sendVerificationEmail(email, emailVerifyToken);
  } catch (emailErr) {
    console.warn('⚠️ Failed to send verification email:', emailErr.message);
  }

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, role: 'STUDENT' });
  const refreshToken = await createRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

/**
 * Login with email and password
 */
export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      university: user.university,
      bio: user.bio,
      profilePhotoUrl: user.profilePhotoUrl,
      emailVerified: user.emailVerified,
      trustScore: user.trustScore,
      totalPoints: user.totalPoints,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh an access token
 */
export async function refreshAccessToken(refreshToken) {
  // Verify the refresh token JWT
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Hash and look up in DB
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
    const error = new Error('Refresh token expired or revoked');
    error.statusCode = 401;
    throw error;
  }

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { isRevoked: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = await createRefreshToken(user.id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/**
 * Logout — revoke refresh token
 */
export async function logout(refreshToken) {
  if (!refreshToken) return;
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { isRevoked: true },
  });
}

/**
 * Verify email
 */
export async function verifyEmail(token) {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) {
    const error = new Error('Invalid verification token');
    error.statusCode = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null },
  });

  return { message: 'Email verified successfully' };
}

// ─── HELPERS ──────────────────────────────────────────

async function createRefreshToken(userId) {
  const refreshToken = generateRefreshToken({ userId });
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN));

  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return refreshToken;
}
