import { prisma } from 'wasp/server'

import { rejectRewardTransaction } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (rejectRewardTransaction as any)(args, {
    ...context,
    entities: {
      RewardTransaction: prisma.rewardTransaction,
    },
  })
}
