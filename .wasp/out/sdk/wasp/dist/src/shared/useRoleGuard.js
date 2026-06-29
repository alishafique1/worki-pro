import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
/**
 * Redirects the current user if they don't have the required role.
 * - useRoleGuard('CONSUMER') → non-consumers (providers) are sent to /provider/dashboard
 * - useRoleGuard('PROVIDER') → non-providers are sent to /account
 * - useRoleGuard('ADMIN')    → non-admins are sent to /
 */
export function useRoleGuard(role) {
    const { data: user, isLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoading || !user)
            return;
        if (role === 'CONSUMER' && user.role !== 'CONSUMER') {
            navigate('/provider/dashboard', { replace: true });
        }
        if (role === 'PROVIDER' && user.role !== 'PROVIDER') {
            navigate('/account', { replace: true });
        }
        if (role === 'ADMIN' && !user.isAdmin) {
            navigate('/', { replace: true });
        }
    }, [user, isLoading, role, navigate]);
}
//# sourceMappingURL=useRoleGuard.js.map