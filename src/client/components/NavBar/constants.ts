import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

const staticNavigationItems: NavigationItem[] = [];

export const marketingNavigationItems: NavigationItem[] = [
  { name: "HVAC", to: "/hvac" },
  { name: "Handyman", to: "/handyman" },
  { name: "Appliance Repair", to: "/appliance-repair" },
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
] as const;

export const consumerNavigationItems: NavigationItem[] = [
  { name: "Discover Pros", to: "/discover" },
  { name: "Request Service", to: "/request-service" },
  { name: "My Requests", to: "/my-requests" },
  { name: "Analytics", to: "/analytics" },
  { name: "Rewards", to: "/rewards" },
  { name: "Referrals", to: "/referral" },
] as const;

export const providerNavigationItems: NavigationItem[] = [
  { name: "Dashboard", to: "/provider/dashboard" },
  { name: "Leads", to: "/provider/leads" },
  { name: "Services", to: "/provider/services" },
  { name: "Appointments", to: "/provider/appointments" },
  { name: "Profile", to: "/provider/profile" },
] as const;
