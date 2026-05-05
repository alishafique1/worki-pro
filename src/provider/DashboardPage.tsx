import React from "react";
import {
  useAction,
  useQuery,
  acceptServiceRequest,
  getProviderAppointments,
  getProviderLeads,
  getProviderProfile,
} from "wasp/client/operations";
import { Link } from "react-router";

export default function ProviderDashboardPage() {
  const {
    data: leads,
    isLoading: leadsLoading,
    error: leadsError,
  } = useQuery(getProviderLeads);
  const {
    data: appts,
    isLoading: apptsLoading,
    error: apptsError,
  } = useQuery(getProviderAppointments);
  const {
    data: profile,
    isLoading: profileLoading,
  } = useQuery(getProviderProfile);
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
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Provider Portal
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-lg">
            Review assigned leads, accept work, and manage booking updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/services"
            className="rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
          >
            Manage listings
          </Link>
          <Link
            to="/provider/leads"
            className="rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
          >
            Open lead inbox
          </Link>
          <Link
            to="/provider/appointments"
            className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-3 text-sm font-bold hover:border-[var(--accent)]"
          >
            Manage bookings
          </Link>
        </div>
      </div>

      {/* My Listings Summary */}
      <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-2xl">📋</span>
              My Service Listings
            </h2>
            <p className="text-[var(--text-secondary)] mt-1">
              {profileLoading
                ? 'Loading...'
                : (() => {
                    const services = (profile as any)?.servicesJson
                      ? JSON.parse((profile as any).servicesJson)
                      : [];
                    return services.length === 0
                      ? 'No services listed yet — add your first listing so customers can find you.'
                      : `${services.length} service${services.length !== 1 ? 's' : ''} listed`;
                  })()}
            </p>
          </div>
          <Link
            to="/provider/services"
            className="px-6 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[18px] hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
          >
            {(() => {
              const services = (profile as any)?.servicesJson
                ? JSON.parse((profile as any).servicesJson)
                : [];
              return services.length === 0 ? 'Add your first listing' : 'Manage listings';
            })()}
          </Link>
        </div>

        {!profileLoading && (() => {
          const services = (profile as any)?.servicesJson
            ? JSON.parse((profile as any).servicesJson)
            : [];
          if (services.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-2 mt-2">
              {services.slice(0, 6).map((svc: any) => (
                <span
                  key={svc.id}
                  className="px-3 py-1.5 bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-full text-xs font-medium"
                >
                  {svc.name}
                  {svc.price && <span className="text-[var(--accent)] ml-1 font-bold">${svc.price}</span>}
                </span>
              ))}
              {services.length > 6 && (
                <span className="px-3 py-1.5 text-xs text-[var(--text-tertiary)]">
                  +{services.length - 6} more
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Column */}
        <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] p-8 shadow-xl">
          <div className="flex justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="bg-[var(--accent)] text-[#000] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {leads?.length || 0}
              </span>
              Assigned Leads
            </h2>
            <Link
              to="/provider/leads"
              className="text-sm font-bold text-[var(--accent)] hover:underline"
            >
              View all →
            </Link>
          </div>

          {leadsLoading ? (
            <div className="animate-pulse h-32 bg-[var(--surface-overlay)] rounded-[14px]"></div>
          ) : leadsError ? (
            <div className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-overlay)] p-6">
              <p className="font-bold">Leads could not load</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Refresh the page or open the lead inbox to try again.
              </p>
              <Link
                to="/provider/leads"
                className="mt-3 inline-block text-sm font-bold text-[var(--accent)] hover:underline"
              >
                Open lead inbox →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {leads?.length === 0 ? (
                <div className="text-center p-8 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)]">
                  <p className="text-[var(--text-secondary)]">
                    Your lead queue is empty.
                  </p>
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">
                    Assigned requests will appear here when they are available.
                  </p>
                </div>
              ) : (
                leads?.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)] hover:border-[var(--accent)] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-[var(--surface-base)] text-xs font-bold rounded-full mb-3 inline-block uppercase">
                          {lead.urgency}
                        </span>
                        <h3 className="font-bold text-lg">
                          {lead.city || lead.postalCode}
                        </h3>
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                      {lead.description}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(lead.id)}
                        className="flex-1 py-2 bg-[var(--accent)] text-[#000] font-bold rounded-[14px] hover:opacity-90 transition-opacity"
                      >
                        Accept
                      </button>
                      <Link
                        to="/provider/leads"
                        className="px-4 py-2 bg-[var(--surface-base)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold rounded-[14px] hover:bg-[var(--surface-raised)]"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Appointments Column */}
        <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)] p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Bookings</h2>
            <Link
              to="/provider/appointments"
              className="text-sm font-bold text-[var(--accent)] hover:underline"
            >
              Manage all →
            </Link>
          </div>

          {apptsLoading ? (
            <div className="animate-pulse h-32 bg-[var(--surface-overlay)] rounded-[14px]"></div>
          ) : apptsError ? (
            <div className="rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-overlay)] p-6">
              <p className="font-bold">Bookings could not load</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Refresh the page or open bookings to try again.
              </p>
              <Link
                to="/provider/appointments"
                className="mt-3 inline-block text-sm font-bold text-[var(--accent)] hover:underline"
              >
                Open bookings →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appts?.length === 0 ? (
                <div className="text-center p-8 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)]">
                  <p className="text-[var(--text-secondary)]">
                    No accepted jobs or booking updates yet.
                  </p>
                </div>
              ) : (
                appts?.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="p-6 bg-[var(--surface-overlay)] rounded-[14px] border border-[var(--border-default)] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-lg mb-1">
                        {appt.serviceRequest?.description || "Customer Request"}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {appt.scheduledAt
                          ? new Date(appt.scheduledAt).toLocaleString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Pending Scheduling"}
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
