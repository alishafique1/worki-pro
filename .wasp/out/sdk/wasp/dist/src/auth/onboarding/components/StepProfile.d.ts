type Role = 'CONSUMER' | 'PROVIDER';
type FormData = {
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    smsConsent: boolean;
    referralCode: string;
};
type StepProfileProps = {
    form: FormData;
    role: Role | null;
    onChange: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
};
export default function StepProfile({ form, role, onChange }: StepProfileProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepProfile.d.ts.map