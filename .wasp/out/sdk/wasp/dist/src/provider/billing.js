import { HttpError, prisma, config } from "wasp/server";
// ─── Stripe access (graceful degrade) ────────────────────────────────────────
//
// The shared client in src/payment/stripe/stripeClient.ts throws at module
// load when STRIPE_API_KEY is unset, so we import it lazily. When the key is
// missing, billing features simply report "not configured" and lead-claim
// charges are skipped (fees stay PENDING) — nothing crashes.
async function getStripeOrNull() {
    if (!process.env.STRIPE_API_KEY)
        return null;
    const { stripeClient } = await import("../payment/stripe/stripeClient");
    return stripeClient;
}
const requireProviderForBilling = async (context) => {
    if (!context.user)
        throw new HttpError(401);
    const provider = await context.entities.Provider.findUnique({
        where: { userId: context.user.id },
    });
    if (!provider)
        throw new HttpError(403, "Provider profile required.");
    return provider;
};
export const getBillingStatus = async (_args, context) => {
    const provider = await requireProviderForBilling(context);
    const [pending, paid] = await Promise.all([
        context.entities.ProviderFee.aggregate({
            where: { providerId: provider.id, status: "PENDING" },
            _sum: { amount: true },
        }),
        context.entities.ProviderFee.aggregate({
            where: { providerId: provider.id, status: "PAID" },
            _sum: { amount: true },
        }),
    ]);
    const status = {
        stripeConfigured: Boolean(process.env.STRIPE_API_KEY),
        hasCardOnFile: false,
        cardBrand: null,
        cardLast4: null,
        pendingTotal: Number(pending._sum.amount ?? 0),
        paidTotal: Number(paid._sum.amount ?? 0),
    };
    const stripe = await getStripeOrNull();
    if (!stripe || !provider.stripeCustomerId)
        return status;
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: provider.stripeCustomerId,
            type: "card",
            limit: 1,
        });
        const card = paymentMethods.data[0]?.card;
        if (card) {
            status.hasCardOnFile = true;
            status.cardBrand = card.brand;
            status.cardLast4 = card.last4;
        }
    }
    catch (err) {
        // Card status is informational — never fail the whole billing page on it.
        console.warn("[billing] failed to list payment methods:", err.message);
    }
    return status;
};
// ─── createBillingSetupSession ───────────────────────────────────────────────
//
// No @stripe/stripe-js on the client, so instead of a raw SetupIntent we use
// Stripe Checkout in `setup` mode: the provider is redirected to Stripe's
// hosted page, saves a card, and comes back. Zero frontend dependencies.
export const createBillingSetupSession = async (_args, context) => {
    const provider = await requireProviderForBilling(context);
    const stripe = await getStripeOrNull();
    if (!stripe) {
        throw new HttpError(500, "Payments are not configured yet. Please contact support.");
    }
    let customerId = provider.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: context.user?.email ?? undefined,
            name: provider.businessName ?? undefined,
            metadata: { providerId: provider.id },
        });
        customerId = customer.id;
        await context.entities.Provider.update({
            where: { id: provider.id },
            data: { stripeCustomerId: customerId },
        });
    }
    const session = await stripe.checkout.sessions.create({
        mode: "setup",
        customer: customerId,
        payment_method_types: ["card"],
        success_url: `${config.frontendUrl}/provider/billing?setup=success`,
        cancel_url: `${config.frontendUrl}/provider/billing?setup=canceled`,
    });
    if (!session.url) {
        throw new HttpError(500, "Could not start the payment setup session.");
    }
    return { checkoutUrl: session.url };
};
// ─── chargeProviderFee ───────────────────────────────────────────────────────
//
// Attempts an off-session charge for a PENDING ProviderFee using the
// provider's saved card. Called from claimLead AFTER the atomic claim
// transaction commits — never inside it (no network calls in a tx), and it
// NEVER throws: any failure (no key, no customer, no card, declined) just
// leaves the fee PENDING with a warning. The claim itself always stands.
export async function chargeProviderFee(feeId) {
    try {
        const stripe = await getStripeOrNull();
        if (!stripe) {
            console.warn(`[billing] STRIPE_API_KEY not set — fee ${feeId} stays PENDING`);
            return;
        }
        const fee = await prisma.providerFee.findUnique({
            where: { id: feeId },
            include: { provider: true },
        });
        if (!fee || fee.status !== "PENDING")
            return;
        const customerId = fee.provider.stripeCustomerId;
        if (!customerId) {
            console.warn(`[billing] provider ${fee.providerId} has no Stripe customer — fee ${feeId} stays PENDING`);
            return;
        }
        // Prefer the customer's default payment method, fall back to newest card.
        let paymentMethodId = null;
        const customer = await stripe.customers.retrieve(customerId);
        if (!("deleted" in customer && customer.deleted)) {
            const defaultPm = customer.invoice_settings?.default_payment_method;
            paymentMethodId =
                typeof defaultPm === "string" ? defaultPm : (defaultPm?.id ?? null);
        }
        if (!paymentMethodId) {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: customerId,
                type: "card",
                limit: 1,
            });
            paymentMethodId = paymentMethods.data[0]?.id ?? null;
        }
        if (!paymentMethodId) {
            console.warn(`[billing] provider ${fee.providerId} has no card on file — fee ${feeId} stays PENDING`);
            return;
        }
        const amountCents = Math.round(Number(fee.amount) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountCents,
            currency: "cad",
            customer: customerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
            description: `The Helper — ${fee.feeType.replace(/_/g, " ").toLowerCase()} fee`,
            metadata: { providerFeeId: fee.id, providerId: fee.providerId },
        }, 
        // Idempotency key: concurrent/retried invocations for the same fee
        // collapse into a single Stripe charge instead of double-charging.
        { idempotencyKey: `fee-charge-${fee.id}` });
        if (paymentIntent.status === "succeeded") {
            // Guarded write: only flip PENDING → PAID. If the fee was DISPUTED or
            // WAIVED while the charge was in flight, don't stomp that status.
            const { count } = await prisma.providerFee.updateMany({
                where: { id: fee.id, status: "PENDING" },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                    invoiceId: paymentIntent.id, // Stripe PaymentIntent reference
                },
            });
            if (count === 0) {
                console.warn(`[billing] fee ${fee.id} status changed mid-charge — PaymentIntent ${paymentIntent.id} succeeded but was not recorded; manual reconciliation needed`);
            }
        }
        else {
            console.warn(`[billing] charge for fee ${feeId} not succeeded (status: ${paymentIntent.status}) — stays PENDING`);
        }
    }
    catch (err) {
        console.warn(`[billing] charge attempt for fee ${feeId} failed — stays PENDING:`, err.message);
    }
}
//# sourceMappingURL=billing.js.map