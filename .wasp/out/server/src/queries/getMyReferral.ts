import { prisma } from 'wasp/server'

import { getMyReferral } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getMyReferral as any)(args, {
    ...context,
    entities: {
      Referral: prisma.referral,
    },
  })
}
