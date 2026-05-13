import React, { useState } from 'react';
import { useQuery, useAction, getAdminRewards, approveRewardTransaction, rejectRewardTransaction } from 'wasp/client/operations';

import { useRoleGuard } from '../shared/useRoleGuard';

export default function AdminRewardsPage() {
  useRoleGuard('ADMIN');
  const { data: rewards, isLoading } = useQuery(getAdminRewards);
  const approveRewardTransactionFn = useAction(approveRewardTransaction);
  const rejectRewardTransactionFn = useAction(rejectRewardTransaction);

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  const handleApprove = async (transactionId: string) => {
    setLoadingIds(prev => new Set(prev).add(transactionId));
    setErrorMap(prev => { const next = { ...prev }; delete next[transactionId]; return next; });
    try {
      await approveRewardTransactionFn({ transactionId });
      setApprovedIds(prev => new Set(prev).add(transactionId));
    } catch (e: any) {
      setErrorMap(prev => ({ ...prev, [transactionId]: e?.message ?? 'Failed to approve' }));
    } finally {
      setLoadingIds(prev => { const next = new Set(prev); next.delete(transactionId); return next; });
    }
  };

  const handleReject = async (transactionId: string) => {
    setLoadingIds(prev => new Set(prev).add(transactionId));
    setErrorMap(prev => { const next = { ...prev }; delete next[transactionId]; return next; });
    try {
      await rejectRewardTransactionFn({ transactionId });
      setRejectedIds(prev => new Set(prev).add(transactionId));
    } catch (e: any) {
      setErrorMap(prev => ({ ...prev, [transactionId]: e?.message ?? 'Failed to reject' }));
    } finally {
      setLoadingIds(prev => { const next = new Set(prev); next.delete(transactionId); return next; });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Reward Queue</h1>

      <div className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)]">
        {isLoading ? (
          <p className="text-[var(--text-secondary)]">Loading...</p>
        ) : rewards?.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-secondary)]">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-medium">No pending reward approvals</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th className="pb-2">Consumer</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Points</th>
                <th className="pb-2">Reason</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rewards?.map((reward: any) => (
                <tr key={reward.id} className="border-b border-[var(--border-default)] last:border-0">
                  <td className="py-3 font-semibold">
                    {reward.consumer?.email ?? reward.consumer?.username ?? 'Unknown'}
                  </td>
                  <td className="py-3">{reward.type}</td>
                  <td className="py-3 font-bold text-[var(--accent)]">{reward.points}</td>
                  <td className="py-3 text-[var(--text-secondary)]">{reward.reason || '—'}</td>
                  <td className="py-3">{reward.status}</td>
                  <td className="py-3 space-y-1">
                    {approvedIds.has(reward.id) ? (
                      <span className="text-xs text-green-400 font-medium">✓ Approved</span>
                    ) : rejectedIds.has(reward.id) ? (
                      <span className="text-xs text-red-400 font-medium">✗ Rejected</span>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(reward.id)}
                            disabled={loadingIds.has(reward.id)}
                            className="text-xs bg-[#567a58] text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingIds.has(reward.id) ? '…' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(reward.id)}
                            disabled={loadingIds.has(reward.id)}
                            className="text-xs bg-red-600 text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                        {errorMap[reward.id] && (
                          <p className="text-xs text-red-400">{errorMap[reward.id]}</p>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
