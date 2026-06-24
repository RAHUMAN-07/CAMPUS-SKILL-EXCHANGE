import env from '../config/env.js';

/**
 * Pluggable email service
 * In development: logs to console
 * In production: would integrate with SendGrid/Mailgun
 */
export async function sendEmail({ to, subject, html }) {
  if (env.NODE_ENV === 'development') {
    console.log('\n📧 ═══════════════════════════════════════');
    console.log(`   TO: ${to}`);
    console.log(`   SUBJECT: ${subject}`);
    console.log(`   BODY: ${html}`);
    console.log('═══════════════════════════════════════════\n');
    return true;
  }

  // Production: integrate with your SMTP provider
  // Example: SendGrid, Mailgun, AWS SES
  console.warn('Email service not configured for production');
  return false;
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify your Campus Skill Exchange account',
    html: `
      <h2>Welcome to Campus Skill Exchange! 🎓</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:#fff;text-decoration:none;border-radius:8px;">
        Verify Email
      </a>
      <p style="margin-top:16px;color:#666;">Or copy this link: ${verifyUrl}</p>
      <p style="margin-top:16px;color:#666;">Verification token: <strong>${token}</strong></p>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset your Campus Skill Exchange password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#1e3a5f;color:#fff;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
      <p style="margin-top:16px;color:#666;">This link expires in 1 hour.</p>
    `,
  });
}
