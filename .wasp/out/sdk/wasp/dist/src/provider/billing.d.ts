import type { CreateBillingSetupSession, GetBillingStatus } from "wasp/server/operations";
export type BillingStatus = {
    stripeConfigured: boolean;
    hasCardOnFile: boolean;
    cardBrand: string | null;
    cardLast4: string | null;
    pendingTotal: number;
    paidTotal: number;
};
export declare const getBillingStatus: GetBillingStatus<void, BillingStatus>;
export declare const createBillingSetupSession: CreateBillingSetupSession<void, {
    checkoutUrl: string;
}>;
export declare function chargeProviderFee(feeId: string): Promise<void>;
//# sourceMappingURL=billing.d.ts.map