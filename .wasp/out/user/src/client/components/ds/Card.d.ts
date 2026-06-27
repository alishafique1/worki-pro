import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * Surface card. Replaces the 50+ hand-rolled `bg-white border border-[#E2E8F0]
 * rounded-[..] p-..` wrappers (which used 5 different radii). `radius="card"`
 * for standard cards, `radius="panel"` for large surfaces/modals.
 */
declare const cardVariants: (props?: ({
    radius?: "card" | "panel" | null | undefined;
    padding?: "none" | "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
}
export declare function Card({ className, radius, padding, ...props }: CardProps): React.JSX.Element;
export default Card;
