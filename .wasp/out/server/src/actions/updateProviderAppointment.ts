import { prisma } from 'wasp/server'

import { updateProviderAppointment } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (updateProviderAppointment as any)(args, {
    ...context,
    entities: {
      Appointment: prisma.appointment,
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
    },
  })
}
