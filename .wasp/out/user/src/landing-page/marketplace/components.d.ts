import React from "react";
export type LandingButtonProps = {
    children: React.ReactNode;
    href?: string;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
};
export declare function Container({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
export declare function Button({ children, href, type, variant, className, }: LandingButtonProps): React.JSX.Element;
export declare function SectionHeader({ eyebrow, title, description, align, className, }: {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "center" | "left";
    className?: string;
}): React.JSX.Element;
export declare function Hero(): React.JSX.Element;
export declare function MarketplaceMockup(): React.JSX.Element;
export declare function FeatureCard({ icon, title, description, }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}): React.JSX.Element;
export declare function CategoryCard({ icon, name, description, href, imageUrl, comingSoon, }: {
    icon: React.ReactNode;
    name: string;
    description: string;
    href: string;
    imageUrl?: string;
    comingSoon?: boolean;
}): React.JSX.Element;
export declare function CategoryCardSkeleton(): React.JSX.Element;
export declare function StepCard({ step, title, description, }: {
    step: string;
    title: string;
    description: string;
}): React.JSX.Element;
export declare function TrustBadge({ icon, label, dark, }: {
    icon: React.ReactNode;
    label: string;
    dark?: boolean;
}): React.JSX.Element;
export declare function StatsCard({ value, label }: {
    value: string;
    label: string;
}): React.JSX.Element;
export declare function ProviderBenefitCard({ title, description, }: {
    title: string;
    description: string;
}): React.JSX.Element;
export declare function TestimonialCard(): React.JSX.Element;
export declare function FAQAccordion({ faqs, }: {
    faqs: Array<{
        question: string;
        answer: string;
    }>;
}): React.JSX.Element;
export declare function CTASection(): React.JSX.Element;
export declare function Footer(): React.JSX.Element;
export declare const marketplaceIcons: {
    BadgeCheck: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    CalendarCheck: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    ClipboardList: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    Clock3: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    MapPin: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    MessageSquareText: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    Search: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    ShieldCheck: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};
export type ServiceItem = {
    title: string;
    description: string;
    icon: string;
    image?: string;
};
export type TrustSignal = {
    label: string;
    icon: string;
};
export type CategoryHeroProps = {
    badge: string;
    title: string;
    highlightedWord: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    trustNote?: string;
    trustSignals: TrustSignal[];
    services: ServiceItem[];
    heroImage?: string;
    heroImageAlt?: string;
};
export declare function CategoryHero({ badge, title, highlightedWord, description, ctaText, ctaLink, trustNote, trustSignals, services, heroImage, heroImageAlt, }: CategoryHeroProps): React.JSX.Element;
export type ProviderProfile = {
    name: string;
    specialty: string;
    rating: number;
    jobCount: number;
    avatar?: string;
};
export declare function ProviderShowcase({ title, subtitle, providers, }: {
    title: string;
    subtitle?: string;
    providers: ProviderProfile[];
}): React.JSX.Element;
export type BeforeAfterItem = {
    beforeImage: string;
    afterImage: string;
    title: string;
    testimonial?: string;
    author?: string;
    location?: string;
};
export declare function BeforeAfterGallery({ title, items, }: {
    title: string;
    items: BeforeAfterItem[];
}): React.JSX.Element;
