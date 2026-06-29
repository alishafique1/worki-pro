import crypto from 'node:crypto';
export const handleTwilioSms = async (req, res, context) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioSignature = req.headers['x-twilio-signature'];
    if (!authToken) {
        if (isProduction) {
            return res.status(401).json({ error: 'TWILIO_AUTH_TOKEN is required in production' });
        }
        console.warn('[Twilio] TWILIO_AUTH_TOKEN is not set, skipping signature validation');
    }
    else {
        if (!twilioSignature || Array.isArray(twilioSignature)) {
            return res.status(401).json({ error: 'Missing Twilio signature' });
        }
        const requestUrl = getRequestUrl(req);
        const valid = validateTwilioSignature({
            authToken,
            signature: twilioSignature,
            url: requestUrl,
            body: req.body,
        });
        if (!valid) {
            return res.status(401).json({ error: 'Invalid Twilio signature' });
        }
    }
    const { Body, From } = req.body;
    const normalizedFrom = From.replace(/^\+/, '');
    // Find the most recent open service request for this phone number
    const pendingRequest = await context.entities.ServiceRequest.findFirst({
        where: {
            phone: { contains: normalizedFrom.slice(-10) },
            status: { in: ['NEW', 'SMS_STARTED', 'QUALIFYING'] },
        },
        orderBy: { createdAt: 'desc' },
    });
    if (pendingRequest) {
        if (pendingRequest.status === 'NEW') {
            await context.entities.ServiceRequest.update({
                where: { id: pendingRequest.id },
                data: { status: 'SMS_STARTED' },
            });
        }
        await context.entities.CommunicationLog.create({
            data: {
                serviceRequestId: pendingRequest.id,
                channel: 'SMS',
                direction: 'INBOUND',
                from: From,
                to: process.env.TWILIO_PHONE_NUMBER || 'TheHelper',
                body: Body,
                status: 'RECEIVED',
            },
        });
        console.log(`[Twilio] SMS recorded for request ${pendingRequest.id} from ${From}: ${Body}`);
    }
    else {
        console.log(`[Twilio] SMS from unknown number ${From}: ${Body}`);
    }
    res.status(200).send('<Response><Message>Thanks for your reply. The Helper has recorded your response.</Message></Response>');
};
function getRequestUrl(req) {
    const forwardedProto = req.get?.('x-forwarded-proto');
    const protocol = forwardedProto ?? req.protocol ?? 'https';
    const host = req.get?.('x-forwarded-host') ?? req.get?.('host') ?? 'localhost';
    const path = req.originalUrl ?? '/webhooks/twilio';
    return `${protocol}://${host}${path}`;
}
function validateTwilioSignature(input) {
    const sortedParamKeys = Object.keys(input.body).sort();
    const data = sortedParamKeys.reduce((acc, key) => {
        const value = input.body[key];
        return `${acc}${key}${value == null ? '' : String(value)}`;
    }, input.url);
    const expected = crypto.createHmac('sha1', input.authToken).update(data).digest('base64');
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(input.signature);
    if (expectedBuffer.length !== actualBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
