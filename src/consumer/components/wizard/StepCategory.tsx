import type { WizardState } from '../../GuestRequestWizardPage'

type Props = { state: WizardState; update: (p: Partial<WizardState>) => void; onNext: () => void }

export default function StepCategory(_props: Props) {
  return <div className="text-[#94A3B8] text-center py-8">Loading step…</div>
}
