import React from 'react';
import { useQuery, useAction, getProviderLeads, getProviderAppointments, acceptServiceRequest } from 'wasp/client/operations';
import { Link } from 'react-router';

export default function ProviderDashboardPage() {
  const { data: leads, isLoading: leadsLoading } = useQuery(getProviderLeads);
  const { data: appts, isLoading: apptsLoading } = useQuery(getProviderAppointments);
  const acceptLeadFn = useAction(acceptServiceRequest);

  const handleAccept = async (id: string) => {
    try {
      await acceptLeadFn({ requestId: id });
    } catch (err: any) {
      alert("Error accepting lead: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Provider Portal</h1>
          <p className="text-[var(--text-secondary)] mt-2 text-lg">Manage your leads, appointments, and billing.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-bold">Receiving Leads</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Column */}
        <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="bg-[var(--accent)] text-[#000] w-8 h-8 rounded-full flex items-center justify-center text-sm">{leads?.length || 0}</span>
              New Leads
            </h2>
          </div>
          
          {leadsLoading ? <div className="animate-pulse h-32 bg-[var(--surface-overlay)] rounded-[14px]"></div> : (
            <div className="space-y-4">
              {leads?.length === 0 ? (
                <div className="text-center p-8 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)]">
                  <p className="text-[var(--text-secondary)]">Your lead queue is empty.</p>
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">We will notify you via SMS when a new job matches your criteria.</p>
                </div>
              ) : (
                leads?.map((lead) => (
                  <div key={lead.id} className="p-6 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)] hover:border-[var(--accent)] transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-[var(--surface-base)] text-xs font-bold rounded-full mb-3 inline-block uppercase">{lead.urgency}</span>
                        <h3 className="font-bold text-lg">{lead.city || lead.postalCode}</h3>
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] font-medium">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">{lead.description}</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleAccept(lead.id)} className="flex-1 py-2 bg-[var(--accent)] text-[#000] font-bold rounded-[14px] hover:opacity-90 transition-opacity">Accept</button>
                      <button className="px-4 py-2 bg-[var(--surface-base)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold rounded-[14px] hover:bg-[var(--surface-raised)]">Pass</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Appointments Column */}
        <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>
          
          {apptsLoading ? <div className="animate-pulse h-32 bg-[var(--surface-overlay)] rounded-[14px]"></div> : (
            <div className="space-y-4">
              {appts?.length === 0 ? (
                <div className="text-center p-8 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)]">
                  <p className="text-[var(--text-secondary)]">No upcoming jobs scheduled.</p>
                </div>
              ) : (
                appts?.map((appt: any) => (
                  <div key={appt.id} className="p-6 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg mb-1">{appt.serviceRequest?.description || 'Customer Request'}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending Scheduling'}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-[var(--surface-base)] text-[var(--text-primary)] rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--border-default)]">
                      {appt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
