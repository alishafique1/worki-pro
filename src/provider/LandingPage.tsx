import React from 'react';
import { Link } from 'react-router';
import PageSeo from '../landing-page/components/PageSeo';

export default function ProviderLandingPage() {
  return (
    <>
      <PageSeo
        title="Join TheHelper as a Home Service Pro in GTA | Apply Today"
        description="Grow your trades business with qualified, high-intent leads in Milton, Oakville, Burlington & the GTA. No bidding wars — just vetted homeowners ready to book."
        ogTitle="Become a TheHelper Home Service Provider | GTA"
        ogDescription="Partner with TheHelper to get qualified home service leads in Milton, Oakville & Burlington. Licensed HVAC, plumbing, electrical, and handyman pros welcome."
        canonicalPath="/providers"
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Partner with TheHelper
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Grow Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Service Business.</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            Get high-intent, qualified leads without the bidding wars. We match you with homeowners in your area who are ready to book.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link
              to="/providers/apply"
              className="px-12 py-6 bg-[#2563EB] text-white font-black rounded-3xl text-xl hover:bg-[#1D4ED8] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1"
            >
              Apply as a Pro →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { title: 'Qualified Leads', desc: 'Every request is vetted by our team. No more chasing cold leads or dead-ends.', icon: '🎯' },
              { title: 'Local Focus', desc: 'Target specific areas in the GTA including Milton, Oakville, and Burlington.', icon: '📍' },
              { title: 'Transparent Fees', desc: 'Pay $45 per booked job, or $199/mo for priority routing. No annual contract, no dual fees.', icon: '💰' }
            ].map((feature) => (
              <div key={feature.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors text-left shadow-sm">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{feature.title}</h3>
                <p className="text-[#475569] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
