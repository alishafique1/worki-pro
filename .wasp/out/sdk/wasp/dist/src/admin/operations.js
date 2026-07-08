import { HttpError } from 'wasp/server';
import { emailSender } from 'wasp/server/email';
import { assertTransition, canTransition } from '../shared/requestStatusMachine';
const requireAdmin = (context) => {
    if (!context.user || !context.user.isAdmin) {
        throw new HttpError(403, "Admin access required.");
    }
};
export const getAdminRequests = async (args, context) => {
    requireAdmin(context);
    return context.entities.ServiceRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { consumer: true, assignedProvider: true }
    });
};
export const getAdminProviders = async (args, context) => {
    requireAdmin(context);
    return context.entities.Provider.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });
};
export const getAdminRewards = async (args, context) => {
    requireAdmin(context);
    return context.entities.RewardTransaction.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: { consumer: true, serviceRequest: true }
    });
};
export const approveProvider = async ({ providerId }, context) => {
    requireAdmin(context);
    const provider = await context.entities.Provider.findUnique({
        where: { id: providerId },
        include: { user: true }
    });
    if (!provider)
        throw new HttpError(404, 'Provider not found.');
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
export const rejectProvider = async ({ providerId, reason }, context) => {
    requireAdmin(context);
    const provider = await context.entities.Provider.findUnique({
        where: { id: providerId },
        include: { user: true }
    });
    if (!provider)
        throw new HttpError(404, 'Provider not found.');
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
export const assignRequestToProvider = async ({ requestId, providerId }, context) => {
    requireAdmin(context);
    const request = await context.entities.ServiceRequest.findUnique({
        where: { id: requestId },
        select: { status: true },
    });
    if (!request)
        throw new HttpError(404, 'Request not found.');
    // Re-assigning an already-ASSIGNED request only changes the provider — the
    // status is untouched, so no transition to validate. Any other starting
    // status must legally allow → ASSIGNED per the state machine.
    const needsStatusChange = request.status !== 'ASSIGNED';
    if (needsStatusChange)
        assertTransition(request.status, 'ASSIGNED');
    return context.entities.ServiceRequest.update({
        where: { id: requestId },
        data: {
            assignedProviderId: providerId,
            ...(needsStatusChange && { status: 'ASSIGNED' }),
        }
    });
};
export const approveRewardTransaction = async ({ transactionId }, context) => {
    requireAdmin(context);
    const transaction = await context.entities.RewardTransaction.findUnique({
        where: { id: transactionId }
    });
    if (!transaction)
        throw new HttpError(404, 'Reward transaction not found');
    const updated = await context.entities.RewardTransaction.update({
        where: { id: transactionId },
        data: {
            status: 'APPROVED',
            approvedAt: new Date(),
            approvedByAdminId: context.user.id
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
export const rejectRewardTransaction = async ({ transactionId }, context) => {
    requireAdmin(context);
    const transaction = await context.entities.RewardTransaction.findUnique({
        where: { id: transactionId }
    });
    if (!transaction)
        throw new HttpError(404, 'Reward transaction not found');
    if (transaction.status !== 'PENDING') {
        throw new HttpError(400, 'Only pending transactions can be rejected');
    }
    return context.entities.RewardTransaction.update({
        where: { id: transactionId },
        data: {
            status: 'REJECTED',
            approvedByAdminId: context.user.id,
        },
    });
};
export const getAdminLeads = async (_args, context) => {
    requireAdmin(context);
    return context.entities.Lead.findMany({
        orderBy: { createdAt: 'desc' },
    });
};
export const updateLead = async ({ leadId, status, assignedTo, notes }, context) => {
    requireAdmin(context);
    const data = {};
    if (status !== undefined)
        data.status = status;
    if (assignedTo !== undefined)
        data.assignedTo = assignedTo;
    if (notes !== undefined)
        data.notes = notes;
    return context.entities.Lead.update({
        where: { id: leadId },
        data,
    });
};
// ─── Category Management ──────────────────────────────────────────────────────
export const getAdminCategories = async (_args, context) => {
    requireAdmin(context);
    return context.entities.ServiceCategory.findMany({
        where: { parentCategoryId: null },
        orderBy: { name: 'asc' },
    });
};
export const upsertAdminCategory = async (args, context) => {
    requireAdmin(context);
    const { id, ...data } = args;
    if (id) {
        return context.entities.ServiceCategory.update({ where: { id }, data });
    }
    return context.entities.ServiceCategory.create({ data: { ...data, active: data.active ?? true } });
};
export const deleteAdminCategory = async ({ id }, context) => {
    requireAdmin(context);
    return context.entities.ServiceCategory.delete({ where: { id } });
};
// ─── Review Moderation ────────────────────────────────────────────────────────
export const getAdminReviews = async (_args, context) => {
    requireAdmin(context);
    return context.entities.Review.findMany({
        orderBy: { createdAt: 'desc' },
        include: { provider: { select: { businessName: true, slug: true } } },
    });
};
export const moderateReview = async ({ reviewId, status }, context) => {
    requireAdmin(context);
    const allowed = ['PENDING', 'PUBLISHED', 'REJECTED'];
    if (!allowed.includes(status))
        throw new HttpError(400, 'Invalid status.');
    const review = await context.entities.Review.update({
        where: { id: reviewId },
        data: { status: status },
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
// ─── Lead Fee Disputes (bad-lead credit workflow) ─────────────────────────────
//
// Providers dispute a QUALIFIED_LEAD fee via disputeLeadFee (src/provider/
// operations.ts). Admin resolves here: CREDIT → WAIVED (+ best-effort Stripe
// refund when the fee was already charged), REJECT → back to PAID/PENDING.
// Same graceful-degrade pattern as src/provider/billing.ts: the shared Stripe
// client throws at module load when STRIPE_API_KEY is unset, so import lazily.
async function getStripeOrNull() {
    if (!process.env.STRIPE_API_KEY)
        return null;
    const { stripeClient } = await import('../payment/stripe/stripeClient');
    return stripeClient;
}
export const getDisputedFees = async (_args, context) => {
    requireAdmin(context);
    return context.entities.ProviderFee.findMany({
        where: { status: 'DISPUTED' },
        orderBy: { disputedAt: 'desc' },
        include: {
            provider: { select: { businessName: true, email: true, phone: true } },
            serviceRequest: {
                select: { id: true, name: true, city: true, status: true, createdAt: true, serviceCategory: { select: { name: true } } },
            },
        },
    });
};
// Whether a ServiceRequest may still be flagged INVALID/SPAM when a dispute
// is credited is decided by the status machine (src/shared/
// requestStatusMachine.ts): anything past ASSIGNED (booked, completed, …) is
// a real job and no longer allows the → INVALID/SPAM transition.
export const resolveFeeDispute = async ({ feeId, resolution, adminNote }, context) => {
    requireAdmin(context);
    if (resolution !== 'CREDIT' && resolution !== 'REJECT') {
        throw new HttpError(400, 'Invalid resolution.');
    }
    const fee = await context.entities.ProviderFee.findUnique({ where: { id: feeId } });
    if (!fee)
        throw new HttpError(404, 'Fee not found.');
    if (fee.status !== 'DISPUTED') {
        throw new HttpError(400, 'Only disputed fees can be resolved.');
    }
    let note = adminNote?.trim() || null;
    if (resolution === 'REJECT') {
        // Restore the pre-dispute status: PAID if it was charged, else PENDING.
        return context.entities.ProviderFee.update({
            where: { id: fee.id },
            data: {
                status: fee.paidAt ? 'PAID' : 'PENDING',
                adminNote: note,
            },
        });
    }
    // CREDIT → waive the fee. If it was paid via Stripe, attempt a refund of
    // the PaymentIntent (id stored in fee.invoiceId). Refund failure never
    // blocks the waive — log a warning and flag it for manual follow-up.
    if (fee.paidAt && fee.invoiceId) {
        try {
            const stripe = await getStripeOrNull();
            if (!stripe) {
                console.warn(`[disputes] STRIPE_API_KEY not set — fee ${fee.id} waived without refund`);
                note = [note, 'Stripe not configured — refund manually.'].filter(Boolean).join(' ');
            }
            else {
                const refund = await stripe.refunds.create({ payment_intent: fee.invoiceId });
                note = [note, `Stripe refund ${refund.id} issued.`].filter(Boolean).join(' ');
            }
        }
        catch (err) {
            console.warn(`[disputes] Stripe refund for fee ${fee.id} failed — waived anyway:`, err.message);
            note = [note, `Stripe refund FAILED (${err.message}) — refund manually.`].filter(Boolean).join(' ');
        }
    }
    const updated = await context.entities.ProviderFee.update({
        where: { id: fee.id },
        data: { status: 'WAIVED', adminNote: note },
    });
    // Lead-quality feedback loop: a credited dispute means the lead was bad —
    // flag the ServiceRequest so it drops out of the feed and analytics, unless
    // the request already progressed past ASSIGNED.
    if (fee.serviceRequestId) {
        const request = await context.entities.ServiceRequest.findUnique({
            where: { id: fee.serviceRequestId },
            select: { status: true },
        });
        const flagStatus = fee.disputeReason === 'SPAM' ? 'SPAM' : 'INVALID';
        if (request && canTransition(request.status, flagStatus)) {
            await context.entities.ServiceRequest.update({
                where: { id: fee.serviceRequestId },
                data: { status: flagStatus },
            });
        }
    }
    return updated;
};
//# sourceMappingURL=operations.js.map