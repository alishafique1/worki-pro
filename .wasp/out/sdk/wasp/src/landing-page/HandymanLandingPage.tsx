import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronUp, Package, Search, ShieldCheck, Star, Wrench } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';
import LandingHeroBanner from './components/LandingHeroBanner';

const handymanFaqs = [
  {
    question: 'How much does a handyman cost in Oakville?',
    answer: 'Handyman rates in Oakville typically range from $50-$100 per hour depending on the task complexity. Common jobs like TV mounting ($75-$150), furniture assembly ($100-$250), and drywall repair ($150-$400) have fixed pricing. The Helper connects you with background-checked pros who provide upfront quotes.',
  },
  {
    question: 'What services does a handyman provide?',
    answer: 'Our handyman network handles TV and shelf mounting, furniture assembly (IKEA, Wayfair, etc.), drywall repair and patching, minor plumbing fixes, painting touch-ups, door and lock installation, weather stripping, and general home repairs. For specialized trades like electrical or major plumbing, we connect you with licensed contractors.',
  },
  {
    question: 'Are your handymen insured in Burlington?',
    answer: 'Yes, all handymen in The Helper network carry liability insurance and are background-checked. We verify credentials before any provider joins our platform, ensuring you have peace of mind when they enter your home.',
  },
  {
    question: 'How quickly can I get a handyman in Milton?',
    answer: 'Most handyman requests in Milton can be scheduled within 24-48 hours. For urgent small repairs, same-day service may be available depending on provider availability. Submit your request with your preferred timeline.',
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

export default function HandymanLandingPage() {
  return (
    <>
      <PageSeo
        title="Handyman Services in Oakville, Burlington & Milton | The Helper"
        description="Trusted handyman pros for TV mounting, furniture assembly, drywall repair, and home repairs in Oakville, Burlington & Milton. Background-checked, insured, and verified."
        ogTitle="Handyman Services in Oakville, Burlington & Milton | The Helper"
        ogDescription="Book background-checked handyman pros for TV mounting, furniture assembly, painting, and home repairs in the GTA. Verified and insured."
        canonicalPath="/handyman"
        keywords="handyman Oakville, handyman services Burlington, TV mounting Milton, furniture assembly GTA, drywall repair, home repairs near me"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createServiceSchema({
              name: 'Handyman Services',
              description: 'Professional handyman services including TV mounting, furniture assembly, drywall repair, painting, and general home repairs in Oakville, Burlington, and Milton.',
              areaServed: ['Oakville', 'Burlington', 'Milton'],
              url: 'https://thehelper.ca/handyman',
            }),
            createFaqSchema(handymanFaqs),
          ],
        }}
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeroBanner
        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
        alt="Handyman completing home repairs in Milton"
      />
      <main className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Trusted Handyman Services in Oakville, Burlington & Milton
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Tackle Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">To-Do</span> List
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            Professional help for TV mounting, furniture assembly, drywall repair, painting, and small repairs. We match you with background-checked handymen in Oakville, Burlington, and Milton.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/get-quotes?service=handyman"
              className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
            >
              Get Handyman Help
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">Background-checked pros. Earn rewards on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
              { label: 'Background Checked', icon: <Search className="size-6" />, alt: 'Background checked handymen' },
              { label: 'Fully Insured', icon: <ShieldCheck className="size-6" />, alt: 'Fully insured service' },
              { label: 'Satisfaction Guaranteed', icon: <Star className="size-6" />, alt: 'Satisfaction guaranteed' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-[#2563EB]" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="handyman-services-heading">
            <h2 id="handyman-services-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Our Handyman Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { title: 'Mounting & Installation', desc: 'Expert TV mounting on any wall type, shelf installation, mirror hanging, artwork mounting, and curtain rod installation.', icon: <Wrench className="size-7" /> },
                { title: 'Home Repairs', desc: 'Drywall patching, door adjustments, lock installation, weather stripping, caulking, and minor plumbing fixes like leaky faucets.', icon: <Wrench className="size-7" /> },
                { title: 'Assembly & Painting', desc: 'Professional furniture assembly for IKEA, Wayfair, and all major brands. Interior painting touch-ups and small paint jobs.', icon: <Package className="size-7" /> }
              ].map((service) => (
                <article key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                  <div className="text-[#2563EB] mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{service.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Handyman Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Oakville', 'Burlington', 'Milton', 'Mississauga', 'Brampton', 'Halton Hills'].map((area) => (
                <Link
                  key={area}
                  to={`/areas/${area.toLowerCase().replace(' ', '-')}`}
                  className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                >
                  Handyman in {area}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
              {handymanFaqs.map((faq) => (
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
