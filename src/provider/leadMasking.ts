// Single source of truth for masking consumer PII out of the public lead feed.
//
// DOMAIN RULE: the public lead feed must NEVER expose a consumer's name, phone,
// or email. These are revealed only after claimLead succeeds. This module is
// kept free of any `wasp/server` imports so it can be unit-tested in isolation
// (see leadMasking.test.ts) — that test is the regression guard for this rule.

// Fields that must never appear on a masked lead. Asserted by the unit test.
export const FORBIDDEN_LEAD_FIELDS = ['name', 'phone', 'email'] as const;

export type MaskedLead = {
  id: string;
  createdAt: Date;
  serviceCategory: { name: string; slug: string } | null;
  postalCode: string;
  city: string | null;
  urgency: string;
  description: string;
  estimatedSchedule: string | null;
  status: string;
  claimed: boolean;
};

// Minimal shape this transform reads from a ServiceRequest. Intentionally a
// structural subset so the unit test can pass a plain object with PII attached
// and prove the PII does not survive the transform.
export type RawLead = {
  id: string;
  createdAt: Date;
  serviceCategory: { name: string; slug: string } | null;
  postalCode: string;
  city: string | null;
  urgency: string;
  description: string;
  estimatedSchedule: string | null;
  status: string;
  assignedProviderId: string | null;
  // PII — present on the row, must be dropped by maskLead:
  name?: string | null;
  phone?: string | null;
  email?: string | null;
};

export function maskLead(r: RawLead): MaskedLead {
  return {
    id: r.id,
    createdAt: r.createdAt,
    serviceCategory: r.serviceCategory
      ? { name: r.serviceCategory.name, slug: r.serviceCategory.slug }
      : null,
    postalCode: r.postalCode,
    city: r.city,
    urgency: r.urgency,
    description:
      r.description.length > 200
        ? r.description.substring(0, 200) + '…'
        : r.description,
    estimatedSchedule: r.estimatedSchedule,
    status: r.status,
    claimed: !!r.assignedProviderId,
  };
}
