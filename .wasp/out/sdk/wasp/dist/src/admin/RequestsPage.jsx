import React, { useState, useMemo } from 'react';
import { useQuery, useAction, getAdminRequests, getAdminProviders, assignRequestToProvider } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
import { statusBadge } from '../client/lib/statusStyles';
import { Inbox, Search, Clock, CheckCircle2, XCircle, Loader2, UserPlus, ChevronDown, MapPin } from 'lucide-react';
// ── Filter pills ────────────────────────────────────────────────
// Maps a UI pill label to the underlying ServiceRequest.status values it covers.
const FILTER_TABS = [
    { label: 'All', statuses: null },
    { label: 'New', statuses: ['NEW', 'SMS_STARTED', 'QUALIFYING', 'QUALIFIED'] },
    { label: 'In Progress', statuses: ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'BOOKED', 'REWARD_PENDING', 'REWARD_APPROVED'] },
    { label: 'Completed', statuses: ['COMPLETED', 'CLOSED'] },
    { label: 'Lost', statuses: ['LOST', 'INVALID', 'SPAM'] },
];
// Buckets used for the summary strip + the New/In Progress/Completed pills.
const NEW_STATUSES = new Set(['NEW', 'SMS_STARTED', 'QUALIFYING', 'QUALIFIED']);
const IN_PROGRESS_STATUSES = new Set(['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'BOOKED', 'REWARD_PENDING', 'REWARD_APPROVED']);
const COMPLETED_STATUSES = new Set(['COMPLETED', 'CLOSED']);
const LOST_STATUSES = new Set(['LOST', 'INVALID', 'SPAM']);
// ── Status badge styling ────────────────────────────────────────
// Delegates to the shared statusBadge() so admin/provider/consumer pills
// all render from one map (see client/lib/statusStyles).
const statusBadgeClass = statusBadge;
const URGENCY_DOT = {
    EMERGENCY: 'bg-[#EF4444]',
    STANDARD: 'bg-[#2563EB]',
    PLANNED: 'bg-[#94A3B8]',
};
// ── Helpers ─────────────────────────────────────────────────────
function initials(name) {
    if (!name)
        return '?';
    return (name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('') || '?');
}
function timeAgo(date) {
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)
        return 'Just now';
    if (mins < 60)
        return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)
        return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30)
        return `${days}d ago`;
    return d.toLocaleDateString();
}
// ── Skeleton row ────────────────────────────────────────────────
function SkeletonRow() {
    return (<tr className="border-b border-[#E2E8F0] last:border-0">
      <td className="py-4 pl-4 pr-3"><div className="h-5 w-20 rounded-full bg-[#F1F5F9] animate-pulse"/></td>
      <td className="py-4 pr-3"><div className="h-4 w-48 rounded bg-[#F1F5F9] animate-pulse"/></td>
      <td className="py-4 pr-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#F1F5F9] animate-pulse"/>
          <div className="h-4 w-24 rounded bg-[#F1F5F9] animate-pulse"/>
        </div>
      </td>
      <td className="py-4 pr-3"><div className="h-4 w-20 rounded bg-[#F1F5F9] animate-pulse"/></td>
      <td className="py-4 pr-3"><div className="h-4 w-16 rounded bg-[#F1F5F9] animate-pulse"/></td>
      <td className="py-4 pr-3"><div className="h-4 w-28 rounded bg-[#F1F5F9] animate-pulse"/></td>
      <td className="py-4 pr-4"><div className="h-8 w-24 rounded-[12px] bg-[#F1F5F9] animate-pulse"/></td>
    </tr>);
}
export default function AdminRequestsPage() {
    useRoleGuard('ADMIN');
    const { data: requests, isLoading: reqLoading } = useQuery(getAdminRequests);
    const { data: providers } = useQuery(getAdminProviders);
    const assignRequestToProviderFn = useAction(assignRequestToProvider);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [assigningId, setAssigningId] = useState(null);
    const [selectedProviderId, setSelectedProviderId] = useState({});
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [errorMap, setErrorMap] = useState({});
    const approvedProviders = providers?.filter((p) => p.verificationStatus === 'VERIFIED') ?? [];
    const allRequests = (requests ?? []);
    // ── Summary counts (over all requests, not the filtered view) ──
    const counts = useMemo(() => {
        let newCount = 0, inProgress = 0, completed = 0, lost = 0;
        for (const r of allRequests) {
            if (NEW_STATUSES.has(r.status))
                newCount++;
            else if (IN_PROGRESS_STATUSES.has(r.status))
                inProgress++;
            else if (COMPLETED_STATUSES.has(r.status))
                completed++;
            else if (LOST_STATUSES.has(r.status))
                lost++;
        }
        return { newCount, inProgress, completed, lost, total: allRequests.length };
    }, [allRequests]);
    const activeTab = FILTER_TABS.find((t) => t.label === filter);
    const filtered = useMemo(() => {
        return allRequests.filter((req) => {
            if (activeTab.statuses && !activeTab.statuses.includes(req.status))
                return false;
            if (search) {
                const q = search.toLowerCase();
                const haystack = [req.name, req.postalCode, req.description, req.city, req.category]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q))
                    return false;
            }
            return true;
        });
    }, [allRequests, activeTab, search]);
    const handleAssign = async (requestId) => {
        const providerId = selectedProviderId[requestId];
        if (!providerId)
            return;
        setLoadingIds((prev) => new Set(prev).add(requestId));
        setErrorMap((prev) => { const next = { ...prev }; delete next[requestId]; return next; });
        try {
            await assignRequestToProviderFn({ requestId, providerId });
            setAssigningId(null);
        }
        catch (e) {
            setErrorMap((prev) => ({ ...prev, [requestId]: e?.message ?? 'Failed to assign' }));
        }
        finally {
            setLoadingIds((prev) => { const next = new Set(prev); next.delete(requestId); return next; });
        }
    };
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* ── Page header ──────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-[#0F172A]" style={{ fontFamily: 'Fraunces, serif' }}>
              Service Requests
            </h1>
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 rounded-full bg-[#2563EB] text-white text-sm font-bold">
              {counts.total}
            </span>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]"/>
            <input type="text" placeholder="Search description, name, city…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-[12px] bg-white border border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"/>
          </div>
        </div>

        {/* ── Summary strip ────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard icon={<Clock className="h-5 w-5"/>} label="New" value={counts.newCount} accent/>
          <SummaryCard icon={<Loader2 className="h-5 w-5"/>} label="In Progress" value={counts.inProgress}/>
          <SummaryCard icon={<CheckCircle2 className="h-5 w-5"/>} label="Completed" value={counts.completed}/>
          <SummaryCard icon={<XCircle className="h-5 w-5"/>} label="Lost" value={counts.lost}/>
        </div>

        {/* ── Filter pills ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-[14px] border border-[#E2E8F0] w-fit">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.label;
            return (<button key={tab.label} onClick={() => setFilter(tab.label)} className={`px-4 py-1.5 rounded-[10px] text-sm font-semibold transition-all ${active
                    ? 'bg-[#2563EB] text-white shadow-[0_8px_24px_rgba(37,99,235,0.25)]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'}`}>
                {tab.label}
              </button>);
        })}
        </div>

        {/* ── Data table ───────────────────────────────────── */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-3 pl-4 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">Status</th>
                  <th className="py-3 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">Description</th>
                  <th className="py-3 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">Consumer</th>
                  <th className="py-3 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">City</th>
                  <th className="py-3 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">Created</th>
                  <th className="py-3 pr-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">Provider</th>
                  <th className="py-3 pr-4 text-xs font-bold uppercase tracking-wide text-[#94A3B8] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reqLoading && (<>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>)}

                {!reqLoading && filtered.length === 0 && (<tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#EFF6FF] text-[#2563EB] mb-4">
                          <Inbox className="h-7 w-7"/>
                        </div>
                        <p className="text-base font-bold text-[#0F172A]">No requests found</p>
                        <p className="text-sm text-[#475569] mt-1 max-w-xs">
                          {search || filter !== 'All'
                ? 'Try clearing your search or switching to the All tab.'
                : 'New service requests will appear here as consumers submit them.'}
                        </p>
                        {(search || filter !== 'All') && (<button onClick={() => { setSearch(''); setFilter('All'); }} className="mt-4 px-4 py-2 rounded-[14px] bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.25)]">
                            Clear filters
                          </button>)}
                      </div>
                    </td>
                  </tr>)}

                {!reqLoading && filtered.map((req) => {
            const isAssigning = assigningId === req.id;
            const isLoading = loadingIds.has(req.id);
            const hasProvider = !!req.assignedProvider;
            return (<tr key={req.id} className="group border-b border-[#E2E8F0] last:border-0 border-l-2 border-l-transparent hover:border-l-[#2563EB] hover:bg-[#F8FAFC] transition-colors align-middle">
                      {/* Status */}
                      <td className="py-4 pl-4 pr-3 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Description (truncated) */}
                      <td className="py-4 pr-3 max-w-[260px]">
                        <div className="flex items-center gap-2">
                          {req.urgency && (<span title={req.urgency} className={`h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT[req.urgency] ?? URGENCY_DOT.STANDARD}`}/>)}
                          <span className="block truncate text-sm font-medium text-[#0F172A]">
                            {req.description || req.category || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Consumer */}
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold">
                            {initials(req.name)}
                          </span>
                          <span className="text-sm font-semibold text-[#0F172A]">{req.name || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-sm text-[#475569]">
                          <MapPin className="h-3.5 w-3.5 text-[#94A3B8]"/>
                          {req.city || req.postalCode || '—'}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="py-4 pr-3 whitespace-nowrap">
                        <span className="text-sm text-[#475569]" title={new Date(req.createdAt).toLocaleString()}>
                          {timeAgo(req.createdAt)}
                        </span>
                      </td>

                      {/* Assigned Provider */}
                      <td className="py-4 pr-3 whitespace-nowrap">
                        {hasProvider && !isAssigning ? (<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D]">
                            <CheckCircle2 className="h-4 w-4"/>
                            {req.assignedProvider.businessName}
                          </span>) : (<span className="text-sm text-[#94A3B8]">Unassigned</span>)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-4">
                        <div className="flex flex-col items-end gap-1.5">
                          {isAssigning ? (<div className="flex items-center gap-2">
                              <div className="relative">
                                <select value={selectedProviderId[req.id] ?? ''} onChange={(e) => setSelectedProviderId((prev) => ({ ...prev, [req.id]: e.target.value }))} className="appearance-none text-sm rounded-[12px] bg-white border border-[#E2E8F0] text-[#0F172A] pl-3 pr-8 py-1.5 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all">
                                  <option value="">Select provider…</option>
                                  {approvedProviders.map((p) => (<option key={p.id} value={p.id}>{p.businessName}</option>))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]"/>
                              </div>
                              <button onClick={() => handleAssign(req.id)} disabled={isLoading || !selectedProviderId[req.id]} className="inline-flex items-center gap-1.5 text-sm bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.25)]">
                                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin"/>}
                                {isLoading ? 'Assigning…' : 'Confirm'}
                              </button>
                              <button onClick={() => setAssigningId(null)} className="text-sm font-medium text-[#475569] hover:text-[#0F172A] px-2 py-1.5">
                                Cancel
                              </button>
                            </div>) : (<button onClick={() => setAssigningId(req.id)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] px-3 py-1.5 rounded-[14px] transition-colors">
                              <UserPlus className="h-4 w-4"/>
                              {hasProvider ? 'Reassign' : 'Assign'}
                            </button>)}
                          {errorMap[req.id] && (<p className="text-xs font-medium text-[#B91C1C]">{errorMap[req.id]}</p>)}
                        </div>
                      </td>
                    </tr>);
        })}
              </tbody>
            </table>
          </div>
        </div>

        {!reqLoading && filtered.length > 0 && (<p className="text-xs text-[#94A3B8] text-center">
            Showing {filtered.length} of {counts.total} requests · 15 min avg assignment time
          </p>)}
      </div>
    </div>);
}
// ── Summary metric card ─────────────────────────────────────────
function SummaryCard({ icon, label, value, accent = false, }) {
    return (<div className={`rounded-[20px] border p-5 ${accent
            ? 'border-transparent bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_12px_32px_rgba(37,99,235,0.25)]'
            : 'border-[#E2E8F0] bg-white'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${accent ? 'text-white/80' : 'text-[#475569]'}`}>{label}</span>
        <span className={accent ? 'text-white/70' : 'text-[#94A3B8]'}>{icon}</span>
      </div>
      <p className={`mt-2 text-4xl font-black tracking-tight ${accent ? 'text-white' : 'text-[#0F172A]'}`} style={{ fontFamily: 'Fraunces, serif' }}>
        {value}
      </p>
    </div>);
}
//# sourceMappingURL=RequestsPage.jsx.map