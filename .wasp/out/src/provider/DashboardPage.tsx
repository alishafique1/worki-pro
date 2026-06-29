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
import {
  Wrench,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  Package,
  Users,
  DollarSign,
  Zap,
  AlertTriangle,
  ShieldCheck,
  MessageSquareText,
  ArrowRight,
  BarChart3,
  Star,
  BadgeCheck,
  Clock,
  Phone,
  CheckCircle,
  MapPin,
} from "lucide-react";

function safeParseServices(json: any): any[] {
  try { return JSON.parse(json) || []; } catch { return []; }
}

const STATUS_LABEL: Record<string, string> = {
  ASSIGNED: 'New Lead',
  ACCEPTED_BY_PROVIDER: 'Accepted',
  BOOKED: 'Booked',
};

const urgencyBadge: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  EMERGENCY: { label: 'Emergency', className: 'bg-red-50 text-red-600 border-red-200', icon: <Zap className="size-3" /> },
  URGENT:    { label: 'Urgent',    className: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]', icon: <Clock3 className="size-3" /> },
  SOON:      { label: 'Soon',      className: 'bg-blue-50 text-blue-600 border-blue-200', icon: <CalendarClock className="size-3" /> },
  PLANNED:   { label: 'Planned',   className: 'bg-slate-50 text-slate-500 border-slate-200', icon: <CalendarClock className="size-3" /> },
};

const apptStatusBadge: Record<string, { label: string; className: string }> = {
  CONFIRMED:   { label: 'Confirmed',   className: 'bg-green-50 text-green-700 border-green-200' },
  PENDING:     { label: 'Pending',    className: 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]' },
  CANCELLED:   { label: 'Cancelled',  className: 'bg-red-50 text-red-600 border-red-200' },
  COMPLETED:   { label: 'Completed',  className: 'bg-green-50 text-green-700 border-green-200' },
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
          <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-[#EFF6FF]">
            <Wrench className="size-7 text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Finish setting up your account</h2>
          <p className="text-sm text-[#475569] mb-6">
            Your provider profile isn't complete yet. Let's finish the setup so you can start receiving leads.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Complete setup →
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = (profile as any)?.verificationStatus;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-[#F8FAFC] min-h-screen">
      {/* Verification banner */}
      {!profileLoading && verificationStatus && verificationStatus !== 'VERIFIED' && (
        <div className={`rounded-[16px] border px-5 py-4 flex items-start gap-3 ${
          verificationStatus === 'REJECTED'
            ? 'bg-red-500/10 border-red-400/30 text-red-600'
            : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
        }`}>
          <span role="img" aria-label={verificationStatus === 'REJECTED' ? 'Application not approved' : 'Account pending verification'} className="mt-0.5">{verificationStatus === 'REJECTED' ? <AlertTriangle className="size-5 text-red-500" /> : <Clock className="size-5 text-[#2563EB]" />}</span>
          <div>
            <p className="font-bold text-sm">
              {verificationStatus === 'REJECTED' ? 'Application not approved' : 'Account pending verification'}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {verificationStatus === 'REJECTED'
                ? 'Your application was not approved. Visit your profile page to update your information and resubmit for review.'
                : 'Our team is reviewing your profile. You can browse leads but cannot claim them until approved. We\'ll notify you once the review is complete.'}
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

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Leads", value: leads?.length ?? 0, icon: <Inbox className="size-5 text-[#2563EB]" />, color: "blue" },
          { label: "Upcoming Bookings", value: appts?.filter((a: any) => a.scheduledAt && new Date(a.scheduledAt) >= new Date()).length ?? 0, icon: <CalendarClock className="size-5 text-[#3B82F6]" />, color: "blue" },
          { label: "Completed Jobs", value: appts?.filter((a: any) => a.status === 'COMPLETED').length ?? 0, icon: <CheckCircle2 className="size-5 text-[#22C55E]" />, color: "green" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white border border-[#E2E8F0] rounded-[18px] p-5 flex items-center gap-4">
            <div className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-[#EFF6FF]">{icon}</div>
            <div>
              <p className="text-2xl font-extrabold text-[#0F172A]">{value}</p>
              <p className="text-xs text-[#94A3B8] font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A]">
            Provider Dashboard
          </h1>
          <p className="text-[#475569] mt-2 text-lg">
            Review assigned leads, accept work, and manage booking updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/services"
            className="rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Manage listings
          </Link>
          <Link
            to="/provider/leads"
            className="rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
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
              <div role="img" aria-label="My Service Listings" className="size-9 flex items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Package className="size-5" />
              </div>
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
            className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[18px] hover:bg-[#1D4ED8] transition-colors text-sm whitespace-nowrap shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
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
                  <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    <Inbox className="size-6" />
                  </div>
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
                        {(() => {
                          const u = urgencyBadge[lead.urgency] ?? urgencyBadge.PLANNED;
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${u.className}`}>
                              {u.icon} {u.label}
                            </span>
                          );
                        })()}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full border border-[#BFDBFE]">
                          {STATUS_LABEL[(lead as any).status] ?? (lead as any).status}
                        </span>
                      </div>
                      <span className="text-sm text-[#94A3B8] font-medium shrink-0">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-[#0F172A] flex items-center gap-1.5">
                      <MapPin className="size-4 text-[#94A3B8]" />
                      {lead.city || lead.postalCode}
                    </h3>
                    <p className="text-[#475569] mb-4 line-clamp-2">
                      {lead.description}
                    </p>
                    <div className="flex gap-3">
                      {(lead as any).status === 'ASSIGNED' ? (
                        <button
                          onClick={() => handleAccept(lead.id)}
                          className="flex-1 py-2 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                        >
                          Accept
                        </button>
                      ) : (
                        <Link
                          to={`/provider/requests/${lead.id}/messages`}
                          className="flex-1 py-2 text-center bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
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
                  <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    <CalendarClock className="size-6" />
                  </div>
                  <p className="text-[#475569]">
                    No bookings yet.
                  </p>
                  <p className="text-sm text-[#94A3B8] mt-1">Accept leads to start scheduling jobs.</p>
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
                    {(() => {
                      const b = apptStatusBadge[appt.status] ?? { label: appt.status, className: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' };
                      return (
                        <span className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${b.className}`}>
                          {b.label}
                        </span>
                      );
                    })()}
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
