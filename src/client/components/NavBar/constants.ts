import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "HVAC", to: "/hvac" },
  { name: "Handyman", to: "/handyman" },
  { name: "Appliance Repair", to: "/appliance-repair" },
  { name: "Services", to: "/services" },
  { name: "How it Works", to: "/how-rewards-work" },
  { name: "For Pros", to: "/providers" },
  { name: "List Your Services", to: "/list-your-services" },
  { name: "Contact", to: "/contact" },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Discover Pros", to: "/discover" },
  { name: "Services", to: "/services" },
  { name: "Pricing", to: "/pricing" },
  { name: "Contact", to: "/contact" },
  { name: "Request Service", to: "/request-service" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Provider Portal", to: "/provider/dashboard" },
  { name: "Admin", to: "/admin" },
];

export const consumerNavigationItems: NavigationItem[] = [
  { name: "Discover Pros", to: "/discover" },
  { name: "Services", to: "/services" },
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
];
