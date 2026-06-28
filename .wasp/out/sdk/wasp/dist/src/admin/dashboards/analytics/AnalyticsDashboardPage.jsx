import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, ClipboardList, Inbox, ShieldCheck, Star, TrendingUp, UserCheck, } from "lucide-react";
import { getDailyStats, getAdminLiveCounts, useQuery } from "wasp/client/operations";
import DefaultLayout from "../../layout/DefaultLayout";
import RequestVolumeChart from "./RequestVolumeChart";
import SourcesTable from "./SourcesTable";
/* -------------------------------------------------------------------------- */
/*  Design tokens (The Helper)                                                 */
/* -------------------------------------------------------------------------- */
const COLORS = {
    primary: "#2563EB",
    navy: "#0F172A",
    slate: "#475569",
    pageBg: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",
    success: "#22C55E",
    amber: "#F59E0B",
    amberSoft: "#FEF3C7",
};
const StatCard = ({ label, value, icon: Icon, trend, trendLabel, microcopy, hero = false, }) => {
    const trendColor = trend?.direction === "up"
        ? COLORS.success
        : trend?.direction === "down"
            ? "#EF4444"
            : COLORS.slate;
    return (<div className="relative flex flex-col justify-between overflow-hidden rounded-[20px] border p-5 transition-shadow duration-200 hover:shadow-lg" style={{
            borderColor: hero ? "transparent" : COLORS.border,
            background: hero
                ? `linear-gradient(145deg, ${COLORS.primary} 0%, #1D4ED8 100%)`
                : COLORS.surface,
        }}>
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px]" style={{ background: hero ? "rgba(255,255,255,0.16)" : "#EFF4FF" }}>
          <Icon className="h-5 w-5" style={{ color: hero ? "#FFFFFF" : COLORS.primary }}/>
        </div>

        {trend && (<span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{
                background: hero ? "rgba(255,255,255,0.16)" : `${trendColor}15`,
                color: hero ? "#FFFFFF" : trendColor,
            }}>
            {trend.direction === "up" && <ArrowUpRight className="h-3 w-3"/>}
            {trend.direction === "down" && <ArrowDownRight className="h-3 w-3"/>}
            {trend.value}
          </span>)}
      </div>

      <div className="mt-6">
        <p className="font-['Fraunces',serif] text-3xl font-black leading-none tracking-tight" style={{ color: hero ? "#FFFFFF" : COLORS.navy }}>
          {value}
        </p>
        <p className="mt-1.5 text-sm font-semibold" style={{ color: hero ? "rgba(255,255,255,0.92)" : COLORS.navy }}>
          {label}
        </p>
        <p className="mt-3 text-xs font-medium" style={{ color: hero ? "rgba(255,255,255,0.72)" : COLORS.slate }}>
          <span className="font-semibold">{trendLabel}</span> · {microcopy}
        </p>
      </div>
    </div>);
};
/* -------------------------------------------------------------------------- */
/*  Skeleton stat card                                                         */
/* -------------------------------------------------------------------------- */
const StatCardSkeleton = ({ hero = false }) => (<div className="flex animate-pulse flex-col justify-between rounded-[20px] border p-5" style={{
        borderColor: COLORS.border,
        background: hero ? "#EFF4FF" : COLORS.surface,
    }}>
    <div className="flex items-start justify-between">
      <div className="h-11 w-11 rounded-[14px]" style={{ background: COLORS.border }}/>
      <div className="h-6 w-14 rounded-full" style={{ background: COLORS.border }}/>
    </div>
    <div className="mt-6 space-y-2">
      <div className="h-8 w-24 rounded-md" style={{ background: COLORS.border }}/>
      <div className="h-4 w-32 rounded" style={{ background: COLORS.border }}/>
      <div className="h-3 w-40 rounded" style={{ background: COLORS.border }}/>
    </div>
  </div>);
const PIPELINE_STEPS = [
    { label: "New", icon: Inbox, key: "new" },
    { label: "Qualified", icon: ClipboardList, key: "qualified" },
    { label: "Assigned", icon: UserCheck, key: "assigned" },
    { label: "Booked", icon: CheckCircle2, key: "booked" },
    { label: "Completed", icon: Star, key: "completed" },
];
const RequestPipeline = ({ pipeline }) => {
    const total = pipeline
        ? pipeline.new + pipeline.qualified + pipeline.assigned + pipeline.booked + pipeline.completed
        : 0;
    return (<div className="rounded-[24px] border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-['Fraunces',serif] text-lg font-extrabold" style={{ color: COLORS.navy }}>
            Request Pipeline
          </h3>
          <p className="text-xs font-medium" style={{ color: COLORS.slate }}>
            {total} active request{total === 1 ? "" : "s"} across the funnel
          </p>
        </div>
      </div>

      <div className="flex items-center">
        {PIPELINE_STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isLast = i === PIPELINE_STEPS.length - 1;
            const count = pipeline?.[step.key] ?? 0;
            return (<div key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px]" style={{
                    background: count > 0 ? COLORS.primary : "#EFF4FF",
                    color: count > 0 ? "#FFFFFF" : COLORS.primary,
                }}>
                  <StepIcon className="h-5 w-5"/>
                </div>
                <span className="text-sm font-extrabold" style={{ color: COLORS.navy }}>
                  {count}
                </span>
                <span className="text-xs font-semibold" style={{ color: COLORS.slate }}>
                  {step.label}
                </span>
              </div>
              {!isLast && (<div className="mx-2 mb-10 h-0.5 flex-1 rounded-full" style={{ background: COLORS.border }}/>)}
            </div>);
        })}
      </div>
    </div>);
};
function deriveActivity(counts) {
    const items = [];
    if (!counts)
        return items;
    if (counts.requestsToday > 0) {
        items.push({
            initials: "LD",
            name: `${counts.requestsToday} request${counts.requestsToday === 1 ? "" : "s"} today`,
            action: "submitted across the GTA",
            meta: "Milton · Oakville · Burlington",
            time: "Today",
            tone: "primary",
        });
    }
    if (counts.pendingProviders > 0) {
        items.push({
            initials: "PR",
            name: `${counts.pendingProviders} provider${counts.pendingProviders === 1 ? "" : "s"} awaiting review`,
            action: "needs verification",
            meta: "Pending → Verified",
            time: "Now",
            tone: "success",
        });
    }
    if (counts.pendingReviews > 0) {
        items.push({
            initials: "RV",
            name: `${counts.pendingReviews} review${counts.pendingReviews === 1 ? "" : "s"} to moderate`,
            action: "queued for admin approval",
            meta: "Moderation queue",
            time: "Now",
            tone: "amber",
        });
    }
    items.push({
        initials: "VP",
        name: `${counts.verifiedProviders} verified provider${counts.verifiedProviders === 1 ? "" : "s"}`,
        action: "live on the platform",
        meta: "Active pros",
        time: "Live",
        tone: "slate",
    });
    return items;
}
const toneStyles = {
    primary: { bg: "#EFF4FF", fg: COLORS.primary },
    success: { bg: "#DCFCE7", fg: "#16A34A" },
    amber: { bg: COLORS.amberSoft, fg: "#B45309" },
    slate: { bg: "#F1F5F9", fg: COLORS.slate },
};
const RecentActivity = ({ items }) => (<div className="flex h-full flex-col rounded-[24px] border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
    <div className="mb-1 flex items-center gap-2">
      <Activity className="h-4 w-4" style={{ color: COLORS.primary }}/>
      <h3 className="font-['Fraunces',serif] text-lg font-extrabold" style={{ color: COLORS.navy }}>
        Recent Activity
      </h3>
    </div>
    <p className="mb-5 text-xs font-medium" style={{ color: COLORS.slate }}>
      15 min avg response · live across the platform
    </p>

    {items.length === 0 ? (<div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px]" style={{ background: "#EFF4FF" }}>
          <Inbox className="h-6 w-6" style={{ color: COLORS.primary }}/>
        </div>
        <p className="text-sm font-semibold" style={{ color: COLORS.navy }}>
          No activity yet
        </p>
        <p className="mt-1 text-xs" style={{ color: COLORS.slate }}>
          New requests and signups will appear here.
        </p>
      </div>) : (<ul className="flex flex-col gap-1">
        {items.map((item, i) => {
            const tone = toneStyles[item.tone];
            return (<li key={i} className="flex items-start gap-3 rounded-[14px] px-2 py-3 transition-colors hover:bg-[#F8FAFC]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: tone.bg, color: tone.fg }}>
                {item.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: COLORS.navy }}>
                  {item.name}
                </p>
                <p className="truncate text-xs" style={{ color: COLORS.slate }}>
                  {item.action}
                </p>
                <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: tone.bg, color: tone.fg }}>
                  {item.meta}
                </span>
              </div>
              <span className="shrink-0 text-[11px] font-medium" style={{ color: COLORS.slate }}>
                {item.time}
              </span>
            </li>);
        })}
      </ul>)}
  </div>);
/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */
const Dashboard = ({ user }) => {
    const { data: stats, error } = useQuery(getDailyStats);
    const { data: counts, isLoading: countsLoading } = useQuery(getAdminLiveCounts);
    /* ----- error ----- */
    if (error) {
        return (<DefaultLayout user={user}>
        <div className="flex h-full items-center justify-center py-20">
          <div className="flex max-w-md flex-col items-center rounded-[24px] border p-10 text-center" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[16px]" style={{ background: "#FEE2E2" }}>
              <AlertTriangle className="h-7 w-7" style={{ color: "#EF4444" }}/>
            </div>
            <p className="font-['Fraunces',serif] text-xl font-extrabold" style={{ color: COLORS.navy }}>
              Couldn't load analytics
            </p>
            <p className="mt-2 text-sm" style={{ color: COLORS.slate }}>
              {error.message || "Something went wrong while fetching stats."}
            </p>
          </div>
        </div>
      </DefaultLayout>);
    }
    /* ----- real operational metrics from getAdminLiveCounts ----- */
    // Total Requests (Today) — real ServiceRequest count for today
    const totalRequests = counts?.requestsToday ?? 0;
    // Providers Pending Review — real Provider PENDING count
    const providersPending = counts?.pendingProviders ?? 0;
    // Reviews Awaiting Moderation — real Review PENDING count
    const reviewsPending = counts?.pendingReviews ?? 0;
    // Verified provider share — verified / (verified + pending). A real health
    // signal: how much of the provider base has cleared verification.
    const providerTotal = (counts?.verifiedProviders ?? 0) + (counts?.pendingProviders ?? 0);
    const verifiedPercent = providerTotal > 0
        ? Math.round(((counts?.verifiedProviders ?? 0) / providerTotal) * 100)
        : 0;
    const activity = deriveActivity(counts);
    return (<DefaultLayout user={user}>
      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="font-['Fraunces',serif] text-2xl font-black tracking-tight" style={{ color: COLORS.navy }}>
            Platform Analytics
          </h1>
          <p className="text-sm font-medium" style={{ color: COLORS.slate }}>
            Live overview of requests, providers, and platform health across the
            GTA.
          </p>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {countsLoading ? (<>
              <StatCardSkeleton hero/>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>) : (<>
              <StatCard hero label="Total Requests" value={totalRequests} icon={ClipboardList} trendLabel="Today" microcopy="Leads submitted today"/>
              <StatCard label="Providers Pending Review" value={providersPending} icon={ShieldCheck} trend={providersPending > 0
                ? { value: "Action needed", direction: "flat" }
                : { value: "Clear", direction: "up" }} trendLabel="Verification queue" microcopy="Awaiting verification"/>
              <StatCard label="Reviews Awaiting Moderation" value={reviewsPending} icon={Star} trend={reviewsPending > 0
                ? { value: "Action needed", direction: "flat" }
                : { value: "Clear", direction: "up" }} trendLabel="Moderation queue" microcopy="In moderation queue"/>
              <StatCard label="Verified Providers" value={`${verifiedPercent}%`} icon={TrendingUp} trend={{
                value: verifiedPercent >= 80 ? "Healthy" : "Building",
                direction: verifiedPercent >= 80 ? "up" : "flat",
            }} trendLabel="of provider base" microcopy={`${counts?.verifiedProviders ?? 0} live pros`}/>
            </>)}
        </div>

        {/* Request pipeline */}
        <div className="mt-6">
          <RequestPipeline pipeline={counts?.pipeline}/>
        </div>

        {/* Chart */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-[24px] border p-2" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="px-5 pt-4">
                <h3 className="font-['Fraunces',serif] text-lg font-extrabold" style={{ color: COLORS.navy }}>
                  Request Volume — Last 7 Days
                </h3>
                <p className="text-xs font-medium" style={{ color: COLORS.slate }}>
                  Daily incoming service requests across all categories
                </p>
              </div>
              <RequestVolumeChart data={counts?.requestsByDay} isLoading={countsLoading}/>
            </div>
          </div>
        </div>

        {/* Bottom 2-col grid: sources + activity */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-7">
            <div className="overflow-hidden rounded-[24px] border" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <SourcesTable sources={stats?.dailyStats?.sources}/>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-5">
            <RecentActivity items={activity}/>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-medium" style={{ color: COLORS.slate }}>
          Requests, providers, and reviews are live · traffic sources update
          hourly via the daily stats job · The Helper Admin
        </p>
      </div>
    </DefaultLayout>);
};
export default Dashboard;
//# sourceMappingURL=AnalyticsDashboardPage.jsx.map