import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onBack: () => void;
    onNext: () => void;
};
export default function StepDetails({ state, update, onBack, onNext }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepDetails.d.ts.map