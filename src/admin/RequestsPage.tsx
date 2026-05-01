import React, { useState } from 'react';
import { useQuery, useAction, getAdminRequests, getAdminProviders, assignRequestToProvider } from 'wasp/client/operations';

const STATUS_FILTERS = ['All', 'NEW', 'ASSIGNED', 'COMPLETED', 'CLOSED'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const URGENCY_STYLES: Record<string, string> = {
  EMERGENCY: 'bg-red-600 text-white',
  STANDARD: 'bg-[var(--surface-overlay)] text-[var(--text-primary)]',
  PLANNED: 'bg-[var(--surface-raised)] text-[var(--text-secondary)]'
};

export default function AdminRequestsPage() {
  const { data: requests, isLoading: reqLoading } = useQuery(getAdminRequests);
  const { data: providers } = useQuery(getAdminProviders);
  const assignRequestToProviderFn = useAction(assignRequestToProvider);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});

  const approvedProviders = providers?.filter((p: any) => p.verificationStatus === 'VERIFIED') ?? [];

  const filtered = (requests ?? []).filter((req: any) => {
    if (statusFilter !== 'All' && req.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = [req.name, req.postalCode, req.description, req.city].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const handleAssign = async (requestId: string) => {
    const providerId = selectedProviderId[requestId];
    if (!providerId) return;
    setLoadingIds(prev => new Set(prev).add(requestId));
    setErrorMap(prev => { const next = { ...prev }; delete next[requestId]; return next; });
    try {
      await assignRequestToProviderFn({ requestId, providerId });
      setAssigningId(null);
    } catch (e: any) {
      setErrorMap(prev => ({ ...prev, [requestId]: e?.message ?? 'Failed to assign' }));
    } finally {
      setLoadingIds(prev => { const next = new Set(prev); next.delete(requestId); return next; });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Service Requests (Admin)</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-[var(--surface-raised)] p-1 rounded-lg border border-[var(--border-default)]">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name, postal code, or description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] px-3 py-1.5 text-sm rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)]">
        {reqLoading ? (
          <p className="text-[var(--text-secondary)]">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Location</th>
                <th className="pb-2 pr-4">Urgency</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Provider</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--text-secondary)]">
                    No requests match your filter.
                  </td>
                </tr>
              )}
              {filtered.map((req: any) => {
                const isAssigning = assigningId === req.id;
                const isLoading = loadingIds.has(req.id);

                return (
                  <tr key={req.id} className="border-b border-[var(--border-default)] last:border-0 align-top">
                    <td className="py-3 pr-4 text-sm text-[var(--text-secondary)]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-semibold">{req.name}</td>
                    <td className="py-3 pr-4 text-sm">{req.city || req.postalCode}</td>
                    <td className="py-3 pr-4">
                      {req.urgency ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${URGENCY_STYLES[req.urgency] ?? URGENCY_STYLES.STANDARD}`}>
                          {req.urgency}
                        </span>
                      ) : <span className="text-[var(--text-secondary)]">—</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 bg-[var(--surface-overlay)] rounded-full text-xs">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {!isAssigning && req.assignedProvider ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-medium text-sm">{req.assignedProvider.businessName}</span>
                          <button
                            onClick={() => setAssigningId(req.id)}
                            className="text-xs text-[var(--text-secondary)] underline hover:text-[var(--text-primary)]"
                          >
                            Reassign
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedProviderId[req.id] ?? ''}
                              onChange={e => setSelectedProviderId(prev => ({ ...prev, [req.id]: e.target.value }))}
                              className="text-sm rounded-md bg-[var(--surface-overlay)] border border-[var(--border-default)] text-[var(--text-primary)] px-2 py-1 outline-none focus:border-[var(--accent)]"
                            >
                              <option value="">— Unassigned —</option>
                              {approvedProviders.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.businessName}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssign(req.id)}
                              disabled={isLoading || !selectedProviderId[req.id]}
                              className="text-xs bg-[var(--accent)] text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? 'Assigning…' : 'Assign'}
                            </button>
                            {isAssigning && (
                              <button
                                onClick={() => setAssigningId(null)}
                                className="text-xs text-[var(--text-secondary)] underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          {errorMap[req.id] && (
                            <p className="text-xs text-red-400">{errorMap[req.id]}</p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
