import React, { useState } from 'react';
import { Link } from 'react-router';
import { BadgeCheck, ChevronDown, ChevronUp, ScrollText, ShieldCheck, Utensils, WashingMachine, Zap } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';
import LandingHeroBanner from './components/LandingHeroBanner';
const applianceFaqs = [
    {
        question: 'How much does appliance repair cost in Mississauga?',
        answer: 'Appliance repair costs in Mississauga typically range from $100-$400 depending on the appliance and issue. Refrigerator repair averages $200-$400, washer repair $150-$350, and dishwasher repair $150-$300. The Helper connects you with certified techs who provide upfront quotes before any work begins.',
    },
    {
        question: 'Do you repair all appliance brands?',
        answer: 'Yes, our network of certified technicians services all major brands including Samsung, LG, Whirlpool, GE, Maytag, Bosch, KitchenAid, Frigidaire, and more. Whether your appliance is under warranty or out of warranty, we can help.',
    },
    {
        question: 'Is same-day appliance repair available?',
        answer: 'Yes, same-day appliance repair is often available in Mississauga, Brampton, Oakville, and Burlington. For urgent issues like a non-working refrigerator, submit your request and mark it as urgent to prioritize dispatch.',
    },
    {
        question: 'Should I repair or replace my appliance?',
        answer: 'As a general rule, if repair costs exceed 50% of a new appliance price and the unit is over 8 years old, replacement may be more cost-effective. Our technicians provide honest assessments and can advise on the best option for your situation.',
    },
];
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (<div className="border-b border-[#E2E8F0] last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-4 text-left" aria-expanded={open}>
        <span className="text-sm font-semibold text-[#0F172A]">{question}</span>
        {open ? (<ChevronUp className="size-4 shrink-0 text-[#2563EB]" aria-hidden="true"/>) : (<ChevronDown className="size-4 shrink-0 text-[#475569]" aria-hidden="true"/>)}
      </button>
      {open && (<p className="pb-4 text-sm leading-6 text-[#475569]">{answer}</p>)}
    </div>);
}
export default function ApplianceLandingPage() {
    return (<>
      <PageSeo title="Appliance Repair in Mississauga, Brampton & GTA | The Helper" description="Same-day appliance repair in Mississauga, Brampton, Oakville & Burlington. Certified techs for fridges, washers, dryers, ovens, and dishwashers. All brands serviced. Get matched with verified pros." ogTitle="Same-Day Appliance Repair in Mississauga & GTA | The Helper" ogDescription="Book certified appliance repair techs in Mississauga, Brampton & the GTA. Fridges, washers, dryers, ovens - all brands, upfront pricing." canonicalPath="/appliance-repair" keywords="appliance repair Mississauga, fridge repair Brampton, washer repair Oakville, dryer repair Burlington, dishwasher repair GTA, appliance technician near me" structuredData={{
            '@context': 'https://schema.org',
            '@graph': [
                createServiceSchema({
                    name: 'Appliance Repair Services',
                    description: 'Professional appliance repair services for refrigerators, washers, dryers, ovens, and dishwashers in Mississauga, Brampton, Oakville, and Burlington.',
                    areaServed: ['Mississauga', 'Brampton', 'Oakville', 'Burlington'],
                    url: 'https://thehelper.ca/appliance-repair',
                }),
                createFaqSchema(applianceFaqs),
            ],
        }}/>
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeroBanner src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1600&q=80" alt="Appliance repair technician fixing a washer"/>
      <main className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Certified Appliance Repair in Mississauga, Brampton & GTA
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Fast <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Appliance</span> Repair
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            Broken fridge? Malfunctioning washer? We match you with certified appliance repair technicians in Mississauga, Brampton, Oakville, and Burlington. Same-day service available for urgent repairs.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/get-quotes?service=appliance-repair" className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1 shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
              Book Appliance Repair
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">Certified technicians. All brands serviced. Earn rewards on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
            { label: 'Certified Techs', icon: <ScrollText className="size-6"/>, alt: 'Certified appliance technicians' },
            { label: 'All Brands', icon: <BadgeCheck className="size-6"/>, alt: 'All major brands serviced' },
            { label: 'Same-Day Service', icon: <Zap className="size-6"/>, alt: 'Same-day repair available' }
        ].map((stat) => (<div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-[#2563EB]" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="appliance-services-heading">
            <h2 id="appliance-services-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Appliances We Repair</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
            { title: 'Kitchen Appliances', desc: 'Refrigerator repair, freezer repair, dishwasher repair, oven and stove repair, microwave repair, and range hood service.', icon: <Utensils className="size-7"/> },
            { title: 'Laundry Appliances', desc: 'Washer repair, dryer repair, stackable unit service, and front-load/top-load machine diagnostics for all major brands.', icon: <WashingMachine className="size-7"/> },
            { title: 'Maintenance', desc: 'Preventative maintenance checkups, appliance cleaning, refrigerator coil cleaning, and dryer vent cleaning to extend appliance life.', icon: <ShieldCheck className="size-7"/> }
        ].map((service) => (<article key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                  <div className="text-[#2563EB] mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{service.desc}</p>
                </article>))}
            </div>
          </section>

          {/* Brands We Service */}
          <section className="w-full mb-24" aria-labelledby="brands-heading">
            <h2 id="brands-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Brands We Service</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Samsung', 'LG', 'Whirlpool', 'GE', 'Maytag', 'Bosch', 'KitchenAid', 'Frigidaire', 'Kenmore', 'Miele'].map((brand) => (<span key={brand} className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold">
                  {brand}
                </span>))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Appliance Repair Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Mississauga', 'Brampton', 'Oakville', 'Burlington', 'Milton', 'Hamilton'].map((area) => (<Link key={area} to={`/areas/${area.toLowerCase()}`} className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                  Appliance Repair in {area}
                </Link>))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
              {applianceFaqs.map((faq) => (<FaqItem key={faq.question} question={faq.question} answer={faq.answer}/>))}
            </div>
          </section>
        </div>
      </main>
    </div>
    </>);
}
//# sourceMappingURL=ApplianceLandingPage.jsx.map