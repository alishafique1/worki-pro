import pino from 'pino';
import crypto from 'crypto';
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.code'],
        censor: '[REDACTED]',
    },
});
export function createRequestId() {
    return crypto.randomUUID();
}
