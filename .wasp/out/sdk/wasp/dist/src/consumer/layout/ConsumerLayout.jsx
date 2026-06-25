import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router';
import { LayoutDashboard, ClipboardList, Gift, BarChart3, Wrench, User, Users, HelpCircle, X, ChevronRight, Menu, } from 'lucide-react';
import logo from '../../client/static/logo-icon.svg';
const NAV_SECTIONS = [
    {
        label: 'Overview',
        items: [
            { to: '/account', label: 'Dashboard', Icon: LayoutDashboard, end: true },
        ],
    },
    {
        label: 'Services',
        items: [
            { to: '/account/request-service', label: 'Request Service', Icon: Wrench, end: true },
            { to: '/account/requests', label: 'My Requests', Icon: ClipboardList, end: true },
        ],
    },
    {
        label: 'Account',
        items: [
            { to: '/account/rewards', label: 'Rewards', Icon: Gift, end: true },
            { to: '/account/referrals', label: 'Referrals', Icon: Users, end: true },
            { to: '/account/activity', label: 'Activity', Icon: BarChart3, end: true },
            { to: '/help', label: 'Help', Icon: HelpCircle, end: true },
            { to: '/account/profile', label: 'Profile', Icon: User, end: true },
        ],
    },
];
export default function ConsumerLayout({ children, user }) {
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
    const firstName = user?.firstName || '';
    const initial = firstName ? firstName[0].toUpperCase() : (user ? 'H' : '?');
    return (<div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      {/* ── Sidebar ── */}
      <aside ref={sidebar} className={`absolute top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#0F172A] overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src={logo} alt="The Helper" className="h-8 w-auto"/>
            <span className="text-white font-black text-sm tracking-tight">
              <span className="font-light text-white/50">the</span>helper<span className="text-[#60A5FA]">.ca</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="block lg:hidden text-white/60 hover:text-white transition-colors">
            <X className="size-5"/>
          </button>
        </div>

        {/* User info */}
        <div className="px-6 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{firstName || 'Homeowner'}</p>
              <p className="text-white/40 text-xs truncate">My Account</p>
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
          <button onClick={() => setSidebarOpen(true)} className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white p-1.5 hover:bg-[#F8FAFC] transition-colors">
            <Menu className="size-4 text-[#475569]"/>
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="The Helper" className="h-7 w-auto"/>
            <span className="text-sm font-black text-[#0F172A] tracking-tight">
              <span className="font-light text-[#64748B]">the</span>helper<span className="text-[#2563EB]">.ca</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="size-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
              {initial}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>);
}
//# sourceMappingURL=ConsumerLayout.jsx.map