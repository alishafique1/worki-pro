import type { ServiceRequest, Provider, Appointment, ProviderFee, ProviderCategory, ServiceCategory, RewardTransaction, RewardAccount } from 'wasp/entities';
import type { GetProviderLeads, GetProviderAppointments, GetProviderProfile, GetProviderFees, AcceptServiceRequest, MarkJobCompleted, UpdateProviderProfile } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

const requireProvider = async (context: any) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id }
  });
  if (!provider) throw new HttpError(403, "Provider profile required.");
  return provider;
};

export const getProviderLeads: GetProviderLeads<void, ServiceRequest[]> = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.ServiceRequest.findMany({
    where: { assignedProviderId: provider.id, status: 'ASSIGNED' },
    orderBy: { createdAt: 'desc' }
  });
};

export const getProviderAppointments: GetProviderAppointments<void, Appointment[]> = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.Appointment.findMany({
    where: { providerId: provider.id },
    orderBy: { scheduledAt: 'asc' },
    include: { serviceRequest: true }
  });
};

export const getProviderProfile: GetProviderProfile<void, Provider & { categories: (ProviderCategory & { serviceCategory: ServiceCategory })[] }> = async (args, context) => {
  if (!context.user) throw new HttpError(401);
  const provider = await context.entities.Provider.findUnique({
    where: { userId: context.user.id },
    include: { categories: { include: { serviceCategory: true } } }
  });
  if (!provider) throw new HttpError(404, "Profile not found.");
  return provider;
};

export const getProviderFees: GetProviderFees<void, ProviderFee[]> = async (args, context) => {
  const provider = await requireProvider(context);
  return context.entities.ProviderFee.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: 'desc' }
  });
};

export const acceptServiceRequest: AcceptServiceRequest<{ requestId: string }, Appointment> = async ({ requestId }, context) => {
  const provider = await requireProvider(context);
  
  const req = await context.entities.ServiceRequest.findUnique({ where: { id: requestId } });
  if (!req || req.assignedProviderId !== provider.id) throw new HttpError(403, "Invalid request.");
  
  await context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: { status: 'ACCEPTED_BY_PROVIDER' }
  });
  
  const appointment = await context.entities.Appointment.create({
    data: {
      serviceRequestId: requestId,
      providerId: provider.id,
      consumerId: req.consumerId,
      status: 'PROPOSED'
    }
  });

  return appointment;
};

type UpdateProviderProfileInput = {
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  serviceAreas?: string[];
};

export const updateProviderProfile: UpdateProviderProfile<UpdateProviderProfileInput, Provider> = async (args, context) => {
  const provider = await requireProvider(context);

  if (args.businessName !== undefined && args.businessName.trim() === '') {
    throw new HttpError(400, 'Business name cannot be empty.');
  }
  if (args.phone !== undefined && args.phone.trim() === '') {
    throw new HttpError(400, 'Phone cannot be empty.');
  }

  const data: Record<string, any> = {};
  if (args.businessName !== undefined) data.businessName = args.businessName.trim();
  if (args.contactName !== undefined) data.contactName = args.contactName;
  if (args.phone !== undefined) data.phone = args.phone.trim();
  if (args.email !== undefined) data.email = args.email;
  if (args.website !== undefined) data.website = args.website;
  if (args.serviceAreas !== undefined) data.serviceAreas = args.serviceAreas;

  return context.entities.Provider.update({
    where: { id: provider.id },
    data
  });
};

export const markJobCompleted: MarkJobCompleted<{ appointmentId: string }, Appointment> = async ({ appointmentId }, context) => {
  const provider = await requireProvider(context);
  
  const appt = await context.entities.Appointment.findUnique({ where: { id: appointmentId } });
  if (!appt || appt.providerId !== provider.id) throw new HttpError(403);
  
  const updatedAppt = await context.entities.Appointment.update({
    where: { id: appointmentId },
    data: { status: 'COMPLETED', completedAt: new Date() }
  });

  await context.entities.ServiceRequest.update({
    where: { id: appt.serviceRequestId },
    data: { status: 'COMPLETED', completedAt: new Date() }
  });

  // Future logic: Create pending ProviderFee for completed job here
  
  return updatedAppt;
};
