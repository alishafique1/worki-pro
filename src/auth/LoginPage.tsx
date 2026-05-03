import { LoginForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
      <div className="mt-6 space-y-3 text-center text-sm text-[var(--text-secondary)]">
        <p>
          Don't have an account?{' '}
          <WaspRouterLink to={routes.SignupRoute.to} className="text-[var(--accent)] font-semibold hover:underline">
            Sign up free
          </WaspRouterLink>
        </p>
        <p>
          <WaspRouterLink to={routes.RequestPasswordResetRoute.to} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
            Forgot password?
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}
