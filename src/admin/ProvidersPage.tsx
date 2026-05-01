import React from 'react';
import { useQuery, useAction, getAdminProviders, approveProvider } from 'wasp/client/operations';

export default function AdminProvidersPage() {
  const { data: providers, isLoading } = useQuery(getAdminProviders);
  const approveProviderFn = useAction(approveProvider);

  const handleApprove = async (id: string) => {
    try {
      await approveProviderFn({ providerId: id });
      alert("Provider verified!");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Provider Approvals</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {isLoading && <p>Loading...</p>}
        {providers?.map((prov: any) => (
          <div key={prov.id} className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)] flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{prov.businessName}</h3>
              <p className="text-[var(--text-secondary)]">{prov.phone} • {prov.email}</p>
              <p className="mt-2 text-sm font-semibold">Status: <span className={prov.verificationStatus === 'VERIFIED' ? 'text-[#567a58]' : 'text-[var(--accent)]'}>{prov.verificationStatus}</span></p>
            </div>
            {prov.verificationStatus === 'PENDING' && (
              <button 
                onClick={() => handleApprove(prov.id)}
                className="px-6 py-2 bg-[var(--accent)] text-[#000] rounded-[22px] font-bold"
              >
                Approve & Verify
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
