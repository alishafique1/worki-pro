import type { Request, Response } from 'express'
import cors from 'cors'
import { HttpError, prisma, config, type MiddlewareConfigFn } from 'wasp/server'
import { createSession } from 'wasp/auth/session'
import { createUser, findAuthIdentity, createProviderId, sanitizeAndSerializeProviderData } from 'wasp/server/auth'
import { hashPassword } from 'wasp/auth/password'
import { emailSender } from 'wasp/server/email'
import crypto from 'crypto'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.origin
  if (!origin) return true // non-browser / same-origin server calls have no Origin header
  const allowed = [
    process.env.WASP_WEB_CLIENT_URL,
    'https://thehelper.ca',
    'https://www.thehelper.ca',
  ].filter(Boolean) as string[]
  // also allow localhost dev origins
  if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true
  return allowed.includes(origin)
}

// Wasp custom `api` routes do NOT get the default Operations middleware, so
// CORS (incl. the browser's OPTIONS preflight) must be enabled explicitly.
// Applied to the whole /api/auth namespace via apiNamespace in main.wasp.
export const authApiMiddleware: MiddlewareConfigFn = (middlewareConfig) => {
  middlewareConfig.set('cors', cors({ origin: config.frontendUrl }))
  return middlewareConfig
}

export const requestOtp = async (req: Request, res: Response, context: any): Promise<void> => {
  if (!isAllowedOrigin(req)) { res.status(403).json({ error: 'Forbidden.' }); return }
  const { email } = req.body as { email?: string }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' })
    return
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Rate-limit: max 3 OTPs in last 5 minutes
  const recentCount = await prisma.otpCode.count({
    where: {
      email: normalizedEmail,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
    },
  })
  if (recentCount >= 3) {
    throw new HttpError(429, 'Too many OTP requests. Please wait a few minutes.')
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min

  // Clear any previous unused codes for this email
  await prisma.otpCode.deleteMany({ where: { email: normalizedEmail, used: false } })

  await prisma.otpCode.create({
    data: { email: normalizedEmail, code: hashCode(code), expiresAt },
  })

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
    })
  } catch (err) {
    console.error('[OTP] Email send failed:', err)
    res.status(500).json({ error: 'Failed to send verification email. Please try again.' })
    return
  }

  res.json({ success: true })
}

type PendingRequest = {
  firstName: string
  phone: string
  postalCode: string
  smsConsent: boolean
  referralCode?: string
}

export const verifyOtp = async (req: Request, res: Response, context: any): Promise<void> => {
  if (!isAllowedOrigin(req)) { res.status(403).json({ error: 'Forbidden.' }); return }
  const { email, code, password, pendingRequest } = req.body as {
    email?: string
    code?: string
    password?: string
    pendingRequest?: PendingRequest
  }

  if (!email || !code) {
    res.status(400).json({ error: 'Email and code are required.' })
    return
  }

  if (password && password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters.' })
    return
  }

  const normalizedEmail = email.toLowerCase().trim()

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      used: false,
      expiresAt: { gt: new Date() },
      attempts: { lt: 5 },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otpRecord) {
    throw new HttpError(400, 'No valid OTP found. Please request a new code.')
  }

  const bumped = await prisma.otpCode.updateMany({
    where: { id: otpRecord.id, attempts: { lt: 5 } },
    data: { attempts: { increment: 1 } },
  })
  if (bumped.count === 0) throw new HttpError(429, 'Too many incorrect attempts. Please request a new code.')

  if (otpRecord.code !== hashCode(code.trim())) {
    throw new HttpError(400, 'Incorrect verification code.')
  }

  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } })

  const providerId = createProviderId('email', normalizedEmail)
  let authIdentity = await findAuthIdentity(providerId)
  let authId: string
  let isNewUser = false

  if (!authIdentity) {
    isNewUser = true
    // Hash the password the client supplied on signup. If absent, fall
    // back to a random UUID (legacy OTP-only flow that doesn't support
    // password login).
    const hashedPassword = password
      ? await hashPassword(password)
      : crypto.randomUUID()
    const serializedProviderData = await sanitizeAndSerializeProviderData({
      hashedPassword,
      isEmailVerified: true,
      emailVerificationSentAt: null,
      passwordResetSentAt: null,
    })
    const result = await createUser(providerId, serializedProviderData, {
      email: normalizedEmail,
    })
    if (!result.auth) throw new Error('Failed to create auth record.')
    authId = result.auth.id
  } else {
    authId = authIdentity.authId
  }

  const session = await createSession(authId)

  // If a pending request was submitted with the OTP, seed the user profile now.
  // The lead itself is created solely by submitServiceRequest (C2 single-write path).
  let skipOnboarding = false
  if (pendingRequest) {
    const userRecord = await prisma.user.findFirst({ where: { email: normalizedEmail } })
    if (userRecord) {
      skipOnboarding = !!(pendingRequest.firstName && pendingRequest.phone && pendingRequest.postalCode)

      await prisma.$transaction(async (tx) => {
        // M1: Only set role for new users or users who have no role yet — never demote a provider.
        const roleData = (isNewUser || !userRecord.role) ? { role: 'CONSUMER' as const } : {}

        await tx.user.update({
          where: { id: userRecord.id },
          data: {
            firstName: pendingRequest.firstName,
            phone: pendingRequest.phone,
            postalCode: pendingRequest.postalCode,
            smsConsent: pendingRequest.smsConsent,
            smsConsentAt: pendingRequest.smsConsent ? new Date() : undefined,
            // A full profile from booking means onboarding is effectively done —
            // persist it so the user isn't looped to /onboarding on next login.
            ...(skipOnboarding ? { onboardingCompletedAt: new Date() } : {}),
            ...roleData,
          },
        })

        await tx.rewardAccount.upsert({
          where: { consumerId: userRecord.id },
          update: {},
          create: { consumerId: userRecord.id },
        })

        // Signup bonus — idempotent guard prevents double-award on re-verify
        const existingBonus = await tx.rewardTransaction.findFirst({
          where: { consumerId: userRecord.id, type: 'SIGNUP_BONUS' },
        })
        if (!existingBonus) {
          // TODO: replace 100 with REWARD_POINTS.SIGNUP_BONUS once that constant is defined
          const SIGNUP_BONUS_POINTS = 100
          await tx.rewardTransaction.create({
            data: {
              consumerId: userRecord.id,
              type: 'SIGNUP_BONUS',
              points: SIGNUP_BONUS_POINTS,
              status: 'APPROVED',
              reason: 'Welcome bonus',
            },
          })
          await tx.rewardAccount.update({
            where: { consumerId: userRecord.id },
            data: {
              pointsBalance: { increment: SIGNUP_BONUS_POINTS },
              lifetimePoints: { increment: SIGNUP_BONUS_POINTS },
            },
          })
        }

        if (pendingRequest.referralCode) {
          const refCode = pendingRequest.referralCode.trim().toUpperCase()
          const referral = await tx.referral.findUnique({ where: { referralCode: refCode } })
          if (referral && referral.referrerUserId !== userRecord.id && !referral.referredUserId) {
            await tx.referral.update({
              where: { id: referral.id },
              data: { referredUserId: userRecord.id, status: 'SIGNED_UP' },
            })
          }
        }
      })
    }
  }

  res.json({ success: true, sessionId: session.id, isNewUser, skipOnboarding })
}
