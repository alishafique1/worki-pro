import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import NavBar from "./components/NavBar/NavBar";
import { marketingNavigationItems } from "./components/NavBar/constants";
import CookieConsentBanner from "./components/cookie-consent/Banner";
import { useAuth } from "wasp/client/auth";
import ConsumerLayout from "../consumer/layout/ConsumerLayout";
import ProviderLayout from "../provider/layout/ProviderLayout";
const CONSUMER_PORTAL_PATHS = [
    '/account',
    '/help',
];
export default function App() {
    const location = useLocation();
    const { data: user } = useAuth();
    const isAdminDashboard = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname]);
    const isConsumerPortal = useMemo(() => CONSUMER_PORTAL_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/')), [location.pathname]);
    const isProviderPortal = useMemo(() => location.pathname.startsWith('/provider/'), [location.pathname]);
    const isAuthPage = useMemo(() => location.pathname === routes.LoginRoute.build() ||
        location.pathname === routes.SignupRoute.build(), [location.pathname]);
    useEffect(() => {
        if (location.hash) {
            const el = document.getElementById(location.hash.replace('#', ''));
            if (el)
                el.scrollIntoView();
        }
    }, [location]);
    // Admin: own sidebar layout, no top nav
    if (isAdminDashboard) {
        return (<>
        <ErrorBoundary><Outlet /></ErrorBoundary>
        <Toaster position="bottom-right"/>
      </>);
    }
    // Consumer portal: sidebar layout
    if (isConsumerPortal) {
        return (<>
        <ConsumerLayout user={user}>
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </ConsumerLayout>
        <Toaster position="bottom-right"/>
      </>);
    }
    // Provider portal: sidebar layout
    if (isProviderPortal) {
        return (<>
        <ProviderLayout user={user}>
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </ProviderLayout>
        <Toaster position="bottom-right"/>
      </>);
    }
    // Marketing + auth + everything else: top NavBar
    return (<>
      <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen">
        {!isAuthPage && <NavBar navigationItems={marketingNavigationItems}/>}
        <div className="mx-auto max-w-(--breakpoint-2xl)">
          <ErrorBoundary><Outlet /></ErrorBoundary>
        </div>
      </div>
      <Toaster position="bottom-right"/>
      <CookieConsentBanner />
    </>);
}
