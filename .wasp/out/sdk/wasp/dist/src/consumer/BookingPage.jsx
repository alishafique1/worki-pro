import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, getMyRequests } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
function CalEmbed({ calLink, prefill }) {
    const containerRef = useRef(null);
    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current)
            return;
        loadedRef.current = true;
        const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';
        const mountCal = () => {
            if (!window.Cal) {
                // Cal not loaded yet — retry after a short delay
                setTimeout(mountCal, 100);
                return;
            }
            window.Cal('init', { origin: 'https://cal.com' });
            window.Cal('inline', {
                elementOrSelector: containerRef.current,
                calLink,
                layout: 'month_view',
                ...(prefill ? { prefill } : {}),
            });
            window.Cal('ui', {
                theme: 'light',
                styles: { branding: { brandColor: '#2563EB' } },
                hideEventTypeDetails: false,
            });
        };
        const existing = document.getElementById('cal-embed-script');
        if (existing) {
            mountCal();
            return;
        }
        // Inject the official Cal.com loader bootstrap inline, then load the main script
        const bootstrap = document.createElement('script');
        bootstrap.innerHTML = `
      (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,[L,namespace,api])}else p(cal,ar);return}p(cal,ar)};})(window,"${CAL_SCRIPT_URL}","init");
    `;
        document.head.appendChild(bootstrap);
        const script = document.createElement('script');
        script.id = 'cal-embed-script';
        script.src = CAL_SCRIPT_URL;
        script.async = true;
        script.onload = mountCal;
        document.head.appendChild(script);
    }, [calLink, prefill]);
    return (<div ref={containerRef} className="w-full min-h-[600px] rounded-[24px] overflow-hidden border border-[#E2E8F0] bg-white shadow-sm"/>);
}
export default function BookingPage() {
    useRoleGuard('CONSUMER');
    const { requestId } = useParams();
    const { data: requests, isLoading } = useQuery(getMyRequests);
    const request = requests?.find((r) => r.id === requestId);
    // Determine cal.com link: provider's link > TheHelper default
    const providerCalUsername = request?.assignedProvider?.calComUsername;
    const defaultCalLink = import.meta.env.VITE_CALCOM_DEFAULT_LINK || 'thehelper/consultation';
    const calLink = providerCalUsername
        ? `${providerCalUsername}/thehelper-service`
        : defaultCalLink;
    const serviceName = request?.serviceCategory?.name ?? 'General';
    const prefill = request
        ? {
            name: request.name,
            email: request.email,
            notes: `Service: ${serviceName}. ${request.description ?? ''}`,
        }
        : undefined;
    return (<div className="min-h-screen bg-[#F8FAFC] p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to={requestId ? `/my-requests` : '/dashboard'} className="text-sm text-[#475569] hover:text-[#0F172A] transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-black tracking-tight mt-3 mb-1 text-[#0F172A]">Book Your Appointment</h1>
        <p className="text-[#475569]">
          {providerCalUsername
            ? `Book directly with your matched pro.`
            : `Pick a time and our team will confirm the right pro for your job.`}
        </p>
      </div>

      {isLoading && (<div className="text-[#94A3B8] text-sm">Loading your request…</div>)}

      {!isLoading && (<div className="space-y-6">
          {request && (<div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
              <div className="flex-1">
                <p className="text-xs text-[#94A3B8] uppercase tracking-wide mb-1">Your Request</p>
                <p className="font-semibold text-[#0F172A]">{request.serviceCategory?.name ?? 'General Service'}</p>
                <p className="text-sm text-[#475569] mt-0.5 line-clamp-1">{request.description}</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold self-start sm:self-center whitespace-nowrap">
                {request.status}
              </span>
            </div>)}

          <CalEmbed calLink={calLink} prefill={prefill}/>

          <p className="text-xs text-center text-[#94A3B8]">
            Powered by{' '}
            <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#475569]">
              cal.com
            </a>
            {' '}· You'll get a confirmation email with all the details.
          </p>
        </div>)}
    </div>);
}
//# sourceMappingURL=BookingPage.jsx.map