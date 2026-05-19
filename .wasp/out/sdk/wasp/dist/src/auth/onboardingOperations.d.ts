import { type CompleteOnboarding } from 'wasp/server/operations';
type CompleteOnboardingInput = {
    role: 'CONSUMER' | 'PROVIDER';
    firstName: string;
    lastName?: string;
    phone: string;
    postalCode: string;
    smsConsent?: boolean;
    businessName?: string;
    serviceAreas?: string[];
    referralCode?: string;
};
type CompleteOnboardingOutput = {
    success: boolean;
};
export declare const completeOnboarding: CompleteOnboarding<CompleteOnboardingInput, CompleteOnboardingOutput>;
export {};
//# sourceMappingURL=onboardingOperations.d.ts.map