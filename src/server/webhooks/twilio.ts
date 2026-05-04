import type { TwilioWebhook } from 'wasp/server/api';
import crypto from 'node:crypto';

export const handleTwilioSms: TwilioWebhook = async (req, res, context) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioSignature = req.headers['x-twilio-signature'];

  if (!authToken) {
    if (isProduction) {
      return res.status(401).json({ error: 'TWILIO_AUTH_TOKEN is required in production' });
    }
    console.warn('[Twilio] TWILIO_AUTH_TOKEN is not set, skipping signature validation');
  } else {
    if (!twilioSignature || Array.isArray(twilioSignature)) {
      return res.status(401).json({ error: 'Missing Twilio signature' });
    }

    const requestUrl = getRequestUrl(req);
    const valid = validateTwilioSignature({
      authToken,
      signature: twilioSignature,
      url: requestUrl,
      body: req.body as Record<string, unknown>,
    });

    if (!valid) {
      return res.status(401).json({ error: 'Invalid Twilio signature' });
    }
  }

  // Parse incoming SMS body and from number
  const { Body, From } = req.body as { Body: string; From: string };

  console.log(`Received SMS from ${From}: ${Body}`);

  // In the future:
  // 1. Find User by phone number matching `From`
  // 2. Identify if they are replying "YES" to a lead dispatch
  // 3. Update ServiceRequest status or create CommunicationLog
  
  res.status(200).send('<Response><Message>Thanks for your reply. Worki has recorded your response.</Message></Response>');
};

function getRequestUrl(req: {
  protocol?: string;
  get?: (name: string) => string | undefined;
  originalUrl?: string;
}): string {
  const forwardedProto = req.get?.('x-forwarded-proto');
  const protocol = forwardedProto ?? req.protocol ?? 'https';
  const host = req.get?.('x-forwarded-host') ?? req.get?.('host') ?? 'localhost';
  const path = req.originalUrl ?? '/webhooks/twilio';
  return `${protocol}://${host}${path}`;
}

function validateTwilioSignature(input: {
  authToken: string;
  signature: string;
  url: string;
  body: Record<string, unknown>;
}): boolean {
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
