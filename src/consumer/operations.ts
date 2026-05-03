import type { ServiceRequest, RewardAccount, RewardTransaction, Redemption, ServiceCategory, Provider, ProviderCategory, Lead } from 'wasp/entities';
import type { GetMyRequests, GetMyRewardAccount, SubmitServiceRequest, RedeemPoints, GetServiceCategories, GetProviders, GetConsumerStats } from 'wasp/server/operations';
import type { SubmitLead } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

export const getServiceCategories: GetServiceCategories<void, ServiceCategory[]> = async (args, context) => {
  return context.entities.ServiceCategory.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  });
};

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
  preferredProviderId?: string;
}, ServiceRequest> = async (args, context) => {
  let serviceCategoryId = undefined;
  if (args.serviceType) {
    const cat = await context.entities.ServiceCategory.findUnique({ where: { slug: args.serviceType } });
    serviceCategoryId = cat?.id;
  }

  const preferredProviderId = args.preferredProviderId
    ? (await context.entities.Provider.findUnique({ where: { id: args.preferredProviderId } }))?.id
    : undefined;

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
      status: preferredProviderId ? 'ASSIGNED' : 'NEW',
      serviceCategoryId: serviceCategoryId || undefined,
      assignedProviderId: preferredProviderId || undefined,
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

type ProviderWithCategories = Provider & {
  categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
};

export const getProviders: GetProviders<{ categorySlug?: string; search?: string }, ProviderWithCategories[]> = async ({ categorySlug, search }, context) => {
  const where: Record<string, any> = {
    active: true,
    verificationStatus: 'VERIFIED',
  };

  if (categorySlug) {
    where.categories = {
      some: {
        serviceCategory: { slug: categorySlug },
      },
    };
  }

  let providers = await context.entities.Provider.findMany({
    where,
    include: {
      categories: { include: { serviceCategory: true } },
    },
    orderBy: { ratingInternal: 'desc' },
  });

  if (search) {
    const q = search.toLowerCase();
    providers = providers.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        p.categories.some((c) => c.serviceCategory.name.toLowerCase().includes(q))
    );
  }

  return providers;
};

type ProviderDetail = Provider & {
  categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
  services: { id: string; name: string; description: string; price: number | null; categorySlug: string }[];
};

export const getProviderById: GetProviders<{ providerId: string }, ProviderDetail | null> = async ({ providerId }, context) => {
  const provider = await context.entities.Provider.findUnique({
    where: { id: providerId, active: true },
    include: { categories: { include: { serviceCategory: true } } },
  });
  if (!provider) return null;

  const services = provider.servicesJson ? JSON.parse(provider.servicesJson) : [];
  return { ...provider, services };
};

// ─── Consumer Analytics ───────────────────────────────────────────────────────

type ConsumerStats = {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  currentBalance: number;
  lifetimePoints: number;
  requestsByStatus: Record<string, number>;
  requestsByCategory: Record<string, number>;
  monthlyPoints: { month: string; earned: number; redeemed: number }[];
};

export const getConsumerStats: GetConsumerStats<void, ConsumerStats> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const requests = await context.entities.ServiceRequest.findMany({
    where: { consumerId: context.user.id },
    include: { serviceCategory: true },
  });

  const { account, transactions } = await getMyRewardAccount(args, context);

  const totalRequests = requests.length;
  const completedRequests = requests.filter((r) =>
    ['COMPLETED', 'REWARD_APPROVED', 'CLOSED'].includes(r.status)
  ).length;
  const pendingRequests = totalRequests - completedRequests;

  const totalPointsEarned = transactions
    .filter((t) => t.points > 0)
    .reduce((sum, t) => sum + t.points, 0);
  const totalPointsRedeemed = Math.abs(
    transactions.filter((t) => t.points < 0).reduce((sum, t) => sum + t.points, 0)
  );

  const requestsByStatus: Record<string, number> = {};
  for (const r of requests) {
    requestsByStatus[r.status] = (requestsByStatus[r.status] || 0) + 1;
  }

  const requestsByCategory: Record<string, number> = {};
  for (const r of requests) {
    const cat = r.serviceCategory?.name ?? 'Unknown';
    requestsByCategory[cat] = (requestsByCategory[cat] || 0) + 1;
  }

  // Monthly points for last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyPoints: { month: string; earned: number; redeemed: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const earned = transactions
      .filter((t) => {
        const td = new Date(t.createdAt);
        return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points > 0;
      })
      .reduce((s, t) => s + t.points, 0);
    const redeemed = Math.abs(
      transactions
        .filter((t) => {
          const td = new Date(t.createdAt);
          return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points < 0;
        })
        .reduce((s, t) => s + t.points, 0)
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
    monthlyPoints,
  };
};

// ─── Lead / Contact Flow ─────────────────────────────────────────────────────

export const submitLead: SubmitLead<{
  name: string;
  email: string;
  phone?: string;
  postalCode?: string;
  serviceType?: string;
  message?: string;
  source?: string;
}, Lead> = async ({ name, email, phone, postalCode, serviceType, message, source }, context) => {
  return context.entities.Lead.create({
    data: {
      name,
      email,
      phone: phone || null,
      postalCode: postalCode || null,
      serviceType: serviceType || null,
      message: message || null,
      source: source || 'WEBSITE',
      status: 'NEW',
    },
  });
};
