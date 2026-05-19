import { prisma } from 'wasp/server'

import { getReviewsForProvider } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getReviewsForProvider as any)(args, {
    ...context,
    entities: {
      Review: prisma.review,
    },
  })
}
