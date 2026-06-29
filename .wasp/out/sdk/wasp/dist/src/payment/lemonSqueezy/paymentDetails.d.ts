import { PrismaClient } from "@prisma/client";
import type { SubscriptionStatus } from "../plans";
import { PaymentPlanId } from "../plans";
export declare const updateUserLemonSqueezyPaymentDetails: ({ lemonSqueezyId, userId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased, lemonSqueezyCustomerPortalUrl, }: {
    lemonSqueezyId: string;
    userId: string;
    subscriptionPlan?: PaymentPlanId;
    subscriptionStatus?: SubscriptionStatus;
    numOfCreditsPurchased?: number;
    lemonSqueezyCustomerPortalUrl?: string;
    datePaid?: Date;
}, prismaUserDelegate: PrismaClient["user"]) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string | null;
    username: string | null;
    isAdmin: boolean;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    postalCode: string | null;
    role: import(".prisma/client").$Enums.Role;
    status: import(".prisma/client").$Enums.UserStatus;
    smsConsent: boolean;
    smsConsentAt: Date | null;
    smsMarketingConsent: boolean;
    smsMarketingConsentAt: Date | null;
    smsMarketingConsentIp: string | null;
    emailConsent: boolean;
    onboardingCompletedAt: Date | null;
    paymentProcessorUserId: string | null;
    lemonSqueezyCustomerPortalUrl: string | null;
    subscriptionStatus: string | null;
    subscriptionPlan: string | null;
    datePaid: Date | null;
    credits: number;
}>;
//# sourceMappingURL=paymentDetails.d.ts.map