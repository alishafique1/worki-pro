import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

const staticNavigationItems: NavigationItem[] = [];

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Services", to: "/#services" },
  { name: "For Pros", to: "/#providers" },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "New Request", to: "/request-service" },
  { name: "My Dashboard", to: "/dashboard" },
  { name: "My Requests", to: "/dashboard" },
  { name: "Provider Portal", to: "/provider/dashboard" },
  { name: "Admin Dashboard", to: "/admin/requests" },
] as const;
