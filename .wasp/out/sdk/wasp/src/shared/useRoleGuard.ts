import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';

/**
 * Redirects the current user if they don't have the required role.
 * - useRoleGuard('PROVIDER') → non-providers are sent to /dashboard
 * - useRoleGuard('ADMIN')    → non-admins are sent to /
 */
export function useRoleGuard(role: 'PROVIDER' | 'ADMIN') {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user) return;

    if (role === 'PROVIDER' && user.role !== 'PROVIDER') {
      navigate('/dashboard', { replace: true });
    }

    if (role === 'ADMIN' && !user.isAdmin) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, role, navigate]);
}
