import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  Users,
  Star,
  Gift,
  Layers,
  MessageSquare,
  Settings,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { Logo } from '../../client/components/Logo/Logo';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface NavItem {
  to: string;
  label: string;
  Icon: typeof LayoutDashboard;
  end?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'CRM',
    items: [
      { to: '/admin/requests', label: 'Requests', Icon: ClipboardList },
      { to: '/admin/providers', label: 'Providers', Icon: Briefcase },
      { to: '/admin/users', label: 'Users', Icon: Users },
    ],
  },
  {
    label: 'Quality',
    items: [
      { to: '/admin/reviews', label: 'Reviews', Icon: Star },
      { to: '/admin/rewards', label: 'Rewards', Icon: Gift },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/categories', label: 'Categories', Icon: Layers },
      { to: '/admin/messages', label: 'Messages', Icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', Icon: Settings },
      { to: '/admin/calendar', label: 'Calendar', Icon: Calendar },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#0F172A] overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <NavLink to="/">
          <Logo variant="dark" size="md" />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden text-white/60 hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Admin badge */}
      <div className="px-6 pt-4 pb-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#93C5FD] text-xs font-bold uppercase tracking-widest">
          <span className="size-1.5 rounded-full bg-[#2563EB]" />
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ to, label, Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `group flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <Icon className={`size-4 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={2} />
                          {label}
                        </span>
                        {isActive && <ChevronRight className="size-3.5 text-white/60" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ChevronRight className="size-3.5 rotate-180" />
          Back to site
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
