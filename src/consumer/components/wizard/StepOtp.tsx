import type { WizardState } from '../../GuestRequestWizardPage'

type Props = {
  state: WizardState
  update: (p: Partial<WizardState>) => void
  onBack: () => void
  onSuccess: (requestId?: string) => void
  setError: (e: string | null) => void
}

export default function StepOtp(_props: Props) {
  return <div className="text-[#94A3B8] text-center py-8">Loading step…</div>
}
