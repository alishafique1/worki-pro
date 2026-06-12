import { VerifyEmailForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";
import logo from "../../client/static/logo.webp";
export function EmailVerificationPage() {
    return (<AuthPageLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="The Helper" className="w-8 h-8 rounded-lg"/>
          <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Verify your email</h2>
        <p className="text-sm text-[#475569]">Check your inbox for a confirmation link to activate your account.</p>
      </div>
      <VerifyEmailForm />
      <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
        <p className="text-sm text-[#475569]">
          Already verified?{" "}
          <WaspRouterLink to={routes.LoginRoute.to} className="text-[#2563EB] font-semibold hover:underline">
            Sign in
          </WaspRouterLink>
        </p>
      </div>
    </AuthPageLayout>);
}
//# sourceMappingURL=EmailVerificationPage.jsx.map