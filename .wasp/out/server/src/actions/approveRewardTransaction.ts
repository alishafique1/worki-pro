import { prisma } from 'wasp/server'

import { approveRewardTransaction } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (approveRewardTransaction as any)(args, {
    ...context,
    entities: {
      RewardTransaction: prisma.rewardTransaction,
      RewardAccount: prisma.rewardAccount,
      ServiceRequest: prisma.serviceRequest,
    },
  })
}
