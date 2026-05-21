import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

import { config } from 'wasp/server'
import type { MiddlewareConfig, MiddlewareConfigFn } from 'wasp/server/middleware'
export type { MiddlewareConfig, MiddlewareConfigFn } from 'wasp/server/middleware'

import pinoHttp from 'pino-http'

const pinoHttpLogger = pinoHttp({
  level: process.env.LOG_LEVEL || 'info',
  autoLogging: {
    ignore: (req) => req.url === '/api/health',
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    censor: '[REDACTED]',
  },
})

const _waspGlobalMiddlewareConfigFn = (mc: MiddlewareConfig) => {
  mc.set('pino-logger', pinoHttpLogger)
  return mc
}

// This is the set of middleware Wasp supplies by default.
// NOTE: Remember to update the docs of these change.
const defaultGlobalMiddlewareConfig: MiddlewareConfig = new Map([
  ['helmet', helmet()],
  ['cors', cors({ origin: config.allowedCORSOrigins })],
  ['express.json', express.json()],
  ['express.urlencoded', express.urlencoded()],
  ['cookieParser', cookieParser()]
])

// This is the global middleware that is the result of applying the user's modifications.
// It will be used as the basis for Operations and APIs (unless they are further customized).
const globalMiddlewareConfig: MiddlewareConfig = _waspGlobalMiddlewareConfigFn(defaultGlobalMiddlewareConfig)

// This function returns an array of Express middleware to be used by a router. It optionally
// accepts a function that can modify the global middleware for specific route customization.
export function globalMiddlewareConfigForExpress(middlewareConfigFn?: MiddlewareConfigFn): express.RequestHandler[] {
  if (!middlewareConfigFn) {
    return Array.from(globalMiddlewareConfig.values())
  }

  // Make a clone so they can't mess up the global Map for any other routes calling this.
  const globalMiddlewareConfigClone = new Map(globalMiddlewareConfig)
  const modifiedMiddlewareConfig = middlewareConfigFn(globalMiddlewareConfigClone)
  return Array.from(modifiedMiddlewareConfig.values())
}
