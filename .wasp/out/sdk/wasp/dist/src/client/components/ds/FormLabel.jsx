import * as React from "react";
import { cn } from "../../utils";
/** The `text-sm font-semibold text-slate mb-1.5` label repeated on 100+ fields. */
export function FormLabel({ className, ...props }) {
    return (<label className={cn("block text-sm font-semibold text-slate mb-1.5", className)} {...props}/>);
}
export default FormLabel;
//# sourceMappingURL=FormLabel.jsx.map