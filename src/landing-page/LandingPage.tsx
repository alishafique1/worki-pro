import React from 'react';
import { Link } from 'react-router';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="isolate">
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Home Services, <span className="text-[var(--accent)]">Rewarded.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Worki connects you with vetted professionals for all your home needs.
            Earn points for every service and redeem them for gift cards and more.
          </p>
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              to="/provider/dashboard"
              className="px-8 py-3 bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-primary)] font-bold rounded-[22px] text-lg hover:bg-[var(--surface-overlay)] transition-colors"
            >
              I am a Pro
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
