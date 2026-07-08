import React, { useState } from "react";
import { useQuery, getDisputedFees, resolveFeeDispute } from "wasp/client/operations";
import { useRoleGuard } from "../shared/useRoleGuard";

const REASON_LABELS: Record<string, string> = {
  WRONG_NUMBER: "Wrong number",
  SPAM: "Spam / fake request",
  DUPLICATE: "Duplicate lead",
  OUT_OF_AREA: "Out of service area",
  OTHER: "Other",
};

export default function AdminDisputesPage() {
  useRoleGuard("ADMIN");
  const { data: rawFees, isLoading, error } = useQuery(getDisputedFees);
  const fees = rawFees as any[] | undefined;

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [resolveError, setResolveError] = useState<string | null>(null);

  const handleResolve = async (feeId: string, resolution: "CREDIT" | "REJECT") => {
    setResolvingId(feeId);
    setResolveError(null);
    try {
      await resolveFeeDispute({
        feeId,
        resolution,
        adminNote: notes[feeId]?.trim() || undefined,
      });
    } catch (e: any) {
      setResolveError(e?.message || "Failed to resolve dispute.");
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {resolveError && (
        <div className="rounded-[12px] bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{resolveError}</span>
          <button onClick={() => setResolveError(null)} className="ml-3 font-bold">✕</button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Lead Fee Disputes</h1>
        <p className="text-sm text-[#475569] mt-1">
          Providers can dispute a $5 lead fee within 45 days. Credit waives the fee
          (and refunds the Stripe charge if it was paid); Reject restores the original fee.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse h-24 bg-[#F8FAFC] rounded-[16px]" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-sm">Failed to load disputes.</p>}

      {!isLoading && !error && (!fees || fees.length === 0) && (
        <p className="text-[#475569] text-sm py-8 text-center">
          No open disputes. Nice.
        </p>
      )}

      <div className="space-y-4">
        {fees?.map((fee: any) => (
          <div key={fee.id} className="rounded-[18px] border border-[#E2E8F0] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full border text-xs font-bold bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]">
                    DISPUTED
                  </span>
                  <span className="text-xs font-bold text-[#0F172A]">
                    ${Number(fee.amount).toFixed(2)} · {fee.feeType.replace(/_/g, " ")}
                  </span>
                  {fee.paidAt ? (
                    <span className="text-xs text-[#475569]">Paid — credit will trigger a Stripe refund</span>
                  ) : (
                    <span className="text-xs text-[#475569]">Unpaid — credit simply waives it</span>
                  )}
                  {fee.disputedAt && (
                    <span className="text-xs text-[#475569]">
                      Filed {new Date(fee.disputedAt).toLocaleDateString("en-CA")}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#0F172A] font-bold mb-1">
                  {fee.provider?.businessName ?? fee.providerId}
                  <span className="font-normal text-[#475569]">
                    {" "}disputed: {REASON_LABELS[fee.disputeReason] ?? fee.disputeReason ?? "—"}
                  </span>
                </p>
                {fee.disputeNote && (
                  <p className="text-sm text-[#475569] leading-relaxed mb-2">"{fee.disputeNote}"</p>
                )}
                {fee.serviceRequest && (
                  <p className="text-xs text-[#475569]">
                    Lead: {fee.serviceRequest.serviceCategory?.name ?? "Uncategorized"} ·{" "}
                    {fee.serviceRequest.city ?? "Unknown city"} · request status{" "}
                    <span className="font-semibold">{fee.serviceRequest.status}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-72">
                <input
                  type="text"
                  value={notes[fee.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [fee.id]: e.target.value }))}
                  placeholder="Admin note (optional)"
                  className="px-3 py-2 rounded-[10px] border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolve(fee.id, "CREDIT")}
                    disabled={resolvingId === fee.id}
                    className="flex-1 px-4 py-2 rounded-[12px] text-sm font-bold bg-green-50 text-[#15803D] border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-all"
                  >
                    Credit
                  </button>
                  <button
                    onClick={() => handleResolve(fee.id, "REJECT")}
                    disabled={resolvingId === fee.id}
                    className="flex-1 px-4 py-2 rounded-[12px] text-sm font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
