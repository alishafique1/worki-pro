import React from 'react';
import { useQuery, getProviderFees } from 'wasp/client/operations';

import { useRoleGuard } from '../shared/useRoleGuard';

export default function ProviderBillingPage() {
  useRoleGuard('PROVIDER');
  const { data: fees, isLoading, error } = useQuery(getProviderFees);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Billing & Invoices</h1>
      <p className="text-sm text-[#475569]">No annual contract. Cancel anytime.</p>

      <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-[#0F172A]">Recent Fees</h2>

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
