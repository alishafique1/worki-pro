// Signup page — dedicated create-account flow
import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { initSession } from 'wasp/auth/helpers/user'
import { config } from 'wasp/client'
import { AuthPageLayout } from './AuthPageLayout'
import { Logo } from '../client/components/Logo/Logo'

export function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const codeValue = code.join('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      // Single-flow signup: ONLY request the OTP code. The /api/auth/verify-otp
      // handler creates the User (via createUser) the first time this email is
      // seen, then creates a session. We intentionally skip /auth/email/signup
      // here — that endpoint also fires a separate "Verify your The Helper
      // email" message via getVerificationEmailContent, which was producing
      // duplicate emails on signup.
      //
      // The password is captured at signup so the account is created in
      // "email + password" mode. verifyOtp persists it as hashedPassword
      // (see the call inside otpApi.ts:135).
      const res = await fetch(`${config.apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data && data.error) || 'Failed to send verification code.')
      }
      setStep('code')
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      const raw = err && err.message ? String(err.message) : ''
      const friendly =
        raw.includes('Unexpected token') || raw.includes('is not valid JSON')
          ? 'Something went wrong reaching our server. Please try again in a moment.'
          : raw || 'Something went wrong. Please try again.'
      setError(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (codeValue.length !== 6) return
    setIsLoading(true)
    setError(null)
    try {
      // Send the password the user typed at signup so the server can
      // hash it and persist as the Wasp auth identity. This way the
      // user can later sign in with the same password via login().
      const res = await fetch(`${config.apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: codeValue, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data && data.error) || 'Verification failed. Please try again.')
      }
      if (!data || !data.sessionId) {
        throw new Error('Verification succeeded but no session was returned. Please sign in.')
      }
      // initSession sets the session id AND invalidates the React Query
      // cache so useAuth() refetches the user. Without this, navigating
      // to /onboarding (which has authRequired: true) would race the
      // auth check and bounce the user back to /login.
      await initSession(data.sessionId)
      navigate(data.isNewUser ? '/onboarding' : '/account')
    } catch (err: any) {
      const raw = err && err.message ? String(err.message) : ''
      const friendly =
        raw.includes('Unexpected token') || raw.includes('is not valid JSON')
          ? 'Something went wrong reaching our server. Please try again in a moment.'
          : raw || 'Something went wrong. Please try again.'
      setError(friendly)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCodeInput(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setError(null)
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  function handleResend() {
    setCode(['', '', '', '', '', ''])
    setError(null)
    handleSendCode()
  }

  async function handleSendCode() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${config.apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send code.')
      setStep('code')
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageLayout>
      <div className="mb-8">
        <Logo variant="light" size="md" className="mb-6" />
        {step === 'form' ? (
          <>
            <h2 className="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Create your account</h2>
            <p className="text-sm text-[#475569]">Join thousands of GTA homeowners. Free forever.</p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setStep('form'); setCode(['', '', '', '', '', '']); setError(null) }}
              className="text-sm text-[#475569] hover:text-[#0F172A] mb-3 flex items-center gap-1"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Verify your email</h2>
            <p className="text-sm text-[#475569]">
              We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{email}</span>
            </p>
          </>
        )}
      </div>

      {step === 'form' ? (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Email address</label>
            <input
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null) }}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null) }}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Confirm password</label>
            <input
              type="password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(null) }}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password || !confirmPassword}
            className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account…' : 'Create account →'}
          </button>

          <p className="text-center text-sm text-[#475569]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-3">Enter your 6-digit code</label>
            <div className="flex gap-2 justify-between" onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeInput(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-black bg-white border-2 rounded-xl transition-colors focus:outline-none focus:border-[#2563EB]"
                  style={{ borderColor: digit ? '#2563EB' : '#E2E8F0' }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || codeValue.length !== 6}
            className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying…' : 'Verify & complete signup'}
          </button>

          <p className="text-center text-sm text-[#475569]">
            Didn't get it?{' '}
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#2563EB] font-semibold hover:underline"
              >
                Resend code
              </button>
            )}
          </p>
        </form>
      )}
    </AuthPageLayout>
  )
}
