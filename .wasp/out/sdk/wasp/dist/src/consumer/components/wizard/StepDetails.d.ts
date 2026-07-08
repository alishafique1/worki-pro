import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onBack: () => void;
    onNext: () => void;
    /** When true, shows "From your account" hint on prefilled fields. */
    prefilled?: boolean;
};
export default function StepDetails({ state, update, onBack, onNext, prefilled }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepDetails.d.ts.map