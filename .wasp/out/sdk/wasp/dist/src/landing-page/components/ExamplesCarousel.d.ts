export interface ProCard {
    slug: string;
    businessName: string;
    profilePhotoUrl: string | null;
    ratingInternal: number | null;
    reviewCount: number;
    category: string;
    serviceAreas: string[];
}
declare const ExamplesCarousel: ({ pros }: {
    pros: ProCard[];
}) => import("react").JSX.Element | null;
export default ExamplesCarousel;
//# sourceMappingURL=ExamplesCarousel.d.ts.map