import { Settings, Shield, Briefcase, Home, LayoutDashboard, Gift } from "lucide-react";
import { routes } from "wasp/client/router";
export const userMenuItems = [
    {
        name: "Dashboard",
        to: "/account",
        icon: LayoutDashboard,
        isConsumerOnly: true,
        isAuthRequired: true,
    },
    {
        name: "My Requests",
        to: "/account/requests",
        icon: Home,
        isProviderOnly: false,
        isConsumerOnly: true,
        isAuthRequired: true,
    },
    {
        name: "Rewards",
        to: "/account/rewards",
        icon: Gift,
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
        to: "/account/profile",
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
];
//# sourceMappingURL=constants.js.map