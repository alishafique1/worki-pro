import type { PrismaClient } from "@prisma/client";
export declare const DEFAULT_VENDOR_CATEGORIES: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    imageUrl: string;
}[];
export declare function seedVendorCategories(prisma: PrismaClient): Promise<void>;
export declare function seedMockUsers(prisma: PrismaClient): Promise<void>;
//# sourceMappingURL=dbSeeds.d.ts.map