/**
 * One source of truth for status-pill styling.
 *
 * Before this, the admin Requests page, admin Messages page, and Reviews page
 * each defined their own status→color map (some hex, some Tailwind `*-50/700`),
 * so the same conceptual state looked different across screens. Everything now
 * resolves a status to a semantic `tone`, and the tone maps to the shared
 * design tokens defined in Main.css.
 */
export type BadgeTone = "info" | "success" | "warning" | "danger" | "neutral";
/** Tailwind classes for a status pill, keyed by semantic tone. */
export declare const badgeToneClass: Record<BadgeTone, string>;
/**
 * Maps a ServiceRequest status (see CLAUDE.md status lifecycle) to a tone.
 * New/early states are warning (needs attention), in-flight states are info,
 * terminal-good states are success, dead-end states are danger.
 */
export declare function requestStatusTone(status: string): BadgeTone;
/** Convenience: full className for a request/review/message status pill. */
export declare function statusBadge(status: string): string;
//# sourceMappingURL=statusStyles.d.ts.map