import React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Award, BarChart3, CheckCircle2, Clock, Coins, Gift, Layers, Sparkles, TrendingUp, } from 'lucide-react';
import { useQuery, getConsumerStats } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
const STATUS_LABELS = {
    NEW: 'New',
    QUALIFYING: 'Qualifying',
    QUALIFIED: 'Qualified',
    ASSIGNED: 'Assigned',
    ACCEPTED_BY_PROVIDER: 'Accepted',
    BOOKED: 'Booked',
    COMPLETED: 'Completed',
    REWARD_APPROVED: 'Reward Approved',
    LOST: 'Lost',
    INVALID: 'Invalid',
    SPAM: 'Spam',
    CLOSED: 'Closed',
};
const STATUS_COLORS = {
    NEW: 'bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]',
    QUALIFYING: 'bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]',
    QUALIFIED: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
    ASSIGNED: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
    ACCEPTED_BY_PROVIDER: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
    BOOKED: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
    COMPLETED: 'bg-[#F0FDF4] text-[#15803D] border border-green-200',
    REWARD_APPROVED: 'bg-[#F0FDF4] text-[#15803D] border border-green-200',
    LOST: 'bg-[#FEF2F2] text-red-600 border border-red-200',
    INVALID: 'bg-slate-100 text-[#94A3B8] border border-[#E2E8F0]',
    SPAM: 'bg-[#FEF2F2] text-red-600 border border-red-200',
    CLOSED: 'bg-slate-100 text-[#94A3B8] border border-[#E2E8F0]',
};
// Maps a status to the bar fill colour used in the "Requests by Status" chart.
const STATUS_BAR_COLORS = {
    NEW: 'bg-[#F59E0B]',
    QUALIFYING: 'bg-[#F59E0B]',
    QUALIFIED: 'bg-[#2563EB]',
    ASSIGNED: 'bg-[#2563EB]',
    ACCEPTED_BY_PROVIDER: 'bg-[#2563EB]',
    BOOKED: 'bg-[#2563EB]',
    COMPLETED: 'bg-[#22C55E]',
    REWARD_APPROVED: 'bg-[#22C55E]',
    LOST: 'bg-red-400',
    INVALID: 'bg-[#94A3B8]',
    SPAM: 'bg-red-400',
    CLOSED: 'bg-[#94A3B8]',
};
// Points → dollars conversion used for milestone progress and balance equivalence.
const POINTS_PER_DOLLAR = 100;
const REDEMPTION_THRESHOLD_DOLLARS = 100;
const REDEMPTION_THRESHOLD_POINTS = REDEMPTION_THRESHOLD_DOLLARS * POINTS_PER_DOLLAR;
function pointsToDollars(points) {
    return (points / POINTS_PER_DOLLAR).toLocaleString('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
    });
}
function KpiCard({ label, value, sub, icon: Icon, trend, accent, }) {
    if (accent) {
        return (<div className="relative overflow-hidden rounded-[20px] p-6 shadow-sm bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white">
        <div className="absolute -right-6 -top-6 opacity-20">
          <Icon className="w-28 h-28"/>
        </div>
        <div className="relative space-y-1">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-white/80"/>
            <p className="text-sm font-medium text-white/80">{label}</p>
          </div>
          <p className="text-4xl font-extrabold tracking-tight">{value}</p>
          {sub && <p className="text-xs text-white/75">{sub}</p>}
        </div>
      </div>);
    }
    return (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-1.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-[12px] bg-[#EFF6FF]">
            <Icon className="w-4 h-4 text-[#2563EB]"/>
          </span>
          <p className="text-sm text-[#475569] font-medium">{label}</p>
        </div>
        {trend && (<span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${trend.direction === 'up'
                ? 'bg-[#F0FDF4] text-[#15803D]'
                : 'bg-[#FEF2F2] text-red-600'}`}>
            {trend.direction === 'up' ? (<ArrowUpRight className="w-3 h-3"/>) : (<ArrowDownRight className="w-3 h-3"/>)}
            {trend.label}
          </span>)}
      </div>
      <p className="text-4xl font-extrabold tracking-tight text-[#0F172A]">{value}</p>
      {sub && <p className="text-xs text-[#94A3B8]">{sub}</p>}
    </div>);
}
function Bar({ value, max, color, height = 'h-2' }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (<div className={`${height} bg-[#E2E8F0] rounded-full overflow-hidden`}>
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}/>
    </div>);
}
function SkeletonBlock({ className }) {
    return <div className={`animate-pulse bg-[#E2E8F0] rounded-[12px] ${className}`}/>;
}
export default function AnalyticsPage() {
    useRoleGuard('CONSUMER');
    const { data: stats, isLoading } = useQuery(getConsumerStats);
    if (isLoading) {
        return (<div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
        <div className="space-y-2">
          <SkeletonBlock className="h-10 w-64"/>
          <SkeletonBlock className="h-4 w-80"/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (<div key={i} className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 space-y-3">
              <SkeletonBlock className="h-4 w-24"/>
              <SkeletonBlock className="h-9 w-20"/>
              <SkeletonBlock className="h-3 w-16"/>
            </div>))}
        </div>
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 space-y-4">
          <SkeletonBlock className="h-6 w-48"/>
          {[...Array(5)].map((_, i) => (<SkeletonBlock key={i} className="h-6 w-full"/>))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (<div key={i} className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 space-y-4">
              <SkeletonBlock className="h-6 w-40"/>
              {[...Array(4)].map((_, j) => (<SkeletonBlock key={j} className="h-5 w-full"/>))}
            </div>))}
        </div>
      </div>);
    }
    if (!stats) {
        return (<div className="p-6 md:p-8 max-w-6xl mx-auto bg-[#F8FAFC] min-h-screen">
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-12 text-center space-y-4 shadow-sm max-w-md mx-auto mt-10">
          <span className="flex items-center justify-center w-16 h-16 rounded-[20px] bg-[#EFF6FF] mx-auto">
            <BarChart3 className="w-8 h-8 text-[#2563EB]"/>
          </span>
          <p className="text-lg font-bold text-[#0F172A]">No analytics data available yet</p>
          <p className="text-sm text-[#475569]">
            Once you submit service requests, your activity will appear here.
          </p>
        </div>
      </div>);
    }
    const maxMonthly = Math.max(...stats.monthlyPoints.map((m) => Math.max(m.earned, m.redeemed)), 1);
    const maxCategory = Math.max(...Object.values(stats.requestsByCategory), 1);
    const totalCategoryRequests = Object.values(stats.requestsByCategory).reduce((a, b) => a + b, 0);
    // Milestone progress toward next $100 redemption.
    const balancePoints = stats.currentBalance;
    const milestonePct = Math.min(100, (balancePoints / REDEMPTION_THRESHOLD_POINTS) * 100);
    const pointsToNext = Math.max(0, REDEMPTION_THRESHOLD_POINTS - balancePoints);
    const milestoneReached = balancePoints >= REDEMPTION_THRESHOLD_POINTS;
    // Lightweight month-over-month trend for the points balance KPI chip.
    let balanceTrend;
    if (stats.monthlyPoints.length >= 2) {
        const last = stats.monthlyPoints[stats.monthlyPoints.length - 1];
        const prev = stats.monthlyPoints[stats.monthlyPoints.length - 2];
        const lastNet = last.earned - last.redeemed;
        const prevNet = prev.earned - prev.redeemed;
        if (lastNet !== prevNet) {
            balanceTrend = {
                direction: lastNet >= prevNet ? 'up' : 'down',
                label: 'vs last mo',
            };
        }
    }
    return (<div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">Your activity</h1>
          <p className="text-[#475569] mt-1">Service history and reward trends at a glance.</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#475569] bg-white border border-[#E2E8F0] rounded-full px-3 py-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-[#2563EB]"/>
          Last 6 months
        </span>
      </div>

      {/* Top KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Requests" value={stats.totalRequests} sub={`${stats.completedRequests} completed`} icon={Layers}/>
        <KpiCard label="Active Now" value={stats.pendingRequests} sub={stats.pendingRequests > 0 ? 'In progress' : 'All caught up'} icon={Activity}/>
        <KpiCard label="Points Balance" value={stats.currentBalance.toLocaleString()} sub={`${pointsToDollars(stats.currentBalance)} in rewards`} icon={Coins} accent/>
        <KpiCard label="Lifetime Earned" value={stats.lifetimePoints.toLocaleString()} sub={`${stats.totalPointsRedeemed.toLocaleString()} redeemed`} icon={Award} trend={balanceTrend}/>
      </div>

      {/* Rewards milestone progress */}
      <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-[#FEF3C7]">
              <Gift className="w-5 h-5 text-[#F59E0B]"/>
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Rewards milestone</h2>
              <p className="text-xs text-[#475569]">
                {milestoneReached
            ? `You can redeem ${REDEMPTION_THRESHOLD_DOLLARS} CAD right now`
            : `${pointsToNext.toLocaleString()} points to your next ${REDEMPTION_THRESHOLD_DOLLARS} CAD reward`}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${milestoneReached
            ? 'bg-[#F0FDF4] text-[#15803D] border border-green-200'
            : 'bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]'}`}>
            <Sparkles className="w-3.5 h-3.5"/>
            {milestoneReached ? 'Ready to redeem' : `${Math.round(milestonePct)}% there`}
          </span>
        </div>
        <Bar value={balancePoints} max={REDEMPTION_THRESHOLD_POINTS} color="bg-[#F59E0B]" height="h-3"/>
        <div className="flex justify-between mt-2 text-xs text-[#94A3B8]">
          <span>{balancePoints.toLocaleString()} pts</span>
          <span>{REDEMPTION_THRESHOLD_POINTS.toLocaleString()} pts = {REDEMPTION_THRESHOLD_DOLLARS} CAD</span>
        </div>
      </div>

      {/* Monthly points trend — horizontal bar chart */}
      {stats.monthlyPoints.length > 0 && (<div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2563EB]"/>
              <h2 className="text-lg font-bold text-[#0F172A]">Points trend</h2>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"/>
                <span className="text-xs text-[#475569]">Earned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"/>
                <span className="text-xs text-[#475569]">Redeemed</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {stats.monthlyPoints.map((m) => (<div key={m.month} className="grid grid-cols-[64px_1fr] items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">{m.month}</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Bar value={m.earned} max={maxMonthly} color="bg-[#2563EB]"/>
                    </div>
                    <span className="text-xs font-semibold text-[#2563EB] w-16 text-right tabular-nums">
                      +{m.earned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Bar value={m.redeemed} max={maxMonthly} color="bg-red-400"/>
                    </div>
                    <span className="text-xs font-semibold text-red-500 w-16 text-right tabular-nums">
                      -{m.redeemed.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Two-column lower section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Requests by status */}
        {Object.keys(stats.requestsByStatus).length > 0 && (<div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A]">Requests by status</h2>
            <div className="space-y-4">
              {Object.entries(stats.requestsByStatus)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => (<div key={status} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[status] ?? 'bg-slate-100 text-[#94A3B8]'}`}>
                        {STATUS_LABELS[status] ?? status}
                      </span>
                      <span className="text-sm font-bold text-[#0F172A] tabular-nums">{count}</span>
                    </div>
                    <Bar value={count} max={stats.totalRequests} color={STATUS_BAR_COLORS[status] ?? 'bg-[#2563EB]'}/>
                  </div>))}
            </div>
          </div>)}

        {/* Requests by category */}
        {Object.keys(stats.requestsByCategory).length > 0 && (<div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A]">Requests by category</h2>
            <div className="space-y-4">
              {Object.entries(stats.requestsByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => {
                const share = totalCategoryRequests > 0 ? Math.round((count / totalCategoryRequests) * 100) : 0;
                return (<div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#0F172A] truncate">{cat}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-[#94A3B8] tabular-nums">{share}%</span>
                          <span className="text-sm font-bold text-[#0F172A] tabular-nums">{count}</span>
                        </div>
                      </div>
                      <Bar value={count} max={maxCategory} color="bg-[#2563EB]"/>
                    </div>);
            })}
            </div>
          </div>)}
      </div>

      {/* Empty state */}
      {stats.totalRequests === 0 && (<div className="bg-white rounded-[24px] border border-[#E2E8F0] p-12 text-center space-y-4 shadow-sm">
          <span className="flex items-center justify-center w-16 h-16 rounded-[20px] bg-[#EFF6FF] mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[#2563EB]"/>
          </span>
          <div className="space-y-1">
            <p className="text-lg font-bold text-[#0F172A]">No activity yet</p>
            <p className="text-sm text-[#475569] max-w-sm mx-auto">
              Submit your first service request to start tracking your activity and earning rewards.
            </p>
          </div>
          <a href="/request" className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]">
            <Sparkles className="w-4 h-4"/>
            Submit a request
          </a>
        </div>)}
    </div>);
}
