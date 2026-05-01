import React from 'react';
import { Link } from 'react-router';

export default function HvacLandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="isolate">
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Expert <span className="text-[var(--accent)]">HVAC</span> Services.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            From furnace repairs to AC installations, get matched with vetted HVAC pros in the GTA. 
            Earn points for every service call and redeem them for rewards.
          </p>
          <div className="flex gap-4">
            <Link
              to="/request-service"
              className="px-8 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] text-lg hover:opacity-90 transition-opacity"
            >
              Request HVAC Quote
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
              Earn 500 Reward Points
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Heating</h3>
              <p className="text-[var(--text-secondary)]">Furnace repair, maintenance, and new installations for those cold winters.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Cooling</h3>
              <p className="text-[var(--text-secondary)]">Stay cool with expert AC repair and high-efficiency cooling solutions.</p>
            </div>
            <div className="p-8 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]">
              <h3 className="text-xl font-bold mb-4">Air Quality</h3>
              <p className="text-[var(--text-secondary)]">Humidifiers, air purifiers, and duct cleaning to keep your family healthy.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
