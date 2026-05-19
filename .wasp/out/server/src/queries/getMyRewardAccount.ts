import { prisma } from 'wasp/server'

import { getMyRewardAccount } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getMyRewardAccount as any)(args, {
    ...context,
    entities: {
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Redemption: prisma.redemption,
    },
  })
}
