import React from "react";
type ProviderCategory = {
    serviceCategory: {
        id: string;
        slug: string;
        name: string;
    };
};
export type ProviderCardProps = {
    id: string;
    businessName: string;
    contactName?: string | null;
    ratingInternal?: number | null;
    verificationStatus: string;
    serviceAreas?: string[];
    categories: ProviderCategory[];
    profilePhotoUrl?: string | null;
    bio?: string | null;
    completedJobsCount?: number;
    reviewCount?: number;
    featured?: boolean;
    rank?: number;
};
export declare function ProviderCard({ id, businessName, contactName, ratingInternal, verificationStatus, serviceAreas, categories, profilePhotoUrl, bio, completedJobsCount, reviewCount, featured, rank, }: ProviderCardProps): React.JSX.Element;
export declare function ProviderCardSkeleton({ featured }: {
    featured?: boolean;
}): React.JSX.Element;
export declare function ProviderCardGrid({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function FeaturedProviderGrid({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
//# sourceMappingURL=ProviderCard.d.ts.map