import * as React from "react";
import { type BadgeTone } from "../../lib/statusStyles";
/**
 * Status / category pill. Reuses the shared tone tokens (see statusStyles) so
 * the 50+ hand-rolled `rounded-full px-3 py-1 ...` badges all match.
 */
export interface BadgeProps extends React.ComponentProps<"span"> {
    tone?: BadgeTone;
}
export declare function Badge({ className, tone, ...props }: BadgeProps): React.JSX.Element;
export default Badge;
