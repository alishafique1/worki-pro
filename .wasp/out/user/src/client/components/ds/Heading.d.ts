import * as React from "react";
/**
 * Heading with the brand type system baked in.
 *
 * Fraunces (the display serif) is the brand voice but was applied in only ~7
 * places app-wide. This puts it on h1/h2 and enforces weight discipline:
 * font-black is reserved for display headings, h3 steps down to DM Sans bold —
 * so hierarchy comes from weight + family, not just size.
 */
type HeadingLevel = 1 | 2 | 3;
export interface HeadingProps extends React.ComponentProps<"h2"> {
    level?: HeadingLevel;
}
export declare function Heading({ level, className, ...props }: HeadingProps): React.JSX.Element;
export default Heading;
