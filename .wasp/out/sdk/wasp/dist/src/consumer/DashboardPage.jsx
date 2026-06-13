import React from "react";
import { useQuery, getMyRequests, getMyRewardAccount, } from "wasp/client/operations";
import { Link } from "react-router";
import { useRoleGuard } from '../shared/useRoleGuard';
import { CalendarClock, CheckCircle2, Clock3, ShieldCheck, Wrench, TrendingUp, Gift, Star, ArrowRight, Zap, Calendar, } from "lucide-react";
const urgencyConfig = {
    EMERGENCY: { label: "Emergency", className: "bg-red-50 text-red-600 border border-red-200", icon: <Zap className="size-3"/> },
    URGENT: { label: "Urgent", className: "bg-amber-50 text-amber-700 border border-amber-200", icon: <Clock3 className="size-3"/> },
    SOON: { label: "Soon", className: "bg-blue-50 text-blue-600 border border-blue-200", icon: <Calendar className="size-3"/> },
    PLANNED: { label: "Planned", className: "bg-slate-50 text-slate-500 border border-slate-200", icon: <Calendar className="size-3"/> },
};
export default function DashboardPage() {
    useRoleGuard('CONSUMER');
    const { data: requests, isLoading: requestsLoading, error: requestsError, } = useQuery(getMyRequests);
    const { data: rewards, isLoading: rewardsLoading, error: rewardsError, } = useQuery(getMyRewardAccount);
    return (<div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back
            </h1>
            {rewards && !rewardsLoading && (<span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full px-3 py-1 text-xs font-semibold">
                <Gift className="size-3.5 text-[#F59E0B]"/>
                {(rewards?.account?.pointsBalance ?? 0).toLocaleString()} pts
              </span>)}
            {!rewards && !rewardsLoading && (<span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full px-3 py-1 text-xs font-semibold">
                <Gift className="size-3.5 text-[#F59E0B]"/>
                1,250 pts
              </span>)}
          </div>
          <p className="text-[#475569] mt-2 text-lg">
            Track service requests, bookings, messages, and rewards from here.
          </p>
        </div>
        <Link to="/get-quotes" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
          <Wrench className="size-4"/> Get Help
        </Link>
      </div>

      {/* Stats strip */}
      {!requestsLoading && !requestsError && requests && requests.length > 0 && (<div className="grid grid-cols-3 gap-4">
          {[
                { label: "Total Requests", value: requests.length, icon: <Wrench className="size-4 text-[#2563EB]"/> },
                { label: "In Progress", value: requests.filter((r) => !['COMPLETED', 'LOST', 'INVALID', 'SPAM', 'CLOSED'].includes(r.status)).length, icon: <Clock3 className="size-4 text-[#F59E0B]"/> },
                { label: "Completed", value: requests.filter((r) => r.status === 'COMPLETED').length, icon: <CheckCircle2 className="size-4 text-[#22C55E]"/> },
            ].map(({ label, value, icon }) => (<div key={label} className="bg-white border border-[#E2E8F0] rounded-[18px] p-4 flex items-center gap-4">
              <div className="size-10 shrink-0 flex items-center justify-center rounded-xl bg-[#EFF6FF]">{icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-[#0F172A]">{value}</p>
                <p className="text-xs text-[#94A3B8] font-medium">{label}</p>
              </div>
            </div>))}
        </div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Requests & Bookings</h2>
            <Link to="/my-requests" className="text-sm font-bold text-[#2563EB] hover:underline">
              View all requests →
            </Link>
          </div>
          {requestsLoading && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
              <div className="h-5 w-40 animate-pulse rounded bg-[#F8FAFC]"/>
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-[#F8FAFC]"/>
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[#F8FAFC]"/>
            </div>)}

          {!requestsLoading && requestsError && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
              <h3 className="text-lg font-bold">Requests could not load</h3>
              <p className="mt-2 text-sm text-[#475569]">
                Refresh the page or open your request details to try again.
              </p>
              <Link to="/my-requests" className="mt-4 inline-block text-sm font-bold text-[#2563EB] hover:underline">
                Open request details →
              </Link>
            </div>)}

          {!requestsLoading && !requestsError && requests?.length === 0 ? (<div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center">
              <div className="w-20 h-20 bg-[#EFF6FF] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Wrench className="size-8 text-[#2563EB]"/>
              </div>
              <h3 className="text-xl font-bold mb-2">No active requests</h3>
              <p className="text-[#475569]">
                Submit a service request when you need help. You can track
                booking updates and messages here after it is created.
              </p>
            </div>) : !requestsLoading && !requestsError && requests?.length ? (<div className="space-y-4">
              {requests.map((req) => {
                const urgency = urgencyConfig[req.urgency] ?? urgencyConfig.PLANNED;
                const appt = req.appointments?.[0];
                const provider = appt?.provider || req.assignedProvider;
                return (<div key={req.id} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#BFDBFE] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 group">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="min-w-0 flex-1">
                      {/* Urgency badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full mb-3 ${urgency.className}`}>
                        {urgency.icon}
                        {urgency.label}
                      </span>
                      <h3 className="text-lg font-bold text-[#0F172A] line-clamp-2">
                        {req.description}
                      </h3>
                    </div>
                    <span className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${req.status === 'COMPLETED'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : ['NEW', 'QUALIFYING', 'QUALIFIED'].includes(req.status)
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'}`}>
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#475569]">
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="size-3.5 text-[#94A3B8]"/>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    {appt?.scheduledAt && (<span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-[#94A3B8]"/>
                        {new Date(appt.scheduledAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>)}
                    {provider && (<span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5 text-[#94A3B8]"/>
                        {provider.businessName}
                      </span>)}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link to={`/my-requests/${req.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline">
                      View details <ArrowRight className="size-3"/>
                    </Link>
                    {!appt?.scheduledAt &&
                        ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(req.status) && (<Link to={`/book/${req.id}`} className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                          <Calendar className="size-3.5"/> Book Now
                        </Link>)}
                  </div>
                </div>);
            })}
            </div>) : null}
        </div>

        {/* Right Column: Rewards Widget */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] opacity-5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Gift className="size-5 text-[#F59E0B]"/> Rewards
              </h3>
              <Link to="/rewards" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                View History <ArrowRight className="size-3"/>
              </Link>
            </div>

            {rewardsLoading ? (<div className="animate-pulse h-20 bg-[#F8FAFC] rounded-[14px]"></div>) : rewardsError ? (<div>
                <p className="font-bold">Rewards could not load</p>
                <p className="mt-2 text-sm text-[#475569]">
                  Open rewards to check your balance and history.
                </p>
              </div>) : (<>
                <p className="text-[#94A3B8] font-medium mb-1 text-xs uppercase tracking-wider">
                  Points balance
                </p>
                <div className="text-6xl font-extrabold text-[#0F172A] tracking-tighter mb-6">
                  {rewards?.account?.pointsBalance || 0}
                </div>

                {/* Cash equivalent */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#FEF3C7] px-4 py-2.5">
                  <TrendingUp className="size-4 text-[#F59E0B]"/>
                  <span className="text-sm font-semibold text-[#92400E]">
                    Worth ${((rewards?.account?.pointsBalance || 0) / 100).toFixed(2)} in gift cards
                  </span>
                </div>

                <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#94A3B8]">
                      Current Tier
                    </p>
                    <p className="font-bold text-lg flex items-center gap-1.5">
                      <Star className="size-4 text-[#F59E0B] fill-[#F59E0B]"/>
                      {rewards?.account?.level.replace(/_/g, " ") ||
                "New Homeowner"}
                    </p>
                  </div>
                  <Link to="/how-rewards-work" className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                    Earn More →
                  </Link>
                </div>
              </>)}
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=DashboardPage.jsx.map