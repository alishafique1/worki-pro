export interface ServiceItem {
    name: string;
    description: string;
}
export interface SubCategory {
    name: string;
    services: ServiceItem[];
}
export interface CategoryPageData {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    badge: string;
    subCategories: SubCategory[];
    faqs: {
        question: string;
        answer: string;
    }[];
    seo: {
        title: string;
        description: string;
    };
}
export declare const categoryPages: CategoryPageData[];
