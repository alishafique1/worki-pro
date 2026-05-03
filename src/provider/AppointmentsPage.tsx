import React from 'react';
import { useQuery, useAction, getProviderAppointments, markJobCompleted } from 'wasp/client/operations';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PROPOSED:    { label: 'Proposed',    bg: 'bg-[var(--surface-overlay)]',    text: 'text-[var(--text-secondary)]', dot: 'bg-yellow-400' },
  CONFIRMED:   { label: 'Confirmed',  bg: 'bg-blue-500/10',                 text: 'text-blue-400',                dot: 'bg-blue-400' },
  RESCHEDULED: { label: 'Rescheduled',bg: 'bg-orange-500/10',               text: 'text-orange-400',              dot: 'bg-orange-400' },
  COMPLETED:   { label: 'Completed',  bg: 'bg-green-500/10',                text: 'text-green-400',               dot: 'bg-green-400' },
  CANCELLED:   { label: 'Cancelled',  bg: 'bg-red-500/10',                  text: 'text-red-400',                dot: 'bg-red-400' },
  NO_SHOW:     { label: 'No Show',    bg: 'bg-red-500/10',                  text: 'text-red-400',                dot: 'bg-red-400' },
};

const URGENCY_CONFIG: Record<string, { label: string; badge: string }> = {
  EMERGENCY: { label: 'Emergency', badge: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  STANDARD:  { label: 'Standard',  badge: 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]' },
  PLANNED:   { label: 'Planned',   badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
};

function isToday(date: Date): boolean {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

function formatCountdown(date: Date): string {
  const diff = date.getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `in ${mins}m`;
}

export default function ProviderAppointmentsPage() {
  const { data: appts, isLoading } = useQuery(getProviderAppointments);
  const markCompletedFn = useAction(markJobCompleted);

  const handleComplete = async (id: string) => {
    try {
      await markCompletedFn({ appointmentId: id });
      alert("Job marked as completed!");
    } catch (e: any) {
      alert("Error updating job: " + e.message);
    }
  };

  const upcomingAppts = appts?.filter((a: any) =>
    a.status !== 'COMPLETED' && a.status !== 'CANCELLED'
  ) ?? [];
  const pastAppts = appts?.filter((a: any) =>
    a.status === 'COMPLETED' || a.status === 'CANCELLED'
  ) ?? [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Appointments</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {upcomingAppts.length > 0
              ? `You have ${upcomingAppts.length} upcoming appointment${upcomingAppts.length > 1 ? 's' : ''}`
              : 'No upcoming appointments'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-[var(--text-secondary)]">Live sync</span>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[var(--accent)] rounded-full"></span>
          Upcoming
        </h2>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse h-48 bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border-default)]" />
            ))}
          </div>
        )}

        {!isLoading && upcomingAppts.length === 0 && (
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-12 text-center">
            <div className="w-16 h-16 bg-[var(--surface-overlay)] rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
              📅
            </div>
            <h3 className="text-lg font-bold mb-1">All caught up</h3>
            <p className="text-[var(--text-secondary)] text-sm">No upcoming appointments right now.</p>
          </div>
        )}

        <div className="space-y-4">
          {upcomingAppts.map((appt: any) => {
            const sr = appt.serviceRequest;
            const scheduledAt = appt.scheduledAt ? new Date(appt.scheduledAt) : null;
            const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.PROPOSED;
            const urgencyCfg = sr?.urgency ? URGENCY_CONFIG[sr.urgency] ?? URGENCY_CONFIG.STANDARD : null;
            const isScheduledSoon = scheduledAt && !isPast(scheduledAt) && scheduledAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

            return (
              <div key={appt.id} className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)]/40 transition-colors">

                {/* Card header row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                    {urgencyCfg && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgencyCfg.badge}`}>
                        {urgencyCfg.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {scheduledAt ? (
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isScheduledSoon && !isPast(scheduledAt) ? 'text-[var(--accent)]' : ''}`}>
                          {isToday(scheduledAt) ? 'Today' : scheduledAt.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {scheduledAt.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
                          {' — '}
                          <span className={isScheduledSoon && !isPast(scheduledAt) ? 'text-[var(--accent)] font-bold' : ''}>
                            {formatCountdown(scheduledAt)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text-secondary)] font-medium">No time set</span>
                    )}
                  </div>
                </div>

                {/* Job details */}
                <div className="mb-5">
                  <h3 className="text-xl font-bold mb-1 line-clamp-2">{sr?.description || 'No description'}</h3>
                  {sr?.serviceCategory && (
                    <p className="text-sm text-[var(--text-secondary)]">{sr.serviceCategory.name}</p>
                  )}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 p-4 bg-[var(--surface-base)] rounded-[16px] border border-[var(--border-default)]">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">Homeowner</p>
                    <p className="font-bold text-sm">{sr?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${sr?.phone}`} className="font-bold text-sm text-[var(--accent)] hover:underline">
                      {sr?.phone || 'N/A'}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">Location</p>
                    <p className="font-bold text-sm">{[sr?.city, sr?.postalCode].filter(Boolean).join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">Property</p>
                    <p className="font-bold text-sm">
                      {[sr?.propertyType, sr?.ownOrRent].filter(Boolean).join(' · ') || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {(appt.providerNotes || appt.consumerNotes) && (
                  <div className="mb-5 space-y-2">
                    {appt.consumerNotes && (
                      <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-[12px]">
                        <p className="text-xs font-bold text-blue-400 mb-1">Customer Notes</p>
                        <p className="text-sm">{appt.consumerNotes}</p>
                      </div>
                    )}
                    {appt.providerNotes && (
                      <div className="p-3 bg-[var(--surface-overlay)] rounded-[12px]">
                        <p className="text-xs font-bold text-[var(--text-secondary)] mb-1">Your Notes</p>
                        <p className="text-sm">{appt.providerNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                  <div className="flex gap-3 pt-2 border-t border-[var(--border-default)]">
                    <a
                      href={`tel:${sr?.phone}`}
                      className="flex-1 px-5 py-3 bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-[22px] font-bold text-center hover:border-[var(--accent)] transition-colors"
                    >
                      Call Customer
                    </a>
                    <button
                      onClick={() => handleComplete(appt.id)}
                      className="flex-1 px-5 py-3 bg-[var(--accent)] text-[#000] rounded-[22px] font-bold hover:scale-[1.02] transition-transform"
                    >
                      Mark Completed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Appointments */}
      {pastAppts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full opacity-40"></span>
            Past Appointments
          </h2>
          <div className="space-y-3">
            {pastAppts.map((appt: any) => {
              const sr = appt.serviceRequest;
              const scheduledAt = appt.scheduledAt ? new Date(appt.scheduledAt) : null;
              const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.PROPOSED;
              return (
                <div key={appt.id} className="bg-[var(--surface-raised)] border border-[var(--border-default)]/50 rounded-[16px] p-4 flex justify-between items-center opacity-75">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.label}
                    </span>
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{sr?.description || 'No description'}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {scheduledAt ? scheduledAt.toLocaleDateString('en-CA') : 'No date'} · {sr?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
