import type { ReactNode } from "react";
export declare const painPoints: {
    icon: import("react").JSX.Element;
    title: string;
    description: string;
}[];
export declare const solutionSteps: {
    icon: import("react").JSX.Element;
    title: string;
    description: string;
}[];
export declare const categoryImages: Record<string, string>;
export interface Category {
    icon: ReactNode;
    name: string;
    slug: string;
    description: string;
    href?: string;
    imageUrl?: string;
    live?: boolean;
    comingSoon?: boolean;
}
export declare const categories: Category[];
export declare const customerSteps: {
    step: string;
    title: string;
    description: string;
}[];
export declare const providerSteps: {
    step: string;
    title: string;
    description: string;
}[];
export declare const internalFeatures: {
    icon: import("react").JSX.Element;
    title: string;
    description: string;
}[];
export declare const trustFeatures: {
    icon: import("react").JSX.Element;
    title: string;
    description: string;
}[];
export declare const providerBenefits: {
    title: string;
    description: string;
}[];
export declare const faqs: {
    question: string;
    answer: string;
}[];
