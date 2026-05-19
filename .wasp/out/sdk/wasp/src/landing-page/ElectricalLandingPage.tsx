import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';

const electricalFaqs = [
  {
    question: 'How much does an electrician cost in Milton?',
    answer: 'Electricians in Milton typically charge $80-$150 per hour. Common jobs like outlet installation ($150-$300), panel upgrades ($1,500-$3,500), and EV charger installation ($800-$2,000) vary based on complexity. The Helper connects you with ESA-certified electricians who provide upfront quotes.',
  },
  {
    question: 'Do you install EV chargers in Burlington?',
    answer: 'Yes, our network includes certified electricians who specialize in EV charger installation in Burlington, Oakville, and Milton. Level 2 charger installations typically include panel assessment, permit pulling, and ESA inspection coordination.',
  },
  {
    question: 'What electrical work requires a permit?',
    answer: 'In Ontario, most electrical work beyond simple fixture replacements requires an ESA permit. This includes panel upgrades, new circuits, outdoor wiring, and EV charger installations. Our licensed electricians handle permit applications and inspections.',
  },
  {
    question: 'Can you upgrade my electrical panel?',
    answer: 'Yes, panel upgrades are one of our most common electrical services. Whether you need more capacity for EV charging, a hot tub, or home renovation, our ESA-certified electricians handle 100-amp to 200-amp upgrades and beyond.',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E2E8F0] last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#0F172A]">{question}</span>
        {open ? (
          <ChevronUp className="size-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-[#475569]" aria-hidden="true" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-6 text-[#475569]">{answer}</p>
      )}
    </div>
  );
}

export default function ElectricalLandingPage() {
  return (
    <>
      <PageSeo
        title="Electrician in Milton, Oakville & Burlington | Licensed Electrical Services"
        description="ESA-certified electricians for panel upgrades, EV charger installation, pot lights, and electrical repairs in Milton, Oakville & Burlington. Get matched with verified, licensed pros."
        ogTitle="Licensed Electricians in Milton, Oakville & Burlington | The Helper"
        ogDescription="Find trusted electricians for panel upgrades, EV charger installation, and electrical repairs in the GTA. ESA-certified and fully insured."
        canonicalPath="/electrical"
        keywords="electrician Milton, electrical services Oakville, EV charger installation Burlington, panel upgrade GTA, pot lights installation, licensed electrician near me"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createServiceSchema({
              name: 'Electrical Services',
              description: 'Professional electrical services including panel upgrades, EV charger installation, pot lights, and electrical repairs in Milton, Oakville, and Burlington.',
              areaServed: ['Milton', 'Oakville', 'Burlington'],
              url: 'https://thehelper.ca/electrical',
            }),
            createFaqSchema(electricalFaqs),
          ],
        }}
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            ESA-Certified Electricians in Milton, Oakville & Burlington
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Safe, Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Electrical</span> Work
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            From outlet repairs to complete panel upgrades, we match you with ESA-certified electricians in Milton, Oakville, and Burlington. All work meets Ontario Electrical Safety Code requirements.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/request-service?service=electrical"
              className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
            >
              Request Electrical Quote
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">ESA-certified electricians. Earn rewards on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
              { label: 'ESA Certified', icon: '⚡', alt: 'ESA certified electricians' },
              { label: 'Permit Ready', icon: '🛡️', alt: 'Handles permits and inspections' },
              { label: 'Insured Work', icon: '📋', alt: 'Fully insured electrical work' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-3xl" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="electrical-services-heading">
            <h2 id="electrical-services-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Our Electrical Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { title: 'Repairs & Outlets', desc: 'Outlet replacements, circuit troubleshooting, GFCI installation, and panel breaker repairs. Safety-focused diagnostics for flickering lights and tripping breakers.', icon: '🔌' },
                { title: 'Lighting', desc: 'Pot light installation, fixture upgrades, under-cabinet lighting, outdoor lighting, and smart lighting setup with switches and dimmers.', icon: '💡' },
                { title: 'Panel & Upgrades', desc: 'Electrical panel upgrades (100A to 200A), EV charger installation (Level 2), whole-home surge protection, and rewiring for renovations.', icon: '🔋' }
              ].map((service) => (
                <article key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                  <div className="text-4xl mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{service.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Electrical Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Halton Hills'].map((area) => (
                <Link
                  key={area}
                  to={`/areas/${area.toLowerCase().replace(' ', '-')}`}
                  className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                >
                  Electrician in {area}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
              {electricalFaqs.map((faq) => (
                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
    </>
  );
}
