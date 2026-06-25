// Shared onboarding validation — single source of truth used by BOTH the
// client (OnboardingPage) and the server (completeOnboarding). Keeping these
// pure and dependency-free means the same rules guard the form and the trust
// boundary: a direct API call can no longer bypass what the UI enforces.

export type OnboardingRole = 'CONSUMER' | 'PROVIDER';

// Accepts: (416) 555-0100 | 416-555-0100 | 4165550100 | +1 416 555 0100
const CANADIAN_PHONE = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
// Canadian postal code: A1A 1A1 (optional space/hyphen)
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
// GTA service area: postal codes starting with L (905 belt) or M (Toronto)
const GTA_POSTAL_PREFIX = /^[LM]/i;

export const isValidCanadianPhone = (v: string): boolean => CANADIAN_PHONE.test(v.trim());
export const isValidCanadianPostal = (v: string): boolean => CA_POSTAL.test(v.trim());
export const isGtaPostal = (v: string): boolean => GTA_POSTAL_PREFIX.test(v.trim());

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
export function validateOnboarding(
  input: OnboardingValidationInput,
  opts: { requireProviderServices?: boolean } = {},
): string | null {
  if (!input.role) return 'Please select your role to continue.';
  if (!input.firstName.trim()) return 'First name is required.';
  if (!input.phone.trim()) return 'Phone number is required.';
  if (!isValidCanadianPhone(input.phone)) return 'Enter a valid Canadian phone number (e.g. (416) 555-0100).';
  if (!input.postalCode.trim()) return 'Postal code is required.';
  if (!isValidCanadianPostal(input.postalCode)) return 'Enter a valid Canadian postal code (e.g. L9T 2X5).';
  if (!isGtaPostal(input.postalCode)) return 'We currently serve the GTA (postal codes starting with L or M). Other areas coming soon.';
  if (input.role === 'PROVIDER') {
    if (!input.businessName?.trim()) return 'Business name is required.';
    if (opts.requireProviderServices && (input.serviceCategoryIds?.length ?? 0) === 0) {
      return 'Please select at least one service category to continue.';
    }
  }
  return null;
}
