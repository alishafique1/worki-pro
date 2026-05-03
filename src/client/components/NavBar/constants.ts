import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "HVAC", to: "/hvac" },
  { name: "Handyman", to: "/handyman" },
  { name: "Appliance Repair", to: "/appliance-repair" },
  { name: "Services", to: "/services" },
  { name: "How it Works", to: "/how-rewards-work" },
  { name: "For Pros", to: "/providers" },
  { name: "Contact", to: "/contact" },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Request Service", to: "/request-service" },
  { name: "Discover Pros", to: "/discover" },
  { name: "Services", to: "/services" },
  { name: "Contact", to: "/contact" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Provider Portal", to: "/provider/dashboard" },
  { name: "Admin", to: "/admin" },
];

export const consumerNavigationItems: NavigationItem[] = [
  { name: "My Requests", to: "/my-requests" },
  { name: "Analytics", to: "/analytics" },
  { name: "Rewards", to: "/rewards" },
  { name: "Referral", to: "/referral" },
  { name: "Request Service", to: "/request-service" },
];

export const providerNavigationItems: NavigationItem[] = [
  { name: "Dashboard", to: "/provider/dashboard" },
  { name: "Leads", to: "/provider/leads" },
  { name: "Services", to: "/provider/services" },
  { name: "Appointments", to: "/provider/appointments" },
  { name: "Services", to: "/provider/services" },
  { name: "Profile", to: "/provider/profile" },
];
