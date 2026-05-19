interface PageSeoProps {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    canonicalPath?: string;
    structuredData?: object;
    keywords?: string;
}
/**
 * PageSeo — lightweight per-page SEO helper (no extra dependencies).
 *
 * Sets <title>, <meta name="description">, OG tags, Twitter cards, canonical
 * <link>, and JSON-LD structured data by directly mutating document.head elements.
 * Previous values injected by this component are restored on unmount so navigating
 * back to the home page doesn't leave stale tags in place.
 */
export default function PageSeo({ title, description, ogTitle, ogDescription, ogImage, ogType, canonicalPath, structuredData, keywords, }: PageSeoProps): null;
export declare function createLocalBusinessSchema(options: {
    name?: string;
    description?: string;
    url?: string;
    areaServed?: string[];
    serviceType?: string[];
    priceRange?: string;
    telephone?: string;
    address?: {
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
    };
}): {
    address?: {
        addressCountry: string;
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        '@type': string;
    } | undefined;
    telephone?: string | undefined;
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    url: string;
    areaServed: string[];
    serviceType: string[];
    priceRange: string;
};
export declare function createServiceSchema(options: {
    name: string;
    description: string;
    provider?: string;
    areaServed?: string[];
    url?: string;
}): {
    url?: string | undefined;
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    provider: {
        '@type': string;
        name: string;
        url: string;
    };
    areaServed: {
        '@type': string;
        name: string;
        containedInPlace: {
            '@type': string;
            name: string;
        };
    }[];
};
export declare function createFaqSchema(faqs: Array<{
    question: string;
    answer: string;
}>): {
    '@context': string;
    '@type': string;
    mainEntity: {
        '@type': string;
        name: string;
        acceptedAnswer: {
            '@type': string;
            text: string;
        };
    }[];
};
export declare function createBreadcrumbSchema(items: Array<{
    name: string;
    url: string;
}>): {
    '@context': string;
    '@type': string;
    itemListElement: {
        '@type': string;
        position: number;
        name: string;
        item: string;
    }[];
};
export {};
//# sourceMappingURL=PageSeo.d.ts.map