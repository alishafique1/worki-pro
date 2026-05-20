import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    update: (p: Partial<WizardState>) => void;
    onNext: () => void;
};
export default function StepCategory({ state, update, onNext }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepCategory.d.ts.map