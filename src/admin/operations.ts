import type { ServiceRequest, Provider, RewardTransaction, Redemption, User, RewardAccount, Lead } from 'wasp/entities';
import type { GetAdminRequests, GetAdminProviders, GetAdminRewards, ApproveProvider, AssignRequestToProvider, ApproveRewardTransaction, RejectProvider } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { emailSender } from 'wasp/server/email';

const requireAdmin = (context: any) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "Admin access required.");
  }
};

export const getAdminRequests: GetAdminRequests<void, ServiceRequest[]> = async (args, context) => {
  requireAdmin(context);
  return context.entities.ServiceRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { consumer: true, assignedProvider: true }
  });
};

export const getAdminProviders: GetAdminProviders<void, Provider[]> = async (args, context) => {
  requireAdmin(context);
  return context.entities.Provider.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
};

export const getAdminRewards: GetAdminRewards<void, RewardTransaction[]> = async (args, context) => {
  requireAdmin(context);
  return context.entities.RewardTransaction.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: { consumer: true, serviceRequest: true }
  });
};

export const approveProvider: ApproveProvider<{ providerId: string }, Provider> = async ({ providerId }, context) => {
  requireAdmin(context);

  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId },
    include: { user: true }
  });
  if (!provider) throw new HttpError(404, 'Provider not found.');

  const updated = await context.entities.Provider.update({
    where: { id: providerId },
    data: { verificationStatus: 'VERIFIED' }
  });

  // Send approval email
  const userEmail = provider.email ?? provider.user?.email;
  if (userEmail) {
    await emailSender.send({
      to: userEmail,
      subject: `Your Worki Pro account is verified!`,
      html: `
        <h2>Great news, ${provider.businessName}!</h2>
        <p>Your provider application has been approved and your account is now <strong>verified</strong>.</p>
        <p>You can now log in to your dashboard and start receiving job leads.</p>
        <p><a href="${process.env.APP_URL ?? 'https://worki.ca'}/provider/dashboard">Go to your dashboard →</a></p>
      `,
      text: `Great news! Your Worki Pro account is verified. Log in at ${process.env.APP_URL ?? 'https://worki.ca'}/provider/dashboard`,
    });
  }

  return updated;
};

type RejectProviderInput = { providerId: string; reason?: string };

export const rejectProvider: RejectProvider<RejectProviderInput, Provider> = async ({ providerId, reason }, context) => {
  requireAdmin(context);

  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId },
    include: { user: true }
  });
  if (!provider) throw new HttpError(404, 'Provider not found.');

  const updated = await context.entities.Provider.update({
    where: { id: providerId },
    data: { verificationStatus: 'REJECTED' }
  });

  // Send rejection email
  const userEmail = provider.email ?? provider.user?.email;
  if (userEmail) {
    const reasonText = reason
      ? `Reason: ${reason}`
      : 'If you have questions, please contact us at support@worki.ca.';
    await emailSender.send({
      to: userEmail,
      subject: `Update on your Worki Pro application`,
      html: `
        <h2>Hello ${provider.businessName},</h2>
        <p>Thank you for applying to join the Worki Pro network.</p>
        <p>After review, we're unable to approve your application at this time.</p>
        <p>${reasonText}</p>
        <p>You are welcome to apply again in the future.</p>
      `,
      text: `Thank you for applying to Worki Pro. After review, we are unable to approve your application at this time. ${reasonText}`,
    });
  }

  return updated;
};

export const assignRequestToProvider: AssignRequestToProvider<{ requestId: string, providerId: string }, ServiceRequest> = async ({ requestId, providerId }, context) => {
  requireAdmin(context);
  return context.entities.ServiceRequest.update({
    where: { id: requestId },
    data: { 
      assignedProviderId: providerId,
      status: 'ASSIGNED'
    }
  });
};

export const approveRewardTransaction: ApproveRewardTransaction<{ transactionId: string }, RewardTransaction> = async ({ transactionId }, context) => {
  requireAdmin(context);

  const transaction = await context.entities.RewardTransaction.findUnique({
    where: { id: transactionId }
  });
  if (!transaction) throw new HttpError(404, 'Reward transaction not found');

  const updated = await context.entities.RewardTransaction.update({
    where: { id: transactionId },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedByAdminId: context.user!.id
    }
  });

  await context.entities.RewardAccount.upsert({
    where: { consumerId: transaction.consumerId },
    create: {
      consumerId: transaction.consumerId,
      pointsBalance: transaction.points,
      lifetimePoints: transaction.points
    },
    update: {
      pointsBalance: { increment: transaction.points },
      lifetimePoints: { increment: transaction.points }
    }
  });

  if (transaction.serviceRequestId) {
    await context.entities.ServiceRequest.update({
      where: { id: transaction.serviceRequestId },
      data: { rewardStatus: 'APPROVED' }
    });
  }

  return updated;
};

export const getAdminLeads = (async (_args: void, context: any) => {
  requireAdmin(context);
  return context.entities.Lead.findMany({
    orderBy: { createdAt: 'desc' },
  });
}) as any;

type UpdateLeadInput = { leadId: string; status?: string; assignedTo?: string; notes?: string };

export const updateLead = (async ({ leadId, status, assignedTo, notes }: UpdateLeadInput, context: any) => {
  requireAdmin(context);
  const data: any = {};
  if (status !== undefined) data.status = status;
  if (assignedTo !== undefined) data.assignedTo = assignedTo;
  if (notes !== undefined) data.notes = notes;
  return context.entities.Lead.update({
    where: { id: leadId },
    data,
  });
}) as any;
