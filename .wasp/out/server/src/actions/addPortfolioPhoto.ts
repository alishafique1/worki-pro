import { prisma } from 'wasp/server'

import { addPortfolioPhoto } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (addPortfolioPhoto as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
