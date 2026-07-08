import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void }

export default function StepCategory({ state, update, onNext }: Props) {
  return (
    <div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">What do you need help with?</h3>
      <p className="text-[#475569] text-sm mb-6">Select a category to get started.</p>
      <div className="grid grid-cols-2 gap-3">
        {HARDCODED_CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => { update({ categoryId: cat.id, categorySlug: cat.slug, categoryName: cat.name }); onNext() }}
            className={`border-2 rounded-2xl p-5 text-left transition-all cursor-pointer ${
              state.categorySlug === cat.slug ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
            }`}
          >
            <span className="text-2xl block mb-2">{cat.icon}</span>
            <p className="text-sm font-bold text-[#0F172A]">{cat.name}</p>
            <p className="text-xs text-[#475569] mt-0.5">{cat.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export const HARDCODED_CATEGORIES = [
  { id: 'handyman', slug: 'handyman',   name: 'Handyman',   icon: '🔧', desc: 'Minor repairs, assembly, drywall, painting' },
  { id: 'hvac',     slug: 'hvac',       name: 'HVAC',       icon: '❄️', desc: 'Heating, cooling, furnace, AC repair' },
  { id: 'plumbing', slug: 'plumbing',   name: 'Plumbing',   icon: '🔧', desc: 'Leaks, drains, toilets, water heaters' },
  { id: 'smarthome',slug: 'smart-home', name: 'Smart Home', icon: '🏠', desc: 'Thermostats, cameras, home automation' },
]
