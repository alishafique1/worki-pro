import { prisma } from 'wasp/server'

import { assignRequestToProvider } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (assignRequestToProvider as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      CommunicationLog: prisma.communicationLog,
    },
  })
}
