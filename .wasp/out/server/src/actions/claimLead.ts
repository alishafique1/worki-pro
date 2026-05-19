import { prisma } from 'wasp/server'

import { claimLead } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (claimLead as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      ProviderFee: prisma.providerFee,
      CommunicationLog: prisma.communicationLog,
    },
  })
}
