import type {
  ServiceRequest,
  Provider,
  Appointment,
  ProviderFee,
  ProviderCategory,
  ServiceCategory,
  CommunicationLog,
  Review,
} from "wasp/entities";
import { maskLead, type MaskedLead } from "./leadMasking";
import type {
  GetProviderLeads,
  GetProviderAppointments,
  GetProviderProfile,
  GetProviderFees,
  AcceptServiceRequest,
  MarkJobCompleted,
  SubmitProviderApplication,
  CreateProviderProfile,
  UpdateProviderServices,
  UpdateProviderProfile,
  UpdateProviderAppointment,
  SendProviderMessage,
  GetPublicLeadFeed,
  ClaimLead,
  GetPublicProvider,
  DisputeLeadFee,
  ResubmitProviderApplication,
  AddPortfolioPhoto,
  RemovePortfolioPhoto,
  SetProfilePhoto,
  RespondToReview,
  GetMyProviderReviews,
} from "wasp/server/operations";
import { checkFileExistsInS3, deleteFileFromS3 } from '../file-upload/s3Utils';
import { HttpError, prisma } from "wasp/server";
import { emailSender } from "wasp/server/email";
import { chargeProviderFee } from "./billing";
import { getLeadFee } from "../shared/leadPricing";
import {
  assertTransition,
  canTransition,
  CLAIMABLE_STATUSES,
} from "../shared/requestStatusMachine";

const requireProvider = async (context: any) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
  });
  if (!provider) throw new HttpError(403, "Provider profile required.");
  return provider;
};

export const getProviderLeads: GetProviderLeads<
  void,
  ServiceRequest[]
> = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.ServiceRequest.findMany({
    where: {
      assignedProviderId: provider.id,
      status: { in: ["ASSIGNED", "ACCEPTED_BY_PROVIDER", "BOOKED"] },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProviderAppointments: GetProviderAppointments<
  void,
  any[]
> = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.Appointment.findMany({
    where: { providerId: provider.id },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
    include: {
      serviceRequest: {
        include: {
          communicationLogs: { orderBy: { createdAt: "asc" } },
          assignedProvider: true,
          serviceCategory: true,
        },
      },
    },
  });
};

export const getProviderProfile: GetProviderProfile<
  void,
  Provider & {
    categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
  }
> = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
    include: { categories: { include: { serviceCategory: true } } },
  });
  if (!provider) throw new HttpError(404, "Profile not found.");
  return provider;
};

export const getProviderFees: GetProviderFees<void, ProviderFee[]> = async (
  args,
  context,
) => {
  const provider = await requireProvider(context);
  return context.entities.ProviderFee.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
  });
};

export const acceptServiceRequest: AcceptServiceRequest<
  { requestId: string },
  Appointment
> = async ({ requestId }, context) => {
  const provider = await requireProvider(context);

  const req = await context.entities.ServiceRequest.findUnique({
    where: { id: requestId },
  });
  if (!req || req.assignedProviderId !== provider.id)
    throw new HttpError(403, "Invalid request.");

  // Idempotent: if this provider already accepted, return the existing
  // appointment instead of creating an orphan + double-awarding points.
  if (req.status === "ACCEPTED_BY_PROVIDER") {
    const existingAppointment = await context.entities.Appointment.findFirst({
      where: { serviceRequestId: requestId, providerId: provider.id },
      orderBy: { createdAt: "desc" },
    });
    if (existingAppointment) return existingAppointment;
    // Status already correct but the appointment write was lost — recreate it
    // below without re-touching status.
  } else {
    assertTransition(req.status, "ACCEPTED_BY_PROVIDER");
    await context.entities.ServiceRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED_BY_PROVIDER" },
    });
  }

  const appointment = await context.entities.Appointment.create({
    data: {
      serviceRequestId: requestId,
      providerId: provider.id,
      consumerId: req.consumerId,
      status: "PROPOSED",
    },
  });

  // Award 500 pts ($5) to consumer when appointment is booked
  if (req.consumerId) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: req.consumerId,
        serviceRequestId: requestId,
        type: "BOOKED_APPOINTMENT",
        points: 500,
        status: "PENDING",
        reason: "Appointment booked — $5 reward pending",
      },
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: req.consumerId },
      create: {
        consumerId: req.consumerId,
        pointsBalance: 0,
        lifetimePoints: 0,
      },
      update: {},
    });
  }

  return appointment;
};

type UpdateProviderProfileInput = {
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  serviceAreas?: string[];
  calComUsername?: string;
  // Bark-style profile fields
  slug?: string;
  bio?: string;
  profilePhotoUrl?: string;
  portfolioJson?: string;
  accreditationsJson?: string;
  responseTimeMins?: number;
  // Credentials (optional; admin verifies against public registries)
  licenceNumber?: string;
  insuranceUrl?: string;
  wsibClearanceNumber?: string;
};

type CreateProviderProfileInput = {
  businessName: string;
  contactName?: string;
  phone: string;
  email?: string;
  website?: string;
  serviceAreas?: string[];
};

type SubmitProviderApplicationInput = {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  website?: string;
  serviceAreas: string[];
  calComUsername?: string;
  serviceCategorySlugs?: string[];
  // Optional credentials — never block application submit.
  licenceNumber?: string;
  insuranceUrl?: string;
  wsibClearanceNumber?: string;
};

const normalizeStringArray = (values: string[] | undefined) =>
  [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];

export const createProviderProfile: CreateProviderProfile<
  CreateProviderProfileInput,
  Provider
> = async (args, context) => {
  if (!context.user) throw new HttpError(401);

  const existing = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
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
      verificationStatus: "PENDING",
    },
  });
};

export const submitProviderApplication: SubmitProviderApplication<
  SubmitProviderApplicationInput,
  Provider
> = async (args, context) => {
  if (!context.user) throw new HttpError(401);

  const businessName = args.businessName.trim();
  const contactName = args.contactName.trim();
  const phone = args.phone.trim();
  const email = args.email.trim();
  const website = args.website?.trim() || null;
  const serviceAreas = normalizeStringArray(args.serviceAreas);
  const calComUsername = args.calComUsername?.trim() || null;
  const serviceCategorySlugs = normalizeStringArray(args.serviceCategorySlugs);
  // Optional credentials: undefined is skipped by Prisma, so re-submitting the
  // application with blank credential fields never wipes saved values.
  const credentialData = {
    licenceNumber: args.licenceNumber?.trim() || undefined,
    insuranceUrl: args.insuranceUrl?.trim() || undefined,
    wsibClearanceNumber: args.wsibClearanceNumber?.trim() || undefined,
  };

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
      // Do NOT reset verificationStatus here: an already-VERIFIED pro editing
      // their application must not be silently knocked back to PENDING.
      businessName,
      contactName,
      phone,
      email,
      website,
      serviceAreas,
      calComUsername,
      ...credentialData,
      active: true,
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
      ...credentialData,
      verificationStatus: "PENDING",
      active: true,
    },
  });

  await context.entities.User.update({
    where: { id: context.user.id },
    data: { role: "PROVIDER", phone },
  });

  if (serviceCategorySlugs.length > 0) {
    const categories = await context.entities.ServiceCategory.findMany({
      where: { slug: { in: serviceCategorySlugs }, active: true },
      select: { id: true },
    });

    await context.entities.ProviderCategory.deleteMany({
      where: { providerId: provider.id },
    });

    if (categories.length > 0) {
      await context.entities.ProviderCategory.createMany({
        data: categories.map((category) => ({
          providerId: provider.id,
          serviceCategoryId: category.id,
        })),
        skipDuplicates: true,
      });
    }
  }

  // Notify admin of new provider application (fire-and-forget)
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean);
  for (const adminEmail of adminEmails) {
    emailSender.send({
      to: adminEmail,
      subject: `New provider application: ${businessName}`,
      text: `A new provider application was submitted.\n\nBusiness: ${businessName}\nContact: ${contactName}\nPhone: ${phone}\nEmail: ${email}\nAreas: ${serviceAreas.join(', ')}\n\nReview: https://thehelper.ca/admin/providers`,
      html: `<p>A new provider application was submitted.</p><ul><li><strong>Business:</strong> ${businessName}</li><li><strong>Contact:</strong> ${contactName}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${email}</li><li><strong>Areas:</strong> ${serviceAreas.join(', ')}</li></ul><p><a href="https://thehelper.ca/admin/providers">Review in admin →</a></p>`,
    }).catch(() => {/* non-blocking */});
  }

  return provider;
};

export const updateProviderProfile: UpdateProviderProfile<
  UpdateProviderProfileInput,
  Provider
> = async (args, context) => {
  const provider = await requireProvider(context);

  if (args.businessName !== undefined && args.businessName.trim() === "") {
    throw new HttpError(400, "Business name cannot be empty.");
  }
  if (args.phone !== undefined && args.phone.trim() === "") {
    throw new HttpError(400, "Phone cannot be empty.");
  }

  const data: Record<string, any> = {};
  if (args.businessName !== undefined)
    data.businessName = args.businessName.trim();
  if (args.contactName !== undefined) data.contactName = args.contactName;
  if (args.phone !== undefined) data.phone = args.phone.trim();
  if (args.email !== undefined) data.email = args.email;
  if (args.website !== undefined) data.website = args.website;
  if (args.serviceAreas !== undefined) data.serviceAreas = args.serviceAreas;
  if (args.calComUsername !== undefined) data.calComUsername = args.calComUsername || null;
  // Bark-style profile fields
  if (args.slug !== undefined) {
    const slug = args.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    data.slug = slug || null;
  }
  if (args.bio !== undefined) data.bio = args.bio || null;
  if (args.profilePhotoUrl !== undefined) data.profilePhotoUrl = args.profilePhotoUrl || null;
  if (args.portfolioJson !== undefined) data.portfolioJson = args.portfolioJson;
  if (args.accreditationsJson !== undefined) data.accreditationsJson = args.accreditationsJson;
  if (args.responseTimeMins !== undefined) data.responseTimeMins = args.responseTimeMins || null;
  // Credentials — explicit empty string clears the value (owner can retract).
  if (args.licenceNumber !== undefined) data.licenceNumber = args.licenceNumber.trim() || null;
  if (args.insuranceUrl !== undefined) data.insuranceUrl = args.insuranceUrl.trim() || null;
  if (args.wsibClearanceNumber !== undefined) data.wsibClearanceNumber = args.wsibClearanceNumber.trim() || null;

  return context.entities.Provider.update({
    where: { id: provider.id },
    data,
  });
};

export const markJobCompleted: MarkJobCompleted<
  { appointmentId: string },
  Appointment
> = async ({ appointmentId }, context) => {
  const provider = await requireProvider(context);

  const appt = await context.entities.Appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appt || appt.providerId !== provider.id) throw new HttpError(403);
  if (appt.status === "COMPLETED") return appt;

  // Validate the ServiceRequest transition BEFORE touching the appointment so
  // a 409 never leaves the two rows out of sync. If the request is already
  // COMPLETED (e.g. via webhook) skip the redundant status write.
  const serviceRequest = await context.entities.ServiceRequest.findUnique({
    where: { id: appt.serviceRequestId },
    select: { status: true },
  });
  const needsRequestUpdate =
    !!serviceRequest && serviceRequest.status !== "COMPLETED";
  if (needsRequestUpdate) {
    assertTransition(serviceRequest.status, "COMPLETED");
  }

  const completedAt = new Date();
  const updatedAppt = await context.entities.Appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED", completedAt },
  });

  if (needsRequestUpdate) {
    await context.entities.ServiceRequest.update({
      where: { id: appt.serviceRequestId },
      data: { status: "COMPLETED", completedAt },
    });
  }

  // Award 5,000 pts ($50) to consumer when job is verified complete
  if (appt.consumerId) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: appt.consumerId,
        serviceRequestId: appt.serviceRequestId,
        type: "COMPLETED_SERVICE",
        points: 5000,
        status: "PENDING",
        reason: "Job completed — $50 reward pending admin verification",
      },
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: appt.consumerId },
      create: {
        consumerId: appt.consumerId,
        pointsBalance: 0,
        lifetimePoints: 0,
      },
      update: {},
    });

    // Check if this consumer was referred — award 500 pts to both referrer and referred
    const referral = await context.entities.Referral.findFirst({
      where: { referredUserId: appt.consumerId, status: "SIGNED_UP" },
    });
    if (referral) {
      // Award referred user
      await context.entities.RewardTransaction.create({
        data: {
          consumerId: appt.consumerId,
          type: "REFERRAL",
          points: 500,
          status: "APPROVED",
          reason: "Referral bonus — first service completed",
        },
      });
      await context.entities.RewardAccount.upsert({
        where: { consumerId: appt.consumerId },
        create: { consumerId: appt.consumerId, pointsBalance: 500, lifetimePoints: 500 },
        update: { pointsBalance: { increment: 500 }, lifetimePoints: { increment: 500 } },
      });

      // Award referrer
      await context.entities.RewardTransaction.create({
        data: {
          consumerId: referral.referrerUserId,
          type: "REFERRAL",
          points: 500,
          status: "APPROVED",
          reason: `Referral bonus — your referred friend completed their first service`,
        },
      });
      await context.entities.RewardAccount.upsert({
        where: { consumerId: referral.referrerUserId },
        create: { consumerId: referral.referrerUserId, pointsBalance: 500, lifetimePoints: 500 },
        update: { pointsBalance: { increment: 500 }, lifetimePoints: { increment: 500 } },
      });

      await context.entities.Referral.update({
        where: { id: referral.id },
        data: { status: "REWARDED", completedAt: completedAt },
      });
    }
  }

  return updatedAppt;
};

type ServiceListing = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  categorySlug: string;
};

type UpdateProviderServicesInput = {
  services: ServiceListing[];
};

export const updateProviderServices: UpdateProviderServices<UpdateProviderServicesInput, Provider> = async ({ services }, context) => {
  const provider = await requireProvider(context);
  return context.entities.Provider.update({
    where: { id: provider.id },
    data: { servicesJson: JSON.stringify(services) },
  });
};

type UpdateProviderAppointmentInput = {
  appointmentId: string;
  scheduledAt?: string;
  status?: "PROPOSED" | "CONFIRMED" | "RESCHEDULED" | "CANCELLED" | "NO_SHOW";
  providerNotes?: string;
};

export const updateProviderAppointment: UpdateProviderAppointment<
  UpdateProviderAppointmentInput,
  Appointment
> = async (args, context) => {
  const provider = await requireProvider(context);

  const appointment = await context.entities.Appointment.findUnique({
    where: { id: args.appointmentId },
  });

  if (!appointment || appointment.providerId !== provider.id) {
    throw new HttpError(403, "Invalid appointment.");
  }

  if (appointment.status === "COMPLETED") {
    throw new HttpError(400, "Completed appointments cannot be rescheduled.");
  }

  const data: Record<string, any> = {};
  if (args.scheduledAt !== undefined) {
    const date = new Date(args.scheduledAt);
    if (Number.isNaN(date.getTime())) {
      throw new HttpError(400, "Invalid appointment date.");
    }
    data.scheduledAt = date;
    if (!args.status) data.status = "CONFIRMED";
  }
  if (args.status !== undefined) data.status = args.status;
  if (args.providerNotes !== undefined)
    data.providerNotes = args.providerNotes.trim() || null;

  const updated = await context.entities.Appointment.update({
    where: { id: args.appointmentId },
    data,
  });

  // Mirror the appointment change onto the ServiceRequest only when the
  // status machine allows it — otherwise skip (the appointment update stands).
  const serviceRequest = await context.entities.ServiceRequest.findUnique({
    where: { id: updated.serviceRequestId },
    select: { status: true },
  });

  if (serviceRequest) {
    const target =
      updated.status === "CONFIRMED"
        ? ("BOOKED" as const)
        : updated.status === "CANCELLED" || updated.status === "NO_SHOW"
          ? ("CLOSED" as const)
          : null;

    if (target && canTransition(serviceRequest.status, target)) {
      await context.entities.ServiceRequest.update({
        where: { id: updated.serviceRequestId },
        data:
          target === "BOOKED"
            ? { status: "BOOKED", bookedAt: updated.scheduledAt || new Date() }
            : { status: "CLOSED" },
      });
    } else if (target) {
      console.warn(
        `[updateProviderAppointment] Skipping request status ${serviceRequest.status}→${target} for ${updated.serviceRequestId} — invalid transition`,
      );
    }
  }

  return updated;
};

export const sendProviderMessage: SendProviderMessage<
  { requestId: string; body: string },
  CommunicationLog
> = async ({ requestId, body }, context) => {
  const provider = await requireProvider(context);

  const trimmedBody = body.trim();
  if (trimmedBody.length < 1) {
    throw new HttpError(400, "Message cannot be empty.");
  }
  if (trimmedBody.length > 1000) {
    throw new HttpError(400, "Message must be 1,000 characters or fewer.");
  }

  const serviceRequest = await context.entities.ServiceRequest.findFirst({
    where: {
      id: requestId,
      OR: [
        { assignedProviderId: provider.id },
        { appointments: { some: { providerId: provider.id } } },
      ],
    },
  });

  if (!serviceRequest) {
    throw new HttpError(404, "Service request not found.");
  }

  const log = await context.entities.CommunicationLog.create({
    data: {
      userId: context.user!.id,
      serviceRequestId: serviceRequest.id,
      providerId: provider.id,
      channel: "INTERNAL_NOTE",
      direction: "OUTBOUND",
      from: provider.businessName,
      to: serviceRequest.email || serviceRequest.name || "Customer",
      body: trimmedBody,
      status: "SENT",
    },
  });

  // Notify consumer by email (fire-and-forget)
  if (serviceRequest.email) {
    emailSender.send({
      to: serviceRequest.email,
      subject: `New message from ${provider.businessName}`,
      text: `Hi ${serviceRequest.name},\n\n${provider.businessName} sent you a message on TheHelper:\n\n"${trimmedBody}"\n\nView the thread:\nhttps://thehelper.ca/my-requests/${serviceRequest.id}/messages\n\nThe TheHelper Team`,
      html: `<p>Hi ${serviceRequest.name},</p><p><strong>${provider.businessName}</strong> sent you a message on TheHelper:</p><blockquote>${trimmedBody}</blockquote><p><a href="https://thehelper.ca/my-requests/${serviceRequest.id}/messages">View the thread</a></p>`,
    }).catch((err: Error) => {
      console.warn("[sendProviderMessage] email notification failed:", err.message);
    });
  }

  return log;
};

// ─── Bark-style Public Lead Feed (masked) ────────────────────────────────────

export const getPublicLeadFeed: GetPublicLeadFeed<
  { categorySlug?: string; urgency?: string; limit?: number; offset?: number },
  MaskedLead[]
> = async ({ categorySlug, urgency, limit = 20, offset = 0 }, context) => {
  const provider = await requireProvider(context);

  // Build category filter based on pro's registered categories
  const providerCats = await context.entities.ProviderCategory.findMany({
    where: { providerId: provider.id },
    include: { serviceCategory: true },
  });
  const proSlugs = providerCats.map((pc) => pc.serviceCategory.slug);

  // Only surface leads a provider can actually claim (statuses from which
  // → ASSIGNED is a legal transition per the request status machine).
  const where: Record<string, any> = {
    status: { in: CLAIMABLE_STATUSES },
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
    include: { serviceCategory: true },
  });

  // Mask PII — never expose name, phone, email. maskLead is the single source
  // of truth for this rule; see leadMasking.test.ts for the regression guard.
  return requests.map(maskLead);
};

// ─── Claim Lead (reveals contact, creates ProviderFee) ───────────────────────

export const claimLead: ClaimLead<
  { requestId: string },
  { request: ServiceRequest; alreadyClaimed: boolean }
> = async ({ requestId }, context) => {
  const provider = await requireProvider(context);

  if (provider.verificationStatus !== "VERIFIED") {
    throw new HttpError(403, "Only verified providers can claim leads.");
  }

  const req = await context.entities.ServiceRequest.findUnique({
    where: { id: requestId },
    include: { serviceCategory: { select: { slug: true } } },
  });
  if (!req) throw new HttpError(404, "Lead not found.");

  // Already claimed by this provider — return existing (idempotent)
  if (req.assignedProviderId === provider.id) {
    return { request: req, alreadyClaimed: true };
  }

  // Already claimed by someone else (fast pre-check; the atomic gate below is
  // what actually prevents the race)
  if (req.assignedProviderId && req.assignedProviderId !== provider.id) {
    throw new HttpError(409, "This lead has already been claimed by another provider.");
  }

  // Status machine gate: only statuses from which → ASSIGNED is legal are
  // claimable. (Fast pre-check for a clear error; the updateMany WHERE below
  // re-checks atomically.)
  if (!CLAIMABLE_STATUSES.includes(req.status)) {
    throw new HttpError(409, `This lead is not open for claims (status ${req.status}).`);
  }

  // Category-based lead fee — see src/shared/leadPricing.ts.
  const leadFee = getLeadFee(req.serviceCategory?.slug);

  // All three writes must succeed together: if the fee write fails after
  // the lead is assigned, the provider has contact info with no revenue record.
  //
  // The claim itself is an atomic compare-and-set: updateMany only matches the
  // row while assignedProviderId is still null, so of N concurrent claimers
  // exactly one gets count === 1. Losers get null back and are resolved below
  // (never a fee, never an email).
  const updated = await prisma.$transaction(async (tx) => {
    const { count } = await tx.serviceRequest.updateMany({
      // The status filter enforces the state machine atomically: only rows
      // still in a claimable status (→ ASSIGNED legal) match.
      where: {
        id: requestId,
        assignedProviderId: null,
        status: { in: CLAIMABLE_STATUSES },
      },
      data: {
        assignedProviderId: provider.id,
        status: "ASSIGNED",
      },
    });

    if (count !== 1) {
      return null; // lost the race — no fee, no log
    }

    const fee = await tx.providerFee.create({
      data: {
        providerId: provider.id,
        serviceRequestId: requestId,
        feeType: "QUALIFIED_LEAD",
        amount: leadFee,
        status: "PENDING",
      },
    });

    await tx.communicationLog.create({
      data: {
        providerId: provider.id,
        serviceRequestId: requestId,
        channel: "INTERNAL_NOTE",
        direction: "OUTBOUND",
        from: provider.businessName,
        to: req.email || req.name || "Customer",
        body: "Lead claimed — contact details now available.",
        status: "DELIVERED",
      },
    });

    return {
      request: await tx.serviceRequest.findUniqueOrThrow({
        where: { id: requestId },
      }),
      feeId: fee.id,
    };
  });

  // Lost the atomic gate: figure out who won.
  if (!updated) {
    const current = await context.entities.ServiceRequest.findUnique({
      where: { id: requestId },
    });
    if (current && current.assignedProviderId === provider.id) {
      // Same provider raced itself (double-click / retry) — idempotent
      return { request: current, alreadyClaimed: true };
    }
    if (current && !current.assignedProviderId) {
      // Unclaimed but the status moved out of the claimable set mid-flight
      throw new HttpError(409, `This lead is not open for claims (status ${current.status}).`);
    }
    throw new HttpError(409, "This lead has already been claimed by another provider.");
  }

  // Charge the provider's card on file for the lead fee (fire-and-forget,
  // OUTSIDE the transaction — no network calls in a tx). chargeProviderFee
  // never throws: on any failure the fee simply stays PENDING and the claim
  // stands. See src/provider/billing.ts.
  void chargeProviderFee(updated.feeId);

  // Notify consumer by email (fire-and-forget)
  if (req.email) {
    emailSender.send({
      to: req.email,
      subject: `${provider.businessName} is interested in your request`,
      text: `Hi ${req.name},\n\n${provider.businessName} has responded to your service request on TheHelper and is ready to help.\n\nLog in to view their message and contact details:\nhttps://thehelper.ca/my-requests/${requestId}/messages\n\nThe TheHelper Team`,
      html: `<p>Hi ${req.name},</p><p><strong>${provider.businessName}</strong> has responded to your service request on TheHelper and is ready to help.</p><p><a href="https://thehelper.ca/my-requests/${requestId}/messages">View their message</a></p><p>The TheHelper Team</p>`,
    }).catch((err: Error) => {
      console.warn("[claimLead] email notification failed:", err.message);
    });
  }

  return { request: updated.request, alreadyClaimed: false };
};

// ─── Dispute Lead Fee (bad-lead credit workflow) ─────────────────────────────
//
// Providers can dispute a QUALIFIED_LEAD fee within 45 days of the claim
// (Thumbtack-style bad-lead refund — the #1 pro-retention feature in lead-gen).
// The fee flips to DISPUTED and an admin resolves it via resolveFeeDispute:
// CREDIT → WAIVED (+ Stripe refund if it was paid), REJECT → back to PAID/PENDING.

export const DISPUTE_REASONS = [
  "WRONG_NUMBER",
  "SPAM",
  "DUPLICATE",
  "OUT_OF_AREA",
  "OTHER",
] as const;
export type DisputeReason = (typeof DISPUTE_REASONS)[number];

const DISPUTE_WINDOW_DAYS = 45;

type DisputeLeadFeeInput = {
  feeId: string;
  reason: DisputeReason;
  note?: string;
};

export const disputeLeadFee: DisputeLeadFee<
  DisputeLeadFeeInput,
  ProviderFee
> = async ({ feeId, reason, note }, context) => {
  const provider = await requireProvider(context);

  if (!DISPUTE_REASONS.includes(reason)) {
    throw new HttpError(400, "Invalid dispute reason.");
  }
  const trimmedNote = note?.trim() || null;
  if (trimmedNote && trimmedNote.length > 1000) {
    throw new HttpError(400, "Note must be 1,000 characters or fewer.");
  }

  const fee = await context.entities.ProviderFee.findUnique({
    where: { id: feeId },
  });
  if (!fee || fee.providerId !== provider.id) {
    throw new HttpError(404, "Fee not found.");
  }
  if (fee.feeType !== "QUALIFIED_LEAD") {
    throw new HttpError(400, "Only lead fees can be disputed.");
  }
  if (fee.status === "DISPUTED") {
    throw new HttpError(400, "This fee is already under review.");
  }
  if (fee.status !== "PENDING" && fee.status !== "PAID") {
    throw new HttpError(400, "This fee can no longer be disputed.");
  }

  const windowMs = DISPUTE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - new Date(fee.createdAt).getTime() > windowMs) {
    throw new HttpError(
      400,
      `Lead fees can only be disputed within ${DISPUTE_WINDOW_DAYS} days.`,
    );
  }

  return context.entities.ProviderFee.update({
    where: { id: fee.id },
    data: {
      status: "DISPUTED",
      disputeReason: reason,
      disputeNote: trimmedNote,
      disputedAt: new Date(),
    },
  });
};

// ─── Public Provider Profile (by slug) ───────────────────────────────────────

// Public-profile shape only — this query is unauthenticated. PII and internal
// fields (phone, email, raw licence/insurance/WSIB numbers, Stripe ids) are
// deliberately never returned. Credential presence is exposed as booleans
// only; since the query filters verificationStatus === VERIFIED, a true flag
// always means "on file AND admin-verified".
type PublicProviderProfile = Pick<
  Provider,
  | "id"
  | "slug"
  | "businessName"
  | "website"
  | "bio"
  | "profilePhotoUrl"
  | "portfolioJson"
  | "accreditationsJson"
  | "responseTimeMins"
  | "serviceAreas"
  | "ratingInternal"
  | "verificationStatus"
  | "createdAt"
> & {
  categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
  reviews: Review[];
  hasLicence: boolean;
  hasInsurance: boolean;
  hasWsib: boolean;
};

export const getPublicProvider: GetPublicProvider<
  { slug: string },
  PublicProviderProfile | null
> = async ({ slug }, context) => {
  const provider = await context.entities.Provider.findFirst({
    where: { slug, active: true, verificationStatus: "VERIFIED" },
    select: {
      id: true,
      slug: true,
      businessName: true,
      website: true,
      bio: true,
      profilePhotoUrl: true,
      portfolioJson: true,
      accreditationsJson: true,
      responseTimeMins: true,
      serviceAreas: true,
      ratingInternal: true,
      verificationStatus: true,
      createdAt: true,
      // Raw credential values — read server-side only, reduced to booleans below.
      licenceNumber: true,
      tssaRegistrationNumber: true,
      insuranceUrl: true,
      insuranceStatus: true,
      wsibClearanceNumber: true,
      categories: { include: { serviceCategory: true } },
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });
  if (!provider) return null;

  const {
    licenceNumber,
    tssaRegistrationNumber,
    insuranceUrl,
    insuranceStatus,
    wsibClearanceNumber,
    ...publicFields
  } = provider;

  return {
    ...publicFields,
    hasLicence: Boolean(licenceNumber?.trim() || tssaRegistrationNumber?.trim()),
    hasInsurance: Boolean(insuranceUrl?.trim()) || insuranceStatus,
    hasWsib: Boolean(wsibClearanceNumber?.trim()),
  };
};

// ─── Issue 3: Resubmit rejected application ─────────────────────────────────

export const resubmitProviderApplication: ResubmitProviderApplication<
  void,
  Provider
> = async (args, context) => {
  if (!context.user) throw new HttpError(401);

  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
  });
  if (!provider) throw new HttpError(404, "Provider profile not found.");
  if (provider.verificationStatus !== "REJECTED") {
    throw new HttpError(400, "Only rejected applications can be resubmitted.");
  }

  const updated = await context.entities.Provider.update({
    where: { id: provider.id },
    data: { verificationStatus: "PENDING" },
  });

  // Notify admin of resubmission
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e: string) => e.trim()).filter(Boolean);
  for (const adminEmail of adminEmails) {
    emailSender.send({
      to: adminEmail,
      subject: `Provider resubmission: ${provider.businessName}`,
      text: `A provider has resubmitted their application.\n\nBusiness: ${provider.businessName}\nEmail: ${context.user.email ?? 'N/A'}\n\nReview: https://thehelper.ca/admin/providers`,
      html: `<p>A provider has resubmitted their application.</p><p><strong>Business:</strong> ${provider.businessName}</p><p><strong>Email:</strong> ${context.user.email ?? 'N/A'}</p><p><a href="https://thehelper.ca/admin/providers">Review in admin →</a></p>`,
    }).catch(() => {/* non-blocking */});
  }

  return updated;
};

// ─── Portfolio & profile photo actions ───────────────────────────────────────

const MAX_PORTFOLIO = 12;
const publicUrl = (s3Key: string) => `${process.env.R2_PUBLIC_URL}/${s3Key}`;

async function getMyProvider(context: any) {
  if (!context.user) throw new HttpError(401, 'Not authorized');
  const provider = await context.entities.Provider.findFirst({ where: { userId: context.user.id } });
  if (!provider) throw new HttpError(404, 'Provider profile not found');
  return provider;
}

type PortfolioItem = { url: string; caption?: string };

export const addPortfolioPhoto: AddPortfolioPhoto<
  { s3Key: string; caption?: string },
  PortfolioItem[]
> = async ({ s3Key, caption }, context) => {
  const provider = await getMyProvider(context);
  const exists = await checkFileExistsInS3({ s3Key });
  if (!exists) throw new HttpError(404, 'Uploaded file not found in storage');
  const portfolio: PortfolioItem[] = provider.portfolioJson
    ? JSON.parse(provider.portfolioJson)
    : [];
  if (portfolio.length >= MAX_PORTFOLIO) {
    throw new HttpError(400, `Maximum ${MAX_PORTFOLIO} photos allowed`);
  }
  portfolio.push({ url: publicUrl(s3Key), ...(caption ? { caption } : {}) });
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { portfolioJson: JSON.stringify(portfolio) },
  });
  return portfolio;
};

export const removePortfolioPhoto: RemovePortfolioPhoto<
  { url: string },
  PortfolioItem[]
> = async ({ url }, context) => {
  const provider = await getMyProvider(context);
  const portfolio: PortfolioItem[] = provider.portfolioJson
    ? JSON.parse(provider.portfolioJson)
    : [];
  const next = portfolio.filter((p) => p.url !== url);
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { portfolioJson: JSON.stringify(next) },
  });
  // Best-effort deletion from R2
  if (process.env.R2_PUBLIC_URL && url.startsWith(process.env.R2_PUBLIC_URL)) {
    const s3Key = url.slice(process.env.R2_PUBLIC_URL.length + 1);
    try { await deleteFileFromS3({ s3Key }); } catch { /* non-blocking */ }
  }
  return next;
};

export const setProfilePhoto: SetProfilePhoto<
  { url: string },
  { profilePhotoUrl: string }
> = async ({ url }, context) => {
  const provider = await getMyProvider(context);
  await context.entities.Provider.update({
    where: { id: provider.id },
    data: { profilePhotoUrl: url },
  });
  return { profilePhotoUrl: url };
};

// ─── Provider Reviews ─────────────────────────────────────────────────────────

export const getMyProviderReviews: GetMyProviderReviews<
  void,
  Review[]
> = async (_args, context) => {
  const provider = await getMyProvider(context);
  return context.entities.Review.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: 'desc' },
  });
};

export const respondToReview: RespondToReview<
  { reviewId: string; response: string },
  Review
> = async ({ reviewId, response }, context) => {
  const provider = await getMyProvider(context);

  const trimmed = response.trim();
  if (!trimmed) throw new HttpError(400, 'Response cannot be empty.');
  if (trimmed.length > 1000) throw new HttpError(400, 'Response must be 1,000 characters or fewer.');

  const review = await context.entities.Review.findUnique({ where: { id: reviewId } });
  if (!review || review.providerId !== provider.id) {
    throw new HttpError(404, 'Review not found.');
  }
  if (review.status !== 'PUBLISHED') {
    throw new HttpError(400, 'You can only respond to published reviews.');
  }
  if (review.providerResponse) {
    throw new HttpError(409, 'You have already responded to this review.');
  }

  return context.entities.Review.update({
    where: { id: reviewId },
    data: { providerResponse: trimmed, respondedAt: new Date() },
  });
};
