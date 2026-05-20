/**
 * Redirects the current user if they don't have the required role.
 * - useRoleGuard('PROVIDER') → non-providers are sent to /dashboard
 * - useRoleGuard('ADMIN')    → non-admins are sent to /
 */
export declare function useRoleGuard(role: 'PROVIDER' | 'ADMIN'): void;
