/**
 * Pick the licence-number label based on the service categories a provider
 * selected. Exactly one regulated trade → that regulator's label; several →
 * a combined label; none → a generic one.
 */
export declare function licenceFieldForCategorySlugs(slugs: string[]): {
    label: string;
    hint: string;
};
/** Public registries an admin can use to manually check a submitted number. */
export declare const CREDENTIAL_REGISTRIES: {
    name: string;
    url: string;
    checks: string;
}[];
//# sourceMappingURL=credentials.d.ts.map