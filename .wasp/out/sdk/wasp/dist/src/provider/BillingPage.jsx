import React, { useState } from 'react';
import { useQuery, getProviderFees, getBillingStatus, createBillingSetupSession, disputeLeadFee, } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../client/components/ui/dialog';
function feeStatusBadgeClasses(status) {
    switch (status) {
        case 'PAID':
            return 'bg-[#F0FDF4] text-[#15803D] border-green-200';
        case 'PENDING':
            return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
        case 'WAIVED':
            return 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]';
        default: // INVOICED, DISPUTED
            return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
    }
}
// ─── Bad-lead dispute (mirrors the guards in disputeLeadFee server-side) ─────
const DISPUTE_WINDOW_DAYS = 45;
const DISPUTE_REASON_OPTIONS = [
    { value: 'WRONG_NUMBER', label: 'Wrong or disconnected number' },
    { value: 'SPAM', label: 'Spam / fake request' },
    { value: 'DUPLICATE', label: 'Duplicate lead' },
    { value: 'OUT_OF_AREA', label: 'Outside my service area' },
    { value: 'OTHER', label: 'Other' },
];
function isDisputable(fee) {
    if (fee.feeType !== 'QUALIFIED_LEAD')
        return false;
    if (fee.status !== 'PENDING' && fee.status !== 'PAID')
        return false;
    const ageMs = Date.now() - new Date(fee.createdAt).getTime();
    return ageMs <= DISPUTE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
export default function ProviderBillingPage() {
    useRoleGuard('PROVIDER');
    const { data: fees, isLoading, error } = useQuery(getProviderFees);
    const { data: billing, isLoading: billingLoading } = useQuery(getBillingStatus);
    const [redirecting, setRedirecting] = useState(false);
    const [setupError, setSetupError] = useState(null);
    // Bad-lead dispute dialog state
    const [disputeFee, setDisputeFee] = useState(null);
    const [disputeReason, setDisputeReason] = useState('WRONG_NUMBER');
    const [disputeNote, setDisputeNote] = useState('');
    const [disputeSubmitting, setDisputeSubmitting] = useState(false);
    const [disputeError, setDisputeError] = useState(null);
    const openDisputeDialog = (fee) => {
        setDisputeFee(fee);
        setDisputeReason('WRONG_NUMBER');
        setDisputeNote('');
        setDisputeError(null);
    };
    const handleSubmitDispute = async () => {
        if (!disputeFee)
            return;
        setDisputeSubmitting(true);
        setDisputeError(null);
        try {
            await disputeLeadFee({
                feeId: disputeFee.id,
                reason: disputeReason,
                note: disputeNote.trim() || undefined,
            });
            setDisputeFee(null);
        }
        catch (err) {
            setDisputeError(err?.message || 'Could not submit the dispute. Try again.');
        }
        finally {
            setDisputeSubmitting(false);
        }
    };
    const setupResult = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('setup')
        : null;
    const handleAddCard = async () => {
        setSetupError(null);
        setRedirecting(true);
        try {
            const { checkoutUrl } = await createBillingSetupSession();
            window.location.href = checkoutUrl;
        }
        catch (err) {
            setSetupError(err?.message || 'Could not start the payment setup. Try again.');
            setRedirecting(false);
        }
    };
    return (<div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Billing & Invoices</h1>
      <p className="text-sm text-[#475569]">No annual contract. Cancel anytime.</p>

      {setupResult === 'success' && (<div className="rounded-[14px] bg-[#F0FDF4] border border-green-200 px-5 py-4 text-sm text-[#15803D]">
          Payment method saved. Lead fees will now be charged automatically.
        </div>)}
      {setupResult === 'canceled' && (<div className="rounded-[14px] bg-[#FEF3C7] border border-[#FDE68A] px-5 py-4 text-sm text-[#B45309]">
          Payment setup was canceled. You can add a card any time below.
        </div>)}

      {/* Payment method */}
      <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-[#0F172A]">Payment Method</h2>
        <p className="text-sm text-[#475569] mb-6">
          Your card on file is charged automatically when you claim a lead. The fee depends on the service category ($5–$25 per qualified lead).
        </p>

        {billingLoading && (<div className="animate-pulse h-16 bg-[#EFF6FF] rounded-[14px]"/>)}

        {!billingLoading && billing && (<div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {billing.hasCardOnFile ? (<div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border inline-block bg-[#F0FDF4] text-[#15803D] border-green-200">
                    CARD ON FILE
                  </span>
                  <span className="font-semibold text-[#0F172A] capitalize">
                    {billing.cardBrand} •••• {billing.cardLast4}
                  </span>
                </div>) : (<div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border inline-block bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]">
                    NO CARD ON FILE
                  </span>
                  <span className="text-sm text-[#475569]">
                    Add a card so lead fees are settled automatically.
                  </span>
                </div>)}
            </div>
            {billing.stripeConfigured ? (<button onClick={handleAddCard} disabled={redirecting} className="px-5 py-2.5 rounded-[10px] bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
                {redirecting
                    ? 'Redirecting to Stripe…'
                    : billing.hasCardOnFile
                        ? 'Update payment method'
                        : 'Add payment method'}
              </button>) : (<p className="text-sm text-[#475569]">
                Online payments are not enabled yet. Fees will be invoiced.
              </p>)}
          </div>)}

        {setupError && (<p className="mt-4 text-sm text-red-600">{setupError}</p>)}

        {!billingLoading && billing && (<div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
            <div className="p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-bold text-[#0F172A]">${billing.pendingTotal.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide">Paid</p>
              <p className="text-2xl font-bold text-[#0F172A]">${billing.paidTotal.toFixed(2)}</p>
            </div>
          </div>)}
      </div>

      {/* Fee history */}
      <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Recent Fees</h2>

        <div className="space-y-4">
          {isLoading && (<div className="animate-pulse h-20 bg-[#EFF6FF] rounded-[14px]"/>)}
          {!isLoading && error && (<div className="rounded-[14px] bg-red-500/10 border border-red-400/30 px-5 py-4 text-sm text-red-600">
              Could not load billing data. Refresh the page to try again.
            </div>)}
          {!isLoading && !error && fees?.length === 0 && (<p className="text-[#475569]">No fees logged yet.</p>)}

          {fees?.map((fee) => (<div key={fee.id} className="flex justify-between items-center gap-4 p-4 border border-[#E2E8F0] rounded-[14px] bg-[#F8FAFC]">
              <div>
                <p className="font-semibold text-[#0F172A]">{fee.feeType.replace(/_/g, ' ')}</p>
                <p className="text-sm text-[#475569]">{new Date(fee.createdAt).toLocaleDateString()}</p>
                {fee.status === 'DISPUTED' && (<p className="text-xs text-[#B45309] mt-1">
                    Under review — we'll email you once it's resolved.
                  </p>)}
                {fee.status === 'WAIVED' && (<p className="text-xs text-[#475569] mt-1">
                    Credited — you were not charged for this lead.
                  </p>)}
              </div>
              <div className="flex items-center gap-3">
                {isDisputable(fee) && (<button onClick={() => openDisputeDialog(fee)} className="px-3 py-1.5 rounded-[10px] text-xs font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                    Dispute
                  </button>)}
                <div className="text-right">
                  <p className="font-bold text-[#0F172A]">${fee.amount.toString()}</p>
                  <p className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-block ${feeStatusBadgeClasses(fee.status)}`}>
                    {fee.status === 'DISPUTED' ? 'UNDER REVIEW' : fee.status}
                  </p>
                </div>
              </div>
            </div>))}
        </div>

        <p className="mt-6 text-xs text-[#475569]">
          Bad lead? Wrong number, spam, duplicate, or out of your area — dispute
          any lead fee within {DISPUTE_WINDOW_DAYS} days and we'll review it for a credit.
        </p>
      </div>

      {/* Dispute dialog */}
      <Dialog open={disputeFee !== null} onOpenChange={(open) => { if (!open)
        setDisputeFee(null); }}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0F172A]">Dispute this lead fee</DialogTitle>
            <DialogDescription className="text-[#475569]">
              Tell us what went wrong with this lead. Our team reviews every
              dispute — if the lead was bad, the ${disputeFee ? Number(disputeFee.amount).toFixed(2) : '5.00'} fee
              is credited back.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="dispute-reason" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Reason
              </label>
              <select id="dispute-reason" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="w-full px-3 py-2 rounded-[10px] border border-[#E2E8F0] bg-white text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]">
                {DISPUTE_REASON_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="dispute-note" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                Details <span className="font-normal text-[#475569]">(optional)</span>
              </label>
              <textarea id="dispute-note" value={disputeNote} onChange={(e) => setDisputeNote(e.target.value)} maxLength={1000} rows={3} placeholder="e.g. Number was disconnected when I called within the hour." className="w-full px-3 py-2 rounded-[10px] border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none"/>
            </div>

            {disputeError && (<p className="text-sm text-red-600">{disputeError}</p>)}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button onClick={() => setDisputeFee(null)} disabled={disputeSubmitting} className="px-4 py-2 rounded-[10px] text-sm font-semibold border border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8] disabled:opacity-60 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmitDispute} disabled={disputeSubmitting} className="px-4 py-2 rounded-[10px] bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
              {disputeSubmitting ? 'Submitting…' : 'Submit dispute'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
//# sourceMappingURL=BillingPage.jsx.map