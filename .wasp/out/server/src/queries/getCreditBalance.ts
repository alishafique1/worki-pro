import { prisma } from 'wasp/server'

import { getCreditBalance } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (getCreditBalance as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      CreditAccount: prisma.creditAccount,
      CreditTransaction: prisma.creditTransaction,
    },
  })
}
