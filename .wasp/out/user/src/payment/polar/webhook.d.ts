import type { MiddlewareConfigFn } from "wasp/server";
type PaymentsWebhook = (req: any, res: any, context: any) => Promise<void>;
/**
 * Polar requires a raw request to construct events successfully.
 */
export declare const polarMiddlewareConfigFn: MiddlewareConfigFn;
export declare const polarWebhook: PaymentsWebhook;
export {};
