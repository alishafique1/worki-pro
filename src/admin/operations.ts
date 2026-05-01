import type { ServiceRequest, Provider, RewardTransaction, Redemption, User, RewardAccount } from 'wasp/entities';
import type { GetAdminRequests, GetAdminProviders, GetAdminRewards, ApproveProvider, AssignRequestToProvider, ApproveRewardTransaction } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

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
  return context.entities.Provider.update({
    where: { id: providerId },
    data: { verificationStatus: 'VERIFIED' }
  });
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
      approvedByAdminId: context.user.id
    }
  });

  await context.entities.RewardAccount.upsert({
    where: { userId: transaction.consumerId },
    create: {
      userId: transaction.consumerId,
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
