import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onBack: () => void;
    onSuccess: (requestId?: string) => void;
    setError: (e: string | null) => void;
};
export default function StepVerifyEmail({ state, update, onBack, onSuccess, setError }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepVerifyEmail.d.ts.map