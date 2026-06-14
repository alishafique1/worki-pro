import { useState } from 'react'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onNext: () => void
}

const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const inputClass = 'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors'

export default function StepInfoAndVerify({ state, update, onBack, onNext }: Props) {
  const [postal, setPostal] = useState(state.postalCode)
  const [firstName, setFirstName] = useState(state.firstName)
  const [phone, setPhone] = useState(state.phone)
  const [smsConsent, setSmsConsent] = useState(state.smsConsent)
  const [referralCode, setReferralCode] = useState(state.referralCode)
  const [showReferral, setShowReferral] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  function handleNext() {
    const trimmedPostal = postal.trim().toUpperCase()
    if (!trimmedPostal) { setFieldError('Postal code is required.'); return }
    if (!CA_POSTAL.test(trimmedPostal)) { setFieldError('Enter a valid Canadian postal code (e.g. L9T 2X5).'); return }
    if (!firstName.trim()) { setFieldError('First name is required.'); return }
    if (!phone.trim()) { setFieldError('Phone number is required.'); return }

    update({
      postalCode: trimmedPostal,
      firstName: firstName.trim(),
      phone: phone.trim(),
      smsConsent,
      referralCode,
    })
    onNext()
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
            onChange={e => { setPostal(e.target.value); setFieldError(null) }}
            maxLength={7}
          />
          <p className="text-xs text-[#94A3B8] mt-1">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">First Name *</label>
          <input type="text" className={inputClass} placeholder="Jane" value={firstName} onChange={e => { setFirstName(e.target.value); setFieldError(null) }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Phone *</label>
          <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={phone} onChange={e => { setPhone(e.target.value); setFieldError(null) }} />
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)} />
          <span className="text-sm text-[#475569]">Text me when a pro confirms my appointment or sends an update</span>
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
          onClick={handleNext}
          className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
