import { prisma } from 'wasp/server'

import { redeemPoints } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (redeemPoints as any)(args, {
    ...context,
    entities: {
      RewardAccount: prisma.rewardAccount,
      RewardTransaction: prisma.rewardTransaction,
      Redemption: prisma.redemption,
    },
  })
}
