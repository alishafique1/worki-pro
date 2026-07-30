import React, { useState } from 'react';
import { useQuery, useAction, getAdminRewards, approveRewardTransaction, rejectRewardTransaction } from 'wasp/client/operations';
import { Gift, Check, X, Sparkles, Clock, Loader2 } from 'lucide-react';
import { useRoleGuard } from '../shared/useRoleGuard';
// ---------- helpers ----------
function consumerName(consumer) {
    const first = consumer?.firstName?.trim();
    const last = consumer?.lastName?.trim();
    const full = [first, last].filter(Boolean).join(' ');
    if (full)
        return full;
    return consumer?.email ?? consumer?.username ?? 'Unknown';
}
function initials(consumer) {
    const first = consumer?.firstName?.trim();
    const last = consumer?.lastName?.trim();
    if (first || last) {
        return `${(first?.[0] ?? '').toUpperCase()}${(last?.[0] ?? '').toUpperCase()}` || '?';
    }
    const fallback = consumer?.email ?? consumer?.username ?? '?';
    return fallback.slice(0, 2).toUpperCase();
}
function requestLabel(reward) {
    const sr = reward?.serviceRequest;
    if (sr?.description) {
        const desc = sr.description.trim();
        return desc.length > 48 ? `${desc.slice(0, 48)}…` : desc;
    }
    if (sr?.name)
        return sr.name;
    return reward?.reason || '—';
}
function formatType(type) {
    if (!type)
        return '—';
    return type
        .split('_')
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(' ');
}
function formatDate(value) {
    if (!value)
        return '—';
    try {
        return new Date(value).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }
    catch {
        return '—';
    }
}
// ---------- skeleton ----------
function RowSkeleton() {
    return (<tr className="border-b border-[#E2E8F0] last:border-0">
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#E2E8F0] animate-pulse"/>
          <div className="h-3.5 w-32 rounded bg-[#E2E8F0] animate-pulse"/>
        </div>
      </td>
      <td className="py-4 px-4"><div className="h-3.5 w-40 rounded bg-[#E2E8F0] animate-pulse"/></td>
      <td className="py-4 px-4"><div className="h-3.5 w-12 rounded bg-[#E2E8F0] animate-pulse"/></td>
      <td className="py-4 px-4"><div className="h-3.5 w-24 rounded bg-[#E2E8F0] animate-pulse"/></td>
      <td className="py-4 px-4"><div className="h-3.5 w-20 rounded bg-[#E2E8F0] animate-pulse"/></td>
      <td className="py-4 pr-6 pl-4">
        <div className="flex gap-2 justify-end">
          <div className="h-8 w-20 rounded-[12px] bg-[#E2E8F0] animate-pulse"/>
          <div className="h-8 w-20 rounded-[12px] bg-[#E2E8F0] animate-pulse"/>
        </div>
      </td>
    </tr>);
}
export default function AdminRewardsPage() {
    useRoleGuard('ADMIN');
    const { data: rewards, isLoading } = useQuery(getAdminRewards);
    const approveRewardTransactionFn = useAction(approveRewardTransaction);
    const rejectRewardTransactionFn = useAction(rejectRewardTransaction);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [actioningIds, setActioningIds] = useState({});
    const [approvedIds, setApprovedIds] = useState(new Set());
    const [rejectedIds, setRejectedIds] = useState(new Set());
    const [errorMap, setErrorMap] = useState({});
    const handleApprove = async (transactionId) => {
        setLoadingIds((prev) => new Set(prev).add(transactionId));
        setActioningIds((prev) => ({ ...prev, [transactionId]: 'approve' }));
        setErrorMap((prev) => { const next = { ...prev }; delete next[transactionId]; return next; });
        try {
            await approveRewardTransactionFn({ transactionId });
            setApprovedIds((prev) => new Set(prev).add(transactionId));
        }
        catch (e) {
            setErrorMap((prev) => ({ ...prev, [transactionId]: e?.message ?? 'Failed to approve' }));
        }
        finally {
            setLoadingIds((prev) => { const next = new Set(prev); next.delete(transactionId); return next; });
            setActioningIds((prev) => { const next = { ...prev }; delete next[transactionId]; return next; });
        }
    };
    const handleReject = async (transactionId) => {
        setLoadingIds((prev) => new Set(prev).add(transactionId));
        setActioningIds((prev) => ({ ...prev, [transactionId]: 'reject' }));
        setErrorMap((prev) => { const next = { ...prev }; delete next[transactionId]; return next; });
        try {
            await rejectRewardTransactionFn({ transactionId });
            setRejectedIds((prev) => new Set(prev).add(transactionId));
        }
        catch (e) {
            setErrorMap((prev) => ({ ...prev, [transactionId]: e?.message ?? 'Failed to reject' }));
        }
        finally {
            setLoadingIds((prev) => { const next = new Set(prev); next.delete(transactionId); return next; });
            setActioningIds((prev) => { const next = { ...prev }; delete next[transactionId]; return next; });
        }
    };
    const rewardList = rewards ?? [];
    // Rewards still awaiting a decision (not yet resolved in this session)
    const unresolved = rewardList.filter((r) => !approvedIds.has(r.id) && !rejectedIds.has(r.id));
    const pendingCount = unresolved.length;
    const pendingPoints = unresolved.reduce((sum, r) => sum + (typeof r.points === 'number' ? r.points : 0), 0);
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* ---------- Header ---------- */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#FEF3C7]">
              <Gift className="h-6 w-6 text-[#F59E0B]"/>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]" style={{ fontFamily: 'Fraunces, serif' }}>
                Reward Approvals
              </h1>
              <p className="mt-1 text-sm text-[#475569]">
                Review and approve consumer reward points before they hit wallets.
              </p>
            </div>
          </div>

          {!isLoading && (<span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-4 py-2 text-sm font-bold text-[#B45309]">
              <Clock className="h-4 w-4"/>
              {pendingCount} pending
            </span>)}
        </div>

        {/* ---------- Summary strip ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Hero gradient stat */}
          <div className="rounded-[20px] p-6 text-white" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
              <Sparkles className="h-4 w-4"/>
              Points awaiting approval
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black leading-none">
                {isLoading ? '—' : pendingPoints.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-blue-100">pts</span>
            </div>
            <p className="mt-2 text-xs text-blue-100">
              Across {isLoading ? '—' : pendingCount} pending {pendingCount === 1 ? 'reward' : 'rewards'}
            </p>
          </div>

          {/* Pending count */}
          <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#475569]">
              Pending rewards
            </div>
            <div className="mt-3 text-4xl font-black leading-none text-[#0F172A]">
              {isLoading ? '—' : pendingCount}
            </div>
            <p className="mt-2 text-xs text-[#475569]">In the approval queue right now</p>
          </div>

          {/* Avg payout */}
          <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#475569]">
              Avg payout
            </div>
            <div className="mt-3 text-4xl font-black leading-none text-[#0F172A]">
              {isLoading || pendingCount === 0
            ? '—'
            : Math.round(pendingPoints / pendingCount).toLocaleString()}
            </div>
            <p className="mt-2 text-xs text-[#475569]">Points per reward, on average</p>
          </div>
        </div>

        {/* ---------- Table ---------- */}
        <div className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white">
          {isLoading ? (<table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="py-3 pl-6 pr-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Consumer</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Request</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Points</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Type</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Created</th>
                  <th className="py-3 pr-6 pl-4 text-right text-xs font-semibold uppercase tracking-wide text-[#475569]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i}/>)}
              </tbody>
            </table>) : rewardList.length === 0 ? (
        // ---------- Empty state ----------
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
                <Gift className="h-8 w-8 text-[#F59E0B]"/>
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0F172A]">All caught up!</h3>
              <p className="mt-1.5 max-w-sm text-sm text-[#475569]">
                There are no reward approvals waiting in the queue. New consumer rewards will
                appear here as soon as they need a decision.
              </p>
            </div>) : (<table className="w-full text-left">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="py-3 pl-6 pr-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Consumer</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Request</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Points</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Type</th>
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-[#475569]">Created</th>
                  <th className="py-3 pr-6 pl-4 text-right text-xs font-semibold uppercase tracking-wide text-[#475569]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rewardList.map((reward) => {
                const isApproved = approvedIds.has(reward.id);
                const isRejected = rejectedIds.has(reward.id);
                const isResolved = isApproved || isRejected;
                const isRowLoading = loadingIds.has(reward.id);
                const action = actioningIds[reward.id];
                // Amber highlight for unresolved PENDING rows
                const rowBg = isResolved
                    ? 'bg-white'
                    : 'bg-[#FEF3C7]/40 hover:bg-[#FEF3C7]/70';
                return (<tr key={reward.id} className={`border-b border-[#E2E8F0] last:border-0 transition-colors ${rowBg}`}>
                      {/* Consumer */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                            {initials(reward.consumer)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-[#0F172A]">
                              {consumerName(reward.consumer)}
                            </div>
                            {reward.consumer?.email && (<div className="truncate text-xs text-[#475569]">
                                {reward.consumer.email}
                              </div>)}
                          </div>
                        </div>
                      </td>

                      {/* Request */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-[#475569]">{requestLabel(reward)}</span>
                      </td>

                      {/* Points */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-1 text-sm font-bold text-[#2563EB]">
                          +{reward.points}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-[#0F172A]">{formatType(reward.type)}</span>
                      </td>

                      {/* Created */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-[#475569]">{formatDate(reward.createdAt)}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4">
                        {isApproved ? (<div className="flex justify-end">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1.5 text-xs font-bold text-[#15803D]">
                              <Check className="h-3.5 w-3.5"/>
                              Approved
                            </span>
                          </div>) : isRejected ? (<div className="flex justify-end">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                              <X className="h-3.5 w-3.5"/>
                              Rejected
                            </span>
                          </div>) : (<div className="flex flex-col items-end gap-1.5">
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(reward.id)} disabled={isRowLoading} className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#22C55E] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50">
                                {isRowLoading && action === 'approve' ? (<Loader2 className="h-3.5 w-3.5 animate-spin"/>) : (<Check className="h-3.5 w-3.5"/>)}
                                Approve
                              </button>
                              <button onClick={() => handleReject(reward.id)} disabled={isRowLoading} className="inline-flex items-center gap-1.5 rounded-[12px] border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                                {isRowLoading && action === 'reject' ? (<Loader2 className="h-3.5 w-3.5 animate-spin"/>) : (<X className="h-3.5 w-3.5"/>)}
                                Reject
                              </button>
                            </div>
                            {errorMap[reward.id] && (<p className="text-xs font-medium text-red-600">{errorMap[reward.id]}</p>)}
                          </div>)}
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>)}
        </div>
      </div>
    </div>);
}
