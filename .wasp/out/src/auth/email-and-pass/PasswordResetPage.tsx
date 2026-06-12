import { ResetPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import logo from "../../client/static/logo.webp";

export function PasswordResetPage() {
  return (
    <AuthPageLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="The Helper" className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Set a new password</h2>
        <p className="text-sm text-[#475569]">Enter a new password to regain access to your account.</p>
      </div>
      <ResetPasswordForm />
      <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
        <p className="text-sm text-[#475569]">
          Remember your password?{" "}
          <WaspRouterLink to={routes.LoginRoute.to} className="text-[#2563EB] font-semibold hover:underline">
            Sign in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>
  );
}