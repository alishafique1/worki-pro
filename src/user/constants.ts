import { LayoutDashboard, Settings, Shield, Briefcase, Home } from "lucide-react";
import { routes } from "wasp/client/router";

type UserMenuItem = {
  name: string;
  to: string;
  icon: any;
  isAuthRequired: boolean;
  isAdminOnly?: boolean;
  isProviderOnly?: boolean;
  isConsumerOnly?: boolean;
};

export const userMenuItems: UserMenuItem[] = [
  {
    name: "AI Scheduler (Demo App)",
    to: routes.DemoAppRoute.to,
    icon: LayoutDashboard,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "My Requests",
    to: routes.MyRequestsRoute.to,
    icon: Home,
    isProviderOnly: false,
    isConsumerOnly: true,
    isAuthRequired: true,
  },
  {
    name: "Provider Dashboard",
    to: routes.ProviderDashboardRoute.to,
    icon: Briefcase,
    isProviderOnly: true,
    isAuthRequired: true,
  },
  {
    name: "Account Settings",
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
  {
    name: "Admin Dashboard",
    to: routes.AdminRoute.to,
    icon: Shield,
    isAuthRequired: false,
    isAdminOnly: true,
  },
] as const;
