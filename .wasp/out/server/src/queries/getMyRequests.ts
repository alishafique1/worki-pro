import { prisma } from 'wasp/server'

import { getMyRequests } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getMyRequests as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      Appointment: prisma.appointment,
      Provider: prisma.provider,
      CommunicationLog: prisma.communicationLog,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
