import { type MiddlewareConfigFn } from "wasp/server";
type PaymentsWebhook = (req: any, res: any, context: any) => Promise<void>;
export declare const lemonSqueezyWebhook: PaymentsWebhook;
export declare const lemonSqueezyMiddlewareConfigFn: MiddlewareConfigFn;
export {};
//# sourceMappingURL=webhook.d.ts.map