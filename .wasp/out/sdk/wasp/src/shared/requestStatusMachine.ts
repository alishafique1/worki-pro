// ServiceRequest status state machine (audit fix: status writes were
// unvalidated — any writer could jump a request to any status, double-firing
// rewards/fees and corrupting the funnel).
//
// Lifecycle (see CLAUDE.md):
//   NEW → SMS_STARTED → QUALIFYING → QUALIFIED → ASSIGNED
//     → ACCEPTED_BY_PROVIDER → BOOKED → COMPLETED
//     → REWARD_PENDING → REWARD_APPROVED → CLOSED
// Dead ends: LOST, INVALID, SPAM.
//
// Server-only module (imports wasp/server) — do not import from client code.

import { HttpError } from 'wasp/server';
import type { RequestStatus } from '@prisma/client';

export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  NEW: ['SMS_STARTED', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED', 'LOST', 'INVALID', 'SPAM'],
  SMS_STARTED: ['QUALIFYING', 'QUALIFIED', 'LOST', 'INVALID', 'SPAM'],
  QUALIFYING: ['QUALIFIED', 'LOST', 'INVALID', 'SPAM'],
  QUALIFIED: ['ASSIGNED', 'LOST', 'INVALID', 'SPAM'],
  ASSIGNED: ['ACCEPTED_BY_PROVIDER', 'QUALIFIED', 'LOST', 'INVALID', 'SPAM'],
  ACCEPTED_BY_PROVIDER: ['BOOKED', 'ASSIGNED', 'LOST'],
  BOOKED: ['COMPLETED', 'LOST'],
  COMPLETED: ['REWARD_PENDING', 'CLOSED'],
  REWARD_PENDING: ['REWARD_APPROVED', 'CLOSED'],
  REWARD_APPROVED: ['CLOSED'],
  // Terminal states. INVALID/SPAM may be resurrected to NEW by an admin
  // (mis-flagged lead); CLOSED and LOST are permanently terminal.
  CLOSED: [],
  LOST: [],
  INVALID: ['NEW'],
  SPAM: ['NEW'],
};

/** True when `from → to` is a legal transition. Same-status is NOT legal —
 *  callers wanting idempotent no-ops must skip the write, not re-apply it. */
export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}

/** Throws HttpError(409) when the transition is illegal. Use in operations;
 *  webhooks should use canTransition + warn/skip instead (never 500 on
 *  external retries). */
export function assertTransition(from: RequestStatus, to: RequestStatus): void {
  if (!canTransition(from, to)) {
    throw new HttpError(409, `Invalid status transition ${from}→${to}`);
  }
}

/** Statuses from which a provider may claim a lead (i.e. → ASSIGNED is legal). */
export const CLAIMABLE_STATUSES: RequestStatus[] = (
  Object.keys(ALLOWED_TRANSITIONS) as RequestStatus[]
).filter((s) => canTransition(s, 'ASSIGNED'));
