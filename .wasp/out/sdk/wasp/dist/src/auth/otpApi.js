import { prisma } from 'wasp/server';
import { createSession } from 'wasp/auth/session';
import { createUser, findAuthIdentity, createProviderId, sanitizeAndSerializeProviderData } from 'wasp/server/auth';
import { emailSender } from 'wasp/server/email';
import crypto from 'crypto';
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}
export const requestOtp = async (req, res, context) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ error: 'A valid email address is required.' });
        return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    // Clear any previous unused codes for this email
    await prisma.otpCode.deleteMany({ where: { email: normalizedEmail, used: false } });
    await prisma.otpCode.create({
        data: { email: normalizedEmail, code: hashCode(code), expiresAt },
    });
    try {
        await emailSender.send({
            to: normalizedEmail,
            subject: `${code} is your Worki sign-in code`,
            text: `Your Worki sign-in code is: ${code}\n\nThis code expires in 10 minutes. If you didn't request this, ignore this email.`,
            html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;background:#F2B5D7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000;line-height:1;">W</div>
              <span style="font-size:22px;font-weight:900;color:#000;">Worki</span>
            </div>
          </div>
          <h2 style="text-align:center;font-size:22px;font-weight:800;margin:0 0 8px;">Your sign-in code</h2>
          <p style="text-align:center;color:#666;margin:0 0 32px;font-size:15px;">Enter this code to access your Worki account.</p>
          <div style="background:#f7f7f7;border:2px solid #e8e8e8;border-radius:20px;padding:36px;text-align:center;margin-bottom:24px;">
            <span style="font-size:52px;font-weight:900;letter-spacing:10px;color:#111;font-family:monospace;">${code}</span>
          </div>
          <p style="text-align:center;color:#999;font-size:12px;margin:0;">Expires in 10 minutes. If you didn't request this, no action needed.</p>
        </div>
      `,
        });
    }
    catch (err) {
        console.error('[OTP] Email send failed:', err);
        res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
        return;
    }
    res.json({ success: true });
};
export const verifyOtp = async (req, res, context) => {
    const { email, code } = req.body;
    if (!email || !code) {
        res.status(400).json({ error: 'Email and code are required.' });
        return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await prisma.otpCode.findFirst({
        where: {
            email: normalizedEmail,
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    });
    if (!otpRecord || otpRecord.code !== hashCode(code.trim())) {
        res.status(400).json({ error: 'Incorrect or expired code. Please request a new one.' });
        return;
    }
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });
    const providerId = createProviderId('email', normalizedEmail);
    let authIdentity = await findAuthIdentity(providerId);
    let authId;
    let isNewUser = false;
    if (!authIdentity) {
        isNewUser = true;
        const serializedProviderData = await sanitizeAndSerializeProviderData({
            hashedPassword: crypto.randomUUID(), // random password, never exposed — OTP is the login mechanism
            isEmailVerified: true,
            emailVerificationSentAt: null,
            passwordResetSentAt: null,
        });
        const result = await createUser(providerId, serializedProviderData, {
            email: normalizedEmail,
        });
        if (!result.auth)
            throw new Error('Failed to create auth record.');
        authId = result.auth.id;
    }
    else {
        authId = authIdentity.authId;
    }
    const session = await createSession(authId);
    res.json({ success: true, sessionId: session.id, isNewUser });
};
//# sourceMappingURL=otpApi.js.map