import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { Link } from "react-router";
import { FileQuestion } from "lucide-react";
export function NotFoundPage() {
    const { data: user } = useAuth();
    // Determine the correct "home" path for the primary button:
    // - Provider → /provider/dashboard
    // - Consumer (or any other logged-in role) → /account
    // - Anonymous → landing page
    const homePath = user
        ? user.role === "PROVIDER"
            ? "/provider/dashboard"
            : "/account"
        : routes.LandingPageRoute.to;
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="size-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#EFF6FF]">
          <FileQuestion className="size-8 text-[#2563EB]"/>
        </div>
        <h1 className="mb-3 text-6xl font-black tracking-tight text-[#0F172A]">404</h1>
        <p className="text-lg text-[#475569] mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Primary recovery action */}
        <Link to={homePath} className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-8 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors">
          Go Back Home
        </Link>

        {/* Secondary recovery actions */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <Link to="/services" className="text-sm font-semibold text-[#2563EB] hover:underline transition-colors">
            Browse services
          </Link>
          <span className="text-[#E2E8F0] select-none">|</span>
          <Link to="/contact" className="text-sm font-semibold text-[#2563EB] hover:underline transition-colors">
            Contact support
          </Link>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=NotFoundPage.jsx.map