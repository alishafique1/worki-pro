import http from 'http';
import express, { Router } from 'express';
import * as z from 'zod';
import { z as z$1 } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { hashPassword, verifyPassword, createJWTHelpers, TimeSpan } from '@wasp.sh/lib-auth/node';
import { registerCustom, deserialize, serialize } from 'superjson';
import Mailgun from 'mailgun.js';
import crypto from 'node:crypto';
import { S3Client, HeadObjectCommand, S3ServiceException, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto$1, { randomUUID } from 'crypto';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import PgBoss from 'pg-boss';
import { listOrders } from '@lemonsqueezy/lemonsqueezy.js';
import Stripe from 'stripe';

const colors = {
  red: "\x1B[31m",
  yellow: "\x1B[33m"
};
const resetColor = "\x1B[0m";
function getColorizedConsoleFormatString(colorKey) {
  const color = colors[colorKey];
  return `${color}%s${resetColor}`;
}

const redColorFormatString = getColorizedConsoleFormatString("red");
function ensureEnvSchema(data, schema) {
  const result = getValidatedEnvOrError(data, schema);
  if (result.success) {
    return result.data;
  } else {
    console.error(`${redColorFormatString}${formatZodEnvErrors(result.error.issues)}`);
    throw new Error("Error parsing environment variables");
  }
}
function getValidatedEnvOrError(env, schema) {
  return schema.safeParse(env);
}
function formatZodEnvErrors(issues) {
  const errorOutput = ["", "\u2550\u2550 Env vars validation failed \u2550\u2550", ""];
  for (const error of issues) {
    errorOutput.push(` - ${error.message}`);
  }
  errorOutput.push("");
  errorOutput.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  return errorOutput.join("\n");
}

const userServerEnvSchema = z.object({});
const waspServerCommonSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required"
  }),
  PG_BOSS_NEW_OPTIONS: z.string().optional(),
  MAILGUN_API_KEY: z.string({
    required_error: getRequiredEnvVarErrorMessage("Mailgun email sender", "MAILGUN_API_KEY")
  }),
  MAILGUN_DOMAIN: z.string({
    required_error: getRequiredEnvVarErrorMessage("Mailgun email sender", "MAILGUN_DOMAIN")
  }),
  MAILGUN_API_URL: z.string().optional(),
  SKIP_EMAIL_VERIFICATION_IN_DEV: z.enum(["true", "false"], {
    message: 'SKIP_EMAIL_VERIFICATION_IN_DEV must be either "true" or "false"'
  }).transform((value) => value === "true").default("false")
});
const serverUrlSchema = z.string({
  required_error: "WASP_SERVER_URL is required"
}).url({
  message: "WASP_SERVER_URL must be a valid URL"
});
const clientUrlSchema = z.string({
  required_error: "WASP_WEB_CLIENT_URL is required"
}).url({
  message: "WASP_WEB_CLIENT_URL must be a valid URL"
});
const jwtTokenSchema = z.string({
  required_error: "JWT_SECRET is required"
});
const serverDevSchema = z.object({
  NODE_ENV: z.literal("development"),
  "WASP_SERVER_URL": serverUrlSchema.default("http://localhost:3001"),
  "WASP_WEB_CLIENT_URL": clientUrlSchema.default("http://localhost:3000/"),
  "JWT_SECRET": jwtTokenSchema.default("DEVJWTSECRET")
});
const serverProdSchema = z.object({
  NODE_ENV: z.literal("production"),
  "WASP_SERVER_URL": serverUrlSchema,
  "WASP_WEB_CLIENT_URL": clientUrlSchema,
  "JWT_SECRET": jwtTokenSchema
});
const serverCommonSchema = userServerEnvSchema.merge(waspServerCommonSchema);
const serverEnvSchema = z.discriminatedUnion("NODE_ENV", [
  serverDevSchema.merge(serverCommonSchema),
  serverProdSchema.merge(serverCommonSchema)
]);
const defaultNodeEnvValue = serverDevSchema.shape.NODE_ENV.value;
const { NODE_ENV: inputNodeEnvValue, ...restEnv } = process.env;
const env = ensureEnvSchema({
  NODE_ENV: inputNodeEnvValue ?? defaultNodeEnvValue,
  ...restEnv
}, serverEnvSchema);
function getRequiredEnvVarErrorMessage(featureName, envVarName) {
  return `${envVarName} is required when using ${featureName}`;
}

function stripTrailingSlash(url) {
  return url?.replace(/\/$/, "");
}
function getOrigin(url) {
  return new URL(url).origin;
}

const frontendUrl = stripTrailingSlash(env["WASP_WEB_CLIENT_URL"]);
stripTrailingSlash(env["WASP_SERVER_URL"]);
const allowedCORSOriginsPerEnv = {
  development: [/.*/],
  production: [getOrigin(frontendUrl)]
};
const allowedCORSOrigins = allowedCORSOriginsPerEnv[env.NODE_ENV];
const config$1 = {
  frontendUrl,
  allowedCORSOrigins,
  env: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === "development",
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  auth: {
    jwtSecret: env["JWT_SECRET"]
  }
};

function createDbClient() {
  return new PrismaClient();
}
const dbClient = createDbClient();

class HttpError extends Error {
  statusCode;
  data;
  constructor(statusCode, message, data, options) {
    super(message, options);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
    this.name = this.constructor.name;
    if (!(Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600)) {
      throw new Error("statusCode has to be integer in range [400, 600).");
    }
    this.statusCode = statusCode;
    if (data) {
      this.data = data;
    }
  }
}

const prismaAdapter = new PrismaAdapter(dbClient.session, dbClient.auth);
const auth$1 = new Lucia(prismaAdapter, {
  // Since we are not using cookies, we don't need to set any cookie options.
  // But in the future, if we decide to use cookies, we can set them here.
  // sessionCookie: {
  //   name: "session",
  //   expires: true,
  //   attributes: {
  //     secure: !config.isDevelopment,
  //     sameSite: "lax",
  //   },
  // },
  getUserAttributes({ userId }) {
    return {
      userId
    };
  }
});

const defineHandler = (middleware) => middleware;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PASSWORD_FIELD = "password";
const EMAIL_FIELD = "email";
const TOKEN_FIELD = "token";
function ensureValidEmail(args) {
  validate(args, [
    { validates: EMAIL_FIELD, message: "email must be present", validator: (email) => !!email },
    { validates: EMAIL_FIELD, message: "email must be a valid email", validator: (email) => isValidEmail(email) }
  ]);
}
function ensurePasswordIsPresent(args) {
  validate(args, [
    { validates: PASSWORD_FIELD, message: "password must be present", validator: (password) => !!password }
  ]);
}
function ensureValidPassword(args) {
  validate(args, [
    { validates: PASSWORD_FIELD, message: "password must be at least 8 characters", validator: (password) => isMinLength(password, 8) },
    { validates: PASSWORD_FIELD, message: "password must contain a number", validator: (password) => containsNumber(password) }
  ]);
}
function ensureTokenIsPresent(args) {
  validate(args, [
    { validates: TOKEN_FIELD, message: "token must be present", validator: (token) => !!token }
  ]);
}
function throwValidationError(message) {
  throw new HttpError(422, "Validation failed", { message });
}
function validate(args, validators) {
  for (const { validates, message, validator } of validators) {
    if (!validator(args[validates])) {
      throwValidationError(message);
    }
  }
}
const validEmailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
function isValidEmail(input) {
  if (typeof input !== "string") {
    return false;
  }
  return input.match(validEmailRegex) !== null;
}
function isMinLength(input, minLength) {
  if (typeof input !== "string") {
    return false;
  }
  return input.length >= minLength;
}
function containsNumber(input) {
  if (typeof input !== "string") {
    return false;
  }
  return /\d/.test(input);
}

({
  entities: {
    User: dbClient.user
  }
});
function createProviderId(providerName, providerUserId) {
  return {
    providerName,
    providerUserId: normalizeProviderUserId(providerName, providerUserId)
  };
}
function normalizeProviderUserId(providerName, providerUserId) {
  switch (providerName) {
    case "email":
    case "username":
      return providerUserId.toLowerCase();
    case "google":
    case "github":
    case "discord":
    case "keycloak":
    case "slack":
    case "microsoft":
      return providerUserId;
    /*
          Why the default case?
          In case users add a new auth provider in the user-land.
          Users can't extend this function because it is private.
          If there is an unknown `providerName` in runtime, we'll
          return the `providerUserId` as is.
    
          We want to still have explicit OAuth providers listed
          so that we get a type error if we forget to add a new provider
          to the switch statement.
        */
    default:
      return providerUserId;
  }
}
async function findAuthIdentity(providerId) {
  return dbClient.authIdentity.findUnique({
    where: {
      providerName_providerUserId: providerId
    }
  });
}
async function updateAuthIdentityProviderData(providerId, existingProviderData, providerDataUpdates) {
  const sanitizedProviderDataUpdates = await ensurePasswordIsHashed(providerDataUpdates);
  const newProviderData = {
    ...existingProviderData,
    ...sanitizedProviderDataUpdates
  };
  const serializedProviderData = await serializeProviderData(newProviderData);
  return dbClient.authIdentity.update({
    where: {
      providerName_providerUserId: providerId
    },
    data: { providerData: serializedProviderData }
  });
}
async function findAuthWithUserBy(where) {
  const result = await dbClient.auth.findFirst({ where, include: { user: true } });
  if (result === null) {
    return null;
  }
  if (result.user === null) {
    return null;
  }
  return { ...result, user: result.user };
}
async function createUser(providerId, serializedProviderData, userFields) {
  return dbClient.user.create({
    data: {
      // Using any here to prevent type errors when userFields are not
      // defined. We want Prisma to throw an error in that case.
      ...userFields ?? {},
      auth: {
        create: {
          identities: {
            create: {
              providerName: providerId.providerName,
              providerUserId: providerId.providerUserId,
              providerData: serializedProviderData
            }
          }
        }
      }
    },
    // We need to include the Auth entity here because we need `authId`
    // to be able to create a session.
    include: {
      auth: true
    }
  });
}
async function deleteUserByAuthId(authId) {
  return dbClient.user.deleteMany({ where: { auth: {
    id: authId
  } } });
}
async function doFakeWork() {
  const timeToWork = Math.floor(Math.random() * 1e3) + 1e3;
  return sleep(timeToWork);
}
function rethrowPossibleAuthError(e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    throw new HttpError(422, "Save failed", {
      message: `user with the same identity already exists`
    });
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    console.error(e);
    throw new HttpError(422, "Save failed", {
      message: "there was a database error"
    });
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
    console.error(e);
    console.info("\u{1F41D} This error can happen if you did't run the database migrations.");
    throw new HttpError(500, "Save failed", {
      message: `there was a database error`
    });
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
    console.error(e);
    console.info(`\u{1F41D} This error can happen if you have some relation on your User entity
   but you didn't specify the "onDelete" behaviour to either "Cascade" or "SetNull".
   Read more at: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions`);
    throw new HttpError(500, "Save failed", {
      message: `there was a database error`
    });
  }
  throw e;
}
async function validateAndGetUserFields(data, userSignupFields) {
  const { password: _password, ...sanitizedData } = data;
  const result = {};
  if (!userSignupFields) {
    return result;
  }
  for (const [field, getFieldValue] of Object.entries(userSignupFields)) {
    try {
      const value = await getFieldValue(sanitizedData);
      result[field] = value;
    } catch (e) {
      throwValidationError(e.message);
    }
  }
  return result;
}
function getProviderData(providerData) {
  return sanitizeProviderData(getProviderDataWithPassword(providerData));
}
function getProviderDataWithPassword(providerData) {
  return JSON.parse(providerData);
}
function sanitizeProviderData(providerData) {
  if (providerDataHasPasswordField(providerData)) {
    const { hashedPassword, ...rest } = providerData;
    return rest;
  } else {
    return providerData;
  }
}
async function sanitizeAndSerializeProviderData(providerData) {
  return serializeProviderData(await ensurePasswordIsHashed(providerData));
}
function serializeProviderData(providerData) {
  return JSON.stringify(providerData);
}
async function ensurePasswordIsHashed(providerData) {
  const data = {
    ...providerData
  };
  if (providerDataHasPasswordField(data)) {
    data.hashedPassword = await hashPassword(data.hashedPassword);
  }
  return data;
}
function providerDataHasPasswordField(providerData) {
  return "hashedPassword" in providerData;
}
function createInvalidCredentialsError(message) {
  return new HttpError(401, "Invalid credentials", { message });
}

function createAuthUserData(user) {
  const { auth, ...rest } = user;
  if (!auth) {
    throw new Error(`\u{1F41D} Error: trying to create a user without auth data.
This should never happen, but it did which means there is a bug in the code.`);
  }
  const identities = {
    email: getProviderInfo(auth, "email")
  };
  return {
    ...rest,
    identities
  };
}
function getProviderInfo(auth, providerName) {
  const identity = getIdentity(auth, providerName);
  if (!identity) {
    return null;
  }
  return {
    ...getProviderData(identity.providerData),
    id: identity.providerUserId
  };
}
function getIdentity(auth, providerName) {
  return auth.identities.find((i) => i.providerName === providerName) ?? null;
}

async function createSession(authId) {
  return auth$1.createSession(authId, {});
}
async function getSessionAndUserFromBearerToken(req) {
  const authorizationHeader = req.headers["authorization"];
  if (typeof authorizationHeader !== "string") {
    return null;
  }
  const sessionId = auth$1.readBearerToken(authorizationHeader);
  if (!sessionId) {
    return null;
  }
  return getSessionAndUserFromSessionId(sessionId);
}
async function getSessionAndUserFromSessionId(sessionId) {
  const { session, user: authEntity } = await auth$1.validateSession(sessionId);
  if (!session || !authEntity) {
    return null;
  }
  return {
    session,
    user: await getAuthUserData(authEntity.userId)
  };
}
async function getAuthUserData(userId) {
  const user = await dbClient.user.findUnique({
    where: { id: userId },
    include: {
      auth: {
        include: {
          identities: true
        }
      }
    }
  });
  if (!user) {
    throw createInvalidCredentialsError();
  }
  return createAuthUserData(user);
}
function invalidateSession(sessionId) {
  return auth$1.invalidateSession(sessionId);
}

const auth = defineHandler(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.sessionId = null;
    req.user = null;
    return next();
  }
  const sessionAndUser = await getSessionAndUserFromBearerToken(req);
  if (sessionAndUser === null) {
    throw createInvalidCredentialsError();
  }
  req.sessionId = sessionAndUser.session.id;
  req.user = sessionAndUser.user;
  next();
});

const Decimal = Prisma.Decimal;
if (Decimal) {
  registerCustom({
    isApplicable: (v) => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v)
  }, "prisma.decimal");
}

function isNotNull(value) {
  return value !== null;
}

function makeAuthUserIfPossible(user) {
  return user ? makeAuthUser(user) : null;
}
function makeAuthUser(data) {
  return {
    ...data,
    getFirstProviderUserId: () => {
      const identities = Object.values(data.identities).filter(isNotNull);
      return identities.length > 0 ? identities[0].id : null;
    }
  };
}

function createOperation(handlerFn) {
  return defineHandler(async (req, res) => {
    const args = req.body && deserialize(req.body) || {};
    const context = {
      user: makeAuthUserIfPossible(req.user)
    };
    const result = await handlerFn(args, context);
    const serializedResult = serialize(result);
    res.json(serializedResult);
  });
}
function createQuery(handlerFn) {
  return createOperation(handlerFn);
}
function createAction(handlerFn) {
  return createOperation(handlerFn);
}

function getDefaultFromField() {
  return {
    email: "hello@thehelper.ca",
    name: "TheHelper"
  };
}

function initMailgunEmailSender(config) {
  const defaultFromField = getDefaultFromField();
  const mailgun = new Mailgun(FormData);
  const mailer = mailgun.client({
    username: "api",
    key: config.apiKey,
    url: config.apiUrl
  });
  return {
    async send(email) {
      const fromField = email.from || defaultFromField;
      return mailer.messages.create(config.domain, {
        from: `${fromField.name} <${fromField.email}>`,
        to: [email.to],
        subject: email.subject,
        text: email.text,
        html: email.html
      });
    }
  };
}

const emailProvider = {
  apiKey: env.MAILGUN_API_KEY,
  domain: env.MAILGUN_DOMAIN,
  apiUrl: env.MAILGUN_API_URL
};
const emailSender = initMailgunEmailSender(emailProvider);

const REWARD_POINTS = {
  SIGNUP_BONUS: 100,
  SERVICE_REQUEST: 500};

const CANADIAN_PHONE = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const GTA_POSTAL_PREFIX = /^[LM]/i;
const isValidCanadianPhone = (v) => CANADIAN_PHONE.test(v.trim());
const isValidCanadianPostal = (v) => CA_POSTAL.test(v.trim());
const isGtaPostal = (v) => GTA_POSTAL_PREFIX.test(v.trim());
function validateOnboarding(input, opts = {}) {
  if (!input.role) return "Please select your role to continue.";
  if (!input.firstName.trim()) return "First name is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (!isValidCanadianPhone(input.phone)) return "Enter a valid Canadian phone number (e.g. (416) 555-0100).";
  if (!input.postalCode.trim()) return "Postal code is required.";
  if (!isValidCanadianPostal(input.postalCode)) return "Enter a valid Canadian postal code (e.g. L9T 2X5).";
  if (!isGtaPostal(input.postalCode)) return "We currently serve the GTA (postal codes starting with L or M). Other areas coming soon.";
  if (input.role === "PROVIDER") {
    if (!input.businessName?.trim()) return "Business name is required.";
    if (opts.requireProviderServices && (input.serviceCategoryIds?.length ?? 0) === 0) {
      return "Please select at least one service category to continue.";
    }
  }
  return null;
}

async function sendLeadToGHL(payload, prisma) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[GHL] GHL_WEBHOOK_URL not set \u2014 skipping outbound webhook");
    return;
  }
  const body = {
    contact: {
      firstName: payload.name.split(" ")[0] ?? payload.name,
      lastName: payload.name.split(" ").slice(1).join(" ") || void 0,
      phone: normalizePhone(payload.phone),
      email: payload.email,
      postalCode: payload.postalCode,
      tags: ["thehelper-lead", payload.serviceType ?? "general", payload.urgency.toLowerCase()],
      customFields: {
        thehelper_request_id: payload.serviceRequestId,
        service_type: payload.serviceType ?? "general",
        description: payload.description,
        urgency: payload.urgency,
        source: payload.source
      }
    }
  };
  let statusCode;
  let error;
  try {
    const headers = { "Content-Type": "application/json" };
    if (process.env.GHL_WEBHOOK_SECRET) {
      headers["x-thehelper-secret"] = process.env.GHL_WEBHOOK_SECRET;
    }
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    statusCode = res.status;
    if (!res.ok) {
      error = `GHL responded ${res.status}: ${await res.text()}`;
      console.error("[GHL] Outbound webhook failed:", error);
    } else {
      console.log(`[GHL] Lead sent for request ${payload.serviceRequestId}`);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    console.error("[GHL] Outbound webhook error:", error);
  }
  try {
    const logData = {
      direction: "OUTBOUND",
      source: "GHL",
      event: "lead.created",
      serviceRequestId: payload.serviceRequestId,
      payload: body,
      statusCode,
      error
    };
    const webhookLogDelegate = prisma.WebhookLog ?? prisma.webhookLog;
    await webhookLogDelegate.create({ data: logData });
  } catch (logErr) {
    console.error("[GHL] Failed to write WebhookLog:", logErr);
  }
}
async function syncContactToGHL(contact, prisma) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[GHL] GHL_WEBHOOK_URL not set \u2014 skipping contact sync");
    return;
  }
  const body = {
    contact: {
      firstName: contact.firstName,
      lastName: contact.lastName || void 0,
      phone: normalizePhone(contact.phone),
      email: contact.email,
      postalCode: contact.postalCode,
      tags: ["thehelper-signup", contact.role.toLowerCase()],
      customFields: {
        role: contact.role,
        business_name: contact.businessName ?? void 0,
        source: "ONBOARDING"
      }
    }
  };
  let statusCode;
  let error;
  try {
    const headers = { "Content-Type": "application/json" };
    if (process.env.GHL_WEBHOOK_SECRET) {
      headers["x-thehelper-secret"] = process.env.GHL_WEBHOOK_SECRET;
    }
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    statusCode = res.status;
    if (!res.ok) {
      error = `GHL responded ${res.status}: ${await res.text()}`;
      console.error("[GHL] Contact sync failed:", error);
    } else {
      console.log(`[GHL] Contact synced for ${contact.role} signup (${contact.email ?? contact.phone})`);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    console.error("[GHL] Contact sync error:", error);
  }
  try {
    const logData = {
      direction: "OUTBOUND",
      source: "GHL",
      event: "contact.created",
      serviceRequestId: null,
      payload: body,
      statusCode,
      error
    };
    const webhookLogDelegate = prisma.WebhookLog ?? prisma.webhookLog;
    await webhookLogDelegate.create({ data: logData });
  } catch (logErr) {
    console.error("[GHL] Failed to write WebhookLog:", logErr);
  }
}
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

const completeOnboarding$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }
  const userId = context.user.id;
  const userEmail = context.user.email;
  const { role, firstName, lastName, phone, postalCode, smsConsent, businessName, serviceAreas, referralCode, interestCategoryIds, serviceCategoryIds } = args;
  const validationError = validateOnboarding(
    { role, firstName, phone, postalCode, businessName, serviceCategoryIds },
    { requireProviderServices: true }
  );
  if (validationError) {
    throw new HttpError(400, validationError);
  }
  await dbClient.$transaction(
    async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phone,
          postalCode,
          role,
          smsConsent: smsConsent ?? false,
          smsConsentAt: smsConsent ? /* @__PURE__ */ new Date() : void 0
        }
      });
      if (role === "PROVIDER") {
        const provider = await tx.provider.upsert({
          where: { userId },
          update: {
            businessName: businessName ?? "",
            phone,
            serviceAreas: serviceAreas ?? []
          },
          create: {
            userId,
            businessName: businessName ?? "",
            phone,
            serviceAreas: serviceAreas ?? [],
            email: userEmail ?? void 0
          }
        });
        if (serviceCategoryIds && serviceCategoryIds.length > 0) {
          await tx.providerCategory.deleteMany({ where: { providerId: provider.id } });
          await tx.providerCategory.createMany({
            data: serviceCategoryIds.map((serviceCategoryId) => ({
              providerId: provider.id,
              serviceCategoryId
            })),
            skipDuplicates: true
          });
        }
      }
      if (role === "CONSUMER") {
        if (interestCategoryIds && interestCategoryIds.length > 0) {
          await tx.consumerInterest.deleteMany({ where: { consumerId: userId } });
          await tx.consumerInterest.createMany({
            data: interestCategoryIds.map((serviceCategoryId) => ({
              consumerId: userId,
              serviceCategoryId
            })),
            skipDuplicates: true
          });
        }
        await tx.rewardAccount.upsert({
          where: { consumerId: userId },
          update: {},
          create: { consumerId: userId }
        });
        if (userEmail) {
          const pendingGuestRequests = await tx.serviceRequest.findMany({
            where: { consumerId: null, email: userEmail },
            orderBy: { createdAt: "asc" },
            select: { id: true }
          });
          if (pendingGuestRequests.length > 0) {
            const requestIds = pendingGuestRequests.map((r) => r.id);
            const existingRewards = await tx.rewardTransaction.findMany({
              where: { consumerId: userId, serviceRequestId: { in: requestIds }, type: "SERVICE_REQUEST" },
              select: { serviceRequestId: true }
            });
            const rewardedRequestIds = new Set(existingRewards.map((r) => r.serviceRequestId));
            const newRewards = requestIds.filter((id) => !rewardedRequestIds.has(id)).map((id) => ({
              consumerId: userId,
              serviceRequestId: id,
              type: "SERVICE_REQUEST",
              points: REWARD_POINTS.SERVICE_REQUEST,
              status: "PENDING",
              reason: "Request submitted \u2014 500 pts reward pending verification"
            }));
            if (newRewards.length > 0) {
              await tx.rewardTransaction.createMany({ data: newRewards, skipDuplicates: true });
            }
            await tx.serviceRequest.updateMany({
              where: { id: { in: requestIds }, consumerId: null },
              data: { consumerId: userId, rewardStatus: "PENDING_VERIFICATION" }
            });
          }
        }
        const existingBonus = await tx.rewardTransaction.findFirst({
          where: { consumerId: userId, type: "SIGNUP_BONUS" }
        });
        if (!existingBonus) {
          await tx.rewardTransaction.create({
            data: {
              consumerId: userId,
              type: "SIGNUP_BONUS",
              points: REWARD_POINTS.SIGNUP_BONUS,
              status: "APPROVED",
              reason: "Welcome bonus"
            }
          });
          await tx.rewardAccount.update({
            where: { consumerId: userId },
            data: {
              pointsBalance: { increment: REWARD_POINTS.SIGNUP_BONUS },
              lifetimePoints: { increment: REWARD_POINTS.SIGNUP_BONUS }
            }
          });
        }
        if (referralCode) {
          const code = referralCode.trim().toUpperCase();
          const referral = await tx.referral.findUnique({ where: { referralCode: code } });
          if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
            await tx.referral.update({
              where: { id: referral.id },
              data: { referredUserId: userId, status: "SIGNED_UP" }
            });
          }
        }
      }
    },
    { isolationLevel: "Serializable" }
  );
  syncContactToGHL(
    {
      firstName,
      lastName,
      phone,
      email: userEmail ?? void 0,
      postalCode,
      role,
      businessName
    },
    dbClient
  ).catch(() => {
  });
  if (role === "CONSUMER" && userEmail) {
    emailSender.send({
      to: userEmail,
      subject: "Welcome to The Helper!",
      text: `Hi ${firstName},

Welcome to The Helper! Here's how it works:

1. Tell us what you need \u2014 describe your problem
2. We match you with vetted local pros
3. Compare, choose, and earn rewards on every job

Ready to start? Submit your first request:
https://thehelper.ca/get-quotes

The TheHelper Team`,
      html: `<p>Hi ${firstName},</p><p>Welcome to The Helper! Here's how it works:</p><ol><li>Tell us what you need</li><li>We match you with vetted local pros</li><li>Earn rewards on every job</li></ol><p><a href="https://thehelper.ca/get-quotes" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Submit your first request \u2192</a></p><p>The TheHelper Team</p>`
    }).catch(() => {
    });
  }
  if (role === "PROVIDER") {
    if (userEmail) {
      emailSender.send({
        to: userEmail,
        subject: "Application received \u2014 The Helper",
        text: `Hi ${firstName},

Thanks for applying to join The Helper as a service pro.

Your application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.

We'll notify you once the review is complete.

Go to your dashboard:
https://thehelper.ca/provider/dashboard

The TheHelper Team`,
        html: `<p>Hi ${firstName},</p><p>Thanks for applying to join The Helper as a service pro.</p><p>Your application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.</p><p>We'll notify you once the review is complete.</p><p><a href="https://thehelper.ca/provider/dashboard" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Go to dashboard \u2192</a></p><p>The TheHelper Team</p>`
      }).catch(() => {
      });
    }
    const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
    for (const adminEmail of adminEmails) {
      emailSender.send({
        to: adminEmail,
        subject: `New provider onboarding: ${businessName ?? "Unknown"}`,
        text: `A new provider completed onboarding.

Business: ${businessName ?? "Unknown"}
Phone: ${phone}
Email: ${userEmail ?? "N/A"}
Areas: ${(serviceAreas ?? []).join(", ")}
Categories: ${(serviceCategoryIds ?? []).length} selected

Review: https://thehelper.ca/admin/providers`,
        html: `<p>A new provider completed onboarding.</p><ul><li><strong>Business:</strong> ${businessName ?? "Unknown"}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${userEmail ?? "N/A"}</li><li><strong>Areas:</strong> ${(serviceAreas ?? []).join(", ")}</li><li><strong>Categories:</strong> ${(serviceCategoryIds ?? []).length} selected</li></ul><p><a href="https://thehelper.ca/admin/providers">Review in admin \u2192</a></p>`
      }).catch(() => {
      });
    }
  }
  return { success: true };
};

async function completeOnboarding$1(args, context) {
  return completeOnboarding$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      Provider: dbClient.provider,
      RewardAccount: dbClient.rewardAccount,
      RewardTransaction: dbClient.rewardTransaction,
      ServiceRequest: dbClient.serviceRequest,
      Referral: dbClient.referral,
      ConsumerInterest: dbClient.consumerInterest,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var completeOnboarding = createAction(completeOnboarding$1);

const getServiceCategories$2 = async (args, context) => {
  return context.entities.ServiceCategory.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: {
      children: {
        where: { active: true },
        orderBy: { name: "asc" }
      }
    }
  });
};
const getMyRequests$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.ServiceRequest.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      assignedProvider: true,
      serviceCategory: true,
      appointments: {
        orderBy: { createdAt: "desc" },
        include: { provider: true }
      },
      communicationLogs: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
};
const getMyRewardAccount$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const account = await context.entities.RewardAccount.findUnique({
    where: { consumerId: context.user.id }
  });
  const transactions = await context.entities.RewardTransaction.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: "desc" }
  });
  const redemptions = await context.entities.Redemption.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: "desc" }
  });
  return { account, transactions, redemptions };
};
const redeemPoints$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { points, giftCardEmail } = args;
  if (points < 500 || points % 500 !== 0) {
    throw new HttpError(
      400,
      "Minimum redemption is 500 points in multiples of 500."
    );
  }
  const cashValue = points / 100;
  const userId = context.user.id;
  const redemption = await dbClient.$transaction(async (tx) => {
    const account = await tx.rewardAccount.findUnique({
      where: { consumerId: userId }
    });
    if (!account || account.pointsBalance < points) {
      throw new HttpError(400, "Insufficient points balance.");
    }
    const newRedemption = await tx.redemption.create({
      data: {
        consumerId: userId,
        pointsUsed: points,
        cashValue,
        giftCardEmail,
        status: "REQUESTED"
      }
    });
    await tx.rewardTransaction.create({
      data: {
        consumerId: userId,
        type: "REDEMPTION",
        points: -points,
        status: "REDEEMED",
        reason: "Gift card redemption"
      }
    });
    await tx.rewardAccount.update({
      where: { consumerId: userId },
      data: { pointsBalance: { decrement: points } }
    });
    return newRedemption;
  });
  return redemption;
};
const POINTS = {
  SERVICE_REQUEST: 500};
const submitServiceRequest$2 = async (args, context) => {
  const trimmedName = args.name?.trim();
  if (!trimmedName) throw new HttpError(400, "Name is required.");
  if (trimmedName.length > 100) throw new HttpError(400, "Name must be 100 characters or fewer.");
  const trimmedDescription = args.description?.trim();
  if (!trimmedDescription) throw new HttpError(400, "Please describe the work needed.");
  if (trimmedDescription.length > 2e3) throw new HttpError(400, "Description must be 2,000 characters or fewer.");
  if (args.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email.trim())) {
      throw new HttpError(400, "Please enter a valid email address.");
    }
  }
  if (args.phone) {
    const phoneDigits = args.phone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      throw new HttpError(400, "Phone number must be 10\u201315 digits.");
    }
  }
  if (args.email) {
    const recentCount = await context.entities.ServiceRequest.count({
      where: {
        email: args.email.trim().toLowerCase(),
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1e3) }
      }
    });
    if (recentCount >= 5) {
      throw new HttpError(429, "Too many requests submitted. Please wait before trying again.");
    }
  }
  const sanitizedDescription = trimmedDescription.replace(/<[^>]*>/g, "").trim();
  let serviceCategoryId = void 0;
  if (args.serviceType) {
    const cat = await context.entities.ServiceCategory.findUnique({
      where: { slug: args.serviceType }
    });
    serviceCategoryId = cat?.id;
  }
  const preferredProviderId = args.preferredProviderId ? (await context.entities.Provider.findUnique({
    where: { id: args.preferredProviderId }
  }))?.id : void 0;
  const newRequest = await context.entities.ServiceRequest.create({
    data: {
      consumerId: context.user?.id || void 0,
      name: trimmedName,
      email: args.email ? args.email.trim().toLowerCase() : void 0,
      phone: args.phone || "",
      postalCode: args.postalCode,
      description: sanitizedDescription,
      urgency: args.urgency,
      estimatedSchedule: args.estimatedSchedule,
      preferredTime: args.preferredTime,
      smsConsentGiven: args.smsConsentGiven ?? false,
      smsConsentFormVersion: args.smsConsentFormVersion || void 0,
      source: "WEBSITE",
      status: preferredProviderId ? "ASSIGNED" : "NEW",
      rewardStatus: "PENDING_VERIFICATION",
      serviceCategoryId: serviceCategoryId || void 0,
      assignedProviderId: preferredProviderId || void 0
    }
  });
  if (context.user?.id) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: context.user.id,
        serviceRequestId: newRequest.id,
        type: "SERVICE_REQUEST",
        points: POINTS.SERVICE_REQUEST,
        status: "PENDING",
        reason: "Request submitted \u2014 $5 reward pending verification"
      }
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: context.user.id },
      create: {
        consumerId: context.user.id,
        pointsBalance: 0,
        lifetimePoints: 0
      },
      update: {}
    });
  }
  sendLeadToGHL(
    {
      serviceRequestId: newRequest.id,
      name: trimmedName,
      phone: args.phone || "",
      email: args.email ? args.email.trim().toLowerCase() : void 0,
      postalCode: args.postalCode,
      serviceType: args.serviceType,
      description: sanitizedDescription,
      urgency: args.urgency,
      source: "WEBSITE"
    },
    context.entities
  ).catch(() => {
  });
  return newRequest;
};
const getProviders$2 = async ({ categorySlug, search, areaSlug }, context) => {
  const where = {
    active: true,
    verificationStatus: "VERIFIED"
  };
  if (categorySlug) {
    where.categories = {
      some: {
        serviceCategory: { slug: categorySlug }
      }
    };
  }
  if (areaSlug) {
    where.serviceAreas = {
      has: areaSlug.toLowerCase()
    };
  }
  let providers = await context.entities.Provider.findMany({
    where,
    include: {
      categories: {
        include: { serviceCategory: true }
      },
      appointments: {
        where: { status: "COMPLETED" },
        select: { id: true }
      },
      reviews: {
        where: { status: "PUBLISHED" },
        select: { id: true }
      }
    },
    orderBy: { ratingInternal: "desc" }
  });
  if (search) {
    const q = search.toLowerCase();
    providers = providers.filter(
      (provider) => provider.businessName.toLowerCase().includes(q) || provider.categories.some(
        (category) => category.serviceCategory.name.toLowerCase().includes(q)
      )
    );
  }
  return providers.map((provider) => ({
    id: provider.id,
    slug: provider.slug,
    businessName: provider.businessName,
    contactName: provider.contactName,
    ratingInternal: provider.ratingInternal,
    verificationStatus: provider.verificationStatus,
    serviceAreas: provider.serviceAreas,
    servicesJson: provider.servicesJson,
    bio: provider.bio,
    profilePhotoUrl: provider.profilePhotoUrl,
    categories: provider.categories,
    completedJobsCount: provider.appointments?.length ?? 0,
    reviewCount: provider.reviews?.length ?? 0
  }));
};
const sendCustomerMessage$2 = async ({ requestId, body }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const trimmedBody = body.trim();
  if (trimmedBody.length < 1) {
    throw new HttpError(400, "Message cannot be empty.");
  }
  if (trimmedBody.length > 1e3) {
    throw new HttpError(400, "Message must be 1,000 characters or fewer.");
  }
  const serviceRequest = await context.entities.ServiceRequest.findFirst({
    where: {
      id: requestId,
      consumerId: context.user.id
    },
    include: { assignedProvider: true }
  });
  if (!serviceRequest) {
    throw new HttpError(404, "Service request not found.");
  }
  const log = await context.entities.CommunicationLog.create({
    data: {
      userId: context.user.id,
      serviceRequestId: serviceRequest.id,
      providerId: serviceRequest.assignedProviderId || void 0,
      channel: "INTERNAL_NOTE",
      direction: "INBOUND",
      from: context.user.email || serviceRequest.email || serviceRequest.name || "Customer",
      to: serviceRequest.assignedProvider?.businessName || "The Helper coordination",
      body: trimmedBody,
      status: "SENT"
    }
  });
  if (serviceRequest.assignedProvider?.email) {
    const customerName = serviceRequest.name || context.user.email || "A customer";
    emailSender.send({
      to: serviceRequest.assignedProvider.email,
      subject: `New message from ${customerName}`,
      text: `Hi,

${customerName} sent you a message on TheHelper:

"${trimmedBody}"

View the thread:
https://thehelper.ca/provider/requests/${serviceRequest.id}/messages

The TheHelper Team`,
      html: `<p>Hi,</p><p><strong>${customerName}</strong> sent you a message on TheHelper:</p><blockquote>${trimmedBody}</blockquote><p><a href="https://thehelper.ca/provider/requests/${serviceRequest.id}/messages">View the thread</a></p>`
    }).catch((err) => {
      console.warn("[sendCustomerMessage] email notification failed:", err.message);
    });
  }
  return log;
};
const getProviderById$2 = async ({ providerId }, context) => {
  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId, active: true },
    include: {
      categories: { include: { serviceCategory: true } },
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 20
      }
    }
  });
  if (!provider) return null;
  const services = provider.servicesJson ? JSON.parse(provider.servicesJson) : [];
  return { ...provider, services };
};
const getConsumerStats$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const requests = await context.entities.ServiceRequest.findMany({
    where: { consumerId: context.user.id },
    include: { serviceCategory: true }
  });
  const account = await context.entities.RewardAccount.findUnique({
    where: { consumerId: context.user.id }
  });
  const transactions = await context.entities.RewardTransaction.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: "desc" }
  });
  const totalRequests = requests.length;
  const completedRequests = requests.filter(
    (r) => ["COMPLETED", "REWARD_APPROVED", "CLOSED"].includes(r.status)
  ).length;
  const pendingRequests = totalRequests - completedRequests;
  const totalPointsEarned = transactions.filter((t) => t.points > 0).reduce((sum, t) => sum + t.points, 0);
  const totalPointsRedeemed = Math.abs(
    transactions.filter((t) => t.points < 0).reduce((sum, t) => sum + t.points, 0)
  );
  const requestsByStatus = {};
  for (const r of requests) {
    requestsByStatus[r.status] = (requestsByStatus[r.status] || 0) + 1;
  }
  const requestsByCategory = {};
  for (const r of requests) {
    const cat = r.serviceCategory?.name ?? "Unknown";
    requestsByCategory[cat] = (requestsByCategory[cat] || 0) + 1;
  }
  const now = /* @__PURE__ */ new Date();
  new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyPoints = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const earned = transactions.filter((t) => {
      const td = new Date(t.createdAt);
      return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points > 0;
    }).reduce((s, t) => s + t.points, 0);
    const redeemed = Math.abs(
      transactions.filter((t) => {
        const td = new Date(t.createdAt);
        return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points < 0;
      }).reduce((s, t) => s + t.points, 0)
    );
    monthlyPoints.push({ month: monthKey, earned, redeemed });
  }
  monthlyPoints.reverse();
  return {
    totalRequests,
    completedRequests,
    pendingRequests,
    totalPointsEarned,
    totalPointsRedeemed,
    currentBalance: account?.pointsBalance ?? 0,
    lifetimePoints: account?.lifetimePoints ?? 0,
    requestsByStatus,
    requestsByCategory,
    monthlyPoints
  };
};
const submitLead$2 = async ({ name, email, phone, postalCode, serviceType, message, source }, context) => {
  if (!name?.trim()) throw new HttpError(400, "Name is required.");
  if (!email?.trim()) throw new HttpError(400, "Email is required.");
  const leadEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!leadEmailRegex.test(email.trim())) throw new HttpError(400, "Please enter a valid email address.");
  if (phone) {
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      throw new HttpError(400, "Phone number must be 10\u201315 digits.");
    }
  }
  const sanitizedLeadMessage = message ? message.replace(/<[^>]*>/g, "").trim() : void 0;
  const recentLeads = await context.entities.Lead.count({
    where: {
      email: email.trim().toLowerCase(),
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1e3) }
    }
  });
  if (recentLeads >= 3) {
    throw new HttpError(429, "Too many submissions. Please wait before trying again.");
  }
  const lead = await context.entities.Lead.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      postalCode: postalCode || null,
      serviceType: serviceType || null,
      message: sanitizedLeadMessage || null,
      source: source || "WEBSITE",
      status: "NEW"
    }
  });
  sendLeadToGHL(
    {
      serviceRequestId: lead.id,
      name: name.trim(),
      phone: phone || "",
      email: email.trim().toLowerCase(),
      postalCode: postalCode || "",
      serviceType: serviceType || "",
      description: sanitizedLeadMessage || "",
      urgency: "STANDARD",
      source: source || "WEBSITE"
    },
    context.entities
  ).catch(() => {
  });
  return lead;
};
const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
function hashOtp(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}
const sendOtp$2 = async ({ phone }, context) => {
  const normalized = phone.replace(/\s+/g, "").trim();
  if (!normalized) throw new HttpError(400, "Phone number required.");
  const recentCount = await context.entities.OtpVerification.count({
    where: {
      phone: normalized,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1e3) }
    }
  });
  if (recentCount >= 3) {
    throw new HttpError(429, "Too many OTP requests. Please wait a few minutes.");
  }
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1e3);
  await context.entities.OtpVerification.create({
    data: {
      phone: normalized,
      codeHash: hashOtp(code),
      expiresAt
    }
  });
  const ghlOtpWebhook = process.env.GHL_OTP_WEBHOOK_URL;
  if (ghlOtpWebhook) {
    await fetch(ghlOtpWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalized, code, ttlMinutes: OTP_TTL_MINUTES })
    }).catch(() => console.warn("[GHL OTP] Webhook failed"));
  } else {
    console.info(`[OTP dev] Code for ${normalized}: ${code}`);
  }
  return { sent: true };
};
const verifyOtp$3 = async ({ phone, code }, context) => {
  const normalized = phone.replace(/\s+/g, "").trim();
  const now = /* @__PURE__ */ new Date();
  const record = await context.entities.OtpVerification.findFirst({
    where: {
      phone: normalized,
      verifiedAt: null,
      expiresAt: { gte: now },
      attempts: { lt: MAX_OTP_ATTEMPTS }
    },
    orderBy: { createdAt: "desc" }
  });
  if (!record) throw new HttpError(400, "No valid OTP found. Please request a new code.");
  await context.entities.OtpVerification.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } }
  });
  if (record.codeHash !== hashOtp(code)) {
    throw new HttpError(400, "Incorrect verification code.");
  }
  await context.entities.OtpVerification.update({
    where: { id: record.id },
    data: { verifiedAt: now }
  });
  return { verified: true };
};
const submitReview$2 = async ({ providerId, serviceRequestId, rating, title, body }, context) => {
  if (!context.user) throw new HttpError(401);
  if (rating < 1 || rating > 5) throw new HttpError(400, "Rating must be 1\u20135.");
  if (!body.trim()) throw new HttpError(400, "Review body is required.");
  if (serviceRequestId) {
    const existing = await context.entities.Review.findFirst({
      where: {
        consumerId: context.user.id,
        serviceRequestId
      }
    });
    if (existing) throw new HttpError(409, "You have already reviewed this service request.");
  }
  const review = await context.entities.Review.create({
    data: {
      providerId,
      consumerId: context.user.id,
      serviceRequestId: serviceRequestId || void 0,
      rating,
      title: title?.trim() || void 0,
      body: body.trim(),
      status: "PENDING"
      // enters admin moderation queue before publishing
    }
  });
  const agg = await context.entities.Review.aggregate({
    where: { providerId, status: "PUBLISHED" },
    _avg: { rating: true }
  });
  await context.entities.Provider.update({
    where: { id: providerId },
    data: { ratingInternal: agg._avg.rating ?? void 0 }
  });
  return review;
};
const getReviewsForProvider$2 = async ({ providerId }, context) => {
  return context.entities.Review.findMany({
    where: { providerId, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50
  });
};
const getMessagesForRequest$2 = async ({ requestId }, context) => {
  if (!context.user) throw new HttpError(401);
  const request = await context.entities.ServiceRequest.findFirst({
    where: {
      id: requestId,
      OR: [
        { consumerId: context.user.id },
        { assignedProvider: { userId: context.user.id } }
      ]
    },
    select: {
      id: true,
      name: true,
      status: true,
      assignedProvider: {
        select: { id: true, businessName: true, slug: true }
      }
    }
  });
  if (!request) throw new HttpError(404, "Request not found.");
  const messages = await context.entities.CommunicationLog.findMany({
    where: {
      serviceRequestId: requestId,
      channel: "INTERNAL_NOTE"
    },
    orderBy: { createdAt: "asc" }
  });
  return { messages, request };
};
const getMyReferral$2 = async (_args, context) => {
  if (!context.user) throw new HttpError(401);
  const userId = context.user.id;
  const existing = await context.entities.Referral.findFirst({
    where: { referrerUserId: userId }
  });
  if (existing) return existing;
  const code = `REF-${userId.slice(-6).toUpperCase()}`;
  return context.entities.Referral.create({
    data: {
      referrerUserId: userId,
      referralCode: code,
      status: "CREATED"
    }
  });
};
const applyReferralCode$2 = async ({ code }, context) => {
  if (!context.user) throw new HttpError(401);
  const userId = context.user.id;
  const referral = await context.entities.Referral.findUnique({
    where: { referralCode: code.trim().toUpperCase() }
  });
  if (!referral) return { success: false, message: "Invalid referral code." };
  if (referral.referrerUserId === userId)
    return { success: false, message: "You cannot use your own referral code." };
  if (referral.referredUserId)
    return { success: false, message: "This referral code has already been used." };
  await context.entities.Referral.update({
    where: { id: referral.id },
    data: { referredUserId: userId, status: "SIGNED_UP" }
  });
  return { success: true, message: "Referral applied! You'll both earn rewards after your first service." };
};
const saveGuestRequest$2 = async (args, context) => {
  if (!context.user) throw new HttpError(401, "Not authenticated");
  const userId = context.user.id;
  await context.entities.User.update({
    where: { id: userId },
    data: {
      firstName: args.firstName,
      phone: args.phone,
      postalCode: args.postalCode,
      role: "CONSUMER",
      smsConsent: args.smsConsent,
      smsConsentAt: args.smsConsent ? /* @__PURE__ */ new Date() : void 0
    }
  });
  const request = await context.entities.ServiceRequest.create({
    data: {
      consumerId: userId,
      name: args.firstName,
      phone: args.phone,
      postalCode: args.postalCode,
      email: context.user.email ?? void 0,
      smsConsentGiven: args.smsConsent,
      serviceCategoryId: args.serviceCategoryId ?? null,
      description: args.description,
      qualifierAnswers: args.qualifierAnswers ?? {},
      source: "WEBSITE"
    }
  });
  await context.entities.RewardAccount.upsert({
    where: { consumerId: userId },
    update: {},
    create: { consumerId: userId }
  });
  const existing = await context.entities.RewardTransaction.findFirst({
    where: { consumerId: userId, type: "SIGNUP_BONUS" }
  });
  if (!existing) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: userId,
        type: "SIGNUP_BONUS",
        points: 100,
        status: "APPROVED",
        reason: "Welcome bonus"
      }
    });
    await context.entities.RewardAccount.update({
      where: { consumerId: userId },
      data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } }
    });
  }
  if (args.referralCode) {
    const code = args.referralCode.trim().toUpperCase();
    const referral = await context.entities.Referral.findUnique({ where: { referralCode: code } });
    if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
      await context.entities.Referral.update({
        where: { id: referral.id },
        data: { referredUserId: userId, status: "SIGNED_UP" }
      });
    }
  }
  return { requestId: request.id };
};
const getProviderSlugById$2 = async ({ id }, context) => {
  const provider = await context.entities.Provider.findUnique({
    where: { id },
    select: { slug: true }
  });
  return { slug: provider?.slug ?? null };
};

async function redeemPoints$1(args, context) {
  return redeemPoints$2(args, {
    ...context,
    entities: {
      RewardAccount: dbClient.rewardAccount,
      RewardTransaction: dbClient.rewardTransaction,
      Redemption: dbClient.redemption
    }
  });
}

var redeemPoints = createAction(redeemPoints$1);

async function saveGuestRequest$1(args, context) {
  return saveGuestRequest$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      User: dbClient.user,
      RewardAccount: dbClient.rewardAccount,
      RewardTransaction: dbClient.rewardTransaction,
      Referral: dbClient.referral
    }
  });
}

var saveGuestRequest = createAction(saveGuestRequest$1);

async function submitServiceRequest$1(args, context) {
  return submitServiceRequest$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      ServiceCategory: dbClient.serviceCategory,
      RewardTransaction: dbClient.rewardTransaction,
      RewardAccount: dbClient.rewardAccount,
      Provider: dbClient.provider,
      WebhookLog: dbClient.webhookLog
    }
  });
}

var submitServiceRequest = createAction(submitServiceRequest$1);

async function submitLead$1(args, context) {
  return submitLead$2(args, {
    ...context,
    entities: {
      Lead: dbClient.lead
    }
  });
}

var submitLead = createAction(submitLead$1);

async function sendCustomerMessage$1(args, context) {
  return sendCustomerMessage$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      CommunicationLog: dbClient.communicationLog,
      Provider: dbClient.provider
    }
  });
}

var sendCustomerMessage = createAction(sendCustomerMessage$1);

async function sendOtp$1(args, context) {
  return sendOtp$2(args, {
    ...context,
    entities: {
      OtpVerification: dbClient.otpVerification
    }
  });
}

var sendOtp = createAction(sendOtp$1);

async function verifyOtp$2(args, context) {
  return verifyOtp$3(args, {
    ...context,
    entities: {
      OtpVerification: dbClient.otpVerification
    }
  });
}

var verifyOtp$1 = createAction(verifyOtp$2);

async function submitReview$1(args, context) {
  return submitReview$2(args, {
    ...context,
    entities: {
      Review: dbClient.review,
      Provider: dbClient.provider,
      ServiceRequest: dbClient.serviceRequest
    }
  });
}

var submitReview = createAction(submitReview$1);

async function applyReferralCode$1(args, context) {
  return applyReferralCode$2(args, {
    ...context,
    entities: {
      Referral: dbClient.referral
    }
  });
}

var applyReferralCode = createAction(applyReferralCode$1);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/*",
  "video/quicktime",
  "video/mp4"
];

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION ?? "auto",
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY
  },
  // R2 requires a custom endpoint; falls back to AWS if not set
  ...process.env.AWS_S3_ENDPOINT ? {
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: false
  } : {}
});
const getUploadFileSignedURLFromS3 = async ({
  fileName,
  fileType,
  userId
}) => {
  const s3Key = getS3Key(fileName, userId);
  const { url: s3UploadUrl, fields: s3UploadFields } = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: s3Key,
    Conditions: [["content-length-range", 0, MAX_FILE_SIZE_BYTES]],
    Fields: {
      "Content-Type": fileType
    },
    Expires: 3600
  });
  return { s3UploadUrl, s3Key, s3UploadFields };
};
const getDownloadFileSignedURLFromS3 = async ({
  s3Key
}) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: s3Key
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
const deleteFileFromS3 = async ({ s3Key }) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: s3Key
  });
  await s3Client.send(command);
};
const checkFileExistsInS3 = async ({ s3Key }) => {
  const command = new HeadObjectCommand({
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: s3Key
  });
  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};
function getS3Key(fileName, userId) {
  const ext = path.extname(fileName).slice(1);
  return `${userId}/${randomUUID()}.${ext}`;
}

const requireProvider = async (context) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id }
  });
  if (!provider) throw new HttpError(403, "Provider profile required.");
  return provider;
};
const getProviderLeads$2 = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.ServiceRequest.findMany({
    where: {
      assignedProviderId: provider.id,
      status: { in: ["ASSIGNED", "ACCEPTED_BY_PROVIDER", "BOOKED"] }
    },
    orderBy: { createdAt: "desc" }
  });
};
const getProviderAppointments$2 = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.Appointment.findMany({
    where: { providerId: provider.id },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    include: {
      serviceRequest: {
        include: {
          communicationLogs: { orderBy: { createdAt: "asc" } },
          assignedProvider: true,
          serviceCategory: true
        }
      }
    }
  });
};
const getProviderProfile$2 = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
    include: { categories: { include: { serviceCategory: true } } }
  });
  if (!provider) throw new HttpError(404, "Profile not found.");
  return provider;
};
const getProviderFees$2 = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.ProviderFee.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" }
  });
};
const acceptServiceRequest$2 = async ({ requestId }, context) => {
  const provider = await requireProvider(context);
  const req = await context.entities.ServiceRequest.findUnique({
    where: { id: requestId }
  });
  if (!req || req.assignedProviderId !== provider.id)
    throw new HttpError(403, "Invalid request.");
  await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: { status: "ACCEPTED_BY_PROVIDER" }
  });
  const appointment = await context.entities.Appointment.create({
    data: {
      serviceRequestId: requestId,
      providerId: provider.id,
      consumerId: req.consumerId,
      status: "PROPOSED"
    }
  });
  if (req.consumerId) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: req.consumerId,
        serviceRequestId: requestId,
        type: "BOOKED_APPOINTMENT",
        points: 500,
        status: "PENDING",
        reason: "Appointment booked \u2014 $5 reward pending"
      }
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: req.consumerId },
      create: {
        consumerId: req.consumerId,
        pointsBalance: 0,
        lifetimePoints: 0
      },
      update: {}
    });
  }
  return appointment;
};
const normalizeStringArray = (values) => [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
const createProviderProfile$2 = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const existing = await context.entities.Provider.findUnique({
    where: { userId: context.user.id }
  });
  if (existing) {
    throw new HttpError(409, "Provider profile already exists.");
  }
  if (!args.businessName?.trim()) {
    throw new HttpError(400, "Business name is required.");
  }
  if (!args.phone?.trim()) {
    throw new HttpError(400, "Phone number is required.");
  }
  return context.entities.Provider.create({
    data: {
      userId: context.user.id,
      businessName: args.businessName.trim(),
      contactName: args.contactName,
      phone: args.phone.trim(),
      email: args.email ?? context.user.email,
      website: args.website,
      serviceAreas: args.serviceAreas ?? [],
      verificationStatus: "PENDING"
    }
  });
};
const submitProviderApplication$2 = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const businessName = args.businessName.trim();
  const contactName = args.contactName.trim();
  const phone = args.phone.trim();
  const email = args.email.trim();
  const website = args.website?.trim() || null;
  const serviceAreas = normalizeStringArray(args.serviceAreas);
  const calComUsername = args.calComUsername?.trim() || null;
  const serviceCategorySlugs = normalizeStringArray(args.serviceCategorySlugs);
  if (!businessName) throw new HttpError(400, "Business name is required.");
  if (!contactName) throw new HttpError(400, "Contact name is required.");
  if (!phone) throw new HttpError(400, "Phone is required.");
  if (!email) throw new HttpError(400, "Email is required.");
  if (serviceAreas.length === 0) {
    throw new HttpError(400, "At least one service area is required.");
  }
  const provider = await context.entities.Provider.upsert({
    where: { userId: context.user.id },
    update: {
      businessName,
      contactName,
      phone,
      email,
      website,
      serviceAreas,
      calComUsername,
      verificationStatus: "PENDING",
      active: true
    },
    create: {
      userId: context.user.id,
      businessName,
      contactName,
      phone,
      email,
      website,
      serviceAreas,
      calComUsername,
      verificationStatus: "PENDING",
      active: true
    }
  });
  await context.entities.User.update({
    where: { id: context.user.id },
    data: { role: "PROVIDER", phone }
  });
  if (serviceCategorySlugs.length > 0) {
    const categories = await context.entities.ServiceCategory.findMany({
      where: { slug: { in: serviceCategorySlugs }, active: true },
      select: { id: true }
    });
    await context.entities.ProviderCategory.deleteMany({
      where: { providerId: provider.id }
    });
    if (categories.length > 0) {
      await context.entities.ProviderCategory.createMany({
        data: categories.map((category) => ({
          providerId: provider.id,
          serviceCategoryId: category.id
        })),
        skipDuplicates: true
      });
    }
  }
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  for (const adminEmail of adminEmails) {
    emailSender.send({
      to: adminEmail,
      subject: `New provider application: ${businessName}`,
      text: `A new provider application was submitted.

Business: ${businessName}
Contact: ${contactName}
Phone: ${phone}
Email: ${email}
Areas: ${serviceAreas.join(", ")}

Review: https://thehelper.ca/admin/providers`,
      html: `<p>A new provider application was submitted.</p><ul><li><strong>Business:</strong> ${businessName}</li><li><strong>Contact:</strong> ${contactName}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${email}</li><li><strong>Areas:</strong> ${serviceAreas.join(", ")}</li></ul><p><a href="https://thehelper.ca/admin/providers">Review in admin \u2192</a></p>`
    }).catch(() => {
    });
  }
  return provider;
};
const updateProviderProfile$2 = async (args, context) => {
  const provider = await requireProvider(context);
  if (args.businessName !== void 0 && args.businessName.trim() === "") {
    throw new HttpError(400, "Business name cannot be empty.");
  }
  if (args.phone !== void 0 && args.phone.trim() === "") {
    throw new HttpError(400, "Phone cannot be empty.");
  }
  const data = {};
  if (args.businessName !== void 0)
    data.businessName = args.businessName.trim();
  if (args.contactName !== void 0) data.contactName = args.contactName;
  if (args.phone !== void 0) data.phone = args.phone.trim();
  if (args.email !== void 0) data.email = args.email;
  if (args.website !== void 0) data.website = args.website;
  if (args.serviceAreas !== void 0) data.serviceAreas = args.serviceAreas;
  if (args.calComUsername !== void 0) data.calComUsername = args.calComUsername || null;
  if (args.slug !== void 0) {
    const slug = args.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    data.slug = slug || null;
  }
  if (args.bio !== void 0) data.bio = args.bio || null;
  if (args.profilePhotoUrl !== void 0) data.profilePhotoUrl = args.profilePhotoUrl || null;
  if (args.portfolioJson !== void 0) data.portfolioJson = args.portfolioJson;
  if (args.accreditationsJson !== void 0) data.accreditationsJson = args.accreditationsJson;
  if (args.responseTimeMins !== void 0) data.responseTimeMins = args.responseTimeMins || null;
  return context.entities.Provider.update({
    where: { id: provider.id },
    data
  });
};
const markJobCompleted$2 = async ({ appointmentId }, context) => {
  const provider = await requireProvider(context);
  const appt = await context.entities.Appointment.findUnique({
    where: { id: appointmentId }
  });
  if (!appt || appt.providerId !== provider.id) throw new HttpError(403);
  if (appt.status === "COMPLETED") return appt;
  const completedAt = /* @__PURE__ */ new Date();
  const updatedAppt = await context.entities.Appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED", completedAt }
  });
  await context.entities.ServiceRequest.update({
    where: { id: appt.serviceRequestId },
    data: { status: "COMPLETED", completedAt }
  });
  if (appt.consumerId) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: appt.consumerId,
        serviceRequestId: appt.serviceRequestId,
        type: "COMPLETED_SERVICE",
        points: 5e3,
        status: "PENDING",
        reason: "Job completed \u2014 $50 reward pending admin verification"
      }
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: appt.consumerId },
      create: {
        consumerId: appt.consumerId,
        pointsBalance: 0,
        lifetimePoints: 0
      },
      update: {}
    });
    const referral = await context.entities.Referral.findFirst({
      where: { referredUserId: appt.consumerId, status: "SIGNED_UP" }
    });
    if (referral) {
      await context.entities.RewardTransaction.create({
        data: {
          consumerId: appt.consumerId,
          type: "REFERRAL",
          points: 500,
          status: "APPROVED",
          reason: "Referral bonus \u2014 first service completed"
        }
      });
      await context.entities.RewardAccount.upsert({
        where: { consumerId: appt.consumerId },
        create: { consumerId: appt.consumerId, pointsBalance: 500, lifetimePoints: 500 },
        update: { pointsBalance: { increment: 500 }, lifetimePoints: { increment: 500 } }
      });
      await context.entities.RewardTransaction.create({
        data: {
          consumerId: referral.referrerUserId,
          type: "REFERRAL",
          points: 500,
          status: "APPROVED",
          reason: `Referral bonus \u2014 your referred friend completed their first service`
        }
      });
      await context.entities.RewardAccount.upsert({
        where: { consumerId: referral.referrerUserId },
        create: { consumerId: referral.referrerUserId, pointsBalance: 500, lifetimePoints: 500 },
        update: { pointsBalance: { increment: 500 }, lifetimePoints: { increment: 500 } }
      });
      await context.entities.Referral.update({
        where: { id: referral.id },
        data: { status: "REWARDED", completedAt }
      });
    }
  }
  return updatedAppt;
};
const updateProviderServices$2 = async ({ services }, context) => {
  const provider = await requireProvider(context);
  return context.entities.Provider.update({
    where: { id: provider.id },
    data: { servicesJson: JSON.stringify(services) }
  });
};
const updateProviderAppointment$2 = async (args, context) => {
  const provider = await requireProvider(context);
  const appointment = await context.entities.Appointment.findUnique({
    where: { id: args.appointmentId }
  });
  if (!appointment || appointment.providerId !== provider.id) {
    throw new HttpError(403, "Invalid appointment.");
  }
  if (appointment.status === "COMPLETED") {
    throw new HttpError(400, "Completed appointments cannot be rescheduled.");
  }
  const data = {};
  if (args.scheduledAt !== void 0) {
    const date = new Date(args.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      throw new HttpError(400, "Invalid appointment date.");
    }
    data.scheduledAt = date;
    if (!args.status) data.status = "CONFIRMED";
  }
  if (args.status !== void 0) data.status = args.status;
  if (args.providerNotes !== void 0)
    data.providerNotes = args.providerNotes.trim() || null;
  const updated = await context.entities.Appointment.update({
    where: { id: args.appointmentId },
    data
  });
  const serviceRequest = await context.entities.ServiceRequest.findUnique({
    where: { id: updated.serviceRequestId },
    select: { status: true }
  });
  const terminalStatuses = ["COMPLETED", "CLOSED", "REWARD_APPROVED"];
  const canTransition = serviceRequest && !terminalStatuses.includes(serviceRequest.status);
  if (canTransition) {
    if (updated.status === "CONFIRMED") {
      await context.entities.ServiceRequest.update({
        where: { id: updated.serviceRequestId },
        data: {
          status: "BOOKED",
          bookedAt: updated.scheduledAt || /* @__PURE__ */ new Date()
        }
      });
    } else if (updated.status === "CANCELLED" || updated.status === "NO_SHOW") {
      await context.entities.ServiceRequest.update({
        where: { id: updated.serviceRequestId },
        data: { status: "CLOSED" }
      });
    }
  }
  return updated;
};
const sendProviderMessage$2 = async ({ requestId, body }, context) => {
  const provider = await requireProvider(context);
  const trimmedBody = body.trim();
  if (trimmedBody.length < 1) {
    throw new HttpError(400, "Message cannot be empty.");
  }
  if (trimmedBody.length > 1e3) {
    throw new HttpError(400, "Message must be 1,000 characters or fewer.");
  }
  const serviceRequest = await context.entities.ServiceRequest.findFirst({
    where: {
      id: requestId,
      OR: [
        { assignedProviderId: provider.id },
        { appointments: { some: { providerId: provider.id } } }
      ]
    }
  });
  if (!serviceRequest) {
    throw new HttpError(404, "Service request not found.");
  }
  const log = await context.entities.CommunicationLog.create({
    data: {
      userId: context.user.id,
      serviceRequestId: serviceRequest.id,
      providerId: provider.id,
      channel: "INTERNAL_NOTE",
      direction: "OUTBOUND",
      from: provider.businessName,
      to: serviceRequest.email || serviceRequest.name || "Customer",
      body: trimmedBody,
      status: "SENT"
    }
  });
  if (serviceRequest.email) {
    emailSender.send({
      to: serviceRequest.email,
      subject: `New message from ${provider.businessName}`,
      text: `Hi ${serviceRequest.name},

${provider.businessName} sent you a message on TheHelper:

"${trimmedBody}"

View the thread:
https://thehelper.ca/my-requests/${serviceRequest.id}/messages

The TheHelper Team`,
      html: `<p>Hi ${serviceRequest.name},</p><p><strong>${provider.businessName}</strong> sent you a message on TheHelper:</p><blockquote>${trimmedBody}</blockquote><p><a href="https://thehelper.ca/my-requests/${serviceRequest.id}/messages">View the thread</a></p>`
    }).catch((err) => {
      console.warn("[sendProviderMessage] email notification failed:", err.message);
    });
  }
  return log;
};
const getPublicLeadFeed$2 = async ({ categorySlug, urgency, limit = 20, offset = 0 }, context) => {
  const provider = await requireProvider(context);
  const providerCats = await context.entities.ProviderCategory.findMany({
    where: { providerId: provider.id },
    include: { serviceCategory: true }
  });
  const proSlugs = providerCats.map((pc) => pc.serviceCategory.slug);
  const where = {
    status: { in: ["NEW", "QUALIFYING", "QUALIFIED"] }
  };
  if (categorySlug) {
    where.serviceCategory = { slug: categorySlug };
  } else if (proSlugs.length > 0) {
    where.serviceCategory = { slug: { in: proSlugs } };
  }
  if (urgency) {
    where.urgency = urgency;
  }
  const requests = await context.entities.ServiceRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 50),
    skip: offset,
    include: { serviceCategory: true }
  });
  return requests.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    serviceCategory: r.serviceCategory ? { name: r.serviceCategory.name, slug: r.serviceCategory.slug } : null,
    postalCode: r.postalCode,
    city: r.city,
    urgency: r.urgency,
    description: r.description.length > 200 ? r.description.substring(0, 200) + "\u2026" : r.description,
    estimatedSchedule: r.estimatedSchedule,
    status: r.status,
    claimed: !!r.assignedProviderId
  }));
};
const claimLead$2 = async ({ requestId }, context) => {
  const provider = await requireProvider(context);
  if (provider.verificationStatus !== "VERIFIED") {
    throw new HttpError(403, "Only verified providers can claim leads.");
  }
  const req = await context.entities.ServiceRequest.findUnique({
    where: { id: requestId }
  });
  if (!req) throw new HttpError(404, "Lead not found.");
  if (req.assignedProviderId === provider.id) {
    return { request: req, alreadyClaimed: true };
  }
  if (req.assignedProviderId && req.assignedProviderId !== provider.id) {
    throw new HttpError(409, "This lead has already been claimed by another provider.");
  }
  const [updated] = await dbClient.$transaction(async (tx) => {
    const updateResult = await tx.serviceRequest.update({
      where: { id: requestId },
      data: {
        assignedProviderId: provider.id,
        status: "ASSIGNED"
      }
    });
    await tx.providerFee.create({
      data: {
        providerId: provider.id,
        serviceRequestId: requestId,
        feeType: "QUALIFIED_LEAD",
        amount: 5,
        status: "PENDING"
      }
    });
    await tx.communicationLog.create({
      data: {
        providerId: provider.id,
        serviceRequestId: requestId,
        channel: "INTERNAL_NOTE",
        direction: "OUTBOUND",
        from: provider.businessName,
        to: req.email || req.name || "Customer",
        body: "Lead claimed \u2014 contact details now available.",
        status: "DELIVERED"
      }
    });
    return [updateResult];
  });
  if (req.email) {
    emailSender.send({
      to: req.email,
      subject: `${provider.businessName} is interested in your request`,
      text: `Hi ${req.name},

${provider.businessName} has responded to your service request on TheHelper and is ready to help.

Log in to view their message and contact details:
https://thehelper.ca/my-requests/${requestId}/messages

The TheHelper Team`,
      html: `<p>Hi ${req.name},</p><p><strong>${provider.businessName}</strong> has responded to your service request on TheHelper and is ready to help.</p><p><a href="https://thehelper.ca/my-requests/${requestId}/messages">View their message</a></p><p>The TheHelper Team</p>`
    }).catch((err) => {
      console.warn("[claimLead] email notification failed:", err.message);
    });
  }
  return { request: updated, alreadyClaimed: false };
};
const getPublicProvider$2 = async ({ slug }, context) => {
  const provider = await context.entities.Provider.findFirst({
    where: { slug, active: true, verificationStatus: "VERIFIED" },
    include: {
      categories: { include: { serviceCategory: true } },
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 30
      }
    }
  });
  return provider;
};
const resubmitProviderApplication$2 = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id }
  });
  if (!provider) throw new HttpError(404, "Provider profile not found.");
  if (provider.verificationStatus !== "REJECTED") {
    throw new HttpError(400, "Only rejected applications can be resubmitted.");
  }
  const updated = await context.entities.Provider.update({
    where: { id: provider.id },
    data: { verificationStatus: "PENDING" }
  });
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  for (const adminEmail of adminEmails) {
    emailSender.send({
      to: adminEmail,
      subject: `Provider resubmission: ${provider.businessName}`,
      text: `A provider has resubmitted their application.

Business: ${provider.businessName}
Email: ${context.user.email ?? "N/A"}

Review: https://thehelper.ca/admin/providers`,
      html: `<p>A provider has resubmitted their application.</p><p><strong>Business:</strong> ${provider.businessName}</p><p><strong>Email:</strong> ${context.user.email ?? "N/A"}</p><p><a href="https://thehelper.ca/admin/providers">Review in admin \u2192</a></p>`
    }).catch(() => {
    });
  }
  return updated;
};
const MAX_PORTFOLIO = 12;
const publicUrl = (s3Key) => `${process.env.R2_PUBLIC_URL}/${s3Key}`;
async function getMyProvider(context) {
  if (!context.user) throw new HttpError(401, "Not authorized");
  const provider = await context.entities.Provider.findFirst({ where: { userId: context.user.id } });
  if (!provider) throw new HttpError(404, "Provider profile not found");
  return provider;
}
const addPortfolioPhoto$2 = async ({ s3Key, caption }, context) => {
  const provider = await getMyProvider(context);
  const exists = await checkFileExistsInS3({ s3Key });
  if (!exists) throw new HttpError(404, "Uploaded file not found in storage");
  const portfolio = provider.portfolioJson ? JSON.parse(provider.portfolioJson) : [];
  if (portfolio.length >= MAX_PORTFOLIO) {
    throw new HttpError(400, `Maximum ${MAX_PORTFOLIO} photos allowed`);
  }
  portfolio.push({ url: publicUrl(s3Key), ...caption ? { caption } : {} });
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { portfolioJson: JSON.stringify(portfolio) }
  });
  return portfolio;
};
const removePortfolioPhoto$2 = async ({ url }, context) => {
  const provider = await getMyProvider(context);
  const portfolio = provider.portfolioJson ? JSON.parse(provider.portfolioJson) : [];
  const next = portfolio.filter((p) => p.url !== url);
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { portfolioJson: JSON.stringify(next) }
  });
  if (process.env.R2_PUBLIC_URL && url.startsWith(process.env.R2_PUBLIC_URL)) {
    const s3Key = url.slice(process.env.R2_PUBLIC_URL.length + 1);
    try {
      await deleteFileFromS3({ s3Key });
    } catch {
    }
  }
  return next;
};
const setProfilePhoto$2 = async ({ url }, context) => {
  const provider = await getMyProvider(context);
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { profilePhotoUrl: url }
  });
  return { profilePhotoUrl: url };
};

async function addPortfolioPhoto$1(args, context) {
  return addPortfolioPhoto$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var addPortfolioPhoto = createAction(addPortfolioPhoto$1);

async function removePortfolioPhoto$1(args, context) {
  return removePortfolioPhoto$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var removePortfolioPhoto = createAction(removePortfolioPhoto$1);

async function setProfilePhoto$1(args, context) {
  return setProfilePhoto$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var setProfilePhoto = createAction(setProfilePhoto$1);

async function acceptServiceRequest$1(args, context) {
  return acceptServiceRequest$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Appointment: dbClient.appointment,
      ProviderFee: dbClient.providerFee,
      Provider: dbClient.provider,
      RewardTransaction: dbClient.rewardTransaction,
      RewardAccount: dbClient.rewardAccount
    }
  });
}

var acceptServiceRequest = createAction(acceptServiceRequest$1);

async function markJobCompleted$1(args, context) {
  return markJobCompleted$2(args, {
    ...context,
    entities: {
      Appointment: dbClient.appointment,
      ServiceRequest: dbClient.serviceRequest,
      RewardTransaction: dbClient.rewardTransaction,
      RewardAccount: dbClient.rewardAccount,
      ProviderFee: dbClient.providerFee,
      Provider: dbClient.provider,
      Referral: dbClient.referral
    }
  });
}

var markJobCompleted = createAction(markJobCompleted$1);

async function submitProviderApplication$1(args, context) {
  return submitProviderApplication$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      Provider: dbClient.provider,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var submitProviderApplication = createAction(submitProviderApplication$1);

async function updateProviderServices$1(args, context) {
  return updateProviderServices$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var updateProviderServices = createAction(updateProviderServices$1);

async function createProviderProfile$1(args, context) {
  return createProviderProfile$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var createProviderProfile = createAction(createProviderProfile$1);

async function updateProviderAppointment$1(args, context) {
  return updateProviderAppointment$2(args, {
    ...context,
    entities: {
      Appointment: dbClient.appointment,
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider
    }
  });
}

var updateProviderAppointment = createAction(updateProviderAppointment$1);

async function sendProviderMessage$1(args, context) {
  return sendProviderMessage$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      CommunicationLog: dbClient.communicationLog,
      Provider: dbClient.provider
    }
  });
}

var sendProviderMessage = createAction(sendProviderMessage$1);

async function updateProviderProfile$1(args, context) {
  return updateProviderProfile$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var updateProviderProfile = createAction(updateProviderProfile$1);

async function resubmitProviderApplication$1(args, context) {
  return resubmitProviderApplication$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var resubmitProviderApplication = createAction(resubmitProviderApplication$1);

async function claimLead$1(args, context) {
  return claimLead$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider,
      ProviderFee: dbClient.providerFee,
      CommunicationLog: dbClient.communicationLog
    }
  });
}

var claimLead = createAction(claimLead$1);

const requireAdmin = (context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Admin access required.");
  }
};
const getAdminRequests$2 = async (args, context) => {
  requireAdmin(context);
  return context.entities.ServiceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { consumer: true, assignedProvider: true }
  });
};
const getAdminProviders$2 = async (args, context) => {
  requireAdmin(context);
  return context.entities.Provider.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });
};
const getAdminRewards$2 = async (args, context) => {
  requireAdmin(context);
  return context.entities.RewardTransaction.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { consumer: true, serviceRequest: true }
  });
};
const approveProvider$2 = async ({ providerId }, context) => {
  requireAdmin(context);
  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId },
    include: { user: true }
  });
  if (!provider) throw new HttpError(404, "Provider not found.");
  const updated = await context.entities.Provider.update({
    where: { id: providerId },
    data: { verificationStatus: "VERIFIED" }
  });
  const userEmail = provider.email ?? provider.user?.email;
  if (userEmail) {
    await emailSender.send({
      to: userEmail,
      subject: `Your The Helper Pro account is verified!`,
      html: `
        <h2>Great news, ${provider.businessName}!</h2>
        <p>Your provider application has been approved and your account is now <strong>verified</strong>.</p>
        <p>You can now log in to your dashboard and start receiving job leads.</p>
        <p><a href="${process.env.APP_URL ?? "https://thehelper.ca"}/provider/dashboard">Go to your dashboard \u2192</a></p>
      `,
      text: `Great news! Your The Helper Pro account is verified. Log in at ${process.env.APP_URL ?? "https://thehelper.ca"}/provider/dashboard`
    });
  }
  return updated;
};
const rejectProvider$2 = async ({ providerId, reason }, context) => {
  requireAdmin(context);
  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId },
    include: { user: true }
  });
  if (!provider) throw new HttpError(404, "Provider not found.");
  const updated = await context.entities.Provider.update({
    where: { id: providerId },
    data: { verificationStatus: "REJECTED" }
  });
  const userEmail = provider.email ?? provider.user?.email;
  if (userEmail) {
    const reasonText = reason ? `Reason: ${reason}` : "If you have questions, please contact us at support@thehelper.ca.";
    await emailSender.send({
      to: userEmail,
      subject: `Update on your The Helper Pro application`,
      html: `
        <h2>Hello ${provider.businessName},</h2>
        <p>Thank you for applying to join The Helper Pro network.</p>
        <p>After review, we're unable to approve your application at this time.</p>
        <p>${reasonText}</p>
        <p>You are welcome to apply again in the future.</p>
      `,
      text: `Thank you for applying to The Helper Pro. After review, we are unable to approve your application at this time. ${reasonText}`
    });
  }
  return updated;
};
const assignRequestToProvider$2 = async ({ requestId, providerId }, context) => {
  requireAdmin(context);
  return context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: {
      assignedProviderId: providerId,
      status: "ASSIGNED"
    }
  });
};
const approveRewardTransaction$2 = async ({ transactionId }, context) => {
  requireAdmin(context);
  const transaction = await context.entities.RewardTransaction.findUnique({
    where: { id: transactionId }
  });
  if (!transaction) throw new HttpError(404, "Reward transaction not found");
  const updated = await context.entities.RewardTransaction.update({
    where: { id: transactionId },
    data: {
      status: "APPROVED",
      approvedAt: /* @__PURE__ */ new Date(),
      approvedByAdminId: context.user.id
    }
  });
  const isEarning = transaction.points > 0;
  await context.entities.RewardAccount.upsert({
    where: { consumerId: transaction.consumerId },
    create: {
      consumerId: transaction.consumerId,
      pointsBalance: transaction.points,
      lifetimePoints: isEarning ? transaction.points : 0
    },
    update: {
      pointsBalance: { increment: transaction.points },
      ...isEarning ? { lifetimePoints: { increment: transaction.points } } : {}
    }
  });
  if (transaction.serviceRequestId) {
    await context.entities.ServiceRequest.update({
      where: { id: transaction.serviceRequestId },
      data: { rewardStatus: "APPROVED" }
    });
  }
  return updated;
};
const rejectRewardTransaction$2 = async ({ transactionId }, context) => {
  requireAdmin(context);
  const transaction = await context.entities.RewardTransaction.findUnique({
    where: { id: transactionId }
  });
  if (!transaction) throw new HttpError(404, "Reward transaction not found");
  if (transaction.status !== "PENDING") {
    throw new HttpError(400, "Only pending transactions can be rejected");
  }
  return context.entities.RewardTransaction.update({
    where: { id: transactionId },
    data: {
      status: "REJECTED",
      approvedByAdminId: context.user.id
    }
  });
};
const getAdminLeads$2 = async (_args, context) => {
  requireAdmin(context);
  return context.entities.Lead.findMany({
    orderBy: { createdAt: "desc" }
  });
};
const updateLead$2 = async ({ leadId, status, assignedTo, notes }, context) => {
  requireAdmin(context);
  const data = {};
  if (status !== void 0) data.status = status;
  if (assignedTo !== void 0) data.assignedTo = assignedTo;
  if (notes !== void 0) data.notes = notes;
  return context.entities.Lead.update({
    where: { id: leadId },
    data
  });
};
const getAdminCategories$2 = async (_args, context) => {
  requireAdmin(context);
  return context.entities.ServiceCategory.findMany({
    where: { parentCategoryId: null },
    orderBy: { name: "asc" }
  });
};
const upsertAdminCategory$2 = async (args, context) => {
  requireAdmin(context);
  const { id, ...data } = args;
  if (id) {
    return context.entities.ServiceCategory.update({ where: { id }, data });
  }
  return context.entities.ServiceCategory.create({ data: { ...data, active: data.active ?? true } });
};
const deleteAdminCategory$2 = async ({ id }, context) => {
  requireAdmin(context);
  return context.entities.ServiceCategory.delete({ where: { id } });
};
const getAdminReviews$2 = async (_args, context) => {
  requireAdmin(context);
  return context.entities.Review.findMany({
    orderBy: { createdAt: "desc" },
    include: { provider: { select: { businessName: true, slug: true } } }
  });
};
const moderateReview$2 = async ({ reviewId, status }, context) => {
  requireAdmin(context);
  const allowed = ["PENDING", "PUBLISHED", "REJECTED"];
  if (!allowed.includes(status)) throw new HttpError(400, "Invalid status.");
  const review = await context.entities.Review.update({
    where: { id: reviewId },
    data: { status }
  });
  const agg = await context.entities.Review.aggregate({
    where: { providerId: review.providerId, status: "PUBLISHED" },
    _avg: { rating: true }
  });
  await context.entities.Provider.update({
    where: { id: review.providerId },
    data: { ratingInternal: agg._avg.rating ?? void 0 }
  });
  return review;
};

async function moderateReview$1(args, context) {
  return moderateReview$2(args, {
    ...context,
    entities: {
      Review: dbClient.review,
      Provider: dbClient.provider
    }
  });
}

var moderateReview = createAction(moderateReview$1);

async function upsertAdminCategory$1(args, context) {
  return upsertAdminCategory$2(args, {
    ...context,
    entities: {
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var upsertAdminCategory = createAction(upsertAdminCategory$1);

async function deleteAdminCategory$1(args, context) {
  return deleteAdminCategory$2(args, {
    ...context,
    entities: {
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var deleteAdminCategory = createAction(deleteAdminCategory$1);

function requireNodeEnvVar(name) {
  const value = process.env[name];
  if (value === void 0) {
    throw new Error(`Env var ${name} is undefined`);
  } else {
    return value;
  }
}

var SubscriptionStatus = /* @__PURE__ */ ((SubscriptionStatus2) => {
  SubscriptionStatus2["PastDue"] = "past_due";
  SubscriptionStatus2["CancelAtPeriodEnd"] = "cancel_at_period_end";
  SubscriptionStatus2["Active"] = "active";
  SubscriptionStatus2["Deleted"] = "deleted";
  return SubscriptionStatus2;
})(SubscriptionStatus || {});
var PaymentPlanId = /* @__PURE__ */ ((PaymentPlanId2) => {
  PaymentPlanId2["Hobby"] = "hobby";
  PaymentPlanId2["Pro"] = "pro";
  PaymentPlanId2["Credits10"] = "credits10";
  return PaymentPlanId2;
})(PaymentPlanId || {});
const paymentPlans = {
  ["hobby" /* Hobby */]: {
    getPaymentProcessorPlanId: () => requireNodeEnvVar("PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" }
  },
  ["pro" /* Pro */]: {
    getPaymentProcessorPlanId: () => requireNodeEnvVar("PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" }
  },
  ["credits10" /* Credits10 */]: {
    getPaymentProcessorPlanId: () => requireNodeEnvVar("PAYMENTS_CREDITS_10_PLAN_ID"),
    effect: { kind: "credits", amount: 10 }
  }
};
function getPaymentPlanIdByPaymentProcessorPlanId(paymentProcessorPlanId) {
  for (const [planId, plan] of Object.entries(paymentPlans)) {
    if (plan.getPaymentProcessorPlanId() === paymentProcessorPlanId) {
      return planId;
    }
  }
  throw new Error(
    `Unknown payment processor plan ID: ${paymentProcessorPlanId}`
  );
}

function ensureArgsSchemaOrThrowHttpError(schema, rawArgs) {
  const parseResult = schema.safeParse(rawArgs);
  if (!parseResult.success) {
    console.warn("Validation failed:", parseResult.error.issues.map((i) => i.path.join(".")).join(", "));
    throw new HttpError(400, "Operation arguments validation failed", {
      errors: parseResult.error.errors
    });
  } else {
    return parseResult.data;
  }
}

const updateUserAdminByIdInputSchema = z.object({
  id: z.string().nonempty(),
  isAdmin: z.boolean()
});
const updateIsUserAdminById$2 = async (rawArgs, context) => {
  const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError(
    updateUserAdminByIdInputSchema,
    rawArgs
  );
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation"
    );
  }
  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation"
    );
  }
  return context.entities.User.update({
    where: { id },
    data: { isAdmin }
  });
};
const updateUserProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  postalCode: z.string().optional(),
  username: z.string().optional()
});
const updateUserProfile$2 = async (rawArgs, context) => {
  const { firstName, lastName, phone, postalCode, username } = ensureArgsSchemaOrThrowHttpError(updateUserProfileInputSchema, rawArgs);
  if (!context.user) {
    throw new HttpError(401, "Authentication required");
  }
  return context.entities.User.update({
    where: { id: context.user.id },
    data: {
      ...firstName !== void 0 && { firstName },
      ...lastName !== void 0 && { lastName },
      ...phone !== void 0 && { phone },
      ...postalCode !== void 0 && { postalCode },
      ...username !== void 0 && { username }
    }
  });
};
const getPaginatorArgsSchema = z.object({
  skipPages: z.number(),
  filter: z.object({
    emailContains: z.string().nonempty().optional(),
    isAdmin: z.boolean().optional(),
    subscriptionStatusIn: z.array(z.nativeEnum(SubscriptionStatus).nullable()).optional()
  })
});
const getPaginatedUsers$2 = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation"
    );
  }
  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation"
    );
  }
  const {
    skipPages,
    filter: {
      subscriptionStatusIn: subscriptionStatus,
      emailContains,
      isAdmin
    }
  } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);
  const includeUnsubscribedUsers = !!subscriptionStatus?.some(
    (status) => status === null
  );
  const desiredSubscriptionStatuses = subscriptionStatus?.filter(
    (status) => status !== null
  );
  const pageSize = 10;
  const userPageQuery = {
    skip: skipPages * pageSize,
    take: pageSize,
    where: {
      AND: [
        {
          email: {
            contains: emailContains,
            mode: "insensitive"
          },
          isAdmin
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: desiredSubscriptionStatuses
              }
            },
            {
              subscriptionStatus: includeUnsubscribedUsers ? null : void 0
            }
          ]
        }
      ]
    },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      subscriptionStatus: true,
      paymentProcessorUserId: true
    },
    orderBy: {
      username: "asc"
    }
  };
  const [pageOfUsers, totalUsers] = await dbClient.$transaction([
    context.entities.User.findMany(userPageQuery),
    context.entities.User.count({ where: userPageQuery.where })
  ]);
  const totalPages = Math.ceil(totalUsers / pageSize);
  return {
    users: pageOfUsers,
    totalPages
  };
};

async function updateIsUserAdminById$1(args, context) {
  return updateIsUserAdminById$2(args, {
    ...context,
    entities: {
      User: dbClient.user
    }
  });
}

var updateIsUserAdminById = createAction(updateIsUserAdminById$1);

async function updateUserProfile$1(args, context) {
  return updateUserProfile$2(args, {
    ...context,
    entities: {
      User: dbClient.user
    }
  });
}

var updateUserProfile = createAction(updateUserProfile$1);

const createFileInputSchema = z.object({
  fileType: z.enum(ALLOWED_FILE_TYPES),
  fileName: z.string().nonempty()
});
const createFileUploadUrl$2 = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { fileType, fileName } = ensureArgsSchemaOrThrowHttpError(
    createFileInputSchema,
    rawArgs
  );
  return await getUploadFileSignedURLFromS3({
    fileType,
    fileName,
    userId: context.user.id
  });
};
z.object({
  s3Key: z.string(),
  fileType: z.enum(ALLOWED_FILE_TYPES),
  fileName: z.string()
});
const addFileToDb$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const fileExists = await checkFileExistsInS3({ s3Key: args.s3Key });
  if (!fileExists) {
    throw new HttpError(404, "File not found in S3.");
  }
  return context.entities.File.create({
    data: {
      name: args.fileName,
      s3Key: args.s3Key,
      type: args.fileType,
      user: { connect: { id: context.user.id } }
    }
  });
};
const getAllFilesByUser$2 = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.File.findMany({
    where: {
      user: {
        id: context.user.id
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
const getDownloadFileSignedURLInputSchema = z.object({
  s3Key: z.string().nonempty()
});
const getDownloadFileSignedURL$2 = async (rawArgs, _context) => {
  const { s3Key } = ensureArgsSchemaOrThrowHttpError(
    getDownloadFileSignedURLInputSchema,
    rawArgs
  );
  return await getDownloadFileSignedURLFromS3({ s3Key });
};
z.object({
  id: z.string()
});
const deleteFile$2 = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const deletedFile = await context.entities.File.delete({
    where: {
      id: args.id,
      user: {
        id: context.user.id
      }
    }
  });
  try {
    await deleteFileFromS3({ s3Key: deletedFile.s3Key });
  } catch (error) {
    console.error(
      `S3 deletion failed. Orphaned file s3Key: ${deletedFile.s3Key}`,
      error
    );
  }
  return deletedFile;
};

async function createFileUploadUrl$1(args, context) {
  return createFileUploadUrl$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      File: dbClient.file
    }
  });
}

var createFileUploadUrl = createAction(createFileUploadUrl$1);

async function addFileToDb$1(args, context) {
  return addFileToDb$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      File: dbClient.file
    }
  });
}

var addFileToDb = createAction(addFileToDb$1);

async function deleteFile$1(args, context) {
  return deleteFile$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      File: dbClient.file
    }
  });
}

var deleteFile = createAction(deleteFile$1);

async function updateLead$1(args, context) {
  return updateLead$2(args, {
    ...context,
    entities: {
      Lead: dbClient.lead
    }
  });
}

var updateLead = createAction(updateLead$1);

async function approveProvider$1(args, context) {
  return approveProvider$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var approveProvider = createAction(approveProvider$1);

async function rejectProvider$1(args, context) {
  return rejectProvider$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var rejectProvider = createAction(rejectProvider$1);

async function assignRequestToProvider$1(args, context) {
  return assignRequestToProvider$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider,
      CommunicationLog: dbClient.communicationLog
    }
  });
}

var assignRequestToProvider = createAction(assignRequestToProvider$1);

async function approveRewardTransaction$1(args, context) {
  return approveRewardTransaction$2(args, {
    ...context,
    entities: {
      RewardTransaction: dbClient.rewardTransaction,
      RewardAccount: dbClient.rewardAccount,
      ServiceRequest: dbClient.serviceRequest
    }
  });
}

var approveRewardTransaction = createAction(approveRewardTransaction$1);

async function rejectRewardTransaction$1(args, context) {
  return rejectRewardTransaction$2(args, {
    ...context,
    entities: {
      RewardTransaction: dbClient.rewardTransaction
    }
  });
}

var rejectRewardTransaction = createAction(rejectRewardTransaction$1);

async function getProviderSlugById$1(args, context) {
  return getProviderSlugById$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider
    }
  });
}

var getProviderSlugById = createQuery(getProviderSlugById$1);

async function getMyRequests$1(args, context) {
  return getMyRequests$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Appointment: dbClient.appointment,
      Provider: dbClient.provider,
      CommunicationLog: dbClient.communicationLog,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getMyRequests = createQuery(getMyRequests$1);

async function getServiceCategories$1(args, context) {
  return getServiceCategories$2(args, {
    ...context,
    entities: {
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getServiceCategories = createQuery(getServiceCategories$1);

async function getProviders$1(args, context) {
  return getProviders$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getProviders = createQuery(getProviders$1);

async function getMyRewardAccount$1(args, context) {
  return getMyRewardAccount$2(args, {
    ...context,
    entities: {
      RewardAccount: dbClient.rewardAccount,
      RewardTransaction: dbClient.rewardTransaction,
      Redemption: dbClient.redemption
    }
  });
}

var getMyRewardAccount = createQuery(getMyRewardAccount$1);

async function getProviderById$1(args, context) {
  return getProviderById$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory,
      Review: dbClient.review
    }
  });
}

var getProviderById = createQuery(getProviderById$1);

async function getConsumerStats$1(args, context) {
  return getConsumerStats$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      RewardAccount: dbClient.rewardAccount,
      RewardTransaction: dbClient.rewardTransaction,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getConsumerStats = createQuery(getConsumerStats$1);

async function getMessagesForRequest$1(args, context) {
  return getMessagesForRequest$2(args, {
    ...context,
    entities: {
      CommunicationLog: dbClient.communicationLog,
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider
    }
  });
}

var getMessagesForRequest = createQuery(getMessagesForRequest$1);

async function getReviewsForProvider$1(args, context) {
  return getReviewsForProvider$2(args, {
    ...context,
    entities: {
      Review: dbClient.review
    }
  });
}

var getReviewsForProvider = createQuery(getReviewsForProvider$1);

async function getMyReferral$1(args, context) {
  return getMyReferral$2(args, {
    ...context,
    entities: {
      Referral: dbClient.referral
    }
  });
}

var getMyReferral = createQuery(getMyReferral$1);

async function getProviderLeads$1(args, context) {
  return getProviderLeads$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider
    }
  });
}

var getProviderLeads = createQuery(getProviderLeads$1);

async function getProviderAppointments$1(args, context) {
  return getProviderAppointments$2(args, {
    ...context,
    entities: {
      Appointment: dbClient.appointment,
      Provider: dbClient.provider,
      ServiceRequest: dbClient.serviceRequest,
      CommunicationLog: dbClient.communicationLog
    }
  });
}

var getProviderAppointments = createQuery(getProviderAppointments$1);

async function getProviderProfile$1(args, context) {
  return getProviderProfile$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getProviderProfile = createQuery(getProviderProfile$1);

async function getProviderFees$1(args, context) {
  return getProviderFees$2(args, {
    ...context,
    entities: {
      ProviderFee: dbClient.providerFee,
      Provider: dbClient.provider
    }
  });
}

var getProviderFees = createQuery(getProviderFees$1);

async function getPublicLeadFeed$1(args, context) {
  return getPublicLeadFeed$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getPublicLeadFeed = createQuery(getPublicLeadFeed$1);

async function getPublicProvider$1(args, context) {
  return getPublicProvider$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider,
      Review: dbClient.review,
      ProviderCategory: dbClient.providerCategory,
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getPublicProvider = createQuery(getPublicProvider$1);

async function getAdminReviews$1(args, context) {
  return getAdminReviews$2(args, {
    ...context,
    entities: {
      Review: dbClient.review,
      Provider: dbClient.provider
    }
  });
}

var getAdminReviews = createQuery(getAdminReviews$1);

async function getAdminCategories$1(args, context) {
  return getAdminCategories$2(args, {
    ...context,
    entities: {
      ServiceCategory: dbClient.serviceCategory
    }
  });
}

var getAdminCategories = createQuery(getAdminCategories$1);

async function getPaginatedUsers$1(args, context) {
  return getPaginatedUsers$2(args, {
    ...context,
    entities: {
      User: dbClient.user
    }
  });
}

var getPaginatedUsers = createQuery(getPaginatedUsers$1);

async function getAllFilesByUser$1(args, context) {
  return getAllFilesByUser$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      File: dbClient.file
    }
  });
}

var getAllFilesByUser = createQuery(getAllFilesByUser$1);

async function getDownloadFileSignedURL$1(args, context) {
  return getDownloadFileSignedURL$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      File: dbClient.file
    }
  });
}

var getDownloadFileSignedURL = createQuery(getDownloadFileSignedURL$1);

const getDailyStats$2 = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation"
    );
  }
  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation"
    );
  }
  const statsQuery = {
    orderBy: {
      date: "desc"
    },
    include: {
      sources: true
    }
  };
  const [dailyStats, weeklyStats] = await dbClient.$transaction([
    context.entities.DailyStats.findFirst(statsQuery),
    context.entities.DailyStats.findMany({ ...statsQuery, take: 7 })
  ]);
  if (!dailyStats) {
    console.log(
      "\x1B[34mNote: No daily stats have been generated by the dailyStatsJob yet. \x1B[0m"
    );
    return null;
  }
  return { dailyStats, weeklyStats };
};

async function getDailyStats$1(args, context) {
  return getDailyStats$2(args, {
    ...context,
    entities: {
      User: dbClient.user,
      DailyStats: dbClient.dailyStats
    }
  });
}

var getDailyStats = createQuery(getDailyStats$1);

async function getAdminRequests$1(args, context) {
  return getAdminRequests$2(args, {
    ...context,
    entities: {
      ServiceRequest: dbClient.serviceRequest,
      Provider: dbClient.provider,
      User: dbClient.user
    }
  });
}

var getAdminRequests = createQuery(getAdminRequests$1);

async function getAdminProviders$1(args, context) {
  return getAdminProviders$2(args, {
    ...context,
    entities: {
      Provider: dbClient.provider,
      User: dbClient.user
    }
  });
}

var getAdminProviders = createQuery(getAdminProviders$1);

async function getAdminRewards$1(args, context) {
  return getAdminRewards$2(args, {
    ...context,
    entities: {
      RewardTransaction: dbClient.rewardTransaction,
      Redemption: dbClient.redemption,
      ServiceRequest: dbClient.serviceRequest,
      User: dbClient.user
    }
  });
}

var getAdminRewards = createQuery(getAdminRewards$1);

async function getAdminLeads$1(args, context) {
  return getAdminLeads$2(args, {
    ...context,
    entities: {
      Lead: dbClient.lead
    }
  });
}

var getAdminLeads = createQuery(getAdminLeads$1);

const router$4 = express.Router();
router$4.post("/complete-onboarding", auth, completeOnboarding);
router$4.post("/redeem-points", auth, redeemPoints);
router$4.post("/save-guest-request", auth, saveGuestRequest);
router$4.post("/submit-service-request", auth, submitServiceRequest);
router$4.post("/submit-lead", auth, submitLead);
router$4.post("/send-customer-message", auth, sendCustomerMessage);
router$4.post("/send-otp", auth, sendOtp);
router$4.post("/verify-otp", auth, verifyOtp$1);
router$4.post("/submit-review", auth, submitReview);
router$4.post("/apply-referral-code", auth, applyReferralCode);
router$4.post("/add-portfolio-photo", auth, addPortfolioPhoto);
router$4.post("/remove-portfolio-photo", auth, removePortfolioPhoto);
router$4.post("/set-profile-photo", auth, setProfilePhoto);
router$4.post("/accept-service-request", auth, acceptServiceRequest);
router$4.post("/mark-job-completed", auth, markJobCompleted);
router$4.post("/submit-provider-application", auth, submitProviderApplication);
router$4.post("/update-provider-services", auth, updateProviderServices);
router$4.post("/create-provider-profile", auth, createProviderProfile);
router$4.post("/update-provider-appointment", auth, updateProviderAppointment);
router$4.post("/send-provider-message", auth, sendProviderMessage);
router$4.post("/update-provider-profile", auth, updateProviderProfile);
router$4.post("/resubmit-provider-application", auth, resubmitProviderApplication);
router$4.post("/claim-lead", auth, claimLead);
router$4.post("/moderate-review", auth, moderateReview);
router$4.post("/upsert-admin-category", auth, upsertAdminCategory);
router$4.post("/delete-admin-category", auth, deleteAdminCategory);
router$4.post("/update-is-user-admin-by-id", auth, updateIsUserAdminById);
router$4.post("/update-user-profile", auth, updateUserProfile);
router$4.post("/create-file-upload-url", auth, createFileUploadUrl);
router$4.post("/add-file-to-db", auth, addFileToDb);
router$4.post("/delete-file", auth, deleteFile);
router$4.post("/update-lead", auth, updateLead);
router$4.post("/approve-provider", auth, approveProvider);
router$4.post("/reject-provider", auth, rejectProvider);
router$4.post("/assign-request-to-provider", auth, assignRequestToProvider);
router$4.post("/approve-reward-transaction", auth, approveRewardTransaction);
router$4.post("/reject-reward-transaction", auth, rejectRewardTransaction);
router$4.post("/get-provider-slug-by-id", auth, getProviderSlugById);
router$4.post("/get-my-requests", auth, getMyRequests);
router$4.post("/get-service-categories", auth, getServiceCategories);
router$4.post("/get-providers", auth, getProviders);
router$4.post("/get-my-reward-account", auth, getMyRewardAccount);
router$4.post("/get-provider-by-id", auth, getProviderById);
router$4.post("/get-consumer-stats", auth, getConsumerStats);
router$4.post("/get-messages-for-request", auth, getMessagesForRequest);
router$4.post("/get-reviews-for-provider", auth, getReviewsForProvider);
router$4.post("/get-my-referral", auth, getMyReferral);
router$4.post("/get-provider-leads", auth, getProviderLeads);
router$4.post("/get-provider-appointments", auth, getProviderAppointments);
router$4.post("/get-provider-profile", auth, getProviderProfile);
router$4.post("/get-provider-fees", auth, getProviderFees);
router$4.post("/get-public-lead-feed", auth, getPublicLeadFeed);
router$4.post("/get-public-provider", auth, getPublicProvider);
router$4.post("/get-admin-reviews", auth, getAdminReviews);
router$4.post("/get-admin-categories", auth, getAdminCategories);
router$4.post("/get-paginated-users", auth, getPaginatedUsers);
router$4.post("/get-all-files-by-user", auth, getAllFilesByUser);
router$4.post("/get-download-file-signed-url", auth, getDownloadFileSignedURL);
router$4.post("/get-daily-stats", auth, getDailyStats);
router$4.post("/get-admin-requests", auth, getAdminRequests);
router$4.post("/get-admin-providers", auth, getAdminProviders);
router$4.post("/get-admin-rewards", auth, getAdminRewards);
router$4.post("/get-admin-leads", auth, getAdminLeads);

const _waspGlobalMiddlewareConfigFn = (mc) => mc;
const defaultGlobalMiddlewareConfig = /* @__PURE__ */ new Map([
  ["helmet", helmet()],
  ["cors", cors({ origin: config$1.allowedCORSOrigins })],
  ["logger", logger("dev")],
  ["express.json", express.json()],
  ["express.urlencoded", express.urlencoded()],
  ["cookieParser", cookieParser()]
]);
const globalMiddlewareConfig = _waspGlobalMiddlewareConfigFn(defaultGlobalMiddlewareConfig);
function globalMiddlewareConfigForExpress(middlewareConfigFn) {
  if (!middlewareConfigFn) {
    return Array.from(globalMiddlewareConfig.values());
  }
  const globalMiddlewareConfigClone = new Map(globalMiddlewareConfig);
  const modifiedMiddlewareConfig = middlewareConfigFn(globalMiddlewareConfigClone);
  return Array.from(modifiedMiddlewareConfig.values());
}

var me = defineHandler(async (req, res) => {
  if (req.user) {
    res.json(serialize(req.user));
  } else {
    res.json(serialize(null));
  }
});

var logout = defineHandler(async (req, res) => {
  if (req.sessionId) {
    await invalidateSession(req.sessionId);
    res.json({ success: true });
  } else {
    throw createInvalidCredentialsError();
  }
});

const onBeforeSignupHook = async (_params) => {
};
const onAfterSignupHook = async (_params) => {
};
const onAfterEmailVerifiedHook = async (_params) => {
};
const onBeforeLoginHook = async (_params) => {
};
const onAfterLoginHook = async (_params) => {
};

function getLoginRoute() {
  return async function login(req, res) {
    const fields = req.body ?? {};
    ensureValidArgs$2(fields);
    const providerId = createProviderId("email", fields.email);
    const authIdentity = await findAuthIdentity(providerId);
    if (!authIdentity) {
      throw createInvalidCredentialsError();
    }
    const providerData = getProviderDataWithPassword(authIdentity.providerData);
    if (!providerData.isEmailVerified) {
      throw createInvalidCredentialsError();
    }
    try {
      await verifyPassword(providerData.hashedPassword, fields.password);
    } catch (e) {
      throw createInvalidCredentialsError();
    }
    const auth = await findAuthWithUserBy({ id: authIdentity.authId });
    if (auth === null) {
      throw createInvalidCredentialsError();
    }
    await onBeforeLoginHook({
      user: auth.user
    });
    const session = await createSession(auth.id);
    await onAfterLoginHook({
      user: auth.user
    });
    res.json({
      sessionId: session.id
    });
  };
}
function ensureValidArgs$2(args) {
  ensureValidEmail(args);
  ensurePasswordIsPresent(args);
}

const JWT_SECRET = new TextEncoder().encode(config$1.auth.jwtSecret);
const JWT_ALGORITHM = "HS256";
const { createJWT, validateJWT } = createJWTHelpers(JWT_SECRET, JWT_ALGORITHM);

async function createEmailVerificationLink(email, clientRoute) {
  const { jwtToken } = await createEmailJWT(email);
  return `${config$1.frontendUrl}${clientRoute}?token=${jwtToken}`;
}
async function createPasswordResetLink(email, clientRoute) {
  const { jwtToken } = await createEmailJWT(email);
  return `${config$1.frontendUrl}${clientRoute}?token=${jwtToken}`;
}
async function createEmailJWT(email) {
  const jwtToken = await createJWT({ email }, { expiresIn: new TimeSpan(30, "m") });
  return { jwtToken };
}
async function sendPasswordResetEmail(email, content) {
  return sendEmailAndSaveMetadata(email, content, {
    passwordResetSentAt: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function sendEmailVerificationEmail(email, content) {
  return sendEmailAndSaveMetadata(email, content, {
    emailVerificationSentAt: (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function sendEmailAndSaveMetadata(email, content, metadata) {
  const providerId = createProviderId("email", email);
  const authIdentity = await findAuthIdentity(providerId);
  if (!authIdentity) {
    throw new Error(`User with email: ${email} not found.`);
  }
  const providerData = getProviderDataWithPassword(authIdentity.providerData);
  await updateAuthIdentityProviderData(providerId, providerData, metadata);
  emailSender.send(content).catch((e) => {
    console.error("Failed to send email", e);
  });
}
function isEmailResendAllowed(fields, field, resendInterval = 1e3 * 60) {
  const sentAt = fields[field];
  if (!sentAt) {
    return {
      isResendAllowed: true,
      timeLeft: 0
    };
  }
  const now = /* @__PURE__ */ new Date();
  const diff = now.getTime() - new Date(sentAt).getTime();
  const isResendAllowed = diff > resendInterval;
  const timeLeft = isResendAllowed ? 0 : Math.round((resendInterval - diff) / 1e3);
  return { isResendAllowed, timeLeft };
}

function getSignupRoute({
  userSignupFields,
  fromField,
  clientRoute,
  getVerificationEmailContent,
  isEmailAutoVerified
}) {
  return async function signup(req, res) {
    const fields = req.body;
    ensureValidArgs$1(fields);
    const providerId = createProviderId("email", fields.email);
    const existingAuthIdentity = await findAuthIdentity(providerId);
    if (existingAuthIdentity) {
      const providerData = getProviderDataWithPassword(
        existingAuthIdentity.providerData
      );
      if (providerData.isEmailVerified) {
        await doFakeWork();
        res.json({ success: true });
        return;
      }
      const { isResendAllowed, timeLeft } = isEmailResendAllowed(
        providerData,
        "passwordResetSentAt"
      );
      if (!isResendAllowed) {
        throw new HttpError(
          400,
          `Please wait ${timeLeft} secs before trying again.`
        );
      }
      try {
        await deleteUserByAuthId(existingAuthIdentity.authId);
      } catch (e) {
        rethrowPossibleAuthError(e);
      }
    }
    const userFields = await validateAndGetUserFields(fields, userSignupFields);
    const newUserProviderData = await sanitizeAndSerializeProviderData(
      {
        hashedPassword: fields.password,
        isEmailVerified: isEmailAutoVerified ? true : false,
        emailVerificationSentAt: null,
        passwordResetSentAt: null
      }
    );
    try {
      await onBeforeSignupHook({ req, providerId });
      const user = await createUser(
        providerId,
        newUserProviderData,
        // Using any here because we want to avoid TypeScript errors and
        // rely on Prisma to validate the data.
        userFields
      );
      await onAfterSignupHook({ req, providerId, user });
    } catch (e) {
      rethrowPossibleAuthError(e);
    }
    if (isEmailAutoVerified) {
      res.json({ success: true });
      return;
    }
    const verificationLink = await createEmailVerificationLink(
      fields.email,
      clientRoute
    );
    try {
      await sendEmailVerificationEmail(fields.email, {
        from: fromField,
        to: fields.email,
        ...getVerificationEmailContent({ verificationLink })
      });
    } catch (e) {
      console.error("Failed to send email verification email:", e);
      throw new HttpError(500, "Failed to send email verification email.");
    }
    res.json({ success: true });
  };
}
function ensureValidArgs$1(args) {
  ensureValidEmail(args);
  ensurePasswordIsPresent(args);
  ensureValidPassword(args);
}

function getRequestPasswordResetRoute({
  fromField,
  clientRoute,
  getPasswordResetEmailContent
}) {
  return async function requestPasswordReset(req, res) {
    const args = req.body ?? {};
    ensureValidEmail(args);
    const authIdentity = await findAuthIdentity(
      createProviderId("email", args.email)
    );
    if (!authIdentity) {
      await doFakeWork();
      res.json({ success: true });
      return;
    }
    const providerData = getProviderDataWithPassword(authIdentity.providerData);
    const { isResendAllowed, timeLeft } = isEmailResendAllowed(providerData, "passwordResetSentAt");
    if (!isResendAllowed) {
      throw new HttpError(400, `Please wait ${timeLeft} secs before trying again.`);
    }
    const passwordResetLink = await createPasswordResetLink(args.email, clientRoute);
    try {
      const email = authIdentity.providerUserId;
      await sendPasswordResetEmail(
        email,
        {
          from: fromField,
          to: email,
          ...getPasswordResetEmailContent({ passwordResetLink })
        }
      );
    } catch (e) {
      console.error("Failed to send password reset email:", e);
      throw new HttpError(500, "Failed to send password reset email.");
    }
    res.json({ success: true });
  };
}

async function resetPassword(req, res) {
  const args = req.body ?? {};
  ensureValidArgs(args);
  const { token, password } = args;
  const { email } = await validateJWT(token).catch(() => {
    throw new HttpError(400, "Password reset failed, invalid token");
  });
  const providerId = createProviderId("email", email);
  const authIdentity = await findAuthIdentity(providerId);
  if (!authIdentity) {
    throw new HttpError(400, "Password reset failed, invalid token");
  }
  const providerData = getProviderDataWithPassword(authIdentity.providerData);
  await updateAuthIdentityProviderData(providerId, providerData, {
    // The act of resetting the password verifies the email
    isEmailVerified: true,
    // The password will be hashed when saving the providerData
    // in the DB
    hashedPassword: password
  });
  res.json({ success: true });
}
function ensureValidArgs(args) {
  ensureTokenIsPresent(args);
  ensurePasswordIsPresent(args);
  ensureValidPassword(args);
}

async function verifyEmail(req, res) {
  const { token } = req.body;
  const { email } = await validateJWT(token).catch(() => {
    throw new HttpError(400, "Email verification failed, invalid token");
  });
  const providerId = createProviderId("email", email);
  const authIdentity = await findAuthIdentity(providerId);
  if (!authIdentity) {
    throw new HttpError(400, "Email verification failed, invalid token");
  }
  const providerData = getProviderDataWithPassword(authIdentity.providerData);
  await updateAuthIdentityProviderData(providerId, providerData, {
    isEmailVerified: true
  });
  const auth = await findAuthWithUserBy({ id: authIdentity.authId });
  await onAfterEmailVerifiedHook({ user: auth.user });
  res.json({ success: true });
}

function defineUserSignupFields(fields) {
  return fields;
}

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
const emailDataSchema = z$1.object({
  email: z$1.string(),
  role: z$1.enum(["CONSUMER", "PROVIDER"]).optional().default("CONSUMER")
});
const getEmailUserFields = defineUserSignupFields({
  email: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.email;
  },
  username: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.email;
  },
  isAdmin: (data) => {
    const emailData = emailDataSchema.parse(data);
    return adminEmails.includes(emailData.email);
  },
  role: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.role ?? "CONSUMER";
  }
});
z$1.object({
  profile: z$1.object({
    emails: z$1.array(
      z$1.object({
        email: z$1.string(),
        verified: z$1.boolean()
      })
    ).min(
      1,
      "You need to have an email address associated with your GitHub account to sign up."
    ),
    login: z$1.string()
  })
});
z$1.object({
  profile: z$1.object({
    email: z$1.string(),
    email_verified: z$1.boolean()
  })
});
z$1.object({
  profile: z$1.object({
    username: z$1.string(),
    email: z$1.string().email().nullable(),
    verified: z$1.boolean().nullable()
  })
});

const LOGO_URL = "https://thehelper.ca/apple-touch-icon.png";
const emailHeader = `
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="${LOGO_URL}" alt="The Helper" width="48" height="48" style="border-radius: 12px; display: inline-block;" />
    <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 8px; font-family: sans-serif;">The Helper</div>
  </div>`;
const getVerificationEmailContent = ({
  verificationLink
}) => ({
  subject: "Verify your The Helper email",
  text: `Welcome to The Helper! Click the link below to verify your email and activate your account: ${verificationLink}

This email is your The Helper account. Once verified, use it to log in and track your rewards, appointments, and job status.
Account: https://thehelper.ca/login`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      ${emailHeader}
      <h2 style="margin-bottom: 8px;">Welcome to The Helper</h2>
      <p style="color: #555; margin-bottom: 16px;">Click the button below to verify your email address and activate your account.</p>
      <a href="${verificationLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #2563EB; color: #ffffff; font-weight: bold; border-radius: 22px; text-decoration: none;">Verify Email</a>
      <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 20px; margin-top: 24px;">
        <p style="margin: 0 0 4px; color: #1E40AF; font-weight: 700; font-size: 14px;">Your portal</p>
        <p style="margin: 0; color: #475569; font-size: 13px;">
          This email is your The Helper account.
          <a href="https://thehelper.ca/login" style="color: #2563EB; text-decoration: none; font-weight: 600;">Log in</a>
          to track your rewards, appointments, and job status.
        </p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't sign up for The Helper, you can safely ignore this email.</p>
    </div>
  `
});
const getPasswordResetEmailContent = ({
  passwordResetLink
}) => ({
  subject: "Reset your The Helper password",
  text: `Click the link below to reset your The Helper password: ${passwordResetLink}`,
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      ${emailHeader}
      <h2 style="margin-bottom: 8px;">Password Reset</h2>
      <p style="color: #555;">We received a request to reset your The Helper password. Click below to choose a new one.</p>
      <a href="${passwordResetLink}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #2563EB; color: #ffffff; font-weight: bold; border-radius: 22px; text-decoration: none;">Reset Password</a>
      <p style="color: #999; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. This link expires in 1 hour.</p>
    </div>
  `
});

const _waspUserSignupFields = getEmailUserFields;
const _waspGetVerificationEmailContent = getVerificationEmailContent;
const _waspGetPasswordResetEmailContent = getPasswordResetEmailContent;
const fromField = {
  name: "TheHelper",
  email: "hello@thehelper.ca"
};
const config = {
  id: "email",
  displayName: "Email and password",
  createRouter() {
    const router = Router();
    const loginRoute = defineHandler(getLoginRoute());
    router.post("/login", loginRoute);
    const signupRoute = defineHandler(getSignupRoute({
      userSignupFields: _waspUserSignupFields,
      fromField,
      clientRoute: "/email-verification",
      getVerificationEmailContent: _waspGetVerificationEmailContent,
      isEmailAutoVerified: env.SKIP_EMAIL_VERIFICATION_IN_DEV
    }));
    router.post("/signup", signupRoute);
    const requestPasswordResetRoute = defineHandler(getRequestPasswordResetRoute({
      fromField,
      clientRoute: "/password-reset",
      getPasswordResetEmailContent: _waspGetPasswordResetEmailContent
    }));
    router.post("/request-password-reset", requestPasswordResetRoute);
    router.post("/reset-password", defineHandler(resetPassword));
    router.post("/verify-email", defineHandler(verifyEmail));
    return router;
  }
};

const providers = [
  config
];
const router$3 = Router();
for (const provider of providers) {
  const { createRouter } = provider;
  const providerRouter = createRouter(provider);
  router$3.use(`/${provider.id}`, providerRouter);
  console.log(`\u{1F680} "${provider.displayName}" auth initialized`);
}

const router$2 = express.Router();
router$2.get("/me", auth, me);
router$2.post("/logout", auth, logout);
router$2.use("/", router$3);

function generateOtp() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function hashCode(code) {
  return crypto$1.createHash("sha256").update(code).digest("hex");
}
function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const allowed = [
    process.env.WASP_WEB_CLIENT_URL,
    "https://thehelper.ca",
    "https://www.thehelper.ca"
  ].filter(Boolean);
  if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  return allowed.includes(origin);
}
const requestOtp = async (req, res, context) => {
  if (!isAllowedOrigin(req)) {
    res.status(403).json({ error: "Forbidden." });
    return;
  }
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }
  const normalizedEmail = email.toLowerCase().trim();
  const recentCount = await dbClient.otpCode.count({
    where: {
      email: normalizedEmail,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1e3) }
    }
  });
  if (recentCount >= 3) {
    throw new HttpError(429, "Too many OTP requests. Please wait a few minutes.");
  }
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
  await dbClient.otpCode.deleteMany({ where: { email: normalizedEmail, used: false } });
  await dbClient.otpCode.create({
    data: { email: normalizedEmail, code: hashCode(code), expiresAt }
  });
  try {
    await emailSender.send({
      to: normalizedEmail,
      subject: `Your The Helper sign-in code: ${code}`,
      text: `Your The Helper sign-in code is: ${code}

This code expires in 10 minutes. If you didn't request this, ignore this email.

This email is your The Helper account. Save it to log in and track your rewards, appointments, and job status.
Account: https://thehelper.ca/login`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <img src="https://thehelper.ca/apple-touch-icon.png" alt="The Helper" width="40" height="40" style="border-radius:10px;display:inline-block;vertical-align:middle;" />
              <span style="font-size:22px;font-weight:900;color:#0F172A;">The Helper</span>
            </div>
          </div>
          <h2 style="text-align:center;font-size:22px;font-weight:800;margin:0 0 8px;">Your sign-in code</h2>
          <p style="text-align:center;color:#475569;margin:0 0 32px;font-size:15px;">Enter this code to access your The Helper account.</p>
          <div style="background:#F8FAFC;border:2px solid #E2E8F0;border-radius:20px;padding:36px;text-align:center;margin-bottom:24px;">
            <span style="font-size:52px;font-weight:900;letter-spacing:10px;color:#0F172A;font-family:monospace;">${code}</span>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0 0 32px;">Expires in 10 minutes. If you didn't request this, no action needed.</p>
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:14px;padding:20px;">
            <p style="margin:0 0 4px;color:#1E40AF;font-weight:700;font-size:14px;">Your portal</p>
            <p style="margin:0;color:#475569;font-size:13px;">
              This email is your The Helper account.
              <a href="https://thehelper.ca/login" style="color:#2563EB;text-decoration:none;font-weight:600;">Log in</a>
              to track your rewards, appointments, and job status.
            </p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error("[OTP] Email send failed:", err);
    res.status(500).json({ error: "Failed to send verification email. Please try again." });
    return;
  }
  res.json({ success: true });
};
const verifyOtp = async (req, res, context) => {
  if (!isAllowedOrigin(req)) {
    res.status(403).json({ error: "Forbidden." });
    return;
  }
  const { email, code, password, pendingRequest } = req.body;
  if (!email || !code) {
    res.status(400).json({ error: "Email and code are required." });
    return;
  }
  if (password && password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await dbClient.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      used: false,
      expiresAt: { gt: /* @__PURE__ */ new Date() },
      attempts: { lt: 5 }
    },
    orderBy: { createdAt: "desc" }
  });
  if (!otpRecord) {
    throw new HttpError(400, "No valid OTP found. Please request a new code.");
  }
  const bumped = await dbClient.otpCode.updateMany({
    where: { id: otpRecord.id, attempts: { lt: 5 } },
    data: { attempts: { increment: 1 } }
  });
  if (bumped.count === 0) throw new HttpError(429, "Too many incorrect attempts. Please request a new code.");
  if (otpRecord.code !== hashCode(code.trim())) {
    throw new HttpError(400, "Incorrect verification code.");
  }
  await dbClient.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });
  const providerId = createProviderId("email", normalizedEmail);
  let authIdentity = await findAuthIdentity(providerId);
  let authId;
  let isNewUser = false;
  if (!authIdentity) {
    isNewUser = true;
    const hashedPassword = password ? await hashPassword(password) : crypto$1.randomUUID();
    const serializedProviderData = await sanitizeAndSerializeProviderData({
      hashedPassword,
      isEmailVerified: true,
      emailVerificationSentAt: null,
      passwordResetSentAt: null
    });
    const result = await createUser(providerId, serializedProviderData, {
      email: normalizedEmail
    });
    if (!result.auth) throw new Error("Failed to create auth record.");
    authId = result.auth.id;
  } else {
    authId = authIdentity.authId;
  }
  const session = await createSession(authId);
  let requestId;
  if (pendingRequest) {
    const userRecord = await dbClient.user.findFirst({ where: { email: normalizedEmail } });
    if (userRecord) {
      await dbClient.user.update({
        where: { id: userRecord.id },
        data: {
          firstName: pendingRequest.firstName,
          phone: pendingRequest.phone,
          postalCode: pendingRequest.postalCode,
          role: "CONSUMER",
          smsConsent: pendingRequest.smsConsent,
          smsConsentAt: pendingRequest.smsConsent ? /* @__PURE__ */ new Date() : void 0
        }
      });
      const request = await dbClient.serviceRequest.create({
        data: {
          consumerId: userRecord.id,
          name: pendingRequest.firstName,
          phone: pendingRequest.phone,
          postalCode: pendingRequest.postalCode,
          email: normalizedEmail,
          smsConsentGiven: pendingRequest.smsConsent,
          serviceCategoryId: pendingRequest.serviceCategoryId ?? null,
          description: pendingRequest.description,
          qualifierAnswers: pendingRequest.qualifierAnswers ?? {},
          source: "WEBSITE"
        }
      });
      requestId = request.id;
      await dbClient.rewardAccount.upsert({
        where: { consumerId: userRecord.id },
        update: {},
        create: { consumerId: userRecord.id }
      });
      const existingBonus = await dbClient.rewardTransaction.findFirst({
        where: { consumerId: userRecord.id, type: "SIGNUP_BONUS" }
      });
      if (!existingBonus) {
        await dbClient.rewardTransaction.create({
          data: {
            consumerId: userRecord.id,
            type: "SIGNUP_BONUS",
            points: 100,
            status: "APPROVED",
            reason: "Welcome bonus"
          }
        });
        await dbClient.rewardAccount.update({
          where: { consumerId: userRecord.id },
          data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } }
        });
      }
      if (pendingRequest.referralCode) {
        const refCode = pendingRequest.referralCode.trim().toUpperCase();
        const referral = await dbClient.referral.findUnique({ where: { referralCode: refCode } });
        if (referral && referral.referrerUserId !== userRecord.id && !referral.referredUserId) {
          await dbClient.referral.update({
            where: { id: referral.id },
            data: { referredUserId: userRecord.id, status: "SIGNED_UP" }
          });
        }
      }
    }
  }
  res.json({ success: true, sessionId: session.id, isNewUser, requestId });
};

function formatICSDateTime(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
function generateUID() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}@thehelper.ca`;
}
function escapeICSText(text) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
const VTIMEZONE_TORONTO = `BEGIN:VTIMEZONE
TZID:America/Toronto
X-LIC-LOCATION:America/Toronto
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`;
function generateICS(event) {
  const uid = generateUID();
  const dtstamp = formatICSDateTime(/* @__PURE__ */ new Date());
  const dtstart = formatICSDateTime(event.startTime);
  const dtend = formatICSDateTime(event.endTime);
  const summary = escapeICSText(event.title);
  const description = escapeICSText(event.description);
  const location = event.location ? escapeICSText(event.location) : "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Helper//thehelper.ca//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    VTIMEZONE_TORONTO,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`
  ];
  if (location) {
    lines.push(`LOCATION:${location}`);
  }
  lines.push(
    `ORGANIZER;CN=The Helper:mailto:${event.organizerEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE;CN=${event.attendeeEmail}:mailto:${event.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  );
  return lines.join("\r\n");
}

const formatBookingTime = (isoDate) => new Intl.DateTimeFormat("en-CA", {
  dateStyle: "full",
  timeStyle: "short"
}).format(new Date(isoDate));
async function sendEmailWithAttachment({
  to,
  subject,
  text,
  html,
  icsContent,
  icsFilename
}) {
  const mailgunApiKey = process.env.MAILGUN_API_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;
  if (icsContent && mailgunApiKey && mailgunDomain) {
    const formData = new FormData();
    formData.append("from", "TheHelper <hello@thehelper.ca>");
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    formData.append("html", html);
    const icsBlob = new Blob([icsContent], { type: "text/calendar" });
    formData.append("attachment", icsBlob, icsFilename);
    const response = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`
        },
        body: formData
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`);
    }
  } else {
    await emailSender.send({ to, subject, text, html });
  }
}
const sendBookingEmails = async ({
  consumerEmail,
  consumerName,
  providerEmail,
  providerName,
  providerPhone,
  serviceLabel,
  appointmentTime,
  appointmentEndTime,
  location,
  actionLabel
}) => {
  const formattedTime = formatBookingTime(appointmentTime);
  const startTime = new Date(appointmentTime);
  const endTime = appointmentEndTime ? new Date(appointmentEndTime) : new Date(startTime.getTime() + 60 * 60 * 1e3);
  let consumerICS;
  let providerICS;
  if (actionLabel !== "cancelled") {
    if (consumerEmail) {
      consumerICS = generateICS({
        title: `${serviceLabel} Appointment - The Helper`,
        description: `Your ${serviceLabel} appointment${providerName ? ` with ${providerName}` : ""}${providerPhone ? `. Contact: ${providerPhone}` : ""}. Booked via The Helper (thehelper.ca)`,
        startTime,
        endTime,
        location,
        organizerEmail: "hello@thehelper.ca",
        attendeeEmail: consumerEmail
      });
    }
    if (providerEmail) {
      providerICS = generateICS({
        title: `${serviceLabel} - ${consumerName || "Customer"}`,
        description: `Service appointment for ${consumerName || "customer"}. ${serviceLabel} job via The Helper (thehelper.ca)`,
        startTime,
        endTime,
        location,
        organizerEmail: "hello@thehelper.ca",
        attendeeEmail: providerEmail
      });
    }
  }
  if (consumerEmail) {
    await sendEmailWithAttachment({
      to: consumerEmail,
      subject: `Your The Helper appointment is ${actionLabel}`,
      text: actionLabel === "cancelled" ? `Your ${serviceLabel} appointment has been cancelled. Our team will help you rebook if needed.` : `Your ${serviceLabel} appointment is ${actionLabel} for ${formattedTime}${providerName ? ` with ${providerName}` : ""}${providerPhone ? ` (${providerPhone})` : ""}.`,
      html: actionLabel === "cancelled" ? `<p>Hi ${consumerName || "there"},</p><p>Your <strong>${serviceLabel}</strong> appointment has been cancelled.</p><p>If you want, reply to this email and The Helper will help you rebook.</p>` : `<p>Hi ${consumerName || "there"},</p><p>Your <strong>${serviceLabel}</strong> appointment is <strong>${actionLabel}</strong> for <strong>${formattedTime}</strong>${providerName ? ` with <strong>${providerName}</strong>` : ""}${providerPhone ? ` (${providerPhone})` : ""}.</p><p>We will keep you updated if anything changes.</p><p style="margin-top: 16px;">An .ics calendar file is attached to this email. Open it to add this appointment to your calendar.</p>`,
      icsContent: consumerICS,
      icsFilename: "the-helper-appointment.ics"
    });
  }
  if (providerEmail) {
    await sendEmailWithAttachment({
      to: providerEmail,
      subject: `The Helper appointment ${actionLabel}`,
      text: actionLabel === "cancelled" ? `A ${serviceLabel} appointment was cancelled.${consumerName ? ` Customer: ${consumerName}.` : ""}` : `A ${serviceLabel} appointment was ${actionLabel} for ${formattedTime}.${consumerName ? ` Customer: ${consumerName}.` : ""}`,
      html: actionLabel === "cancelled" ? `<p>A <strong>${serviceLabel}</strong> appointment was cancelled.${consumerName ? ` Customer: <strong>${consumerName}</strong>.` : ""}</p>` : `<p>A <strong>${serviceLabel}</strong> appointment was ${actionLabel} for <strong>${formattedTime}</strong>.${consumerName ? ` Customer: <strong>${consumerName}</strong>.` : ""}</p><p style="margin-top: 16px;">An .ics calendar file is attached. Open it to add this appointment to your calendar.</p>`,
      icsContent: providerICS,
      icsFilename: "the-helper-appointment.ics"
    });
  }
};
const calcomWebhook = async (req, res, context) => {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers["x-cal-signature-256"];
    if (!signature) {
      return res.status(401).json({ error: "Missing signature" });
    }
    const body = JSON.stringify(req.body);
    const expectedSig = crypto$1.createHmac("sha256", secret).update(body).digest("hex");
    const normalizedSignature = signature.replace(/^sha256=/, "");
    if (!crypto$1.timingSafeEqual(Buffer.from(normalizedSignature), Buffer.from(expectedSig))) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }
  const { triggerEvent, payload } = req.body;
  const bookingUid = payload?.uid;
  if (!bookingUid) {
    return res.status(400).json({ error: "Missing booking uid" });
  }
  try {
    switch (triggerEvent) {
      case "BOOKING_CREATED": {
        const existing = await context.entities.Appointment.findFirst({
          where: { calComBookingUid: bookingUid }
        });
        if (!existing) {
          const attendeeEmail = payload.attendees?.[0]?.email;
          if (attendeeEmail) {
            const serviceRequest = await context.entities.ServiceRequest.findFirst({
              where: {
                email: attendeeEmail,
                status: { notIn: ["COMPLETED", "CLOSED"] }
              },
              orderBy: { createdAt: "desc" }
            });
            if (serviceRequest) {
              const provider = serviceRequest.assignedProviderId ? await context.entities.Provider.findUnique({
                where: { id: serviceRequest.assignedProviderId }
              }) : null;
              if (serviceRequest.assignedProviderId) {
                await context.entities.Appointment.create({
                  data: {
                    serviceRequestId: serviceRequest.id,
                    providerId: serviceRequest.assignedProviderId,
                    consumerId: serviceRequest.consumerId ?? void 0,
                    scheduledAt: new Date(payload.startTime),
                    status: "CONFIRMED",
                    calComBookingUid: bookingUid
                  }
                });
              }
              await context.entities.ServiceRequest.update({
                where: { id: serviceRequest.id },
                data: { status: "BOOKED", bookedAt: /* @__PURE__ */ new Date() }
              });
              await sendBookingEmails({
                consumerEmail: serviceRequest.email,
                consumerName: serviceRequest.name,
                providerEmail: provider?.email,
                providerName: provider?.businessName,
                providerPhone: provider?.phone,
                serviceLabel: payload.title ?? "service",
                appointmentTime: payload.startTime,
                appointmentEndTime: payload.endTime,
                location: serviceRequest.postalCode || serviceRequest.city || void 0,
                actionLabel: "booked"
              });
              console.log(`[Cal.com] Appointment created for request ${serviceRequest.id}`);
            }
          }
        }
        break;
      }
      case "BOOKING_RESCHEDULED": {
        const appointment = await context.entities.Appointment.findFirst({
          where: { calComBookingUid: bookingUid },
          include: {
            provider: true,
            serviceRequest: true
          }
        });
        await context.entities.Appointment.updateMany({
          where: { calComBookingUid: bookingUid },
          data: {
            scheduledAt: new Date(payload.startTime),
            status: "RESCHEDULED"
          }
        });
        if (appointment) {
          await sendBookingEmails({
            consumerEmail: appointment.serviceRequest.email,
            consumerName: appointment.serviceRequest.name,
            providerEmail: appointment.provider.email,
            providerName: appointment.provider.businessName,
            providerPhone: appointment.provider.phone,
            serviceLabel: payload.title ?? "service",
            appointmentTime: payload.startTime,
            appointmentEndTime: payload.endTime,
            location: appointment.serviceRequest.postalCode || appointment.serviceRequest.city || void 0,
            actionLabel: "rescheduled"
          });
        }
        console.log(`[Cal.com] Appointment rescheduled: ${bookingUid}`);
        break;
      }
      case "BOOKING_CANCELLED": {
        const appointment = await context.entities.Appointment.findFirst({
          where: { calComBookingUid: bookingUid },
          include: {
            provider: true,
            serviceRequest: true
          }
        });
        await context.entities.Appointment.updateMany({
          where: { calComBookingUid: bookingUid },
          data: { status: "CANCELLED" }
        });
        if (appointment) {
          await sendBookingEmails({
            consumerEmail: appointment.serviceRequest.email,
            consumerName: appointment.serviceRequest.name,
            providerEmail: appointment.provider.email,
            providerName: appointment.provider.businessName,
            providerPhone: appointment.provider.phone,
            serviceLabel: payload.title ?? "service",
            appointmentTime: appointment.scheduledAt?.toISOString() ?? payload.startTime,
            actionLabel: "cancelled"
          });
        }
        console.log(`[Cal.com] Appointment cancelled: ${bookingUid}`);
        break;
      }
      default:
        console.log(`[Cal.com] Unhandled event: ${triggerEvent}`);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("[Cal.com] Webhook error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};

const startTime = Date.now();
const healthCheck = async (_req, res, _context) => {
  let dbOk = false;
  let dbError = null;
  try {
    await dbClient.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Unknown database error";
  }
  const status = dbOk ? "ok" : "degraded";
  const httpStatus = dbOk ? 200 : 503;
  res.status(httpStatus).json({
    status,
    uptime: Math.floor((Date.now() - startTime) / 1e3),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    checks: {
      database: dbOk ? "ok" : "error",
      databaseError: dbError
    }
  });
};

const handleTwilioSms = async (req, res, context) => {
  const isProduction = process.env.NODE_ENV === "production";
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioSignature = req.headers["x-twilio-signature"];
  if (!authToken) {
    if (isProduction) {
      return res.status(401).json({ error: "TWILIO_AUTH_TOKEN is required in production" });
    }
    console.warn("[Twilio] TWILIO_AUTH_TOKEN is not set, skipping signature validation");
  } else {
    if (!twilioSignature || Array.isArray(twilioSignature)) {
      return res.status(401).json({ error: "Missing Twilio signature" });
    }
    const requestUrl = getRequestUrl(req);
    const valid = validateTwilioSignature({
      authToken,
      signature: twilioSignature,
      url: requestUrl,
      body: req.body
    });
    if (!valid) {
      return res.status(401).json({ error: "Invalid Twilio signature" });
    }
  }
  const { Body, From } = req.body;
  const normalizedFrom = From.replace(/^\+/, "");
  const pendingRequest = await context.entities.ServiceRequest.findFirst({
    where: {
      phone: { contains: normalizedFrom.slice(-10) },
      status: { in: ["NEW", "SMS_STARTED", "QUALIFYING"] }
    },
    orderBy: { createdAt: "desc" }
  });
  if (pendingRequest) {
    if (pendingRequest.status === "NEW") {
      await context.entities.ServiceRequest.update({
        where: { id: pendingRequest.id },
        data: { status: "SMS_STARTED" }
      });
    }
    await context.entities.CommunicationLog.create({
      data: {
        serviceRequestId: pendingRequest.id,
        channel: "SMS",
        direction: "INBOUND",
        from: From,
        to: process.env.TWILIO_PHONE_NUMBER || "TheHelper",
        body: Body,
        status: "RECEIVED"
      }
    });
    console.log(`[Twilio] SMS recorded for request ${pendingRequest.id} from ${From}: ${Body}`);
  } else {
    console.log(`[Twilio] SMS from unknown number ${From}: ${Body}`);
  }
  res.status(200).send("<Response><Message>Thanks for your reply. The Helper has recorded your response.</Message></Response>");
};
function getRequestUrl(req) {
  const forwardedProto = req.get?.("x-forwarded-proto");
  const protocol = forwardedProto ?? req.protocol ?? "https";
  const host = req.get?.("x-forwarded-host") ?? req.get?.("host") ?? "localhost";
  const path = req.originalUrl ?? "/webhooks/twilio";
  return `${protocol}://${host}${path}`;
}
function validateTwilioSignature(input) {
  const sortedParamKeys = Object.keys(input.body).sort();
  const data = sortedParamKeys.reduce((acc, key) => {
    const value = input.body[key];
    return `${acc}${key}${value == null ? "" : String(value)}`;
  }, input.url);
  const expected = crypto.createHmac("sha1", input.authToken).update(data).digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(input.signature);
  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

const handleGhlWebhook = async (req, res, context) => {
  const isProduction = process.env.NODE_ENV === "production";
  const secret = process.env.GHL_WEBHOOK_SECRET;
  if (isProduction && !secret) {
    return res.status(401).json({ error: "Webhook secret is required in production" });
  }
  const headerSecret = req.headers["x-thehelper-secret"];
  const bodySecret = req.body?.secret;
  if (secret && headerSecret !== secret && bodySecret !== secret) {
    return res.status(401).json({ error: "Invalid webhook secret" });
  }
  const {
    event,
    requestId,
    ghlContactId,
    status,
    providerId,
    appointmentTime,
    notes
  } = req.body;
  await context.entities.WebhookLog.create({
    data: {
      direction: "INBOUND",
      source: "GHL",
      event: event ?? "unknown",
      serviceRequestId: requestId ?? null,
      payload: req.body,
      statusCode: 200
    }
  });
  if (!requestId) {
    return res.status(200).json({ received: true, skipped: "no requestId" });
  }
  const serviceRequest = await context.entities.ServiceRequest.findUnique({
    where: { id: requestId }
  });
  if (!serviceRequest) {
    return res.status(200).json({ received: true, skipped: "request not found" });
  }
  const statusMap = {
    "conversation.started": "SMS_STARTED",
    "conversation.qualifying": "QUALIFYING",
    "conversation.qualified": "QUALIFIED",
    "lead.assigned": "ASSIGNED",
    "appointment.booked": "BOOKED",
    "job.completed": "COMPLETED",
    "lead.lost": "LOST"
  };
  const newStatus = statusMap[event] ?? status ?? void 0;
  await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: {
      ...newStatus && { status: newStatus },
      ...providerId && { assignedProviderId: providerId },
      ...appointmentTime && { bookedAt: new Date(appointmentTime) },
      ...event === "job.completed" && { completedAt: /* @__PURE__ */ new Date() }
    }
  });
  await context.entities.CommunicationLog.create({
    data: {
      serviceRequestId: requestId,
      channel: "SMS",
      direction: "INBOUND",
      from: ghlContactId ?? "ghl-system",
      to: "thehelper-system",
      body: notes ?? `GHL event: ${event}`,
      status: newStatus ?? event,
      rawPayload: req.body
    }
  });
  return res.status(200).json({ received: true, updatedStatus: newStatus ?? event });
};

const idFn = (x) => x;
const _wasprequestOtpmiddlewareConfigFn = idFn;
const _waspverifyOtpmiddlewareConfigFn = idFn;
const _waspcalcomWebhookmiddlewareConfigFn = idFn;
const _wasphealthCheckmiddlewareConfigFn = idFn;
const _wasptwilioWebhookmiddlewareConfigFn = idFn;
const _waspghlWebhookmiddlewareConfigFn = idFn;
const router$1 = express.Router();
const requestOtpMiddleware = globalMiddlewareConfigForExpress(_wasprequestOtpmiddlewareConfigFn);
router$1.post(
  "/api/auth/request-otp",
  [auth, ...requestOtpMiddleware],
  defineHandler(
    (req, res) => {
      ({
        user: makeAuthUserIfPossible(req.user)});
      return requestOtp(req, res);
    }
  )
);
const verifyOtpMiddleware = globalMiddlewareConfigForExpress(_waspverifyOtpmiddlewareConfigFn);
router$1.post(
  "/api/auth/verify-otp",
  [auth, ...verifyOtpMiddleware],
  defineHandler(
    (req, res) => {
      ({
        user: makeAuthUserIfPossible(req.user)});
      return verifyOtp(req, res);
    }
  )
);
const calcomWebhookMiddleware = globalMiddlewareConfigForExpress(_waspcalcomWebhookmiddlewareConfigFn);
router$1.post(
  "/calcom-webhook",
  [auth, ...calcomWebhookMiddleware],
  defineHandler(
    (req, res) => {
      const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
          Appointment: dbClient.appointment,
          ServiceRequest: dbClient.serviceRequest,
          Provider: dbClient.provider
        }
      };
      return calcomWebhook(req, res, context);
    }
  )
);
const healthCheckMiddleware = globalMiddlewareConfigForExpress(_wasphealthCheckmiddlewareConfigFn);
router$1.get(
  "/api/health",
  [auth, ...healthCheckMiddleware],
  defineHandler(
    (req, res) => {
      ({
        user: makeAuthUserIfPossible(req.user)});
      return healthCheck(req, res);
    }
  )
);
const twilioWebhookMiddleware = globalMiddlewareConfigForExpress(_wasptwilioWebhookmiddlewareConfigFn);
router$1.post(
  "/webhooks/twilio",
  [auth, ...twilioWebhookMiddleware],
  defineHandler(
    (req, res) => {
      const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
          ServiceRequest: dbClient.serviceRequest,
          User: dbClient.user,
          CommunicationLog: dbClient.communicationLog
        }
      };
      return handleTwilioSms(req, res, context);
    }
  )
);
const ghlWebhookMiddleware = globalMiddlewareConfigForExpress(_waspghlWebhookmiddlewareConfigFn);
router$1.post(
  "/webhooks/ghl",
  [auth, ...ghlWebhookMiddleware],
  defineHandler(
    (req, res) => {
      const context = {
        user: makeAuthUserIfPossible(req.user),
        entities: {
          ServiceRequest: dbClient.serviceRequest,
          CommunicationLog: dbClient.communicationLog,
          WebhookLog: dbClient.webhookLog
        }
      };
      return handleGhlWebhook(req, res, context);
    }
  )
);

const makeWrongPortPage = ({
  appName,
  frontendUrl
}) => (
  /* HTML */
  `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${appName} API Server</title>

      <style>
        :root {
          --page-background: #f0f0f0;
          --wrapper-background: white;
          --wasp-yellow: #f5cc05;
          --main-link-color: #1a73e8;
        }

        .wrapper {
          font-family: system-ui, sans-serif;
          width: 90%;
          max-width: 600px;
          margin: 2em auto;
        }

        h1,
        h2 {
          margin: 0;
        }

        .main-link {
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          font-family: ui-monospace, monospace;
        }

        .icon {
          width: 1em;
          height: 1em;
        }

        .wasp-title {
          margin: 0.5em 0;
          display: flex;
          align-items: center;
          gap: 0.2em;
        }

        body {
          background-color: var(--page-background);
        }

        main {
          background-color: var(--wrapper-background);
          padding: 1.5em;
          border-radius: 10px;
        }

        a,
        a:visited {
          color: var(--main-link-color);
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <header>
          <h2 class="wasp-title">
            <svg viewBox="0 0 161 161" class="icon" alt="Wasp Logo">
              <circle cx="80.5" cy="80.5" r="79" fill="var(--wasp-yellow)" />
              <path
                d="M88.67 114.33h2.91q6 0 7.87-1.89c1.22-1.25 1.83-3.9 1.83-7.93V93.89c0-4.46.65-7.7 1.93-9.73s3.51-3.43 6.67-4.2q-4.69-1.08-6.65-4.12c-1.3-2-2-5.28-2-9.77V55.44q0-6-1.83-7.93t-7.87-1.88h-2.86V39.5h2.65q10.65 0 14.24 3.15t3.59 12.62v10.29c0 4.28.77 7.24 2.29 8.87s4.3 2.44 8.32 2.44h2.74V83h-2.74q-6 0-8.32 2.49c-1.52 1.65-2.29 4.64-2.29 9v10.25q0 9.47-3.59 12.64t-14.24 3.12h-2.65Z"
              />
              <path d="M38.5 85.15h37.33v7.58H38.5Zm0-17.88h37.33v7.49H38.5Z" />
            </svg>
            Wasp
          </h2>
        </header>

        <main>
          <h1>${appName} API Server</h1>
          <p>
            The server is up and running. This is the backend part of your Wasp
            application.
          </p>
          <p>
            If you want to visit your frontend application, go to this URL in
            your browser:
          </p>
          <a href="${frontendUrl}" class="main-link">
            <p>${frontendUrl}</p>
          </a>
          <p>
            <small>
              This message is shown because you are running the server in
              development mode. In production, this route would not show
              anything.
            </small>
          </p>
        </main>
      </div>
    </body>
  </html>
`
);

const router = express.Router();
const middleware = globalMiddlewareConfigForExpress();
router.get(
  "/",
  middleware,
  function(_req, res) {
    const data = {
      appName: "OpenSaaS",
      frontendUrl: config$1.frontendUrl
    };
    const wrongPortPage = makeWrongPortPage(data);
    res.status(200).type("html").send(wrongPortPage);
  }
);
router.use("/auth", middleware, router$2);
router.use("/operations", middleware, router$4);
router.use(router$1);

const app = express();
app.use("/", router);
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message, data: err.data });
  }
  return next(err);
});

const boss = createPgBoss();
function createPgBoss() {
  let pgBossNewOptions = {
    connectionString: config$1.databaseUrl
  };
  if (env.PG_BOSS_NEW_OPTIONS) {
    try {
      pgBossNewOptions = JSON.parse(env.PG_BOSS_NEW_OPTIONS);
    } catch {
      console.error("Environment variable PG_BOSS_NEW_OPTIONS was not parsable by JSON.parse()!");
    }
  }
  return new PgBoss(pgBossNewOptions);
}
let resolvePgBossStarted;
let rejectPgBossStarted;
const pgBossStarted = new Promise((resolve, reject) => {
  resolvePgBossStarted = resolve;
  rejectPgBossStarted = reject;
});
var PgBossStatus;
(function(PgBossStatus2) {
  PgBossStatus2["Unstarted"] = "Unstarted";
  PgBossStatus2["Starting"] = "Starting";
  PgBossStatus2["Started"] = "Started";
  PgBossStatus2["Error"] = "Error";
})(PgBossStatus || (PgBossStatus = {}));
let pgBossStatus = PgBossStatus.Unstarted;
async function startPgBoss() {
  if (pgBossStatus !== PgBossStatus.Unstarted) {
    return;
  }
  pgBossStatus = PgBossStatus.Starting;
  console.log("Starting pg-boss...");
  boss.on("error", (error) => console.error(error));
  try {
    await boss.start();
  } catch (error) {
    console.error("pg-boss failed to start!");
    console.error(error);
    pgBossStatus = PgBossStatus.Error;
    rejectPgBossStarted(boss);
    return;
  }
  resolvePgBossStarted(boss);
  console.log("pg-boss started!");
  pgBossStatus = PgBossStatus.Started;
}

class Job {
  jobName;
  executorName;
  constructor(jobName, executorName) {
    this.jobName = jobName;
    this.executorName = executorName;
  }
}
class SubmittedJob {
  job;
  jobId;
  constructor(job, jobId) {
    this.job = job;
    this.jobId = jobId;
  }
}

const PG_BOSS_EXECUTOR_NAME = /* @__PURE__ */ Symbol("PgBoss");
function createJobDefinition({ jobName, defaultJobOptions, jobSchedule, entities }) {
  return new PgBossJob(jobName, defaultJobOptions, entities, jobSchedule);
}
function registerJob({ job, jobFn }) {
  pgBossStarted.then(async (boss) => {
    await boss.offWork(job.jobName);
    await boss.work(job.jobName, pgBossCallbackWrapper(jobFn, job.entities));
    if (job.jobSchedule) {
      const options = {
        ...job.defaultJobOptions,
        ...job.jobSchedule.options
      };
      await boss.schedule(job.jobName, job.jobSchedule.cron, job.jobSchedule.args, options);
    }
  });
}
class PgBossJob extends Job {
  defaultJobOptions;
  startAfter;
  entities;
  jobSchedule;
  constructor(jobName, defaultJobOptions, entities, jobSchedule, startAfter) {
    super(jobName, PG_BOSS_EXECUTOR_NAME);
    this.defaultJobOptions = defaultJobOptions;
    this.entities = entities;
    this.jobSchedule = jobSchedule;
    this.startAfter = startAfter;
  }
  delay(startAfter) {
    return new PgBossJob(this.jobName, this.defaultJobOptions, this.entities, this.jobSchedule, startAfter);
  }
  async submit(jobArgs, jobOptions = {}) {
    const boss = await pgBossStarted;
    const jobId = await boss.send(this.jobName, jobArgs, {
      ...this.defaultJobOptions,
      ...this.startAfter && { startAfter: this.startAfter },
      ...jobOptions
    });
    return new PgBossSubmittedJob(boss, this, jobId);
  }
}
class PgBossSubmittedJob extends SubmittedJob {
  pgBoss;
  constructor(boss, job, jobId) {
    super(job, jobId);
    this.pgBoss = {
      cancel: () => boss.cancel(jobId),
      resume: () => boss.resume(jobId),
      // Coarcing here since pg-boss typings are not precise enough.
      details: () => boss.getJobById(jobId)
    };
  }
}
function pgBossCallbackWrapper(jobFn, entities) {
  return (args) => {
    const context = { entities };
    return jobFn(args.data, context);
  };
}

const STRIPE_API_VERSION = "2025-04-30.basil";
const stripeClient = new Stripe(requireNodeEnvVar("STRIPE_API_KEY"), {
  apiVersion: STRIPE_API_VERSION
});

const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY;
const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID;
const PLAUSIBLE_BASE_URL = process.env.PLAUSIBLE_BASE_URL;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${PLAUSIBLE_API_KEY}`
};
async function getDailyPageViews() {
  const totalViews = await getTotalPageViews();
  const prevDayViewsChangePercent = await getPrevDayViewsChangePercent();
  return {
    totalViews,
    prevDayViewsChangePercent
  };
}
async function getTotalPageViews() {
  const response = await fetch(
    `${PLAUSIBLE_BASE_URL}/v1/stats/aggregate?site_id=${PLAUSIBLE_SITE_ID}&metrics=pageviews`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PLAUSIBLE_API_KEY}`
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const json = await response.json();
  return json.results.pageviews.value;
}
async function getPrevDayViewsChangePercent() {
  const today = /* @__PURE__ */ new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0];
  const dayBeforeYesterday = new Date(
    (/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 2)
  ).toISOString().split("T")[0];
  const pageViewsYesterday = await getPageviewsForDate(yesterday);
  const pageViewsDayBeforeYesterday = await getPageviewsForDate(dayBeforeYesterday);
  console.table({
    pageViewsYesterday,
    pageViewsDayBeforeYesterday,
    typeY: typeof pageViewsYesterday,
    typeDBY: typeof pageViewsDayBeforeYesterday
  });
  let change = 0;
  if (pageViewsYesterday === 0 || pageViewsDayBeforeYesterday === 0) {
    return "0";
  } else {
    change = (pageViewsYesterday - pageViewsDayBeforeYesterday) / pageViewsDayBeforeYesterday * 100;
  }
  return change.toFixed(0);
}
async function getPageviewsForDate(date) {
  const url = `${PLAUSIBLE_BASE_URL}/v1/stats/aggregate?site_id=${PLAUSIBLE_SITE_ID}&period=day&date=${date}&metrics=pageviews`;
  const response = await fetch(url, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.results.pageviews.value;
}
async function getSources() {
  const url = `${PLAUSIBLE_BASE_URL}/v1/stats/breakdown?site_id=${PLAUSIBLE_SITE_ID}&property=visit:source&metrics=visitors`;
  const response = await fetch(url, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.results;
}

function assertUnreachable(_) {
  throw Error("This code should be unreachable");
}

async function fetchUserPaymentProcessorUserId(userId, prismaUserDelegate) {
  const user = await prismaUserDelegate.findUniqueOrThrow({
    where: {
      id: userId
    },
    select: {
      paymentProcessorUserId: true
    }
  });
  return user.paymentProcessorUserId;
}
function updateUserPaymentProcessorUserId({ userId, paymentProcessorUserId }, prismaUserDelegate) {
  return prismaUserDelegate.update({
    where: {
      id: userId
    },
    data: {
      paymentProcessorUserId
    }
  });
}
function updateUserSubscription({
  paymentProcessorUserId,
  paymentPlanId,
  subscriptionStatus,
  datePaid
}, userDelegate) {
  return userDelegate.update({
    where: {
      paymentProcessorUserId
    },
    data: {
      subscriptionPlan: paymentPlanId,
      subscriptionStatus,
      datePaid
    }
  });
}
function updateUserCredits({
  paymentProcessorUserId,
  numOfCreditsPurchased,
  datePaid
}, userDelegate) {
  return userDelegate.update({
    where: {
      paymentProcessorUserId
    },
    data: {
      credits: { increment: numOfCreditsPurchased },
      datePaid
    }
  });
}

async function ensureStripeCustomer(userEmail) {
  const customers = await stripeClient.customers.list({
    email: userEmail
  });
  if (customers.data.length === 0) {
    return stripeClient.customers.create({
      email: userEmail
    });
  } else {
    return customers.data[0];
  }
}
function createStripeCheckoutSession({
  priceId,
  customerId,
  mode
}) {
  return stripeClient.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode,
    success_url: `${config$1.frontendUrl}/checkout?status=success`,
    cancel_url: `${config$1.frontendUrl}/checkout?status=canceled`,
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
    customer_update: {
      address: "auto"
    },
    invoice_creation: getInvoiceCreationConfig(mode)
  });
}
function getInvoiceCreationConfig(mode) {
  return mode === "payment" ? {
    enabled: true
  } : void 0;
}

class UnhandledWebhookEventError extends Error {
  constructor(eventType) {
    super(`Unhandled event type: ${eventType}`);
    this.name = "UnhandledWebhookEventError";
  }
}

const stripeMiddlewareConfigFn = (middlewareConfig) => {
  middlewareConfig.delete("express.json");
  middlewareConfig.set(
    "express.raw",
    express.raw({ type: "application/json" })
  );
  return middlewareConfig;
};
const stripeWebhook = async (request, response, context) => {
  const prismaUserDelegate = context.entities.User;
  try {
    const event = constructStripeEvent(request);
    switch (event.type) {
      case "invoice.paid":
        await handleInvoicePaid(event, prismaUserDelegate);
        break;
      case "customer.subscription.updated":
        await handleCustomerSubscriptionUpdated(event, prismaUserDelegate);
        break;
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event, prismaUserDelegate);
        break;
      default:
        throw new UnhandledWebhookEventError(event.type);
    }
    return response.status(204).send();
  } catch (error) {
    if (error instanceof UnhandledWebhookEventError) {
      if (process.env.NODE_ENV === "development") {
        console.info("Unhandled Stripe webhook event in development: ", error);
      } else if (process.env.NODE_ENV === "production") {
        console.error("Unhandled Stripe webhook event in production: ", error);
      }
      return response.status(204).send();
    }
    console.error("Stripe webhook error:", error);
    if (error instanceof Error) {
      return response.status(400).json({ error: error.message });
    } else {
      return response.status(500).json({ error: "Error processing Stripe webhook event" });
    }
  }
};
function constructStripeEvent(request) {
  const stripeWebhookSecret = requireNodeEnvVar("STRIPE_WEBHOOK_SECRET");
  const stripeSignature = request.headers["stripe-signature"];
  if (!stripeSignature) {
    throw new Error("Stripe webhook signature not provided");
  }
  return stripeClient.webhooks.constructEvent(
    request.body,
    stripeSignature,
    stripeWebhookSecret
  );
}
async function handleInvoicePaid(event, prismaUserDelegate) {
  const invoice = event.data.object;
  const customerId = getCustomerId(invoice.customer);
  const invoicePaidAtDate = getInvoicePaidAtDate(invoice);
  const paymentPlanId = getPaymentPlanIdByPaymentProcessorPlanId(
    getInvoicePriceId(invoice)
  );
  switch (paymentPlanId) {
    case PaymentPlanId.Credits10:
      await updateUserCredits(
        {
          paymentProcessorUserId: customerId,
          datePaid: invoicePaidAtDate,
          numOfCreditsPurchased: paymentPlans[paymentPlanId].effect.amount
        },
        prismaUserDelegate
      );
      break;
    case PaymentPlanId.Pro:
    case PaymentPlanId.Hobby:
      await updateUserSubscription(
        {
          paymentProcessorUserId: customerId,
          datePaid: invoicePaidAtDate,
          paymentPlanId,
          subscriptionStatus: SubscriptionStatus.Active
        },
        prismaUserDelegate
      );
      break;
    default:
      assertUnreachable();
  }
}
function getInvoicePriceId(invoice) {
  const invoiceLineItems = invoice.lines.data;
  if (invoiceLineItems.length !== 1) {
    throw new Error("There should be exactly one line item in Stripe invoice");
  }
  const priceId = invoiceLineItems[0].pricing?.price_details?.price;
  if (!priceId) {
    throw new Error("Unable to extract price id from items");
  }
  return priceId;
}
async function handleCustomerSubscriptionUpdated(event, prismaUserDelegate) {
  const subscription = event.data.object;
  const subscriptionStatus = getOpenSaasSubscriptionStatus(subscription);
  if (!subscriptionStatus) {
    return;
  }
  const customerId = getCustomerId(subscription.customer);
  const paymentPlanId = getPaymentPlanIdByPaymentProcessorPlanId(
    getSubscriptionPriceId(subscription)
  );
  const user = await updateUserSubscription(
    { paymentProcessorUserId: customerId, paymentPlanId, subscriptionStatus },
    prismaUserDelegate
  );
  if (subscription.cancel_at_period_end && user.email) {
    await emailSender.send({
      to: user.email,
      subject: "We hate to see you go :(",
      text: "We hate to see you go. Here is a sweet offer...",
      html: "We hate to see you go. Here is a sweet offer..."
    });
  }
}
function getOpenSaasSubscriptionStatus(subscription) {
  const stripeToOpenSaasSubscriptionStatus = {
    trialing: SubscriptionStatus.Active,
    active: SubscriptionStatus.Active,
    past_due: SubscriptionStatus.PastDue,
    canceled: SubscriptionStatus.Deleted,
    unpaid: SubscriptionStatus.Deleted,
    incomplete_expired: SubscriptionStatus.Deleted,
    paused: void 0,
    incomplete: void 0
  };
  const subscriptionStatus = stripeToOpenSaasSubscriptionStatus[subscription.status];
  if (subscriptionStatus === SubscriptionStatus.Active && subscription.cancel_at_period_end) {
    return SubscriptionStatus.CancelAtPeriodEnd;
  }
  return subscriptionStatus;
}
function getSubscriptionPriceId(subscription) {
  const subscriptionItems = subscription.items.data;
  if (subscriptionItems.length !== 1) {
    throw new Error(
      "There should be exactly one subscription item in Stripe subscription"
    );
  }
  return subscriptionItems[0].price.id;
}
async function handleCustomerSubscriptionDeleted(event, prismaUserDelegate) {
  const subscription = event.data.object;
  const customerId = getCustomerId(subscription.customer);
  await updateUserSubscription(
    {
      paymentProcessorUserId: customerId,
      subscriptionStatus: SubscriptionStatus.Deleted
    },
    prismaUserDelegate
  );
}
function getCustomerId(customer) {
  if (!customer) {
    throw new Error("Customer is missing");
  } else if (typeof customer === "string") {
    return customer;
  } else {
    return customer.id;
  }
}
function getInvoicePaidAtDate(invoice) {
  if (!invoice.status_transitions.paid_at) {
    throw new Error("Invoice has not been paid yet");
  }
  return new Date(invoice.status_transitions.paid_at * 1e3);
}

const stripePaymentProcessor = {
  id: "stripe",
  createCheckoutSession: async ({
    userId,
    userEmail,
    paymentPlan,
    prismaUserDelegate
  }) => {
    const customer = await ensureStripeCustomer(userEmail);
    await updateUserPaymentProcessorUserId(
      { userId, paymentProcessorUserId: customer.id },
      prismaUserDelegate
    );
    const checkoutSession = await createStripeCheckoutSession({
      customerId: customer.id,
      priceId: paymentPlan.getPaymentProcessorPlanId(),
      mode: paymentPlanEffectToStripeCheckoutSessionMode(paymentPlan.effect)
    });
    if (!checkoutSession.url) {
      throw new Error(
        "Stripe checkout session URL is missing. Checkout session might not be active."
      );
    }
    return {
      session: {
        url: checkoutSession.url,
        id: checkoutSession.id
      }
    };
  },
  fetchCustomerPortalUrl: async ({
    prismaUserDelegate,
    userId
  }) => {
    const paymentProcessorUserId = await fetchUserPaymentProcessorUserId(
      userId,
      prismaUserDelegate
    );
    if (!paymentProcessorUserId) {
      return null;
    }
    const billingPortalSession = await stripeClient.billingPortal.sessions.create({
      customer: paymentProcessorUserId,
      return_url: `${config$1.frontendUrl}/account`
    });
    return billingPortalSession.url;
  },
  webhook: stripeWebhook,
  webhookMiddlewareConfigFn: stripeMiddlewareConfigFn
};
function paymentPlanEffectToStripeCheckoutSessionMode({
  kind
}) {
  switch (kind) {
    case "subscription":
      return "subscription";
    case "credits":
      return "payment";
    default:
      assertUnreachable();
  }
}

const paymentProcessor = stripePaymentProcessor;

const calculateDailyStats = async (_args, context) => {
  const nowUTC = new Date(Date.now());
  nowUTC.setUTCHours(0, 0, 0, 0);
  const yesterdayUTC = new Date(nowUTC);
  yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);
  try {
    const yesterdaysStats = await context.entities.DailyStats.findFirst({
      where: {
        date: {
          equals: yesterdayUTC
        }
      }
    });
    const userCount = await context.entities.User.count({});
    const paidUserCount = await context.entities.User.count({
      where: {
        subscriptionStatus: SubscriptionStatus.Active
      }
    });
    let userDelta = userCount;
    let paidUserDelta = paidUserCount;
    if (yesterdaysStats) {
      userDelta -= yesterdaysStats.userCount;
      paidUserDelta -= yesterdaysStats.paidUserCount;
    }
    let totalRevenue;
    switch (paymentProcessor.id) {
      case "stripe":
        totalRevenue = await fetchTotalStripeRevenue();
        break;
      case "lemonsqueezy":
        totalRevenue = await fetchTotalLemonSqueezyRevenue();
        break;
      default:
        assertUnreachable(paymentProcessor.id);
    }
    const { totalViews, prevDayViewsChangePercent } = await getDailyPageViews();
    let dailyStats = await context.entities.DailyStats.findUnique({
      where: {
        date: nowUTC
      }
    });
    if (!dailyStats) {
      console.log("No daily stat found for today, creating one...");
      dailyStats = await context.entities.DailyStats.create({
        data: {
          date: nowUTC,
          totalViews,
          prevDayViewsChangePercent,
          userCount,
          paidUserCount,
          userDelta,
          paidUserDelta,
          totalRevenue
        }
      });
    } else {
      console.log("Daily stat found for today, updating it...");
      dailyStats = await context.entities.DailyStats.update({
        where: {
          id: dailyStats.id
        },
        data: {
          totalViews,
          prevDayViewsChangePercent,
          userCount,
          paidUserCount,
          userDelta,
          paidUserDelta,
          totalRevenue
        }
      });
    }
    const sources = await getSources();
    for (const source of sources) {
      let visitors = source.visitors;
      if (typeof source.visitors !== "number") {
        visitors = parseInt(source.visitors);
      }
      await context.entities.PageViewSource.upsert({
        where: {
          date_name: {
            date: nowUTC,
            name: source.source
          }
        },
        create: {
          date: nowUTC,
          name: source.source,
          visitors,
          dailyStatsId: dailyStats.id
        },
        update: {
          visitors
        }
      });
    }
    console.table({ dailyStats });
  } catch (error) {
    console.error("Error calculating daily stats: ", error);
    await context.entities.Logs.create({
      data: {
        message: `Error calculating daily stats: ${error?.message}`,
        level: "job-error"
      }
    });
  }
};
async function fetchTotalStripeRevenue() {
  let totalRevenue = 0;
  let params = {
    limit: 100,
    // created: {
    //   gte: startTimestamp,
    //   lt: endTimestamp
    // },
    type: "charge"
  };
  let hasMore = true;
  while (hasMore) {
    const balanceTransactions = await stripeClient.balanceTransactions.list(params);
    for (const transaction of balanceTransactions.data) {
      if (transaction.type === "charge") {
        totalRevenue += transaction.amount;
      }
    }
    if (balanceTransactions.has_more) {
      params.starting_after = balanceTransactions.data[balanceTransactions.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }
  return totalRevenue / 100;
}
async function fetchTotalLemonSqueezyRevenue() {
  try {
    let totalRevenue = 0;
    let hasNextPage = true;
    let currentPage = 1;
    while (hasNextPage) {
      const { data: response } = await listOrders({
        filter: {
          storeId: process.env.LEMONSQUEEZY_STORE_ID
        },
        page: {
          number: currentPage,
          size: 100
        }
      });
      if (response?.data) {
        for (const order of response.data) {
          totalRevenue += order.attributes.total;
        }
      }
      hasNextPage = !response?.meta?.page.lastPage;
      currentPage++;
    }
    return totalRevenue / 100;
  } catch (error) {
    console.error("Error fetching Lemon Squeezy revenue:", error);
    throw error;
  }
}

const entities = {
  User: dbClient.user,
  DailyStats: dbClient.dailyStats,
  Logs: dbClient.logs,
  PageViewSource: dbClient.pageViewSource
};
const jobSchedule = {
  cron: "0 * * * *",
  options: {}
};
const dailyStatsJob = createJobDefinition({
  jobName: "dailyStatsJob",
  defaultJobOptions: {},
  jobSchedule,
  entities
});

registerJob({
  job: dailyStatsJob,
  jobFn: calculateDailyStats
});

const startServer = async () => {
  await startPgBoss();
  const port = normalizePort(config$1.port);
  app.set("port", port);
  const server = http.createServer(app);
  server.listen(port);
  server.on("error", (error) => {
    if (error.syscall !== "listen") throw error;
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  });
  server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Server listening on " + bind);
  });
};
startServer().catch((e) => console.error(e));
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
//# sourceMappingURL=server.js.map
