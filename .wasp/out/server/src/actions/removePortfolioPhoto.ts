import { prisma } from 'wasp/server'

import { removePortfolioPhoto } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (removePortfolioPhoto as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
