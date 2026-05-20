import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import ErrorBoundary from "./components/ErrorBoundary";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import NavBar from "./components/NavBar/NavBar";
import { demoNavigationitems, marketingNavigationItems, consumerNavigationItems, providerNavigationItems, adminNavigationItems, } from "./components/NavBar/constants";
import CookieConsentBanner from "./components/cookie-consent/Banner";
import { useAuth } from "wasp/client/auth";
/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
    const location = useLocation();
    const { data: user } = useAuth();
    const isMarketingPage = useMemo(() => {
        const marketingPaths = ['/', '/hvac', '/handyman', '/appliance-repair', '/plumbing', '/electrical', '/smart-home', '/how-it-works', '/providers', '/get-quotes', '/request-success'];
        return (marketingPaths.includes(location.pathname) ||
            location.pathname.startsWith('/areas') ||
            location.pathname.startsWith('/providers') ||
            location.pathname.startsWith('/services'));
    }, [location]);
    const shouldDisplayAppNavBar = useMemo(() => {
        return (location.pathname !== routes.LoginRoute.build() &&
            location.pathname !== routes.SignupRoute.build());
    }, [location]);
    const isAdminDashboard = useMemo(() => {
        return location.pathname.startsWith("/admin");
    }, [location]);
    const navigationItems = useMemo(() => {
        if (isMarketingPage)
            return marketingNavigationItems;
        if (!user)
            return demoNavigationitems;
        if (user.isAdmin)
            return adminNavigationItems;
        if (user.role === "PROVIDER")
            return providerNavigationItems;
        return consumerNavigationItems;
    }, [isMarketingPage, user]);
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView();
            }
        }
    }, [location]);
    return (<>
      <div className="bg-background text-foreground min-h-screen">
        {isAdminDashboard ? (<ErrorBoundary><Outlet /></ErrorBoundary>) : (<>
            {shouldDisplayAppNavBar && (<NavBar navigationItems={navigationItems}/>)}
            <div className="mx-auto max-w-(--breakpoint-2xl)">
              <ErrorBoundary><Outlet /></ErrorBoundary>
            </div>
          </>)}
      </div>
      <Toaster position="bottom-right"/>
      <CookieConsentBanner />
    </>);
}
//# sourceMappingURL=App.jsx.map