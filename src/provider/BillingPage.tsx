import React from 'react';
import { useQuery, getProviderFees } from 'wasp/client/operations';

export default function ProviderBillingPage() {
  const { data: fees, isLoading } = useQuery(getProviderFees);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Billing & Invoices</h1>
      
      <div className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)]">
        <h2 className="text-xl font-bold mb-6">Recent Fees</h2>
        
        <div className="space-y-4">
          {isLoading && <p>Loading billing info...</p>}
          {fees?.length === 0 && <p className="text-[var(--text-secondary)]">No fees logged yet.</p>}
          
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
