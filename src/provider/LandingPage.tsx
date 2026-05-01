import React from 'react';
import { Link } from 'react-router';

export default function ProviderLandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="isolate">
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Grow Your <span className="text-[var(--accent)]">Service</span> Business.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Worki delivers high-intent, qualified leads directly to your inbox. 
            No bidding wars. No cold calls. Just booked jobs.
          </p>
          <div className="flex gap-4">
            <Link
              to="/providers/apply"
              className="px-8 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] text-lg hover:opacity-90 transition-opacity"
            >
              Apply to Join
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Qualified Leads</h3>
              <p className="text-[var(--text-secondary)]">Every request is vetted by our team before it reaches you. Save time on non-serious inquiries.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Exclusive Access</h3>
              <p className="text-[var(--text-secondary)]">Depending on your plan, get exclusive access to high-value areas in the GTA.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Simple Billing</h3>
              <p className="text-[var(--text-secondary)]">Pay a transparent monthly fee plus a success fee only when jobs are booked or completed.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
