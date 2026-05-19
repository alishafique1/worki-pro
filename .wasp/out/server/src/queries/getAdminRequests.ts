import { prisma } from 'wasp/server'

import { getAdminRequests } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (getAdminRequests as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      User: prisma.user,
    },
  })
}
