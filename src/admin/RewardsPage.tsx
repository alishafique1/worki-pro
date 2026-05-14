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
      <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Reward Queue</h1>

      <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0]">
        {isLoading ? (
          <p className="text-[#475569]">Loading...</p>
        ) : rewards?.length === 0 ? (
          <div className="py-12 text-center text-[#475569]">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-medium">No pending reward approvals</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="pb-2 text-[#0F172A]">Consumer</th>
                <th className="pb-2 text-[#0F172A]">Type</th>
                <th className="pb-2 text-[#0F172A]">Points</th>
                <th className="pb-2 text-[#0F172A]">Reason</th>
                <th className="pb-2 text-[#0F172A]">Status</th>
                <th className="pb-2 text-[#0F172A]">Action</th>
              </tr>
            </thead>
            <tbody>
              {rewards?.map((reward: any) => (
                <tr key={reward.id} className="border-b border-[#E2E8F0] last:border-0">
                  <td className="py-3 font-semibold text-[#0F172A]">
                    {reward.consumer?.email ?? reward.consumer?.username ?? 'Unknown'}
                  </td>
                  <td className="py-3 text-[#0F172A]">{reward.type}</td>
                  <td className="py-3 font-bold text-[#2563EB]">{reward.points}</td>
                  <td className="py-3 text-[#475569]">{reward.reason || '—'}</td>
                  <td className="py-3 text-[#0F172A]">{reward.status}</td>
                  <td className="py-3 space-y-1">
                    {approvedIds.has(reward.id) ? (
                      <span className="text-xs text-[#22C55E] font-medium">✓ Approved</span>
                    ) : rejectedIds.has(reward.id) ? (
                      <span className="text-xs text-red-600 font-medium">✗ Rejected</span>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(reward.id)}
                            disabled={loadingIds.has(reward.id)}
                            className="text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loadingIds.has(reward.id) ? '…' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(reward.id)}
                            disabled={loadingIds.has(reward.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                        {errorMap[reward.id] && (
                          <p className="text-xs text-red-600">{errorMap[reward.id]}</p>
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
