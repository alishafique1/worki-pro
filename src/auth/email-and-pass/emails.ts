import {
  type GetPasswordResetEmailContentFn,
  type GetVerificationEmailContentFn,
} from "wasp/server/auth";

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({
  verificationLink,
}) => ({
  subject: "Verify your TheHelper email",
  text: `Click the link below to verify your email address and get started with TheHelper: ${verificationLink}`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="margin-bottom: 8px;">Welcome to TheHelper 👋</h2>
      <p style="color: #555;">Click the button below to verify your email address and activate your account.</p>
      <a href="${verificationLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #F2B5D7; color: #000; font-weight: bold; border-radius: 22px; text-decoration: none;">Verify Email</a>
      <p style="color: #999; font-size: 12px;">If you didn't sign up for TheHelper, you can safely ignore this email.</p>
    </div>
  `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({
  passwordResetLink,
}) => ({
  subject: "Reset your TheHelper password",
  text: `Click the link below to reset your TheHelper password: ${passwordResetLink}`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="margin-bottom: 8px;">Password Reset</h2>
      <p style="color: #555;">We received a request to reset your TheHelper password. Click below to choose a new one.</p>
      <a href="${passwordResetLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #F2B5D7; color: #000; font-weight: bold; border-radius: 22px; text-decoration: none;">Reset Password</a>
      <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.</p>
    </div>
  `,
});
