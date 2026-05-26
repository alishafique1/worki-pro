import type { PrismaClient } from "@prisma/client";
export declare const DEFAULT_VENDOR_CATEGORIES: ({
    name: string;
    slug: string;
    description: string;
    icon: string;
    imageUrl: string;
    sortOrder?: undefined;
    children?: undefined;
} | {
    name: string;
    slug: string;
    description: string;
    icon: string;
    imageUrl: string;
    sortOrder: number;
    children: {
        name: string;
        slug: string;
        description: string;
        icon: string;
        imageUrl: string;
        sortOrder: number;
    }[];
})[];
export declare function seedVendorCategories(prisma: PrismaClient): Promise<void>;
export declare function seedMockUsers(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=dbSeeds.d.ts.map