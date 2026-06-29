import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * The Helper's primary button. Encodes the brand button that was hand-rolled
 * ~80 times across the app in 8+ padding/radius/shadow combinations. Built on
 * the working direct-hex tokens (bg-brand, shadow-brand) — NOT the shadcn
 * `bg-primary` token, which resolves to nothing under this app's hsl setup.
 */
declare const buttonVariants: (props?: ({
    variant?: "danger" | "primary" | "secondary" | "ghost" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
export declare function Button({ className, variant, size, fullWidth, asChild, ...props }: ButtonProps): React.JSX.Element;
export default Button;
