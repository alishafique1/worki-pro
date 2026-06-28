import { prisma } from 'wasp/server'

import { getAdminLiveCounts } from '../../../../../src/analytics/operations'


export default async function (args, context) {
  return (getAdminLiveCounts as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      Review: prisma.review,
      ServiceRequest: prisma.serviceRequest,
    },
  })
}
