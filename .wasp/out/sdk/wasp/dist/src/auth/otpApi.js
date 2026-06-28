import { HttpError, prisma } from 'wasp/server';
import { createSession } from 'wasp/auth/session';
import { createUser, findAuthIdentity, createProviderId, sanitizeAndSerializeProviderData } from 'wasp/server/auth';
import { hashPassword } from 'wasp/auth/password';
import { emailSender } from 'wasp/server/email';
import crypto from 'crypto';
function generateOtp() {
    // crypto.randomInt is cryptographically secure; Math.random is predictable.
    return crypto.randomInt(100000, 1000000).toString();
}
function hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}
function isOriginAllowed(origin) {
    if (!origin)
        return true; // non-browser / same-origin server calls have no Origin header
    // allow localhost dev origins on any port
    if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
        return true;
    const allowed = [
        process.env.WASP_WEB_CLIENT_URL,
        'https://thehelper.ca',
        'https://www.thehelper.ca',
    ].filter(Boolean);
    return allowed.includes(origin);
}
function isAllowedOrigin(req) {
    return isOriginAllowed(req.headers.origin);
}
// Wasp applies its global CORS middleware to operation routes but NOT to custom
// `api` routes, so cross-origin browser calls to /api/auth/* (dev: localhost ->
// :3200; prod: thehelper.ca -> api.thehelper.ca) were blocked by the browser and
// surfaced as "Failed to fetch". This middleware adds the missing CORS headers
// and answers the preflight. Wired to the /api/auth namespace in main.wasp.
export const authApiMiddlewareConfigFn = (middlewareConfig) => {
    middlewareConfig.set('cors', (req, res, next) => {
        const origin = req.headers.origin;
        if (origin && isOriginAllowed(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
            return;
        }
        next();
    });
    return middlewareConfig;
};
export const requestOtp = async (req, res, context) => {
    if (!isAllowedOrigin(req)) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
    }
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ error: 'A valid email address is required.' });
        return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    // Rate-limit: max 3 OTPs in last 5 minutes
    const recentCount = await prisma.otpCode.count({
        where: {
            email: normalizedEmail,
            createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
    });
    if (recentCount >= 3) {
        throw new HttpError(429, 'Too many OTP requests. Please wait a few minutes.');
    }
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
            subject: `Your The Helper sign-in code: ${code}`,
            text: `Your The Helper sign-in code is: ${code}\n\nThis code expires in 10 minutes. If you didn't request this, ignore this email.\n\nThis email is your The Helper account. Save it to log in and track your rewards, appointments, and job status.\nAccount: https://thehelper.ca/login`,
            html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <img src="https://thehelper.ca/apple-touch-icon.png" alt="The Helper" width="40" height="40" style="border-radius:10px;display:inline-block;vertical-align:middle;" />
              <span style="font-size:22px;font-weight:900;color:#0F172A;">The Helper</span>
            </div>
          </div>
          <h2 style="text-align:center;font-size:22px;font-weight:800;margin:0 0 8px;">Your sign-in code</h2>
          <p style="text-align:center;color:#475569;margin:0 0 32px;font-size:15px;">Enter this code to access your The Helper account.</p>
          <div style="background:#F8FAFC;border:2px solid #E2E8F0;border-radius:20px;padding:36px;text-align:center;margin-bottom:24px;">
            <span style="font-size:52px;font-weight:900;letter-spacing:10px;color:#0F172A;font-family:monospace;">${code}</span>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0 0 32px;">Expires in 10 minutes. If you didn't request this, no action needed.</p>
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:14px;padding:20px;">
            <p style="margin:0 0 4px;color:#1E40AF;font-weight:700;font-size:14px;">Your portal</p>
            <p style="margin:0;color:#475569;font-size:13px;">
              This email is your The Helper account.
              <a href="https://thehelper.ca/login" style="color:#2563EB;text-decoration:none;font-weight:600;">Log in</a>
              to track your rewards, appointments, and job status.
            </p>
          </div>
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
    if (!isAllowedOrigin(req)) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
    }
    const { email, code, password, pendingRequest } = req.body;
    if (!email || !code) {
        res.status(400).json({ error: 'Email and code are required.' });
        return;
    }
    if (password && password.length < 8) {
        res.status(400).json({ error: 'Password must be at least 8 characters.' });
        return;
    }
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await prisma.otpCode.findFirst({
        where: {
            email: normalizedEmail,
            used: false,
            expiresAt: { gt: new Date() },
            attempts: { lt: 5 },
        },
        orderBy: { createdAt: 'desc' },
    });
    if (!otpRecord) {
        throw new HttpError(400, 'No valid OTP found. Please request a new code.');
    }
    const bumped = await prisma.otpCode.updateMany({
        where: { id: otpRecord.id, attempts: { lt: 5 } },
        data: { attempts: { increment: 1 } },
    });
    if (bumped.count === 0)
        throw new HttpError(429, 'Too many incorrect attempts. Please request a new code.');
    if (otpRecord.code !== hashCode(code.trim())) {
        throw new HttpError(400, 'Incorrect verification code.');
    }
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });
    const providerId = createProviderId('email', normalizedEmail);
    let authIdentity = await findAuthIdentity(providerId);
    let authId;
    let isNewUser = false;
    if (!authIdentity) {
        isNewUser = true;
        // Hash the password the client supplied on signup. If absent, fall
        // back to a random UUID (legacy OTP-only flow that doesn't support
        // password login).
        const hashedPassword = password
            ? await hashPassword(password)
            : crypto.randomUUID();
        const serializedProviderData = await sanitizeAndSerializeProviderData({
            hashedPassword,
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
    // If a pending request was submitted with the OTP, save it now
    let requestId;
    if (pendingRequest) {
        const userRecord = await prisma.user.findFirst({ where: { email: normalizedEmail } });
        if (userRecord) {
            await prisma.user.update({
                where: { id: userRecord.id },
                data: {
                    firstName: pendingRequest.firstName,
                    phone: pendingRequest.phone,
                    postalCode: pendingRequest.postalCode,
                    role: 'CONSUMER',
                    smsConsent: pendingRequest.smsConsent,
                    smsConsentAt: pendingRequest.smsConsent ? new Date() : undefined,
                },
            });
            const request = await prisma.serviceRequest.create({
                data: {
                    consumerId: userRecord.id,
                    name: pendingRequest.firstName,
                    phone: pendingRequest.phone,
                    postalCode: pendingRequest.postalCode,
                    email: normalizedEmail,
                    smsConsentGiven: pendingRequest.smsConsent,
                    serviceCategoryId: pendingRequest.serviceCategoryId ?? null,
                    description: pendingRequest.description,
                    qualifierAnswers: pendingRequest.qualifierAnswers ?? {},
                    source: 'WEBSITE',
                },
            });
            requestId = request.id;
            await prisma.rewardAccount.upsert({
                where: { consumerId: userRecord.id },
                update: {},
                create: { consumerId: userRecord.id },
            });
            const existingBonus = await prisma.rewardTransaction.findFirst({
                where: { consumerId: userRecord.id, type: 'SIGNUP_BONUS' },
            });
            if (!existingBonus) {
                await prisma.rewardTransaction.create({
                    data: {
                        consumerId: userRecord.id,
                        type: 'SIGNUP_BONUS',
                        points: 100,
                        status: 'APPROVED',
                        reason: 'Welcome bonus',
                    },
                });
                await prisma.rewardAccount.update({
                    where: { consumerId: userRecord.id },
                    data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } },
                });
            }
            if (pendingRequest.referralCode) {
                const refCode = pendingRequest.referralCode.trim().toUpperCase();
                const referral = await prisma.referral.findUnique({ where: { referralCode: refCode } });
                if (referral && referral.referrerUserId !== userRecord.id && !referral.referredUserId) {
                    await prisma.referral.update({
                        where: { id: referral.id },
                        data: { referredUserId: userRecord.id, status: 'SIGNED_UP' },
                    });
                }
            }
        }
    }
    res.json({ success: true, sessionId: session.id, isNewUser, requestId });
};
//# sourceMappingURL=otpApi.js.map