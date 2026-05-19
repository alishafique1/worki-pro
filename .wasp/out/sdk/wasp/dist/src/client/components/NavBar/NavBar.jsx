import { Menu } from "lucide-react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "../../../client/components/ui/sheet";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import logo from "../../static/logo.webp";
export default function NavBar({ navigationItems, }) {
    return (<header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Global">
        {/* Logo */}
        <WaspRouterLink to={routes.LandingPageRoute.to} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="The Helper" className="size-8"/>
          <span className="text-sm font-extrabold text-[#0F172A]">The Helper</span>
        </WaspRouterLink>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (<li key={item.name}>
              <ReactRouterLink to={item.to} className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0F172A]" target={item.to.startsWith("http") ? "_blank" : undefined}>
                {item.name}
              </ReactRouterLink>
            </li>))}
        </ul>

        {/* Desktop right side */}
        <DesktopAuth />

        {/* Mobile hamburger */}
        <MobileMenu navigationItems={navigationItems}/>
      </nav>
    </header>);
}
function DesktopAuth() {
    const { data: user, isLoading } = useAuth();
    return (<div className="hidden items-center gap-4 lg:flex">
      {isLoading ? null : !user ? (<>
          <WaspRouterLink to={routes.LoginRoute.to} className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0F172A]">
            Log in
          </WaspRouterLink>
          <ReactRouterLink to="/request-service" className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
            Find a Helper
          </ReactRouterLink>
        </>) : (<UserDropdown user={user}/>)}
    </div>);
}
function MobileMenu({ navigationItems, }) {
    const { data: user, isLoading } = useAuth();
    const [open, setOpen] = useState(false);
    return (<div className="flex lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button type="button" className="inline-flex items-center justify-center rounded-md p-1.5 text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]">
            <span className="sr-only">Open menu</span>
            <Menu className="size-6" aria-hidden="true"/>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[360px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <WaspRouterLink to={routes.LandingPageRoute.to} onClick={() => setOpen(false)}>
                <img src={logo} alt="The Helper" className="size-8"/>
              </WaspRouterLink>
              <span className="text-sm font-extrabold text-[#0F172A]">The Helper</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-1">
            {navigationItems.map((item) => (<ReactRouterLink key={item.name} to={item.to} className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]" onClick={() => setOpen(false)} target={item.to.startsWith("http") ? "_blank" : undefined}>
                {item.name}
              </ReactRouterLink>))}
          </div>

          <div className="mt-6 border-t border-[#E2E8F0] pt-6">
            {isLoading ? null : !user ? (<div className="flex flex-col gap-3">
                <WaspRouterLink to={routes.LoginRoute.to} className="text-center text-sm font-medium text-[#475569] transition-colors hover:text-[#0F172A]" onClick={() => setOpen(false)}>
                  Log in
                </WaspRouterLink>
                <ReactRouterLink to="/request-service" className="rounded-full bg-[#2563EB] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]" onClick={() => setOpen(false)}>
                  Find a Helper
                </ReactRouterLink>
              </div>) : (<ul className="space-y-1">
                <UserMenuItems user={user} onItemClick={() => setOpen(false)}/>
              </ul>)}
          </div>
        </SheetContent>
      </Sheet>
    </div>);
}
//# sourceMappingURL=NavBar.jsx.map