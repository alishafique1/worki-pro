import { useState } from 'react'
import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onNext: () => void
}

const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const URGENCY_OPTIONS: { value: WizardState['urgency']; label: string; helper: string }[] = [
  { value: 'TODAY',    label: 'Today',       helper: 'ASAP — within the next few hours' },
  { value: 'THIS_WEEK', label: 'This week',  helper: 'Sometime in the next 7 days' },
  { value: 'FLEXIBLE', label: 'Flexible',    helper: 'No rush — pick a date that works' },
]

const inputClass =
  'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors'

export default function StepDetails({ state, update, onBack, onNext }: Props) {
  const [postalCode, setPostalCode] = useState(state.postalCode)
  const [description, setDescription] = useState(state.description)
  const [urgency, setUrgency] = useState<WizardState['urgency']>(state.urgency)
  const [preferredTime, setPreferredTime] = useState(state.preferredTime)
  const [error, setError] = useState<string | null>(null)

  const descCount = description.trim().length

  function handleNext() {
    const trimmedPostal = postalCode.trim().toUpperCase()
    if (!trimmedPostal) { setError('Postal code is required.'); return }
    if (!CA_POSTAL.test(trimmedPostal)) { setError('Enter a valid Canadian postal code (e.g. L9T 2X5).'); return }

    const trimmedDesc = description.trim()
    if (trimmedDesc.length < 50)  { setError(`Please add a bit more detail — at least 50 characters (currently ${trimmedDesc.length}).`); return }
    if (trimmedDesc.length > 2000) { setError('Description must be 2,000 characters or fewer.'); return }

    setError(null)
    update({
      postalCode: trimmedPostal,
      description: trimmedDesc,
      urgency,
      preferredTime: preferredTime.trim(),
    })
    onNext()
  }

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Tell us about the job</h3>
      <p className="text-[#475569] text-sm mb-6">A few details help pros quote accurately.</p>

      <div className="space-y-5">
        <div>
          <label htmlFor="wiz-postal" className="block text-sm font-semibold text-[#475569] mb-1.5">
            Postal code <span className="text-red-500">*</span>
          </label>
          <input
            id="wiz-postal"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            maxLength={7}
            className={`${inputClass} uppercase tracking-wider`}
            placeholder="L9T 2X5"
            value={postalCode}
            onChange={(e) => { setPostalCode(e.target.value); setError(null) }}
          />
          <p className="text-xs text-[#94A3B8] mt-1">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
        </div>

        <div>
          <label htmlFor="wiz-description" className="block text-sm font-semibold text-[#475569] mb-1.5">
            What needs doing? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="wiz-description"
            rows={5}
            maxLength={2000}
            className={`${inputClass} resize-y min-h-[120px]`}
            placeholder="Tell us the problem, the room/area, and anything pros should know (square footage, age of fixture, etc.)."
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError(null) }}
          />
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#94A3B8]">Aim for at least 50 characters.</span>
            <span className={descCount > 2000 ? 'text-red-500 font-semibold' : 'text-[#94A3B8]'}>
              {descCount} / 2,000
            </span>
          </div>
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-[#475569] mb-2">
            How soon do you need it?
          </legend>
          <div className="grid grid-cols-1 gap-2">
            {URGENCY_OPTIONS.map((opt) => {
              const isSelected = urgency === opt.value
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
                  }`}
                >
                  <input
                    type="radio"
                    name="wiz-urgency"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => { setUrgency(opt.value); setError(null) }}
                    className="mt-1 accent-[#2563EB]"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-[#0F172A]">{opt.label}</span>
                    <span className="block text-xs text-[#475569]">{opt.helper}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="wiz-time" className="block text-sm font-semibold text-[#475569] mb-1.5">
            Preferred time <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input
            id="wiz-time"
            type="text"
            className={inputClass}
            placeholder="e.g. weekday mornings, after 5pm weekdays, Saturday afternoon"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            maxLength={120}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-3 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-[#475569] font-bold hover:text-[#0F172A]"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
