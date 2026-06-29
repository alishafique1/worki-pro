import React from 'react';
import { useQuery, getProviderFees, getCreditBalance } from 'wasp/client/operations';

import { useRoleGuard } from '../shared/useRoleGuard';

export default function ProviderBillingPage() {
  useRoleGuard('PROVIDER');
  const { data: fees, isLoading, error } = useQuery(getProviderFees);
  const { data: credits, isLoading: creditsLoading, error: creditsError } = useQuery(getCreditBalance);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Billing & Credits</h1>
      <p className="text-sm text-[#475569]">Buy credits, then spend them to claim leads. No annual contract.</p>

      {/* Credit wallet */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#475569]">Credit balance</p>
            {creditsLoading ? (
              <div className="animate-pulse h-10 w-32 bg-[#EFF6FF] rounded-[14px] mt-1" />
            ) : creditsError ? (
              <p className="text-red-600 text-sm mt-1">Could not load your balance.</p>
            ) : (
              <p className="text-4xl font-extrabold text-[#0F172A] mt-1">
                {credits?.balance ?? 0}
                <span className="text-lg font-semibold text-[#475569] ml-2">credits</span>
              </p>
            )}
            {!creditsLoading && !creditsError && (
              <p className="text-xs text-[#94A3B8] mt-1">
                {credits?.lifetimeBought ?? 0} bought · {credits?.lifetimeSpent ?? 0} spent · 1 credit = $1 CAD
              </p>
            )}
          </div>
          <button
            disabled
            title="Online top-up is coming soon. Contact The Helper to add credits."
            className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[14px] opacity-60 cursor-not-allowed shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Buy credits (coming soon)
          </button>
        </div>
      </div>

      {/* Credit ledger */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Credit Activity</h2>
        <div className="space-y-3">
          {creditsLoading && <div className="animate-pulse h-16 bg-[#EFF6FF] rounded-[14px]" />}
          {!creditsLoading && (credits?.transactions?.length ?? 0) === 0 && (
            <p className="text-[#475569]">No credit activity yet.</p>
          )}
          {credits?.transactions?.map((t) => (
            <div key={t.id} className="flex justify-between items-center p-4 border border-[#E2E8F0] rounded-[14px] bg-[#F8FAFC]">
              <div>
                <p className="font-semibold text-[#0F172A]">{t.type.replace(/_/g, ' ')}</p>
                <p className="text-sm text-[#475569]">
                  {t.reason ? `${t.reason} · ` : ''}{new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.delta >= 0 ? 'text-[#15803D]' : 'text-[#0F172A]'}`}>
                  {t.delta >= 0 ? '+' : ''}{t.delta}
                </p>
                <p className="text-xs text-[#94A3B8]">balance {t.balanceAfter}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legacy fees (kept for historical records) */}
      <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Fees & Invoices</h2>

        <div className="space-y-4">
          {isLoading && (
            <div className="animate-pulse h-20 bg-[#EFF6FF] rounded-[14px]" />
          )}
          {!isLoading && error && (
            <div className="rounded-[14px] bg-red-500/10 border border-red-400/30 px-5 py-4 text-sm text-red-600">
              Could not load billing data. Refresh the page to try again.
            </div>
          )}
          {!isLoading && !error && fees?.length === 0 && (
            <p className="text-[#475569]">No fees logged yet.</p>
          )}

          {fees?.map((fee: any) => (
            <div key={fee.id} className="flex justify-between items-center p-4 border border-[#E2E8F0] rounded-[14px] bg-[#F8FAFC]">
              <div>
                <p className="font-semibold text-[#0F172A]">{fee.feeType.replace(/_/g, ' ')}</p>
                <p className="text-sm text-[#475569]">{new Date(fee.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0F172A]">${fee.amount.toString()}</p>
                <p className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-block ${
                  fee.status === 'PENDING'
                    ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                    : 'bg-[#F0FDF4] text-[#15803D] border-green-200'
                }`}>{fee.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
