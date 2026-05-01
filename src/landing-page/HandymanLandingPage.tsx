import React from 'react';
import { Link } from 'react-router';

export default function HandymanLandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="isolate">
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Your Local <span className="text-[var(--accent)]">Handyman</span>.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Tackle your home to-do list with trusted local handymen. 
            Furniture assembly, mounting, painting, and more — rewarded.
          </p>
          <div className="flex gap-4">
            <Link
              to="/request-service"
              className="px-8 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] text-lg hover:opacity-90 transition-opacity"
            >
              Get Help Now
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#567a58] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
              Verified Professionals
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#567a58] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
              Insured & Licensed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#567a58] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
              Earn 250 Reward Points
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Mounting</h3>
              <p className="text-[var(--text-secondary)]">TV mounting, shelf installation, and gallery walls done perfectly.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Repairs</h3>
              <p className="text-[var(--text-secondary)]">Drywall patches, leaky faucets, and squeaky floors fixed fast.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Assembly</h3>
              <p className="text-[var(--text-secondary)]">Professional furniture assembly for IKEA, Wayfair, and more.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
