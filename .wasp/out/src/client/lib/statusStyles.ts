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
export const badgeToneClass: Record<BadgeTone, string> = {
  info: "bg-info-bg text-info-fg border border-info-border",
  success: "bg-success-bg text-success-fg border border-success-border",
  warning: "bg-warning-bg text-warning-fg border border-warning-border",
  danger: "bg-danger-bg text-danger-fg border border-danger-border",
  neutral: "bg-[#F1F5F9] text-slate border border-[#E2E8F0]",
};

/**
 * Maps a ServiceRequest status (see CLAUDE.md status lifecycle) to a tone.
 * New/early states are warning (needs attention), in-flight states are info,
 * terminal-good states are success, dead-end states are danger.
 */
export function requestStatusTone(status: string): BadgeTone {
  const s = status.toUpperCase();
  if (["NEW", "SMS_STARTED", "QUALIFYING"].includes(s)) return "warning";
  if (["QUALIFIED", "ASSIGNED", "ACCEPTED_BY_PROVIDER", "BOOKED"].includes(s))
    return "info";
  if (
    [
      "COMPLETED",
      "REWARD_PENDING",
      "REWARD_APPROVED",
      "CLOSED",
      "CONVERTED",
      "PUBLISHED",
    ].includes(s)
  )
    return "success";
  if (["LOST", "INVALID", "SPAM", "REJECTED"].includes(s)) return "danger";
  if (s === "PENDING") return "warning";
  return "neutral";
}

/** Convenience: full className for a request/review/message status pill. */
export function statusBadge(status: string): string {
  return badgeToneClass[requestStatusTone(status)];
}
