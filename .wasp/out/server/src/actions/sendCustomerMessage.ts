import { prisma } from 'wasp/server'

import { sendCustomerMessage } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (sendCustomerMessage as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      CommunicationLog: prisma.communicationLog,
      Provider: prisma.provider,
    },
  })
}
