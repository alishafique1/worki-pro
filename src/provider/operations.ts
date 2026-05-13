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
} from "wasp/server/operations";
import { HttpError } from "wasp/server";
import { emailSender } from "wasp/server/email";

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

  await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: { status: "ACCEPTED_BY_PROVIDER" },
  });

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
      text: `A new provider application was submitted.\n\nBusiness: ${businessName}\nContact: ${contactName}\nPhone: ${phone}\nEmail: ${email}\nAreas: ${serviceAreas.join(', ')}\n\nReview: https://worki.ai/admin/providers`,
      html: `<p>A new provider application was submitted.</p><ul><li><strong>Business:</strong> ${businessName}</li><li><strong>Contact:</strong> ${contactName}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${email}</li><li><strong>Areas:</strong> ${serviceAreas.join(', ')}</li></ul><p><a href="https://worki.ai/admin/providers">Review in admin →</a></p>`,
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

  const completedAt = new Date();
  const updatedAppt = await context.entities.Appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED", completedAt },
  });

  await context.entities.ServiceRequest.update({
    where: { id: appt.serviceRequestId },
    data: { status: "COMPLETED", completedAt },
  });

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

  // Only transition the ServiceRequest if it hasn't already reached a terminal state
  const serviceRequest = await context.entities.ServiceRequest.findUnique({
    where: { id: updated.serviceRequestId },
    select: { status: true },
  });
  const terminalStatuses = ["COMPLETED", "CLOSED", "REWARD_APPROVED"];
  const canTransition = serviceRequest && !terminalStatuses.includes(serviceRequest.status);

  if (canTransition) {
    if (updated.status === "CONFIRMED") {
      await context.entities.ServiceRequest.update({
        where: { id: updated.serviceRequestId },
        data: {
          status: "BOOKED",
          bookedAt: updated.scheduledAt || new Date(),
        },
      });
    } else if (updated.status === "CANCELLED" || updated.status === "NO_SHOW") {
      await context.entities.ServiceRequest.update({
        where: { id: updated.serviceRequestId },
        data: { status: "CLOSED" },
      });
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

type MaskedLead = {
  id: string;
  createdAt: Date;
  serviceCategory: { name: string; slug: string } | null;
  postalCode: string;
  city: string | null;
  urgency: string;
  description: string;
  estimatedSchedule: string | null;
  status: string;
  claimed: boolean;
};

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

  const where: Record<string, any> = {
    status: { in: ["NEW", "QUALIFYING", "QUALIFIED"] },
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

  // Mask PII — never expose name, phone, email
  return requests.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    serviceCategory: r.serviceCategory
      ? { name: r.serviceCategory.name, slug: r.serviceCategory.slug }
      : null,
    postalCode: r.postalCode,
    city: r.city,
    urgency: r.urgency,
    description:
      r.description.length > 200
        ? r.description.substring(0, 200) + "…"
        : r.description,
    estimatedSchedule: r.estimatedSchedule,
    status: r.status,
    claimed: !!r.assignedProviderId,
  }));
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
  });
  if (!req) throw new HttpError(404, "Lead not found.");

  // Already claimed by this provider — return existing (idempotent)
  if (req.assignedProviderId === provider.id) {
    return { request: req, alreadyClaimed: true };
  }

  // Already claimed by someone else
  if (req.assignedProviderId && req.assignedProviderId !== provider.id) {
    throw new HttpError(409, "This lead has already been claimed by another provider.");
  }

  const updated = await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: {
      assignedProviderId: provider.id,
      status: "ASSIGNED",
    },
  });

  // Create a fee record for this lead claim
  await context.entities.ProviderFee.create({
    data: {
      providerId: provider.id,
      serviceRequestId: requestId,
      feeType: "QUALIFIED_LEAD",
      amount: 5.0,
      status: "PENDING",
    },
  });

  // Open an internal thread note so messaging is seeded
  await context.entities.CommunicationLog.create({
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

  return { request: updated, alreadyClaimed: false };
};

// ─── Public Provider Profile (by slug) ───────────────────────────────────────

type PublicProviderProfile = Provider & {
  categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
  reviews: Review[];
};

export const getPublicProvider: GetPublicProvider<
  { slug: string },
  PublicProviderProfile | null
> = async ({ slug }, context) => {
  const provider = await context.entities.Provider.findFirst({
    where: { slug, active: true, verificationStatus: "VERIFIED" },
    include: {
      categories: { include: { serviceCategory: true } },
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });
  return provider;
};
