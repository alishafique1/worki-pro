type StepBusinessProps = {
    businessName: string;
    serviceAreas: string;
    onChange: (field: 'businessName' | 'serviceAreas', value: string) => void;
};
export default function StepBusiness({ businessName, serviceAreas, onChange }: StepBusinessProps): import("react").JSX.Element;
export {};
