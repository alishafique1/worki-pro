import { useState } from 'react'
import type { WizardState } from '../../GuestRequestWizardPage'
import { CATEGORY_QUALIFIERS } from '../../categoryQualifiers'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

const chipClass = (selected: boolean) =>
  `px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-all ${
    selected
      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
      : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]'
  }`

export default function StepQualifiers({ state, update, onNext, onBack }: Props) {
  const slug = state.categorySlug ?? ''
  const config = CATEGORY_QUALIFIERS[slug]
  const [answers, setAnswers] = useState<Record<string, string>>(state.qualifierAnswers)
  const [chips, setChips] = useState<string[]>(state.detailChips)
  const [description, setDescription] = useState(state.description)
  const [error, setError] = useState<string | null>(null)

  function setAnswer(id: string, value: string) {
    setAnswers(prev => ({ ...prev, [id]: value }))
    setError(null)
  }

  function toggleChip(chip: string) {
    setChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )
  }

  function handleNext() {
    update({ qualifierAnswers: answers, detailChips: chips, description: description.trim() })
    onNext()
  }

  if (!config) {
    return (
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Job details</h3>
        <p className="text-[#475569] text-sm mb-6">Help pros understand your job.</p>
        <div className="flex justify-end mt-8">
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

  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">{config.q1.label}</h3>

      {/* q1 — required */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {config.q1.options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => setAnswer(config.q1.id, opt)}
            className={`border-2 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all cursor-pointer ${
              answers[config.q1.id] === opt
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#0F172A]'
                : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#94A3B8]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* q2 — optional */}
      {config.q2 && (
        <>
          <h4 className="text-base font-semibold mb-2 text-[#0F172A]">
            {config.q2.label}
            {config.q2.isOptional && (
              <span className="font-normal text-[#94A3B8] text-sm ml-1">(optional)</span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2 mb-5">
            {config.q2.options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(config.q2!.id, opt)}
                className={`border-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  answers[config.q2!.id] === opt
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#0F172A]'
                    : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#94A3B8]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {/* detailChips */}
      {config.detailChips && config.detailChips.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-[#475569] mb-2">{config.detailChipsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {config.detailChips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={chipClass(chips.includes(chip))}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* optional description */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#475569] mb-1.5">
          Anything else to add?
          <span className="font-normal opacity-60 ml-1">(optional)</span>
        </label>
        <textarea
          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none"
          rows={3}
          placeholder="e.g. 'AC stopped working overnight, unit is 8 years old'"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#475569] font-bold hover:text-[#0F172A] transition-colors"
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
