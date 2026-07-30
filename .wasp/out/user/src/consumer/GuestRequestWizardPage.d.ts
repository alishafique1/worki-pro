export type WizardState = {
    categoryId: string | null;
    categorySlug: string | null;
    categoryName: string | null;
    postalCode: string;
    description: string;
    urgency: 'TODAY' | 'THIS_WEEK' | 'FLEXIBLE';
    preferredTime: string;
    qualifierAnswers: Record<string, string>;
    detailChips: string[];
    firstName: string;
    email: string;
    phone: string;
    smsConsent: boolean;
};
export default function GuestRequestWizardPage(): import("react").JSX.Element;
