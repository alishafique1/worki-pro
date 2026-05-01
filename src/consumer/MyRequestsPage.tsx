import React from 'react';
import { Link } from 'wasp/client/router';
import { useQuery, getMyRequests } from 'wasp/client/operations';

const statusColor = (s: string) => {
  if (['COMPLETED', 'REWARD_APPROVED'].includes(s)) return 'bg-[#567a58] text-white';
  if (['NEW', 'QUALIFYING', 'QUALIFIED'].includes(s)) return 'bg-[var(--surface-overlay)] text-[var(--accent)]';
  if (['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'BOOKED'].includes(s)) return 'bg-blue-900/50 text-blue-300';
  if (['LOST', 'INVALID', 'SPAM', 'CLOSED'].includes(s)) return 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]';
  return 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]';
};

const urgencyStyle = (u: string) => {
  if (u === 'EMERGENCY') return 'bg-red-900/40 text-red-300';
  if (u === 'PLANNED') return 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]';
  return 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]';
};

const formatStatus = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function MyRequestsPage() {
  const { data: requests, isLoading } = useQuery(getMyRequests);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      {isLoading && (
        <p className="text-[var(--text-secondary)] text-sm">Loading your requests…</p>
      )}

      {!isLoading && !requests?.length && (
        <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-12 flex flex-col items-center text-center space-y-3">
          <span className="text-5xl">🛠️</span>
          <p className="text-lg font-semibold">No service requests yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">Ready to get something fixed? Submit your first request.</p>
          <Link
            to="/request-service"
            className="mt-2 px-6 py-2.5 bg-[var(--accent)] text-black rounded-[22px] font-bold text-sm"
          >
            Request a Service
          </Link>
        </div>
      )}

      {!!requests?.length && (
        <div className="space-y-3">
          {requests.map(req => (
            <div
              key={req.id}
              className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-5 space-y-3"
            >
              <p className="text-sm font-medium leading-snug line-clamp-2 text-[var(--text-primary)]">
                {req.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusColor(req.status)}`}>
                  {formatStatus(req.status)}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${urgencyStyle(req.urgency)}`}>
                  {req.urgency.charAt(0) + req.urgency.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                {(req.city || req.postalCode) && (
                  <span>· {[req.city, req.postalCode].filter(Boolean).join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

