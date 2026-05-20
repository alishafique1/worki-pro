import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';
const plumbingFaqs = [
    {
        question: 'How much does a plumber cost in Oakville?',
        answer: 'Plumbing costs in Oakville typically range from $150-$300 for basic repairs like fixing a leaky faucet or unclogging a drain. Larger jobs like water heater installation ($800-$2,500) or sewer line repair ($1,000-$5,000) vary based on complexity. The Helper connects you with licensed plumbers who provide upfront quotes.',
    },
    {
        question: 'Do you offer emergency plumbing in Burlington?',
        answer: 'Yes, The Helper offers 24/7 emergency plumbing services in Burlington, Oakville, and Milton. For burst pipes, sewage backups, or other urgent issues, submit a request marked as emergency and we prioritize same-day dispatch.',
    },
    {
        question: 'How long does drain cleaning take?',
        answer: 'Most drain cleaning jobs take 30 minutes to 2 hours depending on the severity of the blockage and whether camera inspection is needed. For main sewer line clogs, expect 2-4 hours including inspection and clearing.',
    },
    {
        question: 'What plumbing services do you offer?',
        answer: 'Our network of licensed plumbers handles leak repair, drain cleaning, water heater installation, toilet repair, faucet installation, pipe repair, sump pump service, and complete bathroom/kitchen rough-ins. We serve Milton, Oakville, Burlington, and surrounding GTA areas.',
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
export default function PlumbingLandingPage() {
    return (<>
      <PageSeo title="Plumber in Oakville, Burlington & Milton | Licensed Plumbing Services" description="Licensed plumbers for leak repair, drain cleaning, water heater installation, and emergency plumbing in Oakville, Burlington & Milton. 24/7 emergency service available. Get matched with verified pros." ogTitle="Licensed Plumbers in Oakville, Burlington & Milton | The Helper" ogDescription="Find trusted plumbers for emergency repairs, drain cleaning, and fixture installation in the GTA. Licensed, insured, and background-checked." canonicalPath="/plumbing" keywords="plumber Oakville, plumbing services Burlington, emergency plumber Milton, drain cleaning GTA, water heater installation, leak repair near me" structuredData={{
            '@context': 'https://schema.org',
            '@graph': [
                createServiceSchema({
                    name: 'Plumbing Services',
                    description: 'Professional plumbing services including leak repair, drain cleaning, water heater installation, and emergency plumbing in Oakville, Burlington, and Milton.',
                    areaServed: ['Oakville', 'Burlington', 'Milton'],
                    url: 'https://thehelper.ca/plumbing',
                }),
                createFaqSchema(plumbingFaqs),
            ],
        }}/>
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Licensed Plumbers in Oakville, Burlington & Milton
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Plumbing</span> Services
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            From leaky faucets to emergency pipe repairs, we match you with licensed, insured plumbers in Oakville, Burlington, and Milton. 24/7 emergency service available for urgent issues.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/request-service?service=plumbing" className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1">
              Request Plumbing Quote
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">Licensed plumbers. Earn rewards on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
            { label: 'Licensed Plumbers', icon: '🔧', alt: 'Licensed professional plumbers' },
            { label: '24/7 Emergency', icon: '🚨', alt: '24/7 emergency service' },
            { label: 'Upfront Pricing', icon: '💰', alt: 'Upfront transparent pricing' }
        ].map((stat) => (<div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-3xl" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="plumbing-services-heading">
            <h2 id="plumbing-services-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Our Plumbing Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
            { title: 'Leak Repair', desc: 'Fast diagnosis and repair of faucet leaks, pipe leaks, and hidden water damage. We fix problems before they become costly emergencies.', icon: '🚿' },
            { title: 'Drain Cleaning', desc: 'Professional drain clearing for kitchen sinks, bathroom drains, and main sewer lines. Camera inspection available to identify stubborn blockages.', icon: '🌀' },
            { title: 'Installations', desc: 'Water heater installation, toilet replacement, faucet upgrades, and complete bathroom/kitchen plumbing rough-ins.', icon: '🏠' }
        ].map((service) => (<article key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                  <div className="text-4xl mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{service.desc}</p>
                </article>))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Plumbing Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Oakville', 'Burlington', 'Milton', 'Mississauga', 'Brampton', 'Hamilton'].map((area) => (<Link key={area} to={`/areas/${area.toLowerCase()}`} className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                  Plumber in {area}
                </Link>))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
              {plumbingFaqs.map((faq) => (<FaqItem key={faq.question} question={faq.question} answer={faq.answer}/>))}
            </div>
          </section>
        </div>
      </main>
    </div>
    </>);
}
