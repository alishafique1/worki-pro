import { prisma } from 'wasp/server'

import { moderateReview } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (moderateReview as any)(args, {
    ...context,
    entities: {
      Review: prisma.review,
    },
  })
}
