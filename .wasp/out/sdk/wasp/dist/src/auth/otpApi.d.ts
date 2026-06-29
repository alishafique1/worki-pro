import type { Request, Response } from 'express';
import { type MiddlewareConfigFn } from 'wasp/server';
export declare const authApiMiddleware: MiddlewareConfigFn;
export declare const requestOtp: (req: Request, res: Response, context: any) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response, context: any) => Promise<void>;
//# sourceMappingURL=otpApi.d.ts.map