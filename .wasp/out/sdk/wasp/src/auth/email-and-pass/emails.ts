import {
  type GetPasswordResetEmailContentFn,
  type GetVerificationEmailContentFn,
} from "wasp/server/auth";

// Branded email header. The logo asset is served from /public at the production domain.
const LOGO_URL = "https://thehelper.ca/apple-touch-icon.png";
const emailHeader = `
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="${LOGO_URL}" alt="The Helper" width="48" height="48" style="border-radius: 12px; display: inline-block;" />
    <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 8px; font-family: sans-serif;">The Helper</div>
  </div>`;

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({
  verificationLink,
}) => ({
  subject: "Verify your The Helper email",
  text: `Click the link below to verify your email address and get started with The Helper: ${verificationLink}`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      ${emailHeader}
      <h2 style="margin-bottom: 8px;">Welcome to The Helper</h2>
      <p style="color: #555;">Click the button below to verify your email address and activate your account.</p>
      <a href="${verificationLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #2563EB; color: #ffffff; font-weight: bold; border-radius: 22px; text-decoration: none;">Verify Email</a>
      <p style="color: #999; font-size: 12px;">If you didn't sign up for The Helper, you can safely ignore this email.</p>
    </div>
  `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({
  passwordResetLink,
}) => ({
  subject: "Reset your The Helper password",
  text: `Click the link below to reset your The Helper password: ${passwordResetLink}`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      ${emailHeader}
      <h2 style="margin-bottom: 8px;">Password Reset</h2>
      <p style="color: #555;">We received a request to reset your The Helper password. Click below to choose a new one.</p>
      <a href="${passwordResetLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #2563EB; color: #ffffff; font-weight: bold; border-radius: 22px; text-decoration: none;">Reset Password</a>
      <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.</p>
    </div>
  `,
});
