export interface NavigationItem {
    name: string;
    to: string;
    hasDropdown?: boolean;
}
export default function NavBar({ navigationItems, }: {
    navigationItems: NavigationItem[];
}): import("react").JSX.Element;
//# sourceMappingURL=NavBar.d.ts.map