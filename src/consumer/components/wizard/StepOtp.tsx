import { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { config } from 'wasp/client'
import { initSession } from 'wasp/auth/helpers/user'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  onBack: () => void
  onVerified: () => void
  /** External error from the parent (e.g. submitServiceRequest failure). */
  externalError: string | null
  /** Email collected earlier in the wizard (used for email-based OTP). */
  email: string
}

type SendState = 'idle' | 'sending' | 'sent' | 'failed'
type VerifyState = 'idle' | 'verifying' | 'failed'

const RESEND_SECONDS = 60

/**
 * Step 4 of the wizard. Sends a 6-digit code via /api/auth/request-otp,
 * verifies it via /api/auth/verify-otp using EMAIL, then hands control back
 * to the parent to call submitServiceRequest.
 */
export default function StepOtp({ state, onBack, onVerified, externalError, email }: Props) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [resendIn, setResendIn] = useState<number>(RESEND_SECONDS)
  const [sendState, setSendState] = useState<SendState>('idle')
  const [sendError, setSendError] = useState<string | null>(null)
  const [verifyState, setVerifyState] = useState<VerifyState>('idle')
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-send on mount so the user sees the timer ticking immediately.
  useEffect(() => {
    void send()
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startCooldown() {
    setResendIn(RESEND_SECONDS)
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          if (tickRef.current) clearInterval(tickRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function send() {
    setSendState('sending')
    setSendError(null)
    setVerifyError(null)
    try {
      const res = await fetch(`${config.apiUrl}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Could not send the code. Please try again.')
      setSendState('sent')
      startCooldown()
      // Focus first code box shortly after the response so the user can type right away.
      window.setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch (err: any) {
      setSendState('failed')
      setSendError(err?.message || 'Could not send the code.')
    }
  }

  async function verify() {
    const joined = code.join('')
    if (joined.length !== 6) {
      setVerifyError('Enter the full 6-digit code.')
      return
    }
    setVerifyState('verifying')
    setVerifyError(null)
    try {
      const res = await fetch(`${config.apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: joined,
          pendingRequest: {
            firstName: state.firstName,
            phone: state.phone,
            postalCode: state.postalCode,
            smsConsent: state.smsConsent,
          },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Incorrect code. Please try again.')
      setVerifyState('idle')
      await initSession(data.sessionId)
      onVerified()
    } catch (err: any) {
      setVerifyState('failed')
      setVerifyError(err?.message || 'Incorrect code. Please try again.')
    }
  }

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    setVerifyError(null)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') {
      void verify()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).padEnd(6, '')
    const chars = pasted.split('').slice(0, 6)
    setCode(chars)
    inputRefs.current[Math.min(chars.length, 5)]?.focus()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB]">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-black text-[#0F172A]">Confirm your email</h3>
      </div>
      <p className="text-[#475569] text-sm mb-6">
        We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{email}</span>.
        Enter it below to finish your request.
      </p>

      {sendState === 'sending' && (
        <p className="text-sm text-[#94A3B8] mb-4">Sending your code…</p>
      )}
      {sendError && (
        <p className="text-sm text-red-500 mb-4 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
          {sendError}
        </p>
      )}

      <div onPaste={handlePaste} className="flex gap-2 justify-between mb-6" role="group" aria-label="Verification code">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-white border-2 rounded-xl transition-colors focus:outline-none focus:border-[#2563EB]"
            style={{ borderColor: digit ? '#2563EB' : '#E2E8F0' }}
            disabled={sendState !== 'sent'}
          />
        ))}
      </div>

      {(verifyError || externalError) && (
        <p className="text-sm text-red-500 mb-4 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
          {verifyError || externalError}
        </p>
      )}

      <button
        type="button"
        onClick={verify}
        disabled={verifyState === 'verifying' || code.join('').length !== 6 || sendState !== 'sent'}
        className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
      >
        {verifyState === 'verifying' ? 'Verifying…' : 'Verify & get matched →'}
      </button>

      <p className="text-center text-sm text-[#475569] mt-4">
        Didn't get it?{' '}
        {resendIn > 0 ? (
          <span>Resend in {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={send}
            disabled={sendState === 'sending'}
            className="text-[#2563EB] font-semibold hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-[#475569] text-sm hover:text-[#0F172A]"
        >
          ← Change email
        </button>
      </div>
    </div>
  )
}