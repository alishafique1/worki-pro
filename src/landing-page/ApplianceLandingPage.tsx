import React from 'react';
import { Link } from 'react-router';
import PageSeo from './components/PageSeo';

export default function ApplianceLandingPage() {
  return (
    <>
      <PageSeo
        title="Appliance Repair in Mississauga & GTA | TheHelper"
        description="Same-day appliance repair in Mississauga, Brampton & the GTA. Certified techs for fridges, washers, ovens, and dishwashers — all brands covered. Verified and insured pros."
        ogTitle="Same-Day Appliance Repair in GTA | TheHelper"
        ogDescription="Book certified appliance repair techs in Mississauga, Brampton & the GTA. Fridges, washers, dryers, ovens — all brands, managed end-to-end."
        canonicalPath="/services/appliance-repair"
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Fast Appliance Repair in GTA
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Appliance</span> Repair.
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            Broken fridge? Malfunctioning washer? We match you with certified repair techs and manage the whole process — and earn rewards on every completed job.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/request-service"
              className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
            >
              Book Repair Now
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">Certified appliance techs, all brands covered. You earn points on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24">
            {[
              { label: 'Certified Techs', icon: '📜' },
              { label: 'All Brands Covered', icon: '🏷️' },
              { label: 'Managed End-to-End', icon: '🎯' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { title: 'Kitchen', desc: 'Expert repair for refrigerators, dishwashers, ovens, and stoves.', icon: '🍳' },
              { title: 'Laundry', desc: 'Washer and dryer repair for all major brands and models.', icon: '👕' },
              { title: 'Maintenance', desc: 'Preventative checkups to keep your appliances running efficiently.', icon: '🛡️' }
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
