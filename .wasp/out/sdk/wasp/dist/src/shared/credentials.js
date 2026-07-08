// ─── Provider credential helpers ─────────────────────────────────────────────
// HVAC/gas, electrical, and plumbing are compulsory trades in Ontario, each
// with a free public registry. We capture the registration/licence number so
// an admin can manually verify it against the registry before approving a
// provider. Nothing here implies a guarantee — badge copy must stay factual
// ("Licence on file — verified by admin"), never "guaranteed" or
// "background-checked".
/** Regulated-trade category slugs → the regulator whose number we ask for. */
const REGULATED_TRADE_LABELS = [
    {
        slug: 'hvac',
        label: 'TSSA registration #',
        hint: 'Your TSSA fuels/HVAC contractor registration number.',
    },
    {
        slug: 'electrical',
        label: 'ECRA/ESA licence #',
        hint: 'Your ECRA/ESA Licensed Electrical Contractor number (7 digits).',
    },
    {
        slug: 'plumbing',
        label: 'STO certificate #',
        hint: 'Your Skilled Trades Ontario Certificate of Qualification number.',
    },
];
/**
 * Pick the licence-number label based on the service categories a provider
 * selected. Exactly one regulated trade → that regulator's label; several →
 * a combined label; none → a generic one.
 */
export function licenceFieldForCategorySlugs(slugs) {
    const matches = REGULATED_TRADE_LABELS.filter((t) => slugs.includes(t.slug));
    if (matches.length === 1)
        return { label: matches[0].label, hint: matches[0].hint };
    if (matches.length > 1) {
        return {
            label: 'Trade licence # (TSSA / ECRA-ESA / STO)',
            hint: 'Enter your primary trade registration number; you can add the rest later in your profile.',
        };
    }
    return {
        label: 'Trade licence #',
        hint: 'Any trade licence or certification number you hold (if applicable).',
    };
}
/** Public registries an admin can use to manually check a submitted number. */
export const CREDENTIAL_REGISTRIES = [
    { name: 'TSSA', url: 'https://www.tssa.org/en/fuels/find-a-registered-contractor.aspx', checks: 'HVAC / gas contractor registration' },
    { name: 'ESA', url: 'https://findacontractor.esasafe.com', checks: 'ECRA/ESA electrical contractor licence' },
    { name: 'STO', url: 'https://www.skilledtradesontario.ca/about-us/public-register/', checks: 'Skilled Trades Ontario certificate (plumbing etc.)' },
    { name: 'WSIB', url: 'https://clearances.wsib.on.ca', checks: 'WSIB clearance certificate' },
];
//# sourceMappingURL=credentials.js.map