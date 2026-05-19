type GenerateCheckoutSession<Args = any, Output = any> = (args: Args, context: any) => Promise<Output>;
type GetCustomerPortalUrl<Args = any, Output = any> = (args: Args, context: any) => Promise<Output>;
import * as z from "zod";
import { PaymentPlanId } from "../payment/plans";
export type CheckoutSession = {
    sessionUrl: string | null;
    sessionId: string;
};
declare const generateCheckoutSessionSchema: z.ZodNativeEnum<typeof PaymentPlanId>;
type GenerateCheckoutSessionInput = z.infer<typeof generateCheckoutSessionSchema>;
export declare const generateCheckoutSession: GenerateCheckoutSession<GenerateCheckoutSessionInput, CheckoutSession>;
export declare const getCustomerPortalUrl: GetCustomerPortalUrl<void, string | null>;
export {};
//# sourceMappingURL=operations.d.ts.map