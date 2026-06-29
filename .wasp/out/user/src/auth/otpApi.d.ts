import type { Request, Response } from 'express';
export declare const requestOtp: (req: Request, res: Response, context: any) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response, context: any) => Promise<void>;
