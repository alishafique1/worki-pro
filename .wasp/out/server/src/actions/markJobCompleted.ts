import { prisma } from 'wasp/server'

import { markJobCompleted } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (markJobCompleted as any)(args, {
    ...context,
    entities: {
      Appointment: prisma.appointment,
      ServiceRequest: prisma.serviceRequest,
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
      Referral: prisma.referral,
    },
  })
}
