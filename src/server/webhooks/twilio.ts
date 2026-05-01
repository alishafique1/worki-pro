import type { TwilioWebhook } from 'wasp/server/api';
import { HttpError } from 'wasp/server';

export const handleTwilioSms: TwilioWebhook = async (req, res, context) => {
  const twilioSignature = req.headers['x-twilio-signature'];
  if (!twilioSignature) {
    throw new HttpError(401, 'Missing Twilio signature');
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
