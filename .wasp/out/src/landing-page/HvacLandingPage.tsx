import React, { useState } from 'react';
import { Link } from 'react-router';
import { CalendarClock, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck, Zap, Flame, Wind } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';
import LandingHeroBanner from './components/LandingHeroBanner';
import { CATEGORY_QUALIFIERS } from '../consumer/categoryQualifiers';

const HVAC_CHIPS = CATEGORY_QUALIFIERS['hvac']?.detailChips ?? [];

const hvacFaqs = [
  {
    question: 'How much does HVAC repair cost in Milton?',
    answer: 'HVAC repair costs in Milton typically range from $150-$500 for common issues like thermostat replacement or capacitor repair. Major repairs like compressor or heat exchanger replacement can cost $500-$2,000. The Helper connects you with licensed TSSA contractors who provide upfront quotes.',
  },
  {
    question: 'How often should I service my furnace?',
    answer: 'Furnaces should be serviced annually, ideally in the fall before heating season begins. Regular maintenance extends equipment life, maintains warranty validity, and can prevent costly emergency repairs.',
  },
  {
    question: 'What is included in an AC tune-up?',
    answer: 'A comprehensive AC tune-up includes cleaning coils, checking refrigerant levels, lubricating moving parts, testing the thermostat, inspecting electrical connections, and clearing the condensate drain. This service typically takes 1-2 hours.',
  },
  {
    question: 'Do you offer same-day HVAC service in Oakville?',
    answer: 'Yes, The Helper offers same-day HVAC service for emergencies in Oakville, Burlington, and Milton. Emergency requests are flagged for priority dispatch where provider availability allows.',
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

export default function HvacLandingPage() {
  return (
    <>
      <PageSeo
        title="HVAC Repair & Installation Milton, Oakville, Burlington | The Helper"
        description="Licensed TSSA HVAC contractors for furnace repair, AC installation, and air quality services in Milton, Oakville & Burlington. Same-day emergency service available. Get matched with verified pros."
        ogTitle="HVAC Services in Milton, Oakville & Burlington | The Helper"
        ogDescription="Find trusted HVAC pros for furnace repair, AC tune-ups, and heating installation in the GTA. Licensed, insured, and verified contractors."
        canonicalPath="/hvac"
        keywords="HVAC repair Milton, furnace repair Oakville, AC installation Burlington, heating services GTA, air conditioning repair, HVAC contractor near me"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createServiceSchema({
              name: 'HVAC Repair & Installation Services',
              description: 'Professional HVAC services including furnace repair, AC installation, heating tune-ups, and air quality solutions in Milton, Oakville, and Burlington.',
              areaServed: ['Milton', 'Oakville', 'Burlington'],
              url: 'https://thehelper.ca/hvac',
            }),
            createFaqSchema(hvacFaqs),
          ],
        }}
      />
    <div className="min-h-screen bg-slate-50">
      <LandingHeroBanner
        src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1600&q=80"
        alt="HVAC technician servicing a unit in a GTA home"
      />
      <main className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            Expert HVAC Services in Milton, Oakville & Burlington
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-slate-900">
            HVAC Repair & Installation in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">GTA</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Stay comfortable all year round. From furnace repairs to AC installations, we match you with vetted, TSSA-licensed HVAC pros in Milton, Oakville, and Burlington. Same-day emergency service available.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/get-quotes?category=hvac&slug=hvac"
              className="px-10 py-5 bg-blue-600 text-white font-black rounded-3xl text-lg hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
            >
              Request HVAC Quote
            </Link>
          </div>
          <p className="text-sm text-slate-600 mt-2 mb-8">Licensed TSSA contractors. Earn rewards on every completed job.</p>

          {/* Common Problems */}
          <section className="w-full max-w-2xl mb-16" aria-label="Common HVAC problems">
            <p className="text-sm font-semibold text-[#475569] uppercase tracking-widest mb-4">What best describes your issue?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {HVAC_CHIPS.filter(chip => chip !== 'Something else').map(chip => (
                <Link
                  key={chip}
                  to={`/get-quotes?category=hvac&slug=hvac&problem=${encodeURIComponent(chip)}`}
                  className="px-4 py-2 bg-white rounded-full border border-[#E2E8F0] text-sm font-medium text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                >
                  {chip}
                </Link>
              ))}
              <Link
                to="/get-quotes?category=hvac&slug=hvac"
                className="px-4 py-2 bg-white rounded-full border border-[#E2E8F0] text-sm font-medium text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
              >
                Something else →
              </Link>
            </div>
          </section>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
              { label: 'TSSA Licensed', icon: <CheckCircle2 className="size-6" />, alt: 'TSSA licensed contractors' },
              { label: 'Fully Insured', icon: <ShieldCheck className="size-6" />, alt: 'Fully insured pros' },
              { label: 'Same-Day Service', icon: <CalendarClock className="size-6" />, alt: 'Same-day emergency service' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-blue-600" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="hvac-services-heading">
            <h2 id="hvac-services-heading" className="text-3xl font-black mb-8 text-slate-900">Our HVAC Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { title: 'Heating Services', desc: 'Furnace repair, maintenance, tune-ups, and new high-efficiency installations. Heat pump and boiler services also available.', icon: <Flame className="size-7" /> },
                { title: 'Cooling Services', desc: 'AC repair, installation, and seasonal tune-ups. Mini-split systems and central air conditioning for homes of all sizes.', icon: <Zap className="size-7" /> },
                { title: 'Air Quality', desc: 'Duct cleaning, humidifier installation, air purifiers, and HRV/ERV maintenance for a healthier home environment.', icon: <Wind className="size-7" /> }
              ].map((service) => (
                <article key={service.title} className="p-10 bg-white rounded-[40px] border border-slate-200 hover:-translate-y-1 transition-transform text-left">
                  <div className="text-blue-600 mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-slate-900">HVAC Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Halton Hills'].map((area) => (
                <Link
                  key={area}
                  to={`/areas/${area.toLowerCase().replace(' ', '-')}`}
                  className="px-6 py-3 bg-white rounded-full border border-slate-200 text-slate-900 font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  HVAC in {area}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-slate-900">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-slate-200 bg-white px-6">
              {hvacFaqs.map((faq) => (
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
