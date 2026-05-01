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
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Request Service", to: "/request-service" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Provider Portal", to: "/provider/dashboard" },
  { name: "Admin", to: "/admin" },
] as const;
