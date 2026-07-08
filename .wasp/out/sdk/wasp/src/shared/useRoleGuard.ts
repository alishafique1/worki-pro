import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';

/**
 * Redirects the current user if they don't have the required role.
 * - useRoleGuard('CONSUMER') → non-consumers (providers) are sent to /provider/dashboard
 * - useRoleGuard('PROVIDER') → non-providers are sent to /account
 * - useRoleGuard('ADMIN')    → non-admins are sent to /
 */
export function useRoleGuard(role: 'CONSUMER' | 'PROVIDER' | 'ADMIN') {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // IMPORTANT: this guard reads user.role from the React Query cache.
    // If useAuth is still loading or the user object is not yet available,
    // we must NOT redirect — an undefined/loading user looks like a mismatch.
    // OnboardingPage uses window.location.href after completeOnboarding to force
    // a full reload, ensuring this guard always sees the freshly-fetched role.
    if (isLoading || !user) return;

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
