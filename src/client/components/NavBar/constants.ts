import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "HVAC", to: "/hvac" },
  { name: "Handyman", to: "/handyman" },
  { name: "Appliance Repair", to: "/appliance-repair" },
  { name: "Services", to: "/services" },
  { name: "How it Works", to: "/how-it-works" },
  { name: "For Pros", to: "/providers" },
  { name: "List Your Services", to: "/list-your-services" },
  { name: "Contact", to: "/contact" },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Services", to: "/services" },
  { name: "How it Works", to: "/how-it-works" },
  { name: "For Pros", to: "/providers" },
  { name: "Contact", to: "/contact" },
];

export const consumerNavigationItems: NavigationItem[] = [
  { name: "Discover Pros", to: "/discover" },
  { name: "Services", to: "/services" },
  { name: "Listings", to: "/listings" },
  { name: "My Requests", to: "/my-requests" },
  { name: "Analytics", to: "/analytics" },
  { name: "Rewards", to: "/rewards" },
  { name: "Referral", to: "/referral" },
  { name: "Help", to: "/help" },
  { name: "Request Service", to: "/request-service" },
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
