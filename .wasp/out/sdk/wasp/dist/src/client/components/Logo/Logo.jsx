import { Link } from "react-router";
import logoIcon from "../../static/logo-icon.svg";
const ICON_SIZE = {
    sm: "h-7 w-auto",
    md: "h-8 w-auto",
    lg: "h-9 w-auto",
};
const WORDMARK_SIZE = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
};
/**
 * The single source of truth for The Helper brand mark.
 *
 * Renders the icon + the multi-color `thehelper.ca` wordmark used in the
 * marketing nav. Use `variant="dark"` on the navy sidebars / auth panel so
 * the wordmark stays legible. Every logo placement across the app should use
 * this component — do not hand-roll the markup again.
 */
export function Logo({ variant = "light", size = "md", withWordmark = true, to, className = "", }) {
    // On dark backgrounds the navy "helper" would vanish, so flip to white and
    // use the lighter blue (#60A5FA) for ".ca" to keep contrast.
    const theColor = variant === "dark" ? "text-white/50" : "text-[#64748B]";
    const helperColor = variant === "dark" ? "text-white" : "text-[#0F172A]";
    const caColor = variant === "dark" ? "text-[#60A5FA]" : "text-[#2563EB]";
    const content = (<>
      <img src={logoIcon} alt="The Helper" className={ICON_SIZE[size]}/>
      {withWordmark && (<span className={`${WORDMARK_SIZE[size]} font-extrabold tracking-tight ${helperColor}`}>
          <span className={`font-light ${theColor}`}>the</span>
          helper
          <span className={caColor}>.ca</span>
        </span>)}
    </>);
    const wrapperClass = `flex items-center gap-2 ${className}`.trim();
    if (to) {
        return (<Link to={to} className={`${wrapperClass} hover:opacity-80 transition-opacity`}>
        {content}
      </Link>);
    }
    return <div className={wrapperClass}>{content}</div>;
}
export default Logo;
//# sourceMappingURL=Logo.jsx.map