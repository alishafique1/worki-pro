import type { ServiceRequest, RewardAccount, RewardTransaction, Redemption } from 'wasp/entities';
import type { GetMyRequests, GetMyRewardAccount, SubmitServiceRequest, RedeemPoints } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

export const getMyRequests: GetMyRequests<void, ServiceRequest[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.ServiceRequest.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: 'desc' }
  });
};

export const getMyRewardAccount: GetMyRewardAccount<void, { account: RewardAccount | null, transactions: RewardTransaction[], redemptions: Redemption[] }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  
  const account = await context.entities.RewardAccount.findUnique({
    where: { consumerId: context.user.id }
  });
  
  const transactions = await context.entities.RewardTransaction.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const redemptions = await context.entities.Redemption.findMany({
    where: { consumerId: context.user.id },
    orderBy: { createdAt: 'desc' }
  });
  
  return { account, transactions, redemptions };
};

export const redeemPoints: RedeemPoints<{ points: number; giftCardEmail: string }, Redemption> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { points, giftCardEmail } = args;

  if (points < 500 || points % 500 !== 0) {
    throw new HttpError(400, 'Minimum redemption is 500 points in multiples of 500.');
  }

  const account = await context.entities.RewardAccount.findUnique({
    where: { consumerId: context.user.id }
  });

  if (!account || account.pointsBalance < points) {
    throw new HttpError(400, 'Insufficient points balance.');
  }

  const cashValue = points / 100;

  const redemption = await context.entities.Redemption.create({
    data: {
      consumerId: context.user.id,
      pointsUsed: points,
      cashValue,
      giftCardEmail,
      status: 'REQUESTED',
    }
  });

  await context.entities.RewardTransaction.create({
    data: {
      consumerId: context.user.id,
      type: 'REDEMPTION',
      points: -points,
      status: 'REDEEMED',
      reason: 'Gift card redemption',
    }
  });

  await context.entities.RewardAccount.update({
    where: { consumerId: context.user.id },
    data: { pointsBalance: { decrement: points } }
  });

  return redemption;
};

// Points constants — single source of truth
export const POINTS = {
  SERVICE_REQUEST: 500,   // $5 — awarded when request is submitted
  APPOINTMENT_BOOKED: 500, // $5 — awarded when appointment is confirmed
  JOB_COMPLETED: 5000,    // $50 — awarded when job is marked complete
  REFERRAL: 500,          // $5 — both referrer and referred
} as const;

export const submitServiceRequest: SubmitServiceRequest<{ 
  name: string;
  email: string;
  phone: string; 
  postalCode: string; 
  description: string; 
  urgency: 'EMERGENCY' | 'STANDARD' | 'PLANNED';
  serviceType?: string;
}, ServiceRequest> = async (args, context) => {
  const newRequest = await context.entities.ServiceRequest.create({
    data: {
      consumerId: context.user?.id || undefined,
      name: args.name,
      email: args.email,
      phone: args.phone,
      postalCode: args.postalCode,
      description: args.description,
      urgency: args.urgency,
      source: 'WEBSITE',
      status: 'NEW',
    }
  });

  // Award 500 pts ($5) for submitting a service request (logged-in users only)
  if (context.user?.id) {
    await context.entities.RewardTransaction.create({
      data: {
        consumerId: context.user.id,
        serviceRequestId: newRequest.id,
        type: 'SERVICE_REQUEST',
        points: POINTS.SERVICE_REQUEST,
        status: 'PENDING',
        reason: 'Request submitted — $5 reward pending verification',
      }
    });
    await context.entities.RewardAccount.upsert({
      where: { consumerId: context.user.id },
      create: { consumerId: context.user.id, pointsBalance: 0, lifetimePoints: 0 },
      update: {},
    });
  }

  return newRequest;
};
