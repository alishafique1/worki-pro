import React, { useEffect, useRef, useState } from "react";
import {
  useQuery,
  getMyRequests,
  getMyRewardAccount,
} from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useRoleGuard } from '../shared/useRoleGuard';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Wrench,
  TrendingUp,
  TrendingDown,
  Gift,
  Star,
  ArrowRight,
  Zap,
  Calendar,
  Inbox,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const urgencyConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  EMERGENCY: { label: "Emergency", className: "bg-red-50 text-red-600 border border-red-200", icon: <Zap className="size-3" /> },
  URGENT:    { label: "Urgent",   className: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]", icon: <Clock3 className="size-3" /> },
  SOON:      { label: "Soon",    className: "bg-blue-50 text-blue-600 border border-blue-200", icon: <Calendar className="size-3" /> },
  PLANNED:   { label: "Planned", className: "bg-slate-50 text-slate-500 border border-slate-200", icon: <Calendar className="size-3" /> },
};

// Status -> left border accent colour, used to make each request card glanceable.
const statusAccent: Record<string, string> = {
  COMPLETED: "#22C55E",
  NEW: "#2563EB",
  QUALIFYING: "#2563EB",
  QUALIFIED: "#2563EB",
  ASSIGNED: "#F59E0B",
  ACCEPTED_BY_PROVIDER: "#F59E0B",
  BOOKED: "#2563EB",
  LOST: "#94A3B8",
  INVALID: "#94A3B8",
  SPAM: "#94A3B8",
  CLOSED: "#94A3B8",
};

const COMPLETED_OR_DEAD = ["COMPLETED", "LOST", "INVALID", "SPAM", "CLOSED"];

type FilterKey = "ALL" | "ACTIVE" | "COMPLETED";

const filterPills: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
];

export default function DashboardPage() {
  useRoleGuard('CONSUMER');
  const { data: user, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Capture newRequest param in state/ref so it survives the URL clear.
  const newRequestIdFromParam = searchParams.get('newRequest');
  const [showSuccessBanner, setShowSuccessBanner] = useState(!!newRequestIdFromParam);
  const [highlightedId, setHighlightedId] = useState<string | null>(newRequestIdFromParam);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Clear the URL param after the first paint (state already has the ID).
  useEffect(() => {
    if (newRequestIdFromParam) {
      navigate('/account', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) return <div className="min-h-screen bg-[#F8FAFC]" />;
  const {
    data: requests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery(getMyRequests);
  const {
    data: rewards,
    isLoading: rewardsLoading,
    error: rewardsError,
  } = useQuery(getMyRewardAccount);

  const [filter, setFilter] = useState<FilterKey>("ALL");

  // Scroll to the newly-created request card once the request list loads.
  useEffect(() => {
    if (highlightedId && cardRefs.current[highlightedId]) {
      cardRefs.current[highlightedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId, requests]);

  const firstName = (user as any)?.firstName || "there";

  const totalCount = requests?.length ?? 0;
  const inProgressCount =
    requests?.filter((r: any) => !COMPLETED_OR_DEAD.includes(r.status)).length ?? 0;
  const completedCount =
    requests?.filter((r: any) => r.status === "COMPLETED").length ?? 0;

  const filteredRequests = (requests ?? []).filter((req: any) => {
    if (filter === "ACTIVE") return !COMPLETED_OR_DEAD.includes(req.status);
    if (filter === "COMPLETED") return req.status === "COMPLETED";
    return true;
  });

  // Rewards progress toward next tier — purely presentational, derived from balance.
  const pointsBalance = rewards?.account?.pointsBalance ?? 0;
  const NEXT_TIER_AT = 2000;
  const tierProgress = Math.min(100, Math.round((pointsBalance / NEXT_TIER_AT) * 100));
  const pointsToNextTier = Math.max(0, NEXT_TIER_AT - pointsBalance);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-['Fraunces',serif] text-4xl md:text-5xl font-black tracking-tight text-[#0F172A]">
                Welcome back, {firstName}
              </h1>
              {!rewardsLoading && (
                <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full px-3 py-1.5 text-xs font-bold">
                  <Gift className="size-3.5 text-[#F59E0B]" />
                  {pointsBalance.toLocaleString()} pts
                </span>
              )}
            </div>
            <p className="text-[#475569] mt-2 text-base md:text-lg">
              Track your service requests, bookings, messages, and rewards from here.
            </p>
          </div>
          <Link
            to="/account/request-service"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)] whitespace-nowrap"
          >
            <Wrench className="size-4" /> Get Help
          </Link>
        </div>

        {/* ---------- Success banner (shown after wizard redirect) ---------- */}
        {showSuccessBanner && (
          <div className="flex items-start gap-4 bg-white border border-[#E2E8F0] rounded-[20px] p-5">
            <CheckCircle2 className="size-5 text-[#22C55E] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0F172A]">Request sent</p>
              <p className="text-sm text-[#475569] mt-0.5">
                We'll email you the moment a local pro responds
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setShowSuccessBanner(false); setHighlightedId(null); }}
              aria-label="Dismiss"
              className="text-[#94A3B8] hover:text-[#475569] transition-colors shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* ---------- Stat cards ---------- */}
        {requestsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-[#E2E8F0] rounded-[20px] p-6"
              >
                <div className="h-3 w-24 rounded bg-[#E2E8F0] mb-4" />
                <div className="h-10 w-16 rounded bg-[#E2E8F0] mb-3" />
                <div className="h-3 w-32 rounded bg-[#E2E8F0]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Requests",
                value: totalCount,
                hint: "All-time service requests",
                trend: "up" as const,
                trendLabel: "Lifetime",
              },
              {
                label: "In Progress",
                value: inProgressCount,
                hint: "15 min avg response time",
                trend: "up" as const,
                trendLabel: "Active now",
              },
              {
                label: "Completed",
                value: completedCount,
                hint: "Jobs done & reviewed",
                trend: completedCount > 0 ? ("up" as const) : ("down" as const),
                trendLabel: "All done",
              },
            ].map(({ label, value, hint, trend, trendLabel }) => (
              <div
                key={label}
                className="relative bg-white border border-[#E2E8F0] rounded-[20px] p-6 overflow-hidden group hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-shadow"
              >
                {/* Gradient top border accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                    {label}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${
                      trend === "up"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-slate-100 text-[#475569]"
                    }`}
                  >
                    {trend === "up" ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {trendLabel}
                  </span>
                </div>
                <p className="mt-3 text-4xl font-black text-[#0F172A] tracking-tight tabular-nums">
                  {value}
                </p>
                {/* Tiny sparkline-style context bar */}
                <div className="mt-3 flex items-end gap-0.5 h-6">
                  {[40, 65, 50, 80, 60, 90, 75].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-sm bg-[#DBEAFE] group-hover:bg-[#BFDBFE] transition-colors"
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#475569]">{hint}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---------- Left Column: Request feed ---------- */}
          <div className="lg:col-span-2 space-y-5">
            {/* Sticky section header with filter pills */}
            <div className="sticky top-0 z-10 -mx-2 px-2 py-3 bg-[#F8FAFC]/90 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="font-['Fraunces',serif] text-2xl font-extrabold text-[#0F172A]">
                  Requests &amp; Bookings
                </h2>
                <Link
                  to="/account/requests"
                  className="text-sm font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </div>
              {/* Filter pills */}
              {!requestsLoading && !requestsError && totalCount > 0 && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-[14px] bg-white border border-[#E2E8F0] p-1">
                  {filterPills.map((pill) => {
                    const count =
                      pill.key === "ALL"
                        ? totalCount
                        : pill.key === "ACTIVE"
                        ? inProgressCount
                        : completedCount;
                    const active = filter === pill.key;
                    return (
                      <button
                        key={pill.key}
                        type="button"
                        onClick={() => setFilter(pill.key)}
                        className={`inline-flex items-center gap-1.5 rounded-[10px] px-4 py-1.5 text-sm font-semibold transition-colors ${
                          active
                            ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                            : "text-[#475569] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {pill.label}
                        <span
                          className={`text-xs font-bold rounded-full px-1.5 ${
                            active ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#94A3B8]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Loading skeleton matching card shape */}
            {requestsLoading && (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-[24px] border border-[#E2E8F0] bg-white p-6"
                  >
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-24 rounded-full bg-[#E2E8F0]" />
                        <div className="h-5 w-3/4 rounded bg-[#E2E8F0]" />
                      </div>
                      <div className="h-7 w-28 rounded-full bg-[#E2E8F0] shrink-0" />
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="h-4 w-24 rounded bg-[#E2E8F0]" />
                      <div className="h-4 w-32 rounded bg-[#E2E8F0]" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-4 w-20 rounded bg-[#E2E8F0]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!requestsLoading && requestsError && (
              <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Requests could not load
                </h3>
                <p className="mt-2 text-sm text-[#475569]">
                  Refresh the page or open your request details to try again.
                </p>
                <Link
                  to="/account/requests"
                  className="mt-4 inline-block text-sm font-bold text-[#2563EB] hover:underline"
                >
                  Open request details →
                </Link>
              </div>
            )}

            {/* Empty state — no requests at all */}
            {!requestsLoading && !requestsError && totalCount === 0 && (
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center">
                <div className="w-20 h-20 bg-[#EFF6FF] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Inbox className="size-9 text-[#2563EB]" />
                </div>
                <h3 className="font-['Fraunces',serif] text-xl font-extrabold text-[#0F172A] mb-2">
                  No active requests yet
                </h3>
                <p className="text-[#475569] max-w-md mx-auto mb-6">
                  Submit a service request when you need help around the home.
                  You can track booking updates and messages here once it&apos;s
                  created.
                </p>
                <Link
                  to="/account/request-service"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                >
                  <Wrench className="size-4" /> Get your first quote
                </Link>
              </div>
            )}

            {/* Empty state — filter has no matches but requests exist */}
            {!requestsLoading &&
              !requestsError &&
              totalCount > 0 &&
              filteredRequests.length === 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-10 text-center">
                  <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="size-7 text-[#94A3B8]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">
                    Nothing in “{filterPills.find((p) => p.key === filter)?.label}”
                  </h3>
                  <p className="text-sm text-[#475569]">
                    Try a different filter to see your other requests.
                  </p>
                </div>
              )}

            {/* Request cards */}
            {!requestsLoading && !requestsError && filteredRequests.length > 0 && (
              <div className="space-y-4">
                {filteredRequests.map((req: any) => {
                  const urgency = urgencyConfig[req.urgency] ?? urgencyConfig.PLANNED;
                  const appt = req.appointments?.[0];
                  const provider = appt?.provider || req.assignedProvider;
                  const accent = statusAccent[req.status] ?? "#2563EB";
                  return (
                    <div
                      key={req.id}
                      ref={(el) => { cardRefs.current[req.id] = el; }}
                      style={{ borderLeftColor: accent }}
                      className={`bg-white border border-[#E2E8F0] border-l-4 rounded-[24px] p-6 hover:border-[#BFDBFE] hover:border-l-4 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 group${highlightedId === req.id ? ' ring-2 ring-[#2563EB]' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="min-w-0 flex-1">
                          {/* Urgency badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full mb-3 ${urgency.className}`}
                          >
                            {urgency.icon}
                            {urgency.label}
                          </span>
                          <h3 className="text-lg font-bold text-[#0F172A] line-clamp-2">
                            {req.description}
                          </h3>
                        </div>
                        <span
                          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                            req.status === "COMPLETED"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : ["NEW", "QUALIFYING", "QUALIFIED"].includes(req.status)
                              ? "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]"
                              : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                          }`}
                        >
                          {req.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#475569]">
                        <span className="flex items-center gap-1.5">
                          <CalendarClock className="size-3.5 text-[#94A3B8]" />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                        {appt?.scheduledAt && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-[#94A3B8]" />
                            {new Date(appt.scheduledAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                        {provider && (
                          <span className="flex items-center gap-2">
                            {/* Provider initials avatar */}
                            <span className="inline-flex items-center justify-center size-6 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[10px] font-bold text-[#1D4ED8]">
                              {provider.businessName
                                ?.split(" ")
                                .slice(0, 2)
                                .map((w: string) => w[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="size-3.5 text-[#22C55E]" />
                              {provider.businessName}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Link
                          to={`/account/requests/${req.id}`}
                          className="inline-flex items-center gap-1.5 rounded-[14px] border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#475569] hover:border-[#BFDBFE] hover:text-[#2563EB] transition-colors"
                        >
                          View details <ArrowRight className="size-3" />
                        </Link>
                        {!appt?.scheduledAt &&
                          ["ASSIGNED", "ACCEPTED_BY_PROVIDER", "QUALIFIED"].includes(
                            req.status
                          ) && (
                            <Link
                              to={`/account/book/${req.id}`}
                              className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                            >
                              <Calendar className="size-3.5" /> Book Now
                            </Link>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---------- Right Column: Rewards widget ---------- */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] opacity-5 blur-3xl rounded-full translate-x-10 -translate-y-10" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Fraunces',serif] text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Gift className="size-5 text-[#F59E0B]" /> Rewards
                </h3>
                <Link
                  to="/account/rewards"
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  View History <ArrowRight className="size-3" />
                </Link>
              </div>

              {rewardsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-24 rounded bg-[#E2E8F0]" />
                  <div className="h-14 w-32 rounded bg-[#E2E8F0]" />
                  <div className="h-3 w-full rounded-full bg-[#E2E8F0]" />
                  <div className="h-10 w-48 rounded-xl bg-[#E2E8F0]" />
                  <div className="pt-4 border-t border-[#E2E8F0] flex justify-between">
                    <div className="space-y-1.5">
                      <div className="h-3 w-20 rounded bg-[#E2E8F0]" />
                      <div className="h-5 w-28 rounded bg-[#E2E8F0]" />
                    </div>
                    <div className="h-8 w-20 rounded-[14px] bg-[#E2E8F0]" />
                  </div>
                </div>
              ) : rewardsError ? (
                <div>
                  <p className="font-bold text-[#0F172A]">Rewards could not load</p>
                  <p className="mt-2 text-sm text-[#475569]">
                    Open rewards to check your balance and history.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[#94A3B8] font-medium mb-1 text-xs uppercase tracking-wider">
                    Points balance
                  </p>
                  <div className="text-6xl font-black text-[#0F172A] tracking-tighter mb-2 tabular-nums">
                    {pointsBalance.toLocaleString()}
                  </div>

                  {/* Cash equivalent */}
                  <div className="mb-6 inline-flex items-center gap-2 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] px-4 py-2.5">
                    <TrendingUp className="size-4 text-[#F59E0B]" />
                    <span className="text-sm font-semibold text-[#92400E]">
                      Worth ${(pointsBalance / 100).toFixed(2)} in gift cards
                    </span>
                  </div>

                  {/* Progress to next tier */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#475569] flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-[#2563EB]" />
                        Next tier progress
                      </span>
                      <span className="text-xs font-bold text-[#0F172A] tabular-nums">
                        {tierProgress}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        style={{ width: `${tierProgress}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-500"
                      />
                    </div>
                    <p className="mt-2 text-xs text-[#475569]">
                      {pointsToNextTier > 0
                        ? `${pointsToNextTier.toLocaleString()} pts to your next reward tier`
                        : "Top tier unlocked — nice work!"}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#94A3B8]">Current Tier</p>
                      <p className="font-bold text-lg flex items-center gap-1.5 text-[#0F172A]">
                        <Star className="size-4 text-[#F59E0B] fill-[#F59E0B]" />
                        {rewards?.account?.level.replace(/_/g, " ") ||
                          "New Homeowner"}
                      </p>
                    </div>
                    <Link
                      to="/how-rewards-work"
                      className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                    >
                      Earn More →
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Referral callout */}
            <div className="relative bg-[#0F172A] rounded-[24px] p-7 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#2563EB] opacity-30 blur-3xl rounded-full" />
              <div className="relative">
                <div className="inline-flex items-center justify-center size-11 rounded-[14px] bg-white/10 mb-4">
                  <Users className="size-5 text-[#60A5FA]" />
                </div>
                <h3 className="font-['Fraunces',serif] text-lg font-extrabold text-white mb-1.5">
                  Refer a neighbour
                </h3>
                <p className="text-sm text-slate-300 mb-5">
                  Earn bonus points when a friend in the GTA books their first
                  job through The Helper.
                </p>
                <Link
                  to="/account/referrals"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0F172A] text-sm font-bold rounded-[14px] hover:bg-slate-100 transition-colors"
                >
                  <Gift className="size-4 text-[#F59E0B]" /> Share &amp; earn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
