import React from "react";
import { Link } from "react-router";
import {
  useAction,
  useQuery,
  acceptServiceRequest,
  getProviderLeads,
} from "wasp/client/operations";

export default function ProviderLeadsPage() {
  const { data: leads, isLoading, error } = useQuery(getProviderLeads);
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
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Lead Inbox</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Review service requests assigned to your provider account and accept
            the jobs you can handle.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/dashboard"
            className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-bold hover:border-[var(--accent)]"
          >
            Dashboard
          </Link>
          <Link
            to="/provider/appointments"
            className="rounded-[18px] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black"
          >
            Bookings
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading && (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6"
              >
                <div className="h-5 w-1/3 animate-pulse rounded bg-[var(--surface-overlay)]" />
                <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-[var(--surface-overlay)]" />
                <div className="mt-5 h-8 w-44 animate-pulse rounded-full bg-[var(--surface-overlay)]" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
            <p className="text-lg font-semibold">Leads could not load</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Refresh the page and try again before accepting new work.
            </p>
          </div>
        )}

        {!isLoading && !error && leads?.length === 0 && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-10 text-center">
            <p className="font-semibold">Your lead inbox is empty</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Assigned requests will appear here when they are available.
            </p>
          </div>
        )}

        {!error &&
          leads?.map((lead) => (
            <div
              key={lead.id}
              className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h3 className="text-xl font-bold">
                  {lead.name || "Homeowner"} - {lead.city || lead.postalCode}
                </h3>
                <p className="text-[var(--text-secondary)] mt-1">
                  {lead.description}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">
                    Urgency: {lead.urgency}
                  </span>
                  <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">
                    Source: {lead.source}
                  </span>
                  {lead.estimatedSchedule && (
                    <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">
                      Schedule: {lead.estimatedSchedule}
                    </span>
                  )}
                  {lead.preferredTime && (
                    <span className="px-2 py-1 bg-[var(--surface-overlay)] text-[var(--text-primary)] text-xs rounded-full">
                      Best Contact: {lead.preferredTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(lead.id)}
                  className="px-6 py-2 bg-[var(--accent)] text-[#000] rounded-[22px] font-bold"
                >
                  Accept Lead
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
