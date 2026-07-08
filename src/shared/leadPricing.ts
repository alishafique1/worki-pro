// Category-based lead pricing (audit fix: flat $5 dramatically underpriced
// high-value categories — HVAC lead market value is $35–90).
//
// Single source of truth for the QUALIFIED_LEAD fee. Used by:
//   - claimLead (src/provider/operations.ts) — fee record created on claim
//   - submitServiceRequest preferred-provider path (src/consumer/operations.ts)
//   - Provider-facing lead cards / claim confirmation (src/provider/LeadsPage.tsx)
//
// Kept free of any `wasp/server` imports so it is safe to import from client code.

export const LEAD_FEES_CAD: Record<string, number> = {
  hvac: 25,
  plumbing: 20,
  electrical: 20,
  'appliance-repair': 15,
  'smart-home': 10,
  handyman: 10,
};

export const DEFAULT_LEAD_FEE_CAD = 5;

/** Fee (CAD) charged to a provider for claiming a lead in the given category. */
export function getLeadFee(categorySlug: string | null | undefined): number {
  if (!categorySlug) return DEFAULT_LEAD_FEE_CAD;
  return LEAD_FEES_CAD[categorySlug] ?? DEFAULT_LEAD_FEE_CAD;
}
