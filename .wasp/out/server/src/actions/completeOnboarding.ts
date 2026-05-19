import { prisma } from 'wasp/server'

import { completeOnboarding } from '../../../../../src/auth/onboardingOperations'


export default async function (args, context) {
  return (completeOnboarding as any)(args, {
    ...context,
    entities: {
      User: prisma.user,
      Provider: prisma.provider,
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      ServiceRequest: prisma.serviceRequest,
      Referral: prisma.referral,
    },
  })
}
