import React from 'react';
import { useQuery, useAction, getProviderLeads, acceptServiceRequest } from 'wasp/client/operations';

export default function ProviderLeadsPage() {
  const { data: leads, isLoading } = useQuery(getProviderLeads);
  const acceptLeadFn = useAction(acceptServiceRequest);

  const handleAccept = async (id: string) => {
    try {
      await acceptLeadFn({ requestId: id });
      alert("Lead accepted! An appointment was generated.");
    } catch (e: any) {
      alert("Error accepting lead: " + e.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Lead Inbox</h1>
      
      <div className="space-y-6">
        {isLoading && <p>Loading leads...</p>}
        {leads?.length === 0 && <p className="text-[var(--text-secondary)]">Your inbox is empty.</p>}
        
        {leads?.map((lead) => (
          <div key={lead.id} className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold">{lead.name || 'Homeowner'} - {lead.city || lead.postalCode}</h3>
              <p className="text-[var(--text-secondary)] mt-1">{lead.description}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">Urgency: {lead.urgency}</span>
                <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">Source: {lead.source}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-[var(--surface-base)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-[22px] font-bold">Reject</button>
              <button onClick={() => handleAccept(lead.id)} className="px-6 py-2 bg-[var(--accent)] text-[#000] rounded-[22px] font-bold">Accept Lead</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
