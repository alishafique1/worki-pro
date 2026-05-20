import { prisma } from 'wasp/server'

import { saveGuestRequest } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (saveGuestRequest as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      User: prisma.user,
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Referral: prisma.referral,
    },
  })
}
