import { prisma } from 'wasp/server'

import { verifyOtp } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (verifyOtp as any)(args, {
    ...context,
    entities: {
      OtpVerification: prisma.otpVerification,
    },
  })
}
