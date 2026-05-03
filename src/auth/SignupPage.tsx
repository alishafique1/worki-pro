import { SignupForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm />
      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        <p>
          Already have an account?{' '}
          <WaspRouterLink to={routes.LoginRoute.to} className="text-[var(--accent)] font-semibold hover:underline">
            Log in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}
