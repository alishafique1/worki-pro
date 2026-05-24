import React, { useState } from "react";
import {
  useAction,
  useQuery,
  acceptServiceRequest,
  getProviderAppointments,
  getProviderLeads,
  getProviderProfile,
} from "wasp/client/operations";
import { Link, useNavigate } from "react-router";
import { useRoleGuard } from '../shared/useRoleGuard';

function safeParseServices(json: any): any[] {
  try { return JSON.parse(json) || []; } catch { return []; }
}

const STATUS_LABEL: Record<string, string> = {
  ASSIGNED: 'New',
  ACCEPTED_BY_PROVIDER: 'Accepted',
  BOOKED: 'Booked',
};

export default function ProviderDashboardPage() {
  useRoleGuard('PROVIDER');
  const navigate = useNavigate();

  const [acceptError, setAcceptError] = useState<string | null>(null);

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
    error: profileError,
  } = useQuery(getProviderProfile);
  const acceptLeadFn = useAction(acceptServiceRequest);

  const handleAccept = async (id: string) => {
    setAcceptError(null);
    try {
      await acceptLeadFn({ requestId: id });
    } catch (err: any) {
      setAcceptError("Could not accept lead: " + (err.message || 'Unknown error'));
    }
  };

  // Provider record missing — send back to finish onboarding
  if (!profileLoading && profileError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-10 max-w-md w-full text-center shadow-sm">
          <div className="text-4xl mb-4">🔧</div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Finish setting up your account</h2>
          <p className="text-sm text-[#475569] mb-6">
            Your provider profile isn't complete yet. Let's finish the setup so you can start receiving leads.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors"
          >
            Complete setup →
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = (profile as any)?.verificationStatus;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-[#F8FAFC] min-h-screen">
      {/* Verification banner */}
      {!profileLoading && verificationStatus && verificationStatus !== 'VERIFIED' && (
        <div className={`rounded-[16px] border px-5 py-4 flex items-start gap-3 ${
          verificationStatus === 'REJECTED'
            ? 'bg-red-500/10 border-red-400/30 text-red-600'
            : 'bg-[#FEF3C7] border-[#FDE68A] text-amber-700'
        }`}>
          <span className="text-xl mt-0.5">{verificationStatus === 'REJECTED' ? '⛔' : '⏳'}</span>
          <div>
            <p className="font-bold text-sm">
              {verificationStatus === 'REJECTED' ? 'Application not approved' : 'Account pending verification'}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {verificationStatus === 'REJECTED'
                ? 'Contact support to appeal or reapply.'
                : 'Our team is reviewing your profile. You can browse leads but cannot claim them until approved by an admin.'}
            </p>
          </div>
        </div>
      )}
      {acceptError && (
        <div className="rounded-[14px] bg-red-500/10 border border-red-400/30 px-5 py-3 text-sm text-red-600 font-medium">
          {acceptError}
          <button onClick={() => setAcceptError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A]">
            Provider Portal
          </h1>
          <p className="text-[#475569] mt-2 text-lg">
            Review assigned leads, accept work, and manage booking updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/services"
            className="rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
          >
            Manage listings
          </Link>
          <Link
            to="/provider/leads"
            className="rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
          >
            Open lead inbox
          </Link>
          <Link
            to="/provider/appointments"
            className="rounded-[18px] border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:border-[#2563EB] transition-colors"
          >
            Manage bookings
          </Link>
        </div>
      </div>

      {/* My Listings Summary */}
      <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 text-[#0F172A]">
              <span className="text-2xl">📋</span>
              My Service Listings
            </h2>
            <p className="text-[#475569] mt-1">
              {profileLoading
                ? 'Loading...'
                : (() => {
                    const services = safeParseServices((profile as any)?.servicesJson);
                    return services.length === 0
                      ? 'No services listed yet. Add your first listing so customers can find you.'
                      : `${services.length} service${services.length !== 1 ? 's' : ''} listed`;
                  })()}
            </p>
          </div>
          <Link
            to="/provider/services"
            className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[18px] hover:bg-[#1D4ED8] transition-colors text-sm whitespace-nowrap"
          >
            {(() => {
              const services = safeParseServices((profile as any)?.servicesJson);
              return services.length === 0 ? 'Add your first listing' : 'Manage listings';
            })()}
          </Link>
        </div>

        {!profileLoading && (() => {
          const services = safeParseServices((profile as any)?.servicesJson);
          if (services.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-2 mt-2">
              {services.slice(0, 6).map((svc: any) => (
                <span
                  key={svc.id}
                  className="px-3 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full text-xs font-medium text-[#0F172A]"
                >
                  {svc.name}
                  {svc.price && <span className="text-[#2563EB] ml-1 font-bold">${svc.price}</span>}
                </span>
              ))}
              {services.length > 6 && (
                <span className="px-3 py-1.5 text-xs text-[#94A3B8]">
                  +{services.length - 6} more
                </span>
              )}
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Column */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="flex justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-[#0F172A]">
              <span className="bg-[#2563EB] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {leads?.length || 0}
              </span>
              Active Leads
            </h2>
            <Link
              to="/provider/leads"
              className="text-sm font-bold text-[#2563EB] hover:underline"
            >
              View all →
            </Link>
          </div>

          {leadsLoading ? (
            <div className="animate-pulse h-32 bg-[#EFF6FF] rounded-[14px]"></div>
          ) : leadsError ? (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <p className="font-bold text-[#0F172A]">Leads could not load</p>
              <p className="mt-2 text-sm text-[#475569]">
                Refresh the page or open the lead inbox to try again.
              </p>
              <Link
                to="/provider/leads"
                className="mt-3 inline-block text-sm font-bold text-[#2563EB] hover:underline"
              >
                Open lead inbox →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {leads?.length === 0 ? (
                <div className="text-center p-8 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                  <p className="text-[#475569]">
                    Your lead queue is empty.
                  </p>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Assigned requests will appear here when they are available.
                  </p>
                </div>
              ) : (
                leads?.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-3 py-1 bg-white border border-[#E2E8F0] text-xs font-bold rounded-full inline-block uppercase text-[#475569]">
                          {lead.urgency}
                        </span>
                        <span className="px-3 py-1 bg-[#FEF3C7] text-amber-700 text-xs font-bold rounded-full inline-block uppercase border border-[#FDE68A]">
                          {STATUS_LABEL[(lead as any).status] ?? (lead as any).status}
                        </span>
                      </div>
                      <span className="text-sm text-[#475569] font-medium shrink-0">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-[#0F172A]">
                      {lead.city || lead.postalCode}
                    </h3>
                    <p className="text-[#475569] mb-4 line-clamp-2">
                      {lead.description}
                    </p>
                    <div className="flex gap-3">
                      {(lead as any).status === 'ASSIGNED' ? (
                        <button
                          onClick={() => handleAccept(lead.id)}
                          className="flex-1 py-2 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors"
                        >
                          Accept
                        </button>
                      ) : (
                        <Link
                          to={`/provider/requests/${lead.id}/messages`}
                          className="flex-1 py-2 text-center bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors"
                        >
                          Message customer →
                        </Link>
                      )}
                      <Link
                        to="/provider/leads"
                        className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] font-bold rounded-[14px] hover:border-[#2563EB] transition-colors"
                      >
                        All leads
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Appointments Column */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">Bookings</h2>
            <Link
              to="/provider/appointments"
              className="text-sm font-bold text-[#2563EB] hover:underline"
            >
              Manage all →
            </Link>
          </div>

          {apptsLoading ? (
            <div className="animate-pulse h-32 bg-[#EFF6FF] rounded-[14px]"></div>
          ) : apptsError ? (
            <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <p className="font-bold text-[#0F172A]">Bookings could not load</p>
              <p className="mt-2 text-sm text-[#475569]">
                Refresh the page or open bookings to try again.
              </p>
              <Link
                to="/provider/appointments"
                className="mt-3 inline-block text-sm font-bold text-[#2563EB] hover:underline"
              >
                Open bookings →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appts?.length === 0 ? (
                <div className="text-center p-8 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0]">
                  <p className="text-[#475569]">
                    No accepted jobs or booking updates yet.
                  </p>
                </div>
              ) : (
                appts?.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="p-6 bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-lg mb-1 text-[#0F172A]">
                        {appt.serviceRequest?.description || "Customer Request"}
                      </p>
                      <p className="text-sm text-[#475569]">
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
                    <span className="px-4 py-2 bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-bold uppercase tracking-wider border border-[#BFDBFE]">
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
