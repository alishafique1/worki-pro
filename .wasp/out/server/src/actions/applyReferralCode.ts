import { prisma } from 'wasp/server'

import { applyReferralCode } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (applyReferralCode as any)(args, {
    ...context,
    entities: {
      Referral: prisma.referral,
    },
  })
}
