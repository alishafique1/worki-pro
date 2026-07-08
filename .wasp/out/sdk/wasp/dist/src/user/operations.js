import { HttpError, prisma } from "wasp/server";
import * as z from "zod";
import { SubscriptionStatus } from "../payment/plans";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
const updateUserAdminByIdInputSchema = z.object({
    id: z.string().nonempty(),
    isAdmin: z.boolean(),
});
export const updateIsUserAdminById = async (rawArgs, context) => {
    const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError(updateUserAdminByIdInputSchema, rawArgs);
    if (!context.user) {
        throw new HttpError(401, "Only authenticated users are allowed to perform this operation");
    }
    if (!context.user.isAdmin) {
        throw new HttpError(403, "Only admins are allowed to perform this operation");
    }
    return context.entities.User.update({
        where: { id },
        data: { isAdmin },
    });
};
// ── Validation helpers (mirrored from src/auth/onboarding/validation.ts) ─────
const CANADIAN_PHONE = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const GTA_POSTAL_PREFIX = /^[LM]/i;
const updateUserProfileInputSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .refine((v) => CANADIAN_PHONE.test(v.trim()), {
        message: "Enter a valid Canadian phone number (e.g. (416) 555-0100).",
    }),
    postalCode: z
        .string()
        .min(1, "Postal code is required")
        .refine((v) => CA_POSTAL.test(v.trim()), {
        message: "Enter a valid Canadian postal code (e.g. L9T 2X5).",
    })
        .refine((v) => GTA_POSTAL_PREFIX.test(v.trim()), {
        message: "We currently serve the GTA (postal codes starting with L or M).",
    }),
    smsConsent: z.boolean(),
});
export const updateUserProfile = async (rawArgs, context) => {
    if (!context.user) {
        throw new HttpError(401, "Authentication required");
    }
    const { firstName, lastName, phone, postalCode, smsConsent } = ensureArgsSchemaOrThrowHttpError(updateUserProfileInputSchema, rawArgs);
    // Only stamp smsConsentAt when the user is newly opting in
    const existingUser = await context.entities.User.findUnique({
        where: { id: context.user.id },
        select: { smsConsent: true },
    });
    const smsConsentAt = smsConsent && !existingUser?.smsConsent ? new Date() : undefined;
    return context.entities.User.update({
        where: { id: context.user.id },
        data: {
            firstName,
            ...(lastName !== undefined && { lastName }),
            phone,
            postalCode,
            smsConsent,
            ...(smsConsentAt !== undefined && { smsConsentAt }),
        },
    });
};
const getPaginatorArgsSchema = z.object({
    skipPages: z.number(),
    filter: z.object({
        emailContains: z.string().nonempty().optional(),
        isAdmin: z.boolean().optional(),
        subscriptionStatusIn: z
            .array(z.nativeEnum(SubscriptionStatus).nullable())
            .optional(),
    }),
});
export const getPaginatedUsers = async (rawArgs, context) => {
    if (!context.user) {
        throw new HttpError(401, "Only authenticated users are allowed to perform this operation");
    }
    if (!context.user.isAdmin) {
        throw new HttpError(403, "Only admins are allowed to perform this operation");
    }
    const { skipPages, filter: { subscriptionStatusIn: subscriptionStatus, emailContains, isAdmin, }, } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);
    const includeUnsubscribedUsers = !!subscriptionStatus?.some((status) => status === null);
    const desiredSubscriptionStatuses = subscriptionStatus?.filter((status) => status !== null);
    const pageSize = 10;
    const userPageQuery = {
        skip: skipPages * pageSize,
        take: pageSize,
        where: {
            AND: [
                {
                    email: {
                        contains: emailContains,
                        mode: "insensitive",
                    },
                    isAdmin,
                },
                {
                    OR: [
                        {
                            subscriptionStatus: {
                                in: desiredSubscriptionStatuses,
                            },
                        },
                        {
                            subscriptionStatus: includeUnsubscribedUsers ? null : undefined,
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            email: true,
            username: true,
            isAdmin: true,
            subscriptionStatus: true,
            paymentProcessorUserId: true,
        },
        orderBy: {
            username: "asc",
        },
    };
    const [pageOfUsers, totalUsers] = await prisma.$transaction([
        context.entities.User.findMany(userPageQuery),
        context.entities.User.count({ where: userPageQuery.where }),
    ]);
    const totalPages = Math.ceil(totalUsers / pageSize);
    return {
        users: pageOfUsers,
        totalPages,
    };
};
//# sourceMappingURL=operations.js.map