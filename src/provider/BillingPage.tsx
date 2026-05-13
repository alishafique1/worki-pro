import React from 'react';
import { useQuery, getProviderFees } from 'wasp/client/operations';

import { useRoleGuard } from '../shared/useRoleGuard';

export default function ProviderBillingPage() {
  useRoleGuard('PROVIDER');
  const { data: fees, isLoading, error } = useQuery(getProviderFees);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Billing & Invoices</h1>
      <p className="text-sm text-[var(--text-secondary)]">No annual contract. Cancel anytime.</p>
      
      <div className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)]">
        <h2 className="text-xl font-bold mb-6">Recent Fees</h2>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="animate-pulse h-20 bg-[var(--surface-overlay)] rounded-[14px]" />
          )}
          {!isLoading && error && (
            <div className="rounded-[14px] bg-red-500/10 border border-red-400/30 px-5 py-4 text-sm text-red-400">
              Could not load billing data. Refresh the page to try again.
            </div>
          )}
          {!isLoading && !error && fees?.length === 0 && (
            <p className="text-[var(--text-secondary)]">No fees logged yet.</p>
          )}
          
          {fees?.map((fee: any) => (
            <div key={fee.id} className="flex justify-between items-center p-4 border border-[var(--border-default)] rounded-[14px]">
              <div>
                <p className="font-semibold">{fee.feeType.replace(/_/g, ' ')}</p>
                <p className="text-sm text-[var(--text-secondary)]">{new Date(fee.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${fee.amount.toString()}</p>
                <p className={`text-xs ${fee.status === 'PENDING' ? 'text-[var(--accent)]' : 'text-[#567a58]'}`}>{fee.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
