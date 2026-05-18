import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const hvacServices = [
  {
    title: 'Heating',
    description: 'Furnace repair, maintenance, and new high-efficiency installations.',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
  },
  {
    title: 'Cooling',
    description: 'Stay cool with expert AC repair and modern cooling solutions.',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1631545308370-89c9ff8bdab1?w=800&q=80',
  },
  {
    title: 'Air Quality',
    description: 'Humidifiers, air purifiers, and duct cleaning for a healthy home.',
    icon: '💨',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
];

const trustSignals = [
  { label: 'Verified Pros', icon: '✅' },
  { label: 'Licensed & Insured', icon: '🛡️' },
  { label: 'Managed Scheduling', icon: '📅' },
];

const hvacProviders = [
  { name: 'Mike Torres', specialty: 'HVAC Specialist', rating: 4.9, jobCount: 127 },
  { name: 'Dave Singh', specialty: 'Heating & Cooling', rating: 4.8, jobCount: 89 },
  { name: 'James Wilson', specialty: 'AC Installation', rating: 5.0, jobCount: 56 },
  { name: 'Robert Chen', specialty: 'Furnace Repair', rating: 4.9, jobCount: 143 },
];

const hvacFaqs = [
  {
    question: 'How quickly can I get an HVAC technician?',
    answer: 'Most HVAC requests are matched within 24 hours. For emergencies like no heat in winter, we prioritize urgent requests and can often connect you same-day.',
  },
  {
    question: 'Are your HVAC technicians licensed?',
    answer: 'Yes, all HVAC pros on The Helper are TSSA-certified and carry proper insurance. We verify credentials before approving any provider.',
  },
  {
    question: 'What brands do you service?',
    answer: 'Our techs work with all major brands including Carrier, Lennox, Trane, Goodman, Rheem, and more. Just describe your system in your request.',
  },
  {
    question: 'Do I earn rewards on HVAC services?',
    answer: 'Yes! You earn reward points on every completed HVAC job. Points can be redeemed toward future services.',
  },
];

export default function HvacLandingPage() {
  return (
    <>
      <PageSeo
        title="HVAC Repair & Tune-Up in GTA | TheHelper"
        description="Licensed TSSA HVAC contractors for heating, cooling, and air quality in Oakville, Burlington & Milton. Fast response, verified pros, and a matching process that gets you the right tech."
        ogTitle="HVAC Repair & Tune-Up in GTA | TheHelper"
        ogDescription="Find trusted HVAC pros in Milton, Oakville & the GTA. Furnace repair, AC installations, and air quality services — all managed end-to-end."
        canonicalPath="/hvac"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Expert HVAC in GTA"
          title="Reliable HVAC Solutions."
          highlightedWord="HVAC"
          description="Stay comfortable all year round. From furnace repairs to AC installations, we match you with vetted HVAC pros. We handle the matching, scheduling, and follow-up — and earn rewards on every completed job."
          ctaText="Request HVAC Quote"
          ctaLink="/request-service?category=hvac"
          trustNote="Licensed TSSA contractors. You earn points when your job is done."
          trustSignals={trustSignals}
          services={hvacServices}
          heroImage="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80"
          heroImageAlt="Professional HVAC technician servicing a modern furnace"
        />

        <ProviderShowcase
          title="Meet Your Local HVAC Pros"
          subtitle="Verified, licensed technicians ready to help with your heating and cooling needs."
          providers={hvacProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={hvacFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
