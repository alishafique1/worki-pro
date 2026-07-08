import { prisma } from 'wasp/server'

import { createBillingSetupSession } from '../../../../../src/provider/billing'


export default async function (args, context) {
  return (createBillingSetupSession as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
