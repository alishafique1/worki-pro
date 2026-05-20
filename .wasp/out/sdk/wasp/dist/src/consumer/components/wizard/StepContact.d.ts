import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onNext: () => void;
    onBack: () => void;
};
export default function StepContact({ state, update, onNext, onBack }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepContact.d.ts.map