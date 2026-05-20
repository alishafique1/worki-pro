export type WizardState = {
    categoryId: string | null;
    categorySlug: string | null;
    categoryName: string | null;
    subServiceId: string | null;
    subServiceName: string | null;
    qualifierAnswers: Record<string, string | string[]>;
    description: string;
    postalCode: string;
    firstName: string;
    email: string;
    phone: string;
    smsConsent: boolean;
    referralCode: string;
};
export default function GuestRequestWizardPage(): import("react").JSX.Element;
