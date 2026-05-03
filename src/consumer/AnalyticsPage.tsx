import React from 'react';
import { useQuery, getConsumerStats } from 'wasp/client/operations';

const STATUS_LABELS: Record<string, string> = {
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

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-900/50 text-blue-300',
  QUALIFYING: 'bg-yellow-900/50 text-yellow-300',
  QUALIFIED: 'bg-green-900/50 text-green-300',
  ASSIGNED: 'bg-purple-900/50 text-purple-300',
  ACCEPTED_BY_PROVIDER: 'bg-indigo-900/50 text-indigo-300',
  BOOKED: 'bg-cyan-900/50 text-cyan-300',
  COMPLETED: 'bg-[#567a58] text-white',
  REWARD_APPROVED: 'bg-[#567a58] text-white',
  LOST: 'bg-red-900/50 text-red-300',
  INVALID: 'bg-gray-800 text-gray-400',
  SPAM: 'bg-red-900/50 text-red-300',
  CLOSED: 'bg-gray-800 text-gray-400',
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-default)] p-6 space-y-1">
      <p className="text-sm text-[var(--text-secondary)] font-medium">{label}</p>
      <p className={`text-4xl font-extrabold tracking-tight ${accent ? 'text-[var(--accent)]' : ''}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--text-tertiary)]">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery(getConsumerStats);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div className="h-10 w-64 animate-pulse bg-[var(--surface-raised)] rounded-[12px]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse bg-[var(--surface-raised)] rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <p className="text-[var(--text-secondary)]">No analytics data available yet.</p>
      </div>
    );
  }

  const maxMonthly = Math.max(...stats.monthlyPoints.map((m) => Math.max(m.earned, m.redeemed)), 1);
  const maxCategory = Math.max(...Object.values(stats.requestsByCategory), 1);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Analytics</h1>
        <p className="text-[var(--text-secondary)] mt-1">Your service history and reward trends at a glance.</p>
      </div>

      {/* Top-level KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.totalRequests} sub={`${stats.completedRequests} completed`} />
        <StatCard label="Pending" value={stats.pendingRequests} />
        <StatCard label="Points Balance" value={stats.currentBalance.toLocaleString()} accent />
        <StatCard label="Lifetime Earned" value={stats.lifetimePoints.toLocaleString()} sub={`${stats.totalPointsRedeemed.toLocaleString()} redeemed`} />
      </div>

      {/* Monthly points trend */}
      {stats.monthlyPoints.length > 0 && (
        <div className="bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-default)] p-6 space-y-5">
          <h2 className="text-xl font-bold">Points Trend — Last 6 Months</h2>
          <div className="space-y-3">
            {stats.monthlyPoints.map((m) => (
              <div key={m.month} className="grid grid-cols-[80px_1fr_1fr] items-center gap-4">
                <span className="text-sm font-medium text-[var(--text-secondary)]">{m.month}</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Earned</span>
                    <span>{m.earned.toLocaleString()}</span>
                  </div>
                  <MiniBar value={m.earned} max={maxMonthly} color="bg-green-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-red-400">
                    <span>Redeemed</span>
                    <span>{m.redeemed.toLocaleString()}</span>
                  </div>
                  <MiniBar value={m.redeemed} max={maxMonthly} color="bg-red-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 pt-2 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-[var(--text-secondary)]">Points earned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-[var(--text-secondary)]">Points redeemed</span>
            </div>
          </div>
        </div>
      )}

      {/* Two-column lower section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Requests by status */}
        {Object.keys(stats.requestsByStatus).length > 0 && (
          <div className="bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-default)] p-6 space-y-4">
            <h2 className="text-xl font-bold">Requests by Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.requestsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[status] ?? 'bg-gray-800 text-gray-300'}`}>
                      {STATUS_LABELS[status] ?? status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <MiniBar value={count} max={stats.totalRequests} color="bg-[var(--accent)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)] w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests by category */}
        {Object.keys(stats.requestsByCategory).length > 0 && (
          <div className="bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-default)] p-6 space-y-4">
            <h2 className="text-xl font-bold">Requests by Category</h2>
            <div className="space-y-3">
              {Object.entries(stats.requestsByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">{cat}</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <MiniBar value={count} max={maxCategory} color="bg-[var(--accent)]" />
                      <span className="text-sm font-bold text-[var(--text-primary)] w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {stats.totalRequests === 0 && (
        <div className="bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-default)] p-12 text-center space-y-3">
          <span className="text-5xl">📊</span>
          <p className="text-lg font-semibold">No data yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Submit your first service request to start tracking your activity and rewards.
          </p>
        </div>
      )}
    </div>
  );
}
