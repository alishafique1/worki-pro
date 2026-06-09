import React from 'react';
import { Link } from 'react-router';
import { CheckCircle2, DollarSign, MapPin, Target } from 'lucide-react';
import PageSeo from '../landing-page/components/PageSeo';

export default function ProviderLandingPage() {
  return (
    <>
      <PageSeo
        title="Get More Customers: Join The Helper Pro Network | GTA"
        description="Stop chasing cold leads. The Helper delivers high-intent homeowners in Milton, Oakville, Burlington & GTA who are ready to book. No bidding wars, no commission — just verified jobs."
        ogTitle="Get More Customers: Join The Helper Pro Network | GTA"
        ogDescription="Stop chasing cold leads. The Helper delivers verified, booking-ready homeowners in Milton, Oakville & Burlington. No commission, no bidding wars."
        canonicalPath="/providers"
        keywords="home service leads GTA, contractor leads Milton, HVAC leads Oakville, plumber leads Burlington, get more customers trades, home service marketing"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'The Helper Pro Network',
          description: 'Home services marketplace connecting GTA homeowners with vetted local service providers for HVAC, plumbing, electrical, handyman, appliance repair and smart home installation.',
          url: 'https://thehelper.ca/providers',
          areaServed: ['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Toronto'],
          serviceType: ['HVAC Repair', 'Plumbing Services', 'Electrical Services', 'Handyman Services', 'Appliance Repair', 'Smart Home Installation'],
          priceRange: '$$',
        }}
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pb-20">
        {/* Split hero */}
        <section className="bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
                Partner with The Helper
              </div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.95] mb-6 text-[#0F172A]">
                Grow Your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Service Business.</span>
              </h1>
              <p className="text-lg text-[#475569] mb-8 max-w-lg leading-relaxed">
                Get high-intent, qualified leads without the bidding wars. We match you with homeowners in your area who are ready to book.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/providers/apply"
                  className="px-8 py-4 bg-[#2563EB] text-white font-black rounded-2xl text-base hover:bg-[#1D4ED8] transition-all hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                >
                  Apply as a Pro →
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#475569]">
                {['No bidding wars', 'GTA coverage', 'Free to apply'].map(item => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="text-[#22C55E] font-bold">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {/* Right: photo */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 lg:h-96">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80"
                alt="Professional contractor at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-sm font-bold text-[#0F172A]">Join 50+ verified GTA pros</p>
                <p className="text-xs text-[#475569] mt-0.5">Get matched with homeowners ready to book today</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { title: 'Qualified Leads', desc: 'Every request is vetted by our team. No more chasing cold leads or dead-ends.', icon: <Target className="size-7" /> },
              { title: 'Local Focus', desc: 'Target specific areas in the GTA including Milton, Oakville, and Burlington.', icon: <MapPin className="size-7" /> },
              { title: 'Transparent Fees', desc: 'Pay $45 per booked job, or $199/mo for priority routing. No annual contract, no dual fees.', icon: <DollarSign className="size-7" /> }
            ].map((feature) => (
              <div key={feature.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors text-left shadow-sm">
                <div className="text-[#2563EB] mb-6">{feature.icon}</div>
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
