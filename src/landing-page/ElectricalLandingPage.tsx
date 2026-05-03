import React from 'react';
import { Link } from 'react-router';

export default function ElectricalLandingPage() {
  return (
    <div className="min-h-screen bg-background mesh-gradient dark:mesh-gradient-dark">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-6">
            Expert Electrical in GTA
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl">
            Safe, Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Electrical</span> Work.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
            Licensed electricians for everything from outlet repairs to panel upgrades. We vet every pro and manage the whole process so you don't have to.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/request-service?service=electrical"
              className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-lg hover:shadow-[0_0_30px_rgba(242,181,215,0.4)] transition-all hover:-translate-y-1"
            >
              Request Electrical Quote
            </Link>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-16">🎁 Plus earn cashback on every job booked</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24">
            {[
              { label: 'Licensed Electricians', icon: '⚡' },
              { label: 'ESA Compliant', icon: '🛡️' },
              { label: 'Managed Scheduling', icon: '📅' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { title: 'Repairs & Outlets', desc: 'Outlet replacements, circuit troubleshooting, and panel breaker fixes.', icon: '🔌' },
              { title: 'Lighting', desc: 'Pot light installation, fixture upgrades, and smart lighting setup.', icon: '💡' },
              { title: 'Panel & Upgrades', desc: 'Electrical panel upgrades, EV charger installation, and rewiring.', icon: '🔋' }
            ].map((service) => (
              <div key={service.title} className="p-10 glass dark:glass-dark rounded-[40px] border border-[var(--border-default)] hover-lift text-left">
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-black mb-4">{service.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
