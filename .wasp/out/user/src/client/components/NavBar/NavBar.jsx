import { Menu } from "lucide-react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useAuth } from "wasp/client/auth";
import { useQuery, getServiceCategories } from "wasp/client/operations";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "../../../client/components/ui/sheet";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import logo from "../../static/logo.webp";
import { cn } from "../../utils";
function NavCtaButton({ role, onClick, className }) {
    const base = "rounded-full bg-[#2563EB] text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]";
    if (role === 'PROVIDER') {
        return (<ReactRouterLink to="/provider/dashboard" className={cn(base, className)} onClick={onClick}>
        My Dashboard
      </ReactRouterLink>);
    }
    return (<ReactRouterLink to="/get-quotes" className={cn(base, className)} onClick={onClick}>
      Get Help
    </ReactRouterLink>);
}
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
          {navigationItems.map((item) => item.hasDropdown ? (<li key={item.name}>
                <ServicesDropdownItem item={item}/>
              </li>) : (<li key={item.name}>
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
function ServicesDropdownItem({ item }) {
    const { data: categories } = useQuery(getServiceCategories);
    const activeParents = categories?.filter((c) => !c.parentCategoryId && c.active) ?? [];
    return (<div className="relative group">
      <ReactRouterLink to={item.to} className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0F172A]">
        {item.name}
      </ReactRouterLink>
      {activeParents.length > 0 && (<div className="absolute top-full left-0 hidden group-hover:block bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-3 min-w-[200px] z-50">
          {activeParents.map((cat) => (<ReactRouterLink key={cat.id} to={`/services/${cat.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors">
              {cat.name}
            </ReactRouterLink>))}
        </div>)}
    </div>);
}
function DesktopAuth() {
    const { data: user, isLoading } = useAuth();
    return (<div className="hidden items-center gap-4 lg:flex">
      {isLoading ? null : !user ? (<>
          <WaspRouterLink to={routes.LoginRoute.to} className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0F172A]">
            Log in
          </WaspRouterLink>
          <ReactRouterLink to="/get-quotes" className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
            Get Help
          </ReactRouterLink>
        </>) : (<>
          <NavCtaButton role={user.role} className="px-4 py-2"/>
          <UserDropdown user={user}/>
        </>)}
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
                <ReactRouterLink to="/get-quotes" className="rounded-full bg-[#2563EB] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]" onClick={() => setOpen(false)}>
                  Get Help
                </ReactRouterLink>
              </div>) : (<>
                <NavCtaButton role={user.role} onClick={() => setOpen(false)} className="mb-4 block px-4 py-3 text-center"/>
                <ul className="space-y-1">
                  <UserMenuItems user={user} onItemClick={() => setOpen(false)}/>
                </ul>
              </>)}
          </div>
        </SheetContent>
      </Sheet>
    </div>);
}
