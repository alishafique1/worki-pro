import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, getMyRequests } from 'wasp/client/operations';

// Cal.com embed via their lightweight script loader
declare global {
  interface Window {
    Cal?: any;
  }
}

function CalEmbed({ calLink }: { calLink: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    // Load the cal.com embed script once
    const existing = document.getElementById('cal-embed-script');
    const init = () => {
      if (!window.Cal) return;
      window.Cal('init', { origin: 'https://cal.com' });
      window.Cal('inline', {
        elementOrSelector: containerRef.current,
        calLink,
        layout: 'month_view',
      });
      window.Cal('ui', {
        theme: 'dark',
        styles: { branding: { brandColor: '#a3f589' } },
        hideEventTypeDetails: false,
      });
    };

    if (existing) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.id = 'cal-embed-script';
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    // Inline bootstrap so Cal is ready immediately on load
    script.innerHTML = `
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, [L, namespace, api]);}else p(cal, ar); return;} p(cal, ar); }; })(window, "${script.src}", "init");
    `;
    script.onload = init;
    document.head.appendChild(script);

    return () => {
      // cleanup inline calendar on unmount
    };
  }, [calLink]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[600px] rounded-[24px] overflow-hidden border border-[var(--border-default)]"
    />
  );
}

export default function BookingPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { data: requests, isLoading } = useQuery(getMyRequests);

  const request = requests?.find((r: any) => r.id === requestId);

  // Determine cal.com link: provider's link > TheHelper default
  const providerCalUsername = request?.assignedProvider?.calComUsername;
  const defaultCalLink = import.meta.env.REACT_APP_CALCOM_DEFAULT_LINK || 'worki/consultation';
  const calLink = providerCalUsername
    ? `${providerCalUsername}/worki-service`
    : defaultCalLink;

  const prefill = request
    ? {
        name: request.name,
        email: request.email,
        notes: `Service: ${request.serviceType ?? 'General'} — ${request.description ?? ''}`,
      }
    : undefined;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to={requestId ? `/my-requests` : '/dashboard'}
          className="text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-black tracking-tight mt-3 mb-1">Book Your Appointment</h1>
        <p className="text-[var(--text-secondary)]">
          {providerCalUsername
            ? `Book directly with your matched pro.`
            : `Pick a time and our team will confirm the right pro for your job.`}
        </p>
      </div>

      {isLoading && (
        <div className="text-[var(--text-secondary)] text-sm">Loading your request…</div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {request && (
            <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Your Request</p>
                <p className="font-semibold">{request.serviceType ?? 'General Service'}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1">{request.description}</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold self-start sm:self-center whitespace-nowrap">
                {request.status}
              </span>
            </div>
          )}

          <CalEmbed calLink={calLink} />

          <p className="text-xs text-center text-[var(--text-tertiary)]">
            Powered by{' '}
            <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--text-secondary)]">
              cal.com
            </a>
            {' '}· You'll get a confirmation email with all the details.
          </p>
        </div>
      )}
    </div>
  );
}
