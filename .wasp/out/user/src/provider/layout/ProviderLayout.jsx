import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router';
import { LayoutDashboard, ClipboardList, Calendar, Layers, User, CreditCard, X, ChevronRight, Menu, } from 'lucide-react';
import { Logo } from '../../client/components/Logo/Logo';
const NAV_SECTIONS = [
    {
        label: 'Overview',
        items: [
            { to: '/provider/dashboard', label: 'Dashboard', Icon: LayoutDashboard, end: true },
        ],
    },
    {
        label: 'Business',
        items: [
            { to: '/provider/leads', label: 'Leads', Icon: ClipboardList, end: true },
            { to: '/provider/appointments', label: 'Appointments', Icon: Calendar, end: true },
            { to: '/provider/services', label: 'My Services', Icon: Layers, end: true },
        ],
    },
    {
        label: 'Account',
        items: [
            { to: '/provider/profile', label: 'Profile', Icon: User, end: true },
            { to: '/provider/billing', label: 'Billing', Icon: CreditCard, end: true },
        ],
    },
];
export default function ProviderLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebar = useRef(null);
    useEffect(() => {
        const handler = ({ target }) => {
            if (!sidebar.current || !sidebarOpen || sidebar.current.contains(target))
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [sidebarOpen]);
    useEffect(() => {
        const handler = ({ keyCode }) => {
            if (keyCode === 27)
                setSidebarOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);
    const businessName = user?.provider?.businessName || '';
    const firstName = user?.firstName || '';
    const displayName = businessName || firstName || 'Provider';
    const initial = displayName[0]?.toUpperCase() ?? 'P';
    return (<div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      {/* ── Sidebar ── */}
      <aside ref={sidebar} className={`absolute top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#0F172A] overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Logo variant="dark" size="md" to="/"/>
          <button onClick={() => setSidebarOpen(false)} className="block lg:hidden text-white/60 hover:text-white transition-colors">
            <X className="size-5"/>
          </button>
        </div>

        {/* Provider badge + user info */}
        <div className="px-6 pt-4 pb-3 border-b border-white/10">
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#86EFAC] text-xs font-bold uppercase tracking-widest">
              <span className="size-1.5 rounded-full bg-[#22C55E]"/>
              Pro
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{displayName}</p>
              <p className="text-white/40 text-xs truncate">Service Provider</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {NAV_SECTIONS.map((section) => (<div key={section.label}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map(({ to, label, Icon, end }) => (<li key={to}>
                    <NavLink to={to} end={end} className={({ isActive }) => `group flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-all ${isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                      {({ isActive }) => (<>
                          <span className="flex items-center gap-3">
                            <Icon className={`size-4 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={2}/>
                            {label}
                          </span>
                          {isActive && <ChevronRight className="size-3.5 text-white/60"/>}
                        </>)}
                    </NavLink>
                  </li>))}
              </ul>
            </div>))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
            <ChevronRight className="size-3.5 rotate-180"/>
            Back to site
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (<div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      {/* ── Main ── */}
      <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-10 flex w-full items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors">
            <Menu className="size-4 text-[#475569]"/>
          </button>
          <Logo variant="light" size="sm" to="/"/>
          <div className="ml-auto">
            <div className="size-7 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-xs">
              {initial}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>);
}
