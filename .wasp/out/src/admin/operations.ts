import type { ServiceRequest, Provider, RewardTransaction, Redemption, User, RewardAccount, Lead, Review } from 'wasp/entities';
import type { ReviewStatus } from '@prisma/client';
import type { GetAdminRequests, GetAdminProviders, GetAdminRewards, ApproveProvider, AssignRequestToProvider, ApproveRewardTransaction, RejectRewardTransaction, RejectProvider, GetAdminLeads, UpdateLead, GetAdminReviews, ModerateReview } from 'wasp/server/operations';
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
      subject: `Your The Helper Pro account is verified!`,
      html: `
        <h2>Great news, ${provider.businessName}!</h2>
        <p>Your provider application has been approved and your account is now <strong>verified</strong>.</p>
        <p>You can now log in to your dashboard and start receiving job leads.</p>
        <p><a href="${process.env.APP_URL ?? 'https://thehelper.ca'}/provider/dashboard">Go to your dashboard →</a></p>
      `,
      text: `Great news! Your The Helper Pro account is verified. Log in at ${process.env.APP_URL ?? 'https://thehelper.ca'}/provider/dashboard`,
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
      : 'If you have questions, please contact us at support@thehelper.ca.';
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
      text: `Thank you for applying to The Helper Pro. After review, we are unable to approve your application at this time. ${reasonText}`,
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

  // For REDEMPTION transactions (negative points), only decrement pointsBalance.
  // lifetimePoints should never decrease — it tracks all-time earned points.
  const isEarning = transaction.points > 0;
  await context.entities.RewardAccount.upsert({
    where: { consumerId: transaction.consumerId },
    create: {
      consumerId: transaction.consumerId,
      pointsBalance: transaction.points,
      lifetimePoints: isEarning ? transaction.points : 0,
    },
    update: {
      pointsBalance: { increment: transaction.points },
      ...(isEarning ? { lifetimePoints: { increment: transaction.points } } : {}),
    },
  });

  if (transaction.serviceRequestId) {
    await context.entities.ServiceRequest.update({
      where: { id: transaction.serviceRequestId },
      data: { rewardStatus: 'APPROVED' }
    });
  }

  return updated;
};

export const rejectRewardTransaction: RejectRewardTransaction<{ transactionId: string }, RewardTransaction> = async ({ transactionId }, context) => {
  requireAdmin(context);

  const transaction = await context.entities.RewardTransaction.findUnique({
    where: { id: transactionId }
  });
  if (!transaction) throw new HttpError(404, 'Reward transaction not found');
  if (transaction.status !== 'PENDING') {
    throw new HttpError(400, 'Only pending transactions can be rejected');
  }

  return context.entities.RewardTransaction.update({
    where: { id: transactionId },
    data: {
      status: 'REJECTED',
      approvedByAdminId: context.user!.id,
    },
  });
};

export const getAdminLeads: GetAdminLeads<void, Lead[]> = async (_args, context) => {
  requireAdmin(context);
  return context.entities.Lead.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

type UpdateLeadInput = { leadId: string; status?: string; assignedTo?: string; notes?: string };

export const updateLead: UpdateLead<UpdateLeadInput, Lead> = async ({ leadId, status, assignedTo, notes }, context) => {
  requireAdmin(context);
  const data: any = {};
  if (status !== undefined) data.status = status;
  if (assignedTo !== undefined) data.assignedTo = assignedTo;
  if (notes !== undefined) data.notes = notes;
  return context.entities.Lead.update({
    where: { id: leadId },
    data,
  });
};

// ─── Category Management ──────────────────────────────────────────────────────

export const getAdminCategories = async (_args: void, context: any) => {
  requireAdmin(context);
  return context.entities.ServiceCategory.findMany({
    where: { parentCategoryId: null },
    orderBy: { name: 'asc' },
  });
};

type UpsertCategoryInput = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  active?: boolean;
};

export const upsertAdminCategory = async (args: UpsertCategoryInput, context: any) => {
  requireAdmin(context);
  const { id, ...data } = args;
  if (id) {
    return context.entities.ServiceCategory.update({ where: { id }, data });
  }
  return context.entities.ServiceCategory.create({ data: { ...data, active: data.active ?? true } });
};

export const deleteAdminCategory = async ({ id }: { id: string }, context: any) => {
  requireAdmin(context);
  return context.entities.ServiceCategory.delete({ where: { id } });
};

// ─── Review Moderation ────────────────────────────────────────────────────────

export const getAdminReviews: GetAdminReviews<void, Review[]> = async (_args, context) => {
  requireAdmin(context);
  return context.entities.Review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { provider: { select: { businessName: true, slug: true } } },
  });
};

export const moderateReview: ModerateReview<{ reviewId: string; status: string }, Review> = async (
  { reviewId, status },
  context,
) => {
  requireAdmin(context);
  const allowed = ['PENDING', 'PUBLISHED', 'REJECTED'];
  if (!allowed.includes(status)) throw new HttpError(400, 'Invalid status.');

  const review = await context.entities.Review.update({
    where: { id: reviewId },
    data: { status: status as ReviewStatus },
  });

  // Recalculate provider average rating
  const agg = await context.entities.Review.aggregate({
    where: { providerId: review.providerId, status: 'PUBLISHED' },
    _avg: { rating: true },
  });
  await context.entities.Provider.update({
    where: { id: review.providerId },
    data: { ratingInternal: agg._avg.rating ?? undefined },
  });

  return review;
};
