import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onBack: () => void;
    onSuccess: (requestId?: string) => void;
    setError: (e: string | null) => void;
};
export default function StepOtp({ state, onBack, onSuccess, setError }: Props): import("react").JSX.Element;
export {};
