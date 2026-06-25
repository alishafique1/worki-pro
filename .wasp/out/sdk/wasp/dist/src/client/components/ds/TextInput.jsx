import * as React from "react";
import { cn } from "../../utils";
/**
 * Standard text input. Unifies the 40+ hand-rolled `<input>` styles (which
 * varied across rounded-xl / rounded-[20px] / rounded-2xl and px-4 py-3 / p-4)
 * onto one control: rounded-control, brand focus border + ring.
 */
export const TextInput = React.forwardRef(({ className, ...props }, ref) => (<input ref={ref} className={cn("w-full bg-white border border-[#E2E8F0] rounded-control px-4 py-3 text-navy placeholder:text-muted-fg transition-colors focus:outline-none focus:border-brand focus:ring-2 focus:ring-[#2563EB]/30", className)} {...props}/>));
TextInput.displayName = "TextInput";
export default TextInput;
//# sourceMappingURL=TextInput.jsx.map