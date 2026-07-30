type LogoVariant = "light" | "dark";
type LogoSize = "sm" | "md" | "lg";
interface LogoProps {
    /** `light` = for light backgrounds (marketing nav, auth form). `dark` = for navy sidebars/panels. */
    variant?: LogoVariant;
    size?: LogoSize;
    /** Show the `thehelper.ca` wordmark next to the icon. Defaults to true. */
    withWordmark?: boolean;
    /** When set, the whole logo links to this route. */
    to?: string;
    className?: string;
}
/**
 * The single source of truth for The Helper brand mark.
 *
 * Renders the icon + the multi-color `thehelper.ca` wordmark used in the
 * marketing nav. Use `variant="dark"` on the navy sidebars / auth panel so
 * the wordmark stays legible. Every logo placement across the app should use
 * this component — do not hand-roll the markup again.
 */
export declare function Logo({ variant, size, withWordmark, to, className, }: LogoProps): import("react").JSX.Element;
export default Logo;
