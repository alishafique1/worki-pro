import { type MiddlewareConfigFn } from "wasp/server";
type PaymentsWebhook = (req: any, res: any, context: any) => Promise<void>;
/**
 * Stripe requires a raw request to construct events successfully.
 */
export declare const stripeMiddlewareConfigFn: MiddlewareConfigFn;
export declare const stripeWebhook: PaymentsWebhook;
export {};
//# sourceMappingURL=webhook.d.ts.map