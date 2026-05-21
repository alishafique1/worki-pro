import { useState, useRef, useEffect } from 'react'
import { setSessionId } from 'wasp/client/api'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onSuccess: (requestId?: string) => void
  setError: (e: string | null) => void
}

const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const inputClass = 'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors'

export default function StepInfoAndVerify({ state, update, onBack, onSuccess, setError }: Props) {
  const [postal, setPostal] = useState(state.postalCode)
  const [firstName, setFirstName] = useState(state.firstName)
  const [email, setEmail] = useState(state.email)
  const [phone, setPhone] = useState(state.phone)
  const [smsConsent, setSmsConsent] = useState(state.smsConsent)
  const [referralCode, setReferralCode] = useState(state.referralCode)
  const [showReferral, setShowReferral] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function clearFieldError() { setFieldError(null); setError(null) }

  async function handleSubmit() {
    const trimmedPostal = postal.trim().toUpperCase()
    if (!trimmedPostal) { setFieldError('Postal code is required.'); return }
    if (!CA_POSTAL.test(trimmedPostal)) { setFieldError('Enter a valid Canadian postal code (e.g. L9T 2X5).'); return }
    if (!firstName.trim()) { setFieldError('First name is required.'); return }
    if (!email.trim() || !email.includes('@')) { setFieldError('A valid email is required.'); return }
    if (!phone.trim()) { setFieldError('Phone number is required.'); return }

    update({
      postalCode: trimmedPostal,
      firstName: firstName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      smsConsent,
      referralCode,
    })

    await sendCode(email.trim().toLowerCase())
  }

  async function sendCode(emailAddr?: string) {
    const target = emailAddr ?? state.email
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send code.')
      setOtpSent(true)
      setCode(['', '', '', '', '', ''])
      setResendCooldown(60)
      const timer = setInterval(() => setResendCooldown(prev => { if (prev <= 1) { clearInterval(timer); return 0 } return prev - 1 }), 1000)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const codeValue = code.join('')
    if (codeValue.length !== 6) return
    setIsLoading(true)
    setError(null)
    try {
      const currentState = {
        firstName: firstName.trim(),
        phone: phone.trim(),
        postalCode: postal.trim().toUpperCase(),
        smsConsent,
        serviceCategoryId: state.subServiceId ?? state.categoryId ?? undefined,
        description: state.description || `${state.categoryName ?? 'Service'} request`,
        qualifierAnswers: state.qualifierAnswers,
        referralCode: referralCode || undefined,
      }
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: codeValue, pendingRequest: currentState }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed.')
      setSessionId(data.sessionId)
      onSuccess(data.requestId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOtpInput(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]; next[index] = digit; setCode(next)
    setError(null)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setCode(pasted.split('')); inputRefs.current[5]?.focus() }
  }

  if (otpSent) {
    return (
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Check your email</h3>
        <p className="text-[#475569] text-sm mb-6">
          We sent a 6-digit code to <span className="font-semibold text-[#0F172A]">{email.trim().toLowerCase()}</span>
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-3">Enter your 6-digit code</label>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-black bg-white border-2 rounded-xl transition-colors focus:outline-none focus:border-[#2563EB]"
                  style={{ borderColor: digit ? '#2563EB' : '#E2E8F0' }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || code.join('').length !== 6}
            className="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying…' : 'Verify & get quotes'}
          </button>
          <p className="text-center text-sm text-[#475569]">
            Didn't get it?{' '}
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button type="button" onClick={() => sendCode()} className="text-[#2563EB] font-semibold hover:underline">Resend code</button>
            )}
          </p>
        </form>
        <div className="mt-6">
          <button type="button" onClick={() => setOtpSent(false)} className="text-[#475569] text-sm hover:text-[#0F172A]">← Change contact info</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Almost done!</h3>
      <p className="text-[#475569] text-sm mb-6">Where are you located, and how should pros reach you?</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Postal Code *</label>
          <input
            type="text"
            className={`${inputClass} uppercase`}
            placeholder="L9T 2X5"
            value={postal}
            onChange={e => { setPostal(e.target.value); clearFieldError() }}
            maxLength={7}
          />
          <p className="text-xs text-[#94A3B8] mt-1">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">First Name *</label>
          <input type="text" className={inputClass} placeholder="Jane" value={firstName} onChange={e => { setFirstName(e.target.value); clearFieldError() }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Email *</label>
          <input type="email" className={inputClass} placeholder="jane@example.com" value={email} onChange={e => { setEmail(e.target.value); clearFieldError() }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Phone *</label>
          <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={phone} onChange={e => { setPhone(e.target.value); clearFieldError() }} />
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} />
          <span className="text-sm text-[#475569]">I agree to receive SMS updates about my service request</span>
        </label>
        {!showReferral ? (
          <button type="button" onClick={() => setShowReferral(true)} className="text-xs text-[#2563EB] hover:underline">Have a referral code?</button>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Referral Code <span className="font-normal opacity-60">(optional)</span></label>
            <input type="text" className={inputClass} placeholder="REF-XXXXXX" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} />
          </div>
        )}
      </div>
      {fieldError && <p className="text-sm text-red-500 mt-3">{fieldError}</p>}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Sending…' : 'Get free quotes →'}
        </button>
      </div>
    </div>
  )
}
