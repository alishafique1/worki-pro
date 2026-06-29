import React, { useState, useMemo } from 'react';
import { useQuery, approveProvider, rejectProvider, getAdminProviders } from 'wasp/client/operations';
import { Phone, Mail, MapPin, CheckCircle2, XCircle, Clock, ShieldCheck, AlertTriangle, Users, Loader2, Inbox, X, } from 'lucide-react';
import { SERVICE_ZONES } from '../shared/geoConfig';
import { useRoleGuard } from '../shared/useRoleGuard';
const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'REJECTED', label: 'Rejected' },
];
// Deterministic accent colour for avatars based on business name
const AVATAR_PALETTE = [
    { bg: '#EFF6FF', fg: '#2563EB' },
    { bg: '#FEF3C7', fg: '#B45309' },
    { bg: '#DCFCE7', fg: '#15803D' },
    { bg: '#F1F5F9', fg: '#0F172A' },
];
function avatarColors(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++)
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}
function parseServices(provider) {
    try {
        const arr = JSON.parse(provider.servicesJson ?? '[]');
        if (Array.isArray(arr)) {
            return arr
                .map((s) => (typeof s === 'string' ? s : s?.name ?? s?.label))
                .filter(Boolean);
        }
    }
    catch {
        /* ignore malformed json */
    }
    return [];
}
export default function AdminProvidersPage() {
    useRoleGuard('ADMIN');
    const { data: providers, isLoading, refetch } = useQuery(getAdminProviders);
    const [filter, setFilter] = useState('ALL');
    const [busyId, setBusyId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionError, setActionError] = useState(null);
    const counts = useMemo(() => {
        const list = providers ?? [];
        return {
            ALL: list.length,
            PENDING: list.filter((p) => p.verificationStatus === 'PENDING').length,
            VERIFIED: list.filter((p) => p.verificationStatus === 'VERIFIED').length,
            REJECTED: list.filter((p) => p.verificationStatus === 'REJECTED').length,
        };
    }, [providers]);
    const visible = useMemo(() => {
        const list = providers ?? [];
        if (filter === 'ALL')
            return list;
        return list.filter((p) => p.verificationStatus === filter);
    }, [providers, filter]);
    const handleApprove = async (id) => {
        setActionError(null);
        setBusyId(id);
        try {
            await approveProvider({ providerId: id });
            await refetch();
        }
        catch (e) {
            setActionError(e.message || 'Failed to approve provider');
        }
        finally {
            setBusyId(null);
        }
    };
    const handleReject = async (id) => {
        setActionError(null);
        setBusyId(id);
        try {
            await rejectProvider({ providerId: id, reason: rejectReason || undefined });
            setRejectingId(null);
            setRejectReason('');
            await refetch();
        }
        catch (e) {
            setActionError(e.message || 'Failed to reject provider');
        }
        finally {
            setBusyId(null);
        }
    };
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* ---- Header ---- */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-[#0F172A]" style={{ fontFamily: 'Fraunces, serif' }}>
                Providers
              </h1>
              <span className="inline-flex items-center rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-sm font-bold text-[#475569]">
                {counts.ALL}
              </span>
            </div>
            <p className="mt-2 text-[#475569]">Approve, reject, and manage service provider applications.</p>
          </div>

          {counts.PENDING > 0 && (<span className="inline-flex items-center gap-2 rounded-[14px] bg-[#FEF3C7] px-4 py-2.5 text-sm font-bold text-[#B45309] border border-[#F59E0B]/30">
              <Clock className="h-4 w-4"/>
              {counts.PENDING} pending review
            </span>)}
        </header>

        {/* ---- Action error ---- */}
        {actionError && (<div className="flex items-center justify-between rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0"/>
              {actionError}
            </span>
            <button onClick={() => setActionError(null)} className="rounded-lg p-1 hover:bg-red-100">
              <X className="h-4 w-4"/>
            </button>
          </div>)}

        {/* ---- Service zone status ---- */}
        <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#2563EB]"/>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Service Zone Status</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_ZONES.map((zone) => (<span key={zone.name} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${zone.active
                ? 'border-[#22C55E]/30 bg-[#DCFCE7] text-[#15803D]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${zone.active ? 'bg-[#22C55E]' : 'bg-[#CBD5E1]'}`}/>
                {zone.name}
                <span className="text-xs opacity-70">({zone.prefixes.length})</span>
              </span>))}
          </div>
          <p className="mt-3 text-xs text-[#94A3B8]">
            Edit <code className="rounded bg-[#F8FAFC] px-1 py-0.5 text-[#475569]">src/shared/geoConfig.ts</code> to add or enable zones.
          </p>
        </section>

        {/* ---- Filter pills ---- */}
        <div className="sticky top-0 z-10 -mx-6 bg-[#F8FAFC]/90 px-6 py-2 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (<button key={key} onClick={() => setFilter(key)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${active
                    ? 'bg-[#2563EB] text-white'
                    : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/40 hover:text-[#2563EB]'}`}>
                  {label}
                  <span className={`inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 text-xs font-bold ${active ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                    {counts[key]}
                  </span>
                </button>);
        })}
          </div>
        </div>

        {/* ---- Loading skeletons ---- */}
        {isLoading && (<div className="grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (<div key={i} className="animate-pulse rounded-[24px] border border-[#E2E8F0] bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#F1F5F9]"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-[#F1F5F9]"/>
                    <div className="h-3 w-1/3 rounded bg-[#F1F5F9]"/>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded bg-[#F1F5F9]"/>
                  <div className="h-3 w-4/5 rounded bg-[#F1F5F9]"/>
                </div>
                <div className="mt-5 flex gap-2">
                  <div className="h-9 w-24 rounded-[14px] bg-[#F1F5F9]"/>
                  <div className="h-9 w-24 rounded-[14px] bg-[#F1F5F9]"/>
                </div>
              </div>))}
          </div>)}

        {/* ---- Provider grid ---- */}
        {!isLoading && visible.length > 0 && (<div className="grid gap-5 md:grid-cols-2">
            {visible.map((prov) => (<ProviderCard key={prov.id} provider={prov} busy={busyId === prov.id} rejecting={rejectingId === prov.id} rejectReason={rejectReason} onApprove={() => handleApprove(prov.id)} onStartReject={() => {
                    setRejectingId(prov.id);
                    setRejectReason('');
                }} onCancelReject={() => {
                    setRejectingId(null);
                    setRejectReason('');
                }} onChangeReason={setRejectReason} onConfirmReject={() => handleReject(prov.id)}/>))}
          </div>)}

        {/* ---- Empty state ---- */}
        {!isLoading && visible.length === 0 && (<div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E2E8F0] bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF]">
              {filter === 'PENDING' ? (<Inbox className="h-7 w-7 text-[#2563EB]"/>) : (<Users className="h-7 w-7 text-[#2563EB]"/>)}
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: 'Fraunces, serif' }}>
              {filter === 'ALL' ? 'No providers yet' : `No ${filter.toLowerCase()} providers`}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[#475569]">
              {filter === 'PENDING'
                ? 'You are all caught up — no applications waiting for review.'
                : filter === 'ALL'
                    ? 'Provider applications will appear here once pros sign up.'
                    : `There are no ${filter.toLowerCase()} providers to show right now.`}
            </p>
            {filter !== 'ALL' && (<button onClick={() => setFilter('ALL')} className="mt-5 inline-flex items-center rounded-[14px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors">
                View all providers
              </button>)}
          </div>)}
      </div>
    </div>);
}
/* ------------------------------------------------------------------ */
/* Provider card                                                       */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
    if (status === 'VERIFIED') {
        return (<span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-bold text-[#15803D]">
        <CheckCircle2 className="h-3.5 w-3.5"/>
        Verified
      </span>);
    }
    if (status === 'PENDING') {
        return (<span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-bold text-[#B45309]">
        <Clock className="h-3.5 w-3.5"/>
        Pending
      </span>);
    }
    if (status === 'REJECTED') {
        return (<span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
        <XCircle className="h-3.5 w-3.5"/>
        Rejected
      </span>);
    }
    return (<span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-bold text-[#475569]">
      {status}
    </span>);
}
function ProviderCard({ provider, busy, rejecting, rejectReason, onApprove, onStartReject, onCancelReject, onChangeReason, onConfirmReject, }) {
    const isPending = provider.verificationStatus === 'PENDING';
    const isVerified = provider.verificationStatus === 'VERIFIED';
    const colors = avatarColors(provider.businessName || '?');
    const initial = (provider.businessName || '?').trim().charAt(0).toUpperCase();
    const email = provider.email ?? provider.user?.email;
    const services = parseServices(provider);
    const checklist = [
        { label: 'TSSA', done: provider.tssaVerified },
        { label: 'WSIB', done: !!provider.wsibCertExpiry },
        { label: 'Insurance', done: !!(provider.insuranceStatus && provider.insuranceCertExpiry) },
        { label: 'References', done: provider.referencesChecked },
        { label: 'Onboarding', done: provider.onboardingCallDone },
    ];
    const checksDone = checklist.filter((c) => c.done).length;
    return (<div className={`flex flex-col rounded-[24px] border bg-white p-6 transition-shadow hover:shadow-md ${isPending
            ? 'border-l-4 border-l-[#F59E0B] border-t-[#E2E8F0] border-r-[#E2E8F0] border-b-[#E2E8F0] shadow-[0_0_0_3px_rgba(245,158,11,0.06)]'
            : 'border-[#E2E8F0]'}`}>
      {/* Header row */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black" style={{ backgroundColor: colors.bg, color: colors.fg, fontFamily: 'Fraunces, serif' }}>
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-[#0F172A]">{provider.businessName}</h3>
            {isVerified && <ShieldCheck className="h-4 w-4 shrink-0 text-[#22C55E]"/>}
          </div>
          {provider.contactName && (<p className="truncate text-sm text-[#475569]">{provider.contactName}</p>)}
        </div>
        <StatusBadge status={provider.verificationStatus}/>
      </div>

      {/* Contact + meta */}
      <div className="mt-4 space-y-1.5 text-sm text-[#475569]">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-[#94A3B8]"/>
          <span className="truncate">{provider.phone}</span>
        </p>
        {email && (<p className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-[#94A3B8]"/>
            <span className="truncate">{email}</span>
          </p>)}
        {provider.serviceAreas?.length > 0 && (<p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#94A3B8]"/>
            <span>{provider.serviceAreas.join(', ')}</span>
          </p>)}
      </div>

      {/* Categories / services */}
      {services.length > 0 && (<div className="mt-4 flex flex-wrap gap-1.5">
          {services.slice(0, 4).map((s) => (<span key={s} className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold text-[#2563EB]">
              {s}
            </span>))}
          {services.length > 4 && (<span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
              +{services.length - 4}
            </span>)}
        </div>)}

      {/* Verification checklist */}
      <div className="mt-4 rounded-[14px] bg-[#F8FAFC] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-[#475569]">Verification</span>
          <span className="text-xs font-bold text-[#475569]">{checksDone}/5</span>
        </div>
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
          <div className="h-full rounded-full bg-[#22C55E] transition-all" style={{ width: `${(checksDone / 5) * 100}%` }}/>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {checklist.map(({ label, done }) => (<span key={label} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${done ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-white text-[#94A3B8] border border-[#E2E8F0]'}`}>
              {done ? '✓' : '○'} {label}
            </span>))}
        </div>
      </div>

      {/* Applied date + expiries */}
      <div className="mt-3 text-xs text-[#94A3B8]">
        <span>Applied {formatDate(provider.createdAt)}</span>
        {provider.wsibCertExpiry && <span> · WSIB exp {formatDate(provider.wsibCertExpiry)}</span>}
        {provider.insuranceCertExpiry && <span> · Insurance exp {formatDate(provider.insuranceCertExpiry)}</span>}
      </div>

      {/* Actions */}
      <div className="mt-5 border-t border-[#E2E8F0] pt-4">
        {isPending && !rejecting && (<div className="flex gap-2">
            <button onClick={onApprove} disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-[#22C55E] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16A34A] disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}
              Approve
            </button>
            <button onClick={onStartReject} disabled={busy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60">
              <XCircle className="h-4 w-4"/>
              Reject
            </button>
          </div>)}

        {isPending && rejecting && (<div className="rounded-[14px] border border-red-200 bg-red-50 p-3">
            <label className="mb-1 block text-xs font-bold text-red-800">Rejection reason (optional)</label>
            <textarea value={rejectReason} onChange={(e) => onChangeReason(e.target.value)} placeholder="Let the applicant know why their application was rejected..." rows={2} className="mb-2 w-full rounded-[12px] border border-red-200 bg-white p-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-red-400"/>
            <div className="flex gap-2">
              <button onClick={onConfirmReject} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin"/> : null}
                Confirm rejection
              </button>
              <button onClick={onCancelReject} disabled={busy} className="inline-flex items-center justify-center rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold text-[#475569] transition-colors hover:bg-[#F8FAFC] disabled:opacity-60">
                Cancel
              </button>
            </div>
          </div>)}

        {isVerified && (<div className="flex items-center gap-2 text-sm font-bold text-[#15803D]">
            <CheckCircle2 className="h-4 w-4"/>
            Active provider
          </div>)}

        {provider.verificationStatus === 'REJECTED' && (<div className="flex items-center gap-2 text-sm font-semibold text-[#94A3B8]">
            <XCircle className="h-4 w-4"/>
            Application rejected
          </div>)}
      </div>
    </div>);
}
