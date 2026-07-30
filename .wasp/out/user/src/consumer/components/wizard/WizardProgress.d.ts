type WizardProgressProps = {
    current: number;
    total: number;
    labels: string[];
};
export default function WizardProgress({ current, total, labels }: WizardProgressProps): import("react").JSX.Element;
export {};
