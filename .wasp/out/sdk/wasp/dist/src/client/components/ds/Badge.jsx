import * as React from "react";
import { cn } from "../../utils";
import { badgeToneClass } from "../../lib/statusStyles";
export function Badge({ className, tone = "neutral", ...props }) {
    return (<span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold", badgeToneClass[tone], className)} {...props}/>);
}
export default Badge;
//# sourceMappingURL=Badge.jsx.map