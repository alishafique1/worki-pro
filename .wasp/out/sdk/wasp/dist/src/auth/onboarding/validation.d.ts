export type OnboardingRole = 'CONSUMER' | 'PROVIDER';
export declare const isValidCanadianPhone: (v: string) => boolean;
export declare const isValidCanadianPostal: (v: string) => boolean;
export declare const isGtaPostal: (v: string) => boolean;
export type OnboardingValidationInput = {
    role: OnboardingRole | null;
    firstName: string;
    phone: string;
    postalCode: string;
    businessName?: string;
    serviceCategoryIds?: string[];
};
/**
 * Validate a complete onboarding submission. Returns a human-readable error
 * message, or null when valid.
 *
 * `requireProviderServices` lets the client defer the "pick a category" check
 * until the final provider step, while the server always enforces the full
 * rule (it can't trust the client to have reached that step).
 */
export declare function validateOnboarding(input: OnboardingValidationInput, opts?: {
    requireProviderServices?: boolean;
}): string | null;
//# sourceMappingURL=validation.d.ts.map