/**
 * Redirects the current user if they don't have the required role.
 * - useRoleGuard('CONSUMER') → non-consumers (providers) are sent to /provider/dashboard
 * - useRoleGuard('PROVIDER') → non-providers are sent to /account
 * - useRoleGuard('ADMIN')    → non-admins are sent to /
 */
export declare function useRoleGuard(role: 'CONSUMER' | 'PROVIDER' | 'ADMIN'): void;
//# sourceMappingURL=useRoleGuard.d.ts.map