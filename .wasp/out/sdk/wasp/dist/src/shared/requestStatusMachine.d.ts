import type { RequestStatus } from '@prisma/client';
export declare const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]>;
/** True when `from → to` is a legal transition. Same-status is NOT legal —
 *  callers wanting idempotent no-ops must skip the write, not re-apply it. */
export declare function canTransition(from: RequestStatus, to: RequestStatus): boolean;
/** Throws HttpError(409) when the transition is illegal. Use in operations;
 *  webhooks should use canTransition + warn/skip instead (never 500 on
 *  external retries). */
export declare function assertTransition(from: RequestStatus, to: RequestStatus): void;
/** Statuses from which a provider may claim a lead (i.e. → ASSIGNED is legal). */
export declare const CLAIMABLE_STATUSES: RequestStatus[];
//# sourceMappingURL=requestStatusMachine.d.ts.map