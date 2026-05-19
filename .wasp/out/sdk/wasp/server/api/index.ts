
import { type ParamsDictionary as ExpressParams, type Query as ExpressQuery } from 'express-serve-static-core'

import {
  type _Appointment,
  type _ServiceRequest,
  type _Provider,
  type _User,
  type _CommunicationLog,
  type _WebhookLog,
  type AuthenticatedApi,
} from '../_types'


// PUBLIC API
export type RequestOtp<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
export type VerifyOtp<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
export type CalcomWebhook<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
      _Appointment,
      _ServiceRequest,
      _Provider,
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
export type TwilioWebhook<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
      _ServiceRequest,
      _User,
      _CommunicationLog,
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
export type GhlWebhook<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
      _ServiceRequest,
      _CommunicationLog,
      _WebhookLog,
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
