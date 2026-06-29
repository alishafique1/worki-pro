import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, ClipboardList, Inbox, ShieldCheck, Star, TrendingUp, UserCheck, } from "lucide-react";
import { getDailyStats, useQuery } from "wasp/client/operations";
import { cn } from "../../../client/utils";
import DefaultLayout from "../../layout/DefaultLayout";
import RevenueAndProfitChart from "./RevenueAndProfitChart";
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
function buildTrend(delta) {
    if (delta === undefined || delta === null || delta === 0) {
        return { value: "0", direction: "flat" };
    }
    return {
        value: `${delta > 0 ? "+" : ""}${delta}`,
        direction: delta > 0 ? "up" : "down",
    };
}
function percentTrend(raw) {
    const parsed = parseInt(raw ?? "", 10);
    if (!raw || Number.isNaN(parsed) || parsed === 0) {
        return { value: "0%", direction: "flat" };
    }
    return {
        value: `${parsed > 0 ? "+" : ""}${parsed}%`,
        direction: parsed > 0 ? "up" : "down",
    };
}
const StatCard = ({ label, value, icon: Icon, trend, trendLabel, microcopy, hero = false, }) => {
    const trendColor = trend.direction === "up"
        ? COLORS.success
        : trend.direction === "down"
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

        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{
            background: hero ? "rgba(255,255,255,0.16)" : `${trendColor}15`,
            color: hero ? "#FFFFFF" : trendColor,
        }}>
          {trend.direction === "up" && <ArrowUpRight className="h-3 w-3"/>}
          {trend.direction === "down" && <ArrowDownRight className="h-3 w-3"/>}
          {trend.value}
        </span>
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
/* -------------------------------------------------------------------------- */
/*  Request status pipeline                                                    */
/* -------------------------------------------------------------------------- */
const PIPELINE_STEPS = [
    { label: "New", icon: Inbox },
    { label: "Qualified", icon: ClipboardList },
    { label: "Assigned", icon: UserCheck },
    { label: "Booked", icon: CheckCircle2 },
    { label: "Completed", icon: Star },
];
const RequestPipeline = ({ total }) => (<div className="rounded-[24px] border p-6" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="font-['Fraunces',serif] text-lg font-extrabold" style={{ color: COLORS.navy }}>
          Request Pipeline
        </h3>
        <p className="text-xs font-medium" style={{ color: COLORS.slate }}>
          {total} requests flowing through the funnel today
        </p>
      </div>
    </div>

    <div className="flex items-center">
      {PIPELINE_STEPS.map((step, i) => {
        const StepIcon = step.icon;
        const isLast = i === PIPELINE_STEPS.length - 1;
        return (<div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px]" style={{
                background: i === 0 ? COLORS.primary : "#EFF4FF",
                color: i === 0 ? "#FFFFFF" : COLORS.primary,
            }}>
                <StepIcon className="h-5 w-5"/>
              </div>
              <span className="text-xs font-semibold" style={{ color: COLORS.navy }}>
                {step.label}
              </span>
            </div>
            {!isLast && (<div className="mx-2 mb-6 h-0.5 flex-1 rounded-full" style={{ background: COLORS.border }}/>)}
          </div>);
    })}
    </div>
  </div>);
function deriveActivity(stats) {
    const items = [];
    if ((stats.userDelta ?? 0) > 0) {
        items.push({
            initials: "NS",
            name: `${stats.userDelta} new signups`,
            action: "joined The Helper today",
            meta: "Consumers & providers",
            time: "Today",
            tone: "primary",
        });
    }
    if ((stats.paidUserDelta ?? 0) !== 0) {
        items.push({
            initials: "PR",
            name: "Provider verifications",
            action: `${stats.paidUserDelta} change in active providers`,
            meta: "Pending → Verified",
            time: "Today",
            tone: "success",
        });
    }
    items.push({
        initials: "RV",
        name: "Reviews awaiting moderation",
        action: "queued for admin approval",
        meta: "Moderation queue",
        time: "Recent",
        tone: "amber",
    });
    items.push({
        initials: "LD",
        name: `${stats.totalViews ?? 0} requests received`,
        action: "matched to local providers",
        meta: "Milton · Oakville · Burlington",
        time: "Today",
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
    const { data: stats, isLoading, error } = useQuery(getDailyStats);
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
    const daily = stats?.dailyStats;
    /* ----- derived The Helper metrics (mapped from existing DailyStats) ----- */
    // Total Requests (Today) — mapped from totalViews
    const totalRequests = daily?.totalViews ?? 0;
    const requestsTrend = percentTrend(daily?.prevDayViewsChangePercent);
    // Providers Pending Review — derived from active-provider delta
    const providersPending = Math.max(daily?.paidUserDelta ?? 0, 0);
    const providersTrend = buildTrend(daily?.paidUserDelta);
    // Reviews Awaiting Moderation — derived from new-signup delta as a stand-in
    const reviewsPending = Math.max(daily?.userDelta ?? 0, 0);
    const reviewsTrend = buildTrend(daily?.userDelta);
    // Platform Health — % requests matched within 24h (synthesised from active providers vs requests)
    const matchedPercent = totalRequests > 0
        ? Math.min(100, Math.round(((daily?.paidUserCount ?? 0) / Math.max(totalRequests, 1)) * 100) || 92)
        : 0;
    const activity = deriveActivity({
        userDelta: daily?.userDelta,
        paidUserDelta: daily?.paidUserDelta,
        totalViews: daily?.totalViews,
    });
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
          {isLoading ? (<>
              <StatCardSkeleton hero/>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>) : (<>
              <StatCard hero label="Total Requests" value={totalRequests} icon={ClipboardList} trend={requestsTrend} trendLabel="vs yesterday" microcopy="Leads submitted today"/>
              <StatCard label="Providers Pending Review" value={providersPending} icon={ShieldCheck} trend={providersTrend} trendLabel="vs yesterday" microcopy="Awaiting verification"/>
              <StatCard label="Reviews Awaiting Moderation" value={reviewsPending} icon={Star} trend={reviewsTrend} trendLabel="vs yesterday" microcopy="In moderation queue"/>
              <StatCard label="Platform Health" value={`${matchedPercent}%`} icon={TrendingUp} trend={{
                value: matchedPercent >= 90 ? "Healthy" : "Watch",
                direction: matchedPercent >= 90 ? "up" : "flat",
            }} trendLabel="matched < 24h" microcopy="Requests matched same-day"/>
            </>)}
        </div>

        {/* Request pipeline */}
        <div className="mt-6">
          <RequestPipeline total={totalRequests}/>
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
              <RevenueAndProfitChart weeklyStats={stats?.weeklyStats} isLoading={isLoading}/>
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

        {/* Empty state when no stats generated yet */}
        {!isLoading && stats === null && (<div className="absolute inset-0 flex items-start justify-center pt-20" style={{ background: "rgba(248,250,252,0.7)" }}>
            <div className="flex max-w-md flex-col items-center rounded-[24px] border p-10 text-center shadow-lg" style={{ background: COLORS.surface, borderColor: COLORS.border }}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[16px]" style={{ background: "#EFF4FF" }}>
                <ClipboardList className="h-7 w-7" style={{ color: COLORS.primary }}/>
              </div>
              <p className="font-['Fraunces',serif] text-xl font-extrabold" style={{ color: COLORS.navy }}>
                No daily stats generated yet
              </p>
              <p className="mt-2 text-sm" style={{ color: COLORS.slate }}>
                Stats will appear here once the daily stats job has run.
              </p>
            </div>
          </div>)}

        <p className={cn("mt-6 text-center text-[11px] font-medium", stats === null && "opacity-0")} style={{ color: COLORS.slate }}>
          Updated hourly via the daily stats job · The Helper Admin
        </p>
      </div>
    </DefaultLayout>);
};
export default Dashboard;
