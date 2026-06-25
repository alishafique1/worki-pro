import * as React from "react";
import { cn } from "../../utils";
const LEVEL_CLASS = {
    1: "font-['Fraunces',serif] text-3xl sm:text-4xl font-black tracking-tight text-navy",
    2: "font-['Fraunces',serif] text-2xl font-black tracking-tight text-navy",
    3: "text-lg font-bold tracking-tight text-navy",
};
export function Heading({ level = 2, className, ...props }) {
    const Tag = `h${level}`;
    return <Tag className={cn(LEVEL_CLASS[level], className)} {...props}/>;
}
export default Heading;
//# sourceMappingURL=Heading.jsx.map