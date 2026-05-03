import type {
  ServiceRequest,
  Provider,
  Appointment,
  ProviderFee,
  ProviderCategory,
  ServiceCategory,
  CommunicationLog,
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
    where: { assignedProviderId: provider.id, status: "ASSIGNED" },
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

  if (updated.status === "CONFIRMED" || updated.scheduledAt) {
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

  return context.entities.CommunicationLog.create({
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
};
