import crypto from 'crypto';
import { emailSender } from 'wasp/server/email';
import { generateICS } from '../utils/calendar';
const formatBookingTime = (isoDate) => new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'full',
    timeStyle: 'short',
}).format(new Date(isoDate));
/**
 * Send an email with an ICS attachment via Mailgun API.
 * Falls back to emailSender.send() if Mailgun credentials are unavailable.
 */
async function sendEmailWithAttachment({ to, subject, text, html, icsContent, icsFilename, }) {
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    // If we have ICS content and Mailgun credentials, send directly via Mailgun API
    if (icsContent && mailgunApiKey && mailgunDomain) {
        const formData = new FormData();
        formData.append('from', 'TheHelper <hello@thehelper.ca>');
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('html', html);
        // Create blob for ICS attachment
        const icsBlob = new Blob([icsContent], { type: 'text/calendar' });
        formData.append('attachment', icsBlob, icsFilename || 'appointment.ics');
        const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`,
            },
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mailgun API error: ${response.status} ${errorText}`);
        }
    }
    else {
        // Fall back to standard Wasp emailSender (without attachment)
        await emailSender.send({ to, subject, text, html });
    }
}
const sendBookingEmails = async ({ consumerEmail, consumerName, providerEmail, providerName, providerPhone, serviceLabel, appointmentTime, appointmentEndTime, location, actionLabel, }) => {
    const formattedTime = formatBookingTime(appointmentTime);
    const startTime = new Date(appointmentTime);
    // Default to 1 hour appointment if no end time provided
    const endTime = appointmentEndTime
        ? new Date(appointmentEndTime)
        : new Date(startTime.getTime() + 60 * 60 * 1000);
    // Generate ICS content for non-cancelled appointments
    let consumerICS;
    let providerICS;
    if (actionLabel !== 'cancelled') {
        if (consumerEmail) {
            consumerICS = generateICS({
                title: `${serviceLabel} Appointment - The Helper`,
                description: `Your ${serviceLabel} appointment${providerName ? ` with ${providerName}` : ''}${providerPhone ? `. Contact: ${providerPhone}` : ''}. Booked via The Helper (thehelper.ca)`,
                startTime,
                endTime,
                location,
                organizerEmail: 'hello@thehelper.ca',
                attendeeEmail: consumerEmail,
            });
        }
        if (providerEmail) {
            providerICS = generateICS({
                title: `${serviceLabel} - ${consumerName || 'Customer'}`,
                description: `Service appointment for ${consumerName || 'customer'}. ${serviceLabel} job via The Helper (thehelper.ca)`,
                startTime,
                endTime,
                location,
                organizerEmail: 'hello@thehelper.ca',
                attendeeEmail: providerEmail,
            });
        }
    }
    if (consumerEmail) {
        await sendEmailWithAttachment({
            to: consumerEmail,
            subject: `Your The Helper appointment is ${actionLabel}`,
            text: actionLabel === 'cancelled'
                ? `Your ${serviceLabel} appointment has been cancelled. Our team will help you rebook if needed.`
                : `Your ${serviceLabel} appointment is ${actionLabel} for ${formattedTime}${providerName ? ` with ${providerName}` : ''}${providerPhone ? ` (${providerPhone})` : ''}.`,
            html: actionLabel === 'cancelled'
                ? `<p>Hi ${consumerName || 'there'},</p><p>Your <strong>${serviceLabel}</strong> appointment has been cancelled.</p><p>If you want, reply to this email and The Helper will help you rebook.</p>`
                : `<p>Hi ${consumerName || 'there'},</p><p>Your <strong>${serviceLabel}</strong> appointment is <strong>${actionLabel}</strong> for <strong>${formattedTime}</strong>${providerName ? ` with <strong>${providerName}</strong>` : ''}${providerPhone ? ` (${providerPhone})` : ''}.</p><p>We will keep you updated if anything changes.</p><p style="margin-top: 16px;">An .ics calendar file is attached to this email. Open it to add this appointment to your calendar.</p>`,
            icsContent: consumerICS,
            icsFilename: 'the-helper-appointment.ics',
        });
    }
    if (providerEmail) {
        await sendEmailWithAttachment({
            to: providerEmail,
            subject: `The Helper appointment ${actionLabel}`,
            text: actionLabel === 'cancelled'
                ? `A ${serviceLabel} appointment was cancelled.${consumerName ? ` Customer: ${consumerName}.` : ''}`
                : `A ${serviceLabel} appointment was ${actionLabel} for ${formattedTime}.${consumerName ? ` Customer: ${consumerName}.` : ''}`,
            html: actionLabel === 'cancelled'
                ? `<p>A <strong>${serviceLabel}</strong> appointment was cancelled.${consumerName ? ` Customer: <strong>${consumerName}</strong>.` : ''}</p>`
                : `<p>A <strong>${serviceLabel}</strong> appointment was ${actionLabel} for <strong>${formattedTime}</strong>.${consumerName ? ` Customer: <strong>${consumerName}</strong>.` : ''}</p><p style="margin-top: 16px;">An .ics calendar file is attached. Open it to add this appointment to your calendar.</p>`,
            icsContent: providerICS,
            icsFilename: 'the-helper-appointment.ics',
        });
    }
};
/**
 * Cal.com webhook handler — receives booking events and syncs them to The Helper.
 *
 * Set up in cal.com: Settings → Webhooks → Add webhook
 *   URL: https://your-domain.com/calcom-webhook
 *   Events: BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED
 *   Secret: set CALCOM_WEBHOOK_SECRET in .env.server
 */
export const calcomWebhook = async (req, res, context) => {
    const secret = process.env.CALCOM_WEBHOOK_SECRET;
    if (secret) {
        const signature = req.headers['x-cal-signature-256'];
        if (!signature) {
            return res.status(401).json({ error: 'Missing signature' });
        }
        const body = JSON.stringify(req.body);
        const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
        const normalizedSignature = signature.replace(/^sha256=/, '');
        if (!crypto.timingSafeEqual(Buffer.from(normalizedSignature), Buffer.from(expectedSig))) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }
    const { triggerEvent, payload } = req.body;
    const bookingUid = payload?.uid;
    if (!bookingUid) {
        return res.status(400).json({ error: 'Missing booking uid' });
    }
    try {
        switch (triggerEvent) {
            case 'BOOKING_CREATED': {
                const existing = await context.entities.Appointment.findFirst({
                    where: { calComBookingUid: bookingUid },
                });
                if (!existing) {
                    const attendeeEmail = payload.attendees?.[0]?.email;
                    if (attendeeEmail) {
                        const serviceRequest = await context.entities.ServiceRequest.findFirst({
                            where: {
                                email: attendeeEmail,
                                status: { notIn: ['COMPLETED', 'CLOSED'] },
                            },
                            orderBy: { createdAt: 'desc' },
                        });
                        if (serviceRequest) {
                            const provider = serviceRequest.assignedProviderId
                                ? await context.entities.Provider.findUnique({
                                    where: { id: serviceRequest.assignedProviderId },
                                })
                                : null;
                            if (serviceRequest.assignedProviderId) {
                                await context.entities.Appointment.create({
                                    data: {
                                        serviceRequestId: serviceRequest.id,
                                        providerId: serviceRequest.assignedProviderId,
                                        consumerId: serviceRequest.consumerId ?? undefined,
                                        scheduledAt: new Date(payload.startTime),
                                        status: 'CONFIRMED',
                                        calComBookingUid: bookingUid,
                                    },
                                });
                            }
                            await context.entities.ServiceRequest.update({
                                where: { id: serviceRequest.id },
                                data: { status: 'BOOKED', bookedAt: new Date() },
                            });
                            await sendBookingEmails({
                                consumerEmail: serviceRequest.email,
                                consumerName: serviceRequest.name,
                                providerEmail: provider?.email,
                                providerName: provider?.businessName,
                                providerPhone: provider?.phone,
                                serviceLabel: payload.title ?? 'service',
                                appointmentTime: payload.startTime,
                                appointmentEndTime: payload.endTime,
                                location: serviceRequest.postalCode || serviceRequest.city || undefined,
                                actionLabel: 'booked',
                            });
                            console.log(`[Cal.com] Appointment created for request ${serviceRequest.id}`);
                        }
                    }
                }
                break;
            }
            case 'BOOKING_RESCHEDULED': {
                const appointment = await context.entities.Appointment.findFirst({
                    where: { calComBookingUid: bookingUid },
                    include: {
                        provider: true,
                        serviceRequest: true,
                    },
                });
                await context.entities.Appointment.updateMany({
                    where: { calComBookingUid: bookingUid },
                    data: {
                        scheduledAt: new Date(payload.startTime),
                        status: 'RESCHEDULED',
                    },
                });
                if (appointment) {
                    await sendBookingEmails({
                        consumerEmail: appointment.serviceRequest.email,
                        consumerName: appointment.serviceRequest.name,
                        providerEmail: appointment.provider.email,
                        providerName: appointment.provider.businessName,
                        providerPhone: appointment.provider.phone,
                        serviceLabel: payload.title ?? 'service',
                        appointmentTime: payload.startTime,
                        appointmentEndTime: payload.endTime,
                        location: appointment.serviceRequest.postalCode || appointment.serviceRequest.city || undefined,
                        actionLabel: 'rescheduled',
                    });
                }
                console.log(`[Cal.com] Appointment rescheduled: ${bookingUid}`);
                break;
            }
            case 'BOOKING_CANCELLED': {
                const appointment = await context.entities.Appointment.findFirst({
                    where: { calComBookingUid: bookingUid },
                    include: {
                        provider: true,
                        serviceRequest: true,
                    },
                });
                await context.entities.Appointment.updateMany({
                    where: { calComBookingUid: bookingUid },
                    data: { status: 'CANCELLED' },
                });
                if (appointment) {
                    await sendBookingEmails({
                        consumerEmail: appointment.serviceRequest.email,
                        consumerName: appointment.serviceRequest.name,
                        providerEmail: appointment.provider.email,
                        providerName: appointment.provider.businessName,
                        providerPhone: appointment.provider.phone,
                        serviceLabel: payload.title ?? 'service',
                        appointmentTime: appointment.scheduledAt?.toISOString() ?? payload.startTime,
                        actionLabel: 'cancelled',
                    });
                }
                console.log(`[Cal.com] Appointment cancelled: ${bookingUid}`);
                break;
            }
            default:
                console.log(`[Cal.com] Unhandled event: ${triggerEvent}`);
        }
        return res.status(200).json({ received: true });
    }
    catch (err) {
        console.error('[Cal.com] Webhook error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
};
