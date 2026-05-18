import React from 'react';
import { Link } from 'react-router';
import PageSeo from './components/PageSeo';

export default function SmartHomeLandingPage() {
  return (
    <>
      <PageSeo
        title="Smart Home Installation in GTA | TheHelper"
        description="Certified smart home installers in Milton, Oakville & the GTA. Smart locks, cameras, thermostats, and full home automation — matched and managed. Earn 5% cashback."
        ogTitle="Smart Home Installation & Automation in GTA | TheHelper"
        ogDescription="Book certified smart home pros in Milton, Oakville & the GTA. Smart security, home automation, and AV setup — vetted installers, managed end-to-end."
        canonicalPath="/smart-home"
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Smart Home Experts in GTA
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Your Home, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Smarter.</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            From smart locks to full home automation, our vetted techs handle installation and setup. We match, schedule, and follow up — you just enjoy the upgrade and earn rewards on every completed job.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/request-service?service=smart-home"
              className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
            >
              Request Smart Home Quote
            </Link>
          </div>
          <p className="text-sm text-[#475569] mb-16">🎁 Plus earn cashback on every job booked</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24">
            {[
              { label: 'Certified Installers', icon: '📱' },
              { label: 'All Major Brands', icon: '🏷️' },
              { label: 'Managed Setup', icon: '⚙️' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { title: 'Smart Security', desc: 'Smart locks, video doorbells, cameras, and full security system setup.', icon: '🔒' },
              { title: 'Home Automation', desc: 'Smart hubs, voice control integration, and full home automation.', icon: '🎮' },
              { title: 'AV & Connectivity', desc: 'TV mounting, surround sound, structured wiring, and Wi-Fi optimization.', icon: '📡' }
            ].map((service) => (
              <div key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                <p className="text-[#475569] leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
