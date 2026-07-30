import { prisma } from 'wasp/server';
import { sendOtp } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return sendOtp(args, {
        ...context,
        entities: {
            OtpVerification: prisma.otpVerification,
        },
    });
}
//# sourceMappingURL=sendOtp.js.map