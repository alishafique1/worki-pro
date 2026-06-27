/**
 * Qualifier questions by category slug.
 * Used in the RequestServicePage wizard to collect job-specific details.
 */
export interface QualifierQuestion {
    id: string;
    label: string;
    options: string[];
    isOptional?: boolean;
}
export interface CategoryQualifierConfig {
    q1: QualifierQuestion;
    q2?: QualifierQuestion;
    detailChips?: string[];
    detailChipsLabel?: string;
}
export declare const CATEGORY_QUALIFIERS: Record<string, CategoryQualifierConfig>;
/**
 * Get qualifier config for a category slug.
 * Returns undefined if no qualifiers are defined.
 */
export declare function getQualifiersForCategory(slug: string): CategoryQualifierConfig | undefined;
/**
 * Live service categories that appear in the request flow.
 * These are the primary 6 categories with full support.
 */
export declare const LIVE_CATEGORY_SLUGS: string[];
/**
 * Check if a category is live (fully supported in request flow).
 */
export declare function isLiveCategory(slug: string): boolean;
