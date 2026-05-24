import React from 'react';
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
function StatCard({ label, value, sub, accent }) {
    return (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-1 shadow-sm">
      <p className="text-sm text-[#475569] font-medium">{label}</p>
      <p className={`text-4xl font-extrabold tracking-tight ${accent ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#94A3B8]">{sub}</p>}
    </div>);
}
function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (<div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }}/>
    </div>);
}
export default function AnalyticsPage() {
    useRoleGuard('CONSUMER');
    const { data: stats, isLoading } = useQuery(getConsumerStats);
    if (isLoading) {
        return (<div className="p-8 max-w-5xl mx-auto space-y-8">
        <div className="h-10 w-64 animate-pulse bg-[#E2E8F0] rounded-[12px]"/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-28 animate-pulse bg-[#E2E8F0] rounded-[20px]"/>))}
        </div>
      </div>);
    }
    if (!stats) {
        return (<div className="p-8 max-w-5xl mx-auto">
        <p className="text-[#475569]">No analytics data available yet.</p>
      </div>);
    }
    const maxMonthly = Math.max(...stats.monthlyPoints.map((m) => Math.max(m.earned, m.redeemed)), 1);
    const maxCategory = Math.max(...Object.values(stats.requestsByCategory), 1);
    return (<div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">Analytics</h1>
        <p className="text-[#475569] mt-1">Your service history and reward trends at a glance.</p>
      </div>

      {/* Top-level KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.totalRequests} sub={`${stats.completedRequests} completed`}/>
        <StatCard label="Pending" value={stats.pendingRequests}/>
        <StatCard label="Points Balance" value={stats.currentBalance.toLocaleString()} accent/>
        <StatCard label="Lifetime Earned" value={stats.lifetimePoints.toLocaleString()} sub={`${stats.totalPointsRedeemed.toLocaleString()} redeemed`}/>
      </div>

      {/* Monthly points trend */}
      {stats.monthlyPoints.length > 0 && (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#0F172A]">Points Trend: Last 6 Months</h2>
          <div className="space-y-3">
            {stats.monthlyPoints.map((m) => (<div key={m.month} className="grid grid-cols-[80px_1fr_1fr] items-center gap-4">
                <span className="text-sm font-medium text-[#475569]">{m.month}</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#15803D]">
                    <span>Earned</span>
                    <span>{m.earned.toLocaleString()}</span>
                  </div>
                  <MiniBar value={m.earned} max={maxMonthly} color="bg-[#22C55E]"/>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-red-500">
                    <span>Redeemed</span>
                    <span>{m.redeemed.toLocaleString()}</span>
                  </div>
                  <MiniBar value={m.redeemed} max={maxMonthly} color="bg-red-400"/>
                </div>
              </div>))}
          </div>
          <div className="flex gap-6 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22C55E]"/>
              <span className="text-xs text-[#475569]">Points earned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"/>
              <span className="text-xs text-[#475569]">Points redeemed</span>
            </div>
          </div>
        </div>)}

      {/* Two-column lower section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Requests by status */}
        {Object.keys(stats.requestsByStatus).length > 0 && (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">Requests by Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.requestsByStatus).map(([status, count]) => (<div key={status} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[status] ?? 'bg-slate-100 text-[#94A3B8]'}`}>
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <MiniBar value={count} max={stats.totalRequests} color="bg-[#2563EB]"/>
                    <span className="text-sm font-bold text-[#0F172A] w-6 text-right">{count}</span>
                  </div>
                </div>))}
            </div>
          </div>)}

        {/* Requests by category */}
        {Object.keys(stats.requestsByCategory).length > 0 && (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">Requests by Category</h2>
            <div className="space-y-3">
              {Object.entries(stats.requestsByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (<div key={cat} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#0F172A] truncate">{cat}</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <MiniBar value={count} max={maxCategory} color="bg-[#2563EB]"/>
                      <span className="text-sm font-bold text-[#0F172A] w-6 text-right">{count}</span>
                    </div>
                  </div>))}
            </div>
          </div>)}
      </div>

      {/* Empty state */}
      {stats.totalRequests === 0 && (<div className="bg-white rounded-[20px] border border-[#E2E8F0] p-12 text-center space-y-3 shadow-sm">
          <span className="text-5xl">📊</span>
          <p className="text-lg font-semibold text-[#0F172A]">No data yet</p>
          <p className="text-sm text-[#94A3B8]">
            Submit your first service request to start tracking your activity and rewards.
          </p>
        </div>)}
    </div>);
}
//# sourceMappingURL=AnalyticsPage.jsx.map