import { prisma } from 'wasp/server'

import { submitServiceRequest } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (submitServiceRequest as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      ServiceCategory: prisma.serviceCategory,
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      Provider: prisma.provider,
      WebhookLog: prisma.webhookLog,
    },
  })
}
