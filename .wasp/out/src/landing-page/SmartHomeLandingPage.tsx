import React, { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageSeo, { createServiceSchema, createFaqSchema } from './components/PageSeo';

const smartHomeFaqs = [
  {
    question: 'How much does smart home installation cost in Milton?',
    answer: 'Smart home installation costs in Milton vary by project. Smart lock installation typically runs $150-$300, video doorbell installation $100-$200, and full smart thermostat setup $150-$350. For whole-home automation systems, expect $500-$2,000+ depending on complexity. The Helper connects you with certified installers who provide upfront quotes.',
  },
  {
    question: 'What smart home brands do you support?',
    answer: 'Our network of installers works with all major smart home platforms including Google Home, Amazon Alexa, Apple HomeKit, Samsung SmartThings, and dedicated systems like Control4 and Savant. We install Ring, Nest, Ecobee, August, Yale, Schlage, and many more brands.',
  },
  {
    question: 'Can you help with WiFi for smart home devices?',
    answer: 'Yes, many smart home issues stem from WiFi connectivity. Our technicians can assess your network, recommend mesh WiFi solutions, install access points, and ensure all your smart devices have reliable connectivity throughout your home.',
  },
  {
    question: 'Do you install home security systems?',
    answer: 'Yes, we install both DIY-style systems (Ring, SimpliSafe, Arlo) and professional-grade security systems. Services include camera installation, sensor placement, doorbell installation, and integration with your smart home ecosystem.',
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

export default function SmartHomeLandingPage() {
  return (
    <>
      <PageSeo
        title="Smart Home Installation in Milton, Oakville & Burlington | The Helper"
        description="Certified smart home installers in Milton, Oakville & Burlington. Smart locks, video doorbells, thermostats, security cameras, and full home automation. Get matched with verified pros."
        ogTitle="Smart Home Installation & Automation in Milton, Oakville & Burlington"
        ogDescription="Book certified smart home pros for security camera installation, smart lock setup, and home automation in the GTA. All major brands supported."
        canonicalPath="/smart-home"
        keywords="smart home installation Milton, smart lock Oakville, video doorbell Burlington, home automation GTA, security camera installation, smart thermostat setup"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createServiceSchema({
              name: 'Smart Home Installation Services',
              description: 'Professional smart home installation including smart locks, security cameras, video doorbells, thermostats, and full home automation in Milton, Oakville, and Burlington.',
              areaServed: ['Milton', 'Oakville', 'Burlington'],
              url: 'https://thehelper.ca/smart-home',
            }),
            createFaqSchema(smartHomeFaqs),
          ],
        }}
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            Smart Home Experts in Milton, Oakville & Burlington
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl text-[#0F172A]">
            Make Your Home <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">Smarter</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-12">
            From smart locks to full home automation, we match you with certified smart home installers in Milton, Oakville, and Burlington. Professional setup for all major brands and platforms.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/get-quotes?service=smart-home"
              className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
            >
              Request Smart Home Quote
            </Link>
          </div>
          <p className="text-sm text-[#475569] mt-2 mb-16">Certified installers. All major brands supported. Earn rewards on every completed job.</p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-12 mb-24" role="list" aria-label="Trust signals">
            {[
              { label: 'Certified Installers', icon: '📱', alt: 'Certified smart home installers' },
              { label: 'All Platforms', icon: '🏠', alt: 'All smart home platforms supported' },
              { label: 'Professional Setup', icon: '⚙️', alt: 'Professional installation and setup' }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2" role="listitem">
                <div className="text-3xl" aria-hidden="true">{stat.icon}</div>
                <div className="text-sm font-black uppercase tracking-widest text-[#475569]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <section className="w-full mb-24" aria-labelledby="smart-home-services-heading">
            <h2 id="smart-home-services-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Our Smart Home Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                { title: 'Smart Security', desc: 'Smart lock installation, video doorbell setup, security camera placement, motion sensors, and full home security system integration.', icon: '🔒' },
                { title: 'Home Automation', desc: 'Smart thermostat installation, voice assistant setup, smart lighting, automated blinds, and whole-home hub configuration.', icon: '🎮' },
                { title: 'AV & Connectivity', desc: 'TV mounting with concealed wiring, surround sound setup, structured wiring, mesh WiFi installation, and network optimization.', icon: '📡' }
              ].map((service) => (
                <article key={service.title} className="p-10 bg-white rounded-[40px] border border-[#E2E8F0] hover:-translate-y-1 transition-transform text-left">
                  <div className="text-4xl mb-6" aria-hidden="true">{service.icon}</div>
                  <h3 className="text-2xl font-black mb-4 text-[#0F172A]">{service.title}</h3>
                  <p className="text-[#475569] leading-relaxed">{service.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Platforms We Support */}
          <section className="w-full mb-24" aria-labelledby="platforms-heading">
            <h2 id="platforms-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Platforms We Support</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Google Home', 'Amazon Alexa', 'Apple HomeKit', 'Samsung SmartThings', 'Ring', 'Nest', 'Ecobee', 'Control4'].map((platform) => (
                <span
                  key={platform}
                  className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold"
                >
                  {platform}
                </span>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className="w-full mb-24" aria-labelledby="service-areas-heading">
            <h2 id="service-areas-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Smart Home Service Areas</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Halton Hills'].map((area) => (
                <Link
                  key={area}
                  to={`/areas/${area.toLowerCase().replace(' ', '-')}`}
                  className="px-6 py-3 bg-white rounded-full border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                >
                  Smart Home in {area}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full max-w-2xl" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-black mb-8 text-[#0F172A]">Frequently Asked Questions</h2>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
              {smartHomeFaqs.map((faq) => (
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
