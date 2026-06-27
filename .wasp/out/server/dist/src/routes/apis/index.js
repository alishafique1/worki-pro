import express from 'express';
import { prisma } from 'wasp/server';
import { defineHandler } from 'wasp/server/utils';
import { globalMiddlewareConfigForExpress } from '../../middleware/index.js';
import auth from 'wasp/core/auth';
import { makeAuthUserIfPossible } from 'wasp/auth/user';
import { requestOtp as _wasprequestOtpfn } from '../../../../../../src/auth/otpApi';
import { verifyOtp as _waspverifyOtpfn } from '../../../../../../src/auth/otpApi';
import { calcomWebhook as _waspcalcomWebhookfn } from '../../../../../../src/server/webhooks/calcom';
import { healthCheck as _wasphealthCheckfn } from '../../../../../../src/server/healthCheck';
import { handleTwilioSms as _wasptwilioWebhookfn } from '../../../../../../src/server/webhooks/twilio';
import { handleGhlWebhook as _waspghlWebhookfn } from '../../../../../../src/server/webhooks/ghl';
const idFn = x => x;
const _wasprequestOtpmiddlewareConfigFn = idFn;
const _waspverifyOtpmiddlewareConfigFn = idFn;
const _waspcalcomWebhookmiddlewareConfigFn = idFn;
const _wasphealthCheckmiddlewareConfigFn = idFn;
const _wasptwilioWebhookmiddlewareConfigFn = idFn;
const _waspghlWebhookmiddlewareConfigFn = idFn;
const router = express.Router();
const requestOtpMiddleware = globalMiddlewareConfigForExpress(_wasprequestOtpmiddlewareConfigFn);
router.post('/api/auth/request-otp', [auth, ...requestOtpMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {},
    };
    return _wasprequestOtpfn(req, res, context);
}));
const verifyOtpMiddleware = globalMiddlewareConfigForExpress(_waspverifyOtpmiddlewareConfigFn);
router.post('/api/auth/verify-otp', [auth, ...verifyOtpMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {},
    };
    return _waspverifyOtpfn(req, res, context);
}));
const calcomWebhookMiddleware = globalMiddlewareConfigForExpress(_waspcalcomWebhookmiddlewareConfigFn);
router.post('/calcom-webhook', [auth, ...calcomWebhookMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
            Appointment: prisma.appointment,
            ServiceRequest: prisma.serviceRequest,
            Provider: prisma.provider,
        },
    };
    return _waspcalcomWebhookfn(req, res, context);
}));
const healthCheckMiddleware = globalMiddlewareConfigForExpress(_wasphealthCheckmiddlewareConfigFn);
router.get('/api/health', [auth, ...healthCheckMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {},
    };
    return _wasphealthCheckfn(req, res, context);
}));
const twilioWebhookMiddleware = globalMiddlewareConfigForExpress(_wasptwilioWebhookmiddlewareConfigFn);
router.post('/webhooks/twilio', [auth, ...twilioWebhookMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
            ServiceRequest: prisma.serviceRequest,
            User: prisma.user,
            CommunicationLog: prisma.communicationLog,
        },
    };
    return _wasptwilioWebhookfn(req, res, context);
}));
const ghlWebhookMiddleware = globalMiddlewareConfigForExpress(_waspghlWebhookmiddlewareConfigFn);
router.post('/webhooks/ghl', [auth, ...ghlWebhookMiddleware], defineHandler((req, res) => {
    const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
            ServiceRequest: prisma.serviceRequest,
            CommunicationLog: prisma.communicationLog,
            WebhookLog: prisma.webhookLog,
        },
    };
    return _waspghlWebhookfn(req, res, context);
}));
export default router;
//# sourceMappingURL=index.js.map