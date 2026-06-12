import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Services", to: "/services", hasDropdown: true },
  { name: "How it Works", to: "/how-it-works" },
  { name: "Rewards", to: "/how-rewards-work" },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Services", to: "/services" },
  { name: "How it Works", to: "/how-it-works" },
  { name: "For Pros", to: "/providers" },
  { name: "Contact", to: "/contact" },
];

export const consumerNavigationItems: NavigationItem[] = [
  { name: "Get Help", to: "/get-quotes" },
  { name: "My Requests", to: "/my-requests" },
  { name: "Rewards", to: "/rewards" },
];

export const providerNavigationItems: NavigationItem[] = [
  { name: "Dashboard", to: "/provider/dashboard" },
  { name: "Leads", to: "/provider/leads" },
  { name: "Services", to: "/provider/services" },
  { name: "Appointments", to: "/provider/appointments" },
  { name: "Profile", to: "/provider/profile" },
  { name: "Billing", to: "/provider/billing" },
];

export const adminNavigationItems: NavigationItem[] = [
  { name: "Dashboard", to: "/admin" },
  { name: "Users", to: "/admin/users" },
  { name: "Requests", to: "/admin/requests" },
  { name: "Providers", to: "/admin/providers" },
  { name: "Reviews", to: "/admin/reviews" },
  { name: "Rewards", to: "/admin/rewards" },
];
