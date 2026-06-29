import { ForgotPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import { Logo } from "../../client/components/Logo/Logo";
export function RequestPasswordResetPage() {
    return (<AuthPageLayout>
      <div className="mb-8">
        <Logo variant="light" size="md" className="mb-6"/>
        <h2 className="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Reset your password</h2>
        <p className="text-sm text-[#475569]">Enter your email and we'll send you a reset link.</p>
      </div>
      <ForgotPasswordForm />
      <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
        <p className="text-sm text-[#475569]">
          Remember your password?{" "}
          <WaspRouterLink to={routes.LoginRoute.to} className="text-[#2563EB] font-semibold hover:underline">
            Sign in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>);
}
