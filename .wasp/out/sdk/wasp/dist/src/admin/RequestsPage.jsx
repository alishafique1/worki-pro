import React, { useState } from 'react';
import { useQuery, useAction, getAdminRequests, getAdminProviders, assignRequestToProvider } from 'wasp/client/operations';
const STATUS_FILTERS = ['All', 'NEW', 'ASSIGNED', 'COMPLETED', 'CLOSED'];
const URGENCY_STYLES = {
    EMERGENCY: 'bg-red-600 text-white',
    STANDARD: 'bg-[#EFF6FF] text-[#2563EB]',
    PLANNED: 'bg-[#F8FAFC] text-[#475569]'
};
import { useRoleGuard } from '../shared/useRoleGuard';
export default function AdminRequestsPage() {
    useRoleGuard('ADMIN');
    const { data: requests, isLoading: reqLoading } = useQuery(getAdminRequests);
    const { data: providers } = useQuery(getAdminProviders);
    const assignRequestToProviderFn = useAction(assignRequestToProvider);
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [assigningId, setAssigningId] = useState(null);
    const [selectedProviderId, setSelectedProviderId] = useState({});
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [errorMap, setErrorMap] = useState({});
    const approvedProviders = providers?.filter((p) => p.verificationStatus === 'VERIFIED') ?? [];
    const filtered = (requests ?? []).filter((req) => {
        if (statusFilter !== 'All' && req.status !== statusFilter)
            return false;
        if (search) {
            const q = search.toLowerCase();
            const haystack = [req.name, req.postalCode, req.description, req.city].join(' ').toLowerCase();
            if (!haystack.includes(q))
                return false;
        }
        return true;
    });
    const handleAssign = async (requestId) => {
        const providerId = selectedProviderId[requestId];
        if (!providerId)
            return;
        setLoadingIds(prev => new Set(prev).add(requestId));
        setErrorMap(prev => { const next = { ...prev }; delete next[requestId]; return next; });
        try {
            await assignRequestToProviderFn({ requestId, providerId });
            setAssigningId(null);
        }
        catch (e) {
            setErrorMap(prev => ({ ...prev, [requestId]: e?.message ?? 'Failed to assign' }));
        }
        finally {
            setLoadingIds(prev => { const next = new Set(prev); next.delete(requestId); return next; });
        }
    };
    return (<div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">Service Requests (Admin)</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0]">
          {STATUS_FILTERS.map(s => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${statusFilter === s
                ? 'bg-[#2563EB] text-white'
                : 'text-[#475569] hover:text-[#0F172A]'}`}>
              {s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>))}
        </div>
        <input type="text" placeholder="Search by name, postal code, or description…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[220px] px-3 py-1.5 text-sm rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB]"/>
      </div>

      <div className="bg-white p-6 rounded-[14px] border border-[#E2E8F0]">
        {reqLoading ? (<p className="text-[#475569]">Loading...</p>) : (<table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="pb-2 pr-4 text-[#0F172A]">Date</th>
                <th className="pb-2 pr-4 text-[#0F172A]">Customer</th>
                <th className="pb-2 pr-4 text-[#0F172A]">Location</th>
                <th className="pb-2 pr-4 text-[#0F172A]">Urgency</th>
                <th className="pb-2 pr-4 text-[#0F172A]">Status</th>
                <th className="pb-2 text-[#0F172A]">Provider</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (<tr>
                  <td colSpan={6} className="py-8 text-center text-[#475569]">
                    No requests match your filter.
                  </td>
                </tr>)}
              {filtered.map((req) => {
                const isAssigning = assigningId === req.id;
                const isLoading = loadingIds.has(req.id);
                return (<tr key={req.id} className="border-b border-[#E2E8F0] last:border-0 align-top">
                    <td className="py-3 pr-4 text-sm text-[#475569]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-[#0F172A]">{req.name}</td>
                    <td className="py-3 pr-4 text-sm text-[#0F172A]">{req.city || req.postalCode}</td>
                    <td className="py-3 pr-4">
                      {req.urgency ? (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${URGENCY_STYLES[req.urgency] ?? URGENCY_STYLES.STANDARD}`}>
                          {req.urgency}
                        </span>) : <span className="text-[#475569]">-</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'NEW' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                        req.status === 'ASSIGNED' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                            req.status === 'COMPLETED' ? 'bg-green-50 text-[#22C55E]' :
                                'bg-[#F8FAFC] text-[#94A3B8]'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {!isAssigning && req.assignedProvider ? (<div className="flex items-center gap-2">
                          <span className="text-[#22C55E] font-medium text-sm">{req.assignedProvider.businessName}</span>
                          <button onClick={() => setAssigningId(req.id)} className="text-xs text-[#475569] underline hover:text-[#0F172A]">
                            Reassign
                          </button>
                        </div>) : (<div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <select value={selectedProviderId[req.id] ?? ''} onChange={e => setSelectedProviderId(prev => ({ ...prev, [req.id]: e.target.value }))} className="text-sm rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] px-2 py-1 outline-none focus:border-[#2563EB]">
                              <option value="">Unassigned</option>
                              {approvedProviders.map((p) => (<option key={p.id} value={p.id}>{p.businessName}</option>))}
                            </select>
                            <button onClick={() => handleAssign(req.id)} disabled={isLoading || !selectedProviderId[req.id]} className="text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                              {isLoading ? 'Assigning…' : 'Assign'}
                            </button>
                            {isAssigning && (<button onClick={() => setAssigningId(null)} className="text-xs text-[#475569] underline">
                                Cancel
                              </button>)}
                          </div>
                          {errorMap[req.id] && (<p className="text-xs text-red-500">{errorMap[req.id]}</p>)}
                        </div>)}
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>)}
      </div>
    </div>);
}
//# sourceMappingURL=RequestsPage.jsx.map