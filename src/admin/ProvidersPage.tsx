import React, { useState } from 'react';
import { useQuery, useAction, getAdminProviders, approveProvider, rejectProvider } from 'wasp/client/operations';

export default function AdminProvidersPage() {
  const { data: providers, isLoading, refetch } = useQuery(getAdminProviders);
  const approveFn = useAction(approveProvider);
  const rejectFn = useAction(rejectProvider);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (id: string) => {
    try {
      await approveFn({ providerId: id });
      refetch();
    } catch (e: any) {
      alert('Error: ' + (e.message || 'Failed to approve'));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectFn({ providerId: id, reason: rejectReason || undefined });
      setRejectingId(null);
      setRejectReason('');
      refetch();
    } catch (e: any) {
      alert('Error: ' + (e.message || 'Failed to reject'));
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-700 bg-green-50';
      case 'PENDING': return 'text-yellow-700 bg-yellow-50';
      case 'REJECTED': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Provider Management</h1>
        <p className="text-gray-500 mt-1">Approve, reject, and manage service provider applications.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['PENDING', 'VERIFIED', 'REJECTED'].map(status => {
          const count = providers?.filter((p: any) => p.verificationStatus === status).length ?? 0;
          return (
            <div key={status} className="bg-white rounded-xl border p-4">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-500">{status} Providers</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {isLoading && <p className="text-gray-500">Loading providers...</p>}
        {providers?.map((prov: any) => (
          <div key={prov.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 truncate">{prov.businessName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(prov.verificationStatus)}`}>
                    {prov.verificationStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{prov.phone} {prov.email ? `• ${prov.email}` : ''}</p>
                {prov.serviceAreas?.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">Areas: {prov.serviceAreas.join(', ')}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Applied {new Date(prov.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {prov.verificationStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleApprove(prov.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(prov.id)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {prov.verificationStatus === 'VERIFIED' && (
                  <span className="text-sm text-green-600 font-medium">Active</span>
                )}
              </div>
            </div>

            {rejectingId === prov.id && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-sm font-medium text-red-800 mb-1">Rejection reason (optional)</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Let the applicant know why their application was rejected..."
                  className="w-full border border-red-200 rounded-lg p-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(prov.id)}
                    className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => { setRejectingId(null); setRejectReason(''); }}
                    className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {providers?.length === 0 && (
          <p className="text-gray-400 text-center py-8">No providers found.</p>
        )}
      </div>
    </div>
  );
}
