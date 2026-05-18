import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const plumbingServices = [
  {
    title: 'Leak Repair',
    description: 'Faucets, pipes, and fixtures repaired fast before water damage sets in.',
    icon: '🚿',
    image: '/images/categories/plumbing/leak-repair.webp',
  },
  {
    title: 'Drain Cleaning',
    description: 'Professional drain clearing for kitchen, bathroom, and main line blockages.',
    icon: '🌀',
    image: '/images/categories/plumbing/drain-cleaning.webp',
  },
  {
    title: 'Installations',
    description: 'Toilets, sinks, water heaters, and full bathroom rough-ins.',
    icon: '🏠',
    image: '/images/categories/plumbing/installations.webp',
  },
];

const trustSignals = [
  { label: 'Licensed Plumbers', icon: '🔧' },
  { label: 'Emergency Ready', icon: '🚨' },
  { label: 'Managed Scheduling', icon: '📅' },
];

const plumbingProviders = [
  { name: 'Dave Singh', specialty: 'Master Plumber', rating: 4.9, jobCount: 156 },
  { name: 'Marco Rossi', specialty: 'Drain Specialist', rating: 4.8, jobCount: 98 },
  { name: 'Tom Baker', specialty: 'Water Heater Pro', rating: 4.9, jobCount: 112 },
  { name: 'Ahmed Hassan', specialty: 'Emergency Plumbing', rating: 5.0, jobCount: 87 },
];

const plumbingFaqs = [
  {
    question: 'Do you offer emergency plumbing services?',
    answer: 'Yes, we have plumbers available for emergency situations like burst pipes, major leaks, and sewage backups. Mark your request as urgent and we prioritize matching.',
  },
  {
    question: 'How much does a typical plumbing job cost?',
    answer: 'Costs vary by job complexity. Simple repairs start around $150, while larger jobs like water heater replacement may be $800+. Your matched plumber will provide a quote before work begins.',
  },
  {
    question: 'Are your plumbers licensed?',
    answer: 'All plumbers on The Helper hold valid licenses and carry liability insurance. We verify credentials before approving providers.',
  },
  {
    question: 'Can you install new fixtures?',
    answer: 'Absolutely! Our plumbers handle everything from faucet swaps to full bathroom renovations including toilets, sinks, showers, and tubs.',
  },
];

export default function PlumbingLandingPage() {
  return (
    <>
      <PageSeo
        title="Plumber in Oakville, Burlington & GTA | TheHelper"
        description="Licensed plumbers for leak repair, drain cleaning, and fixture installs in Oakville, Burlington & Mississauga. Emergency plumbing available. Earn 5% cashback on every job."
        ogTitle="Licensed Plumbers in GTA | TheHelper"
        ogDescription="Trusted plumbers in Oakville, Burlington & the GTA. Emergency plumbing, drain cleaning, and fixture installs — vetted, insured, and managed end-to-end."
        canonicalPath="/services/plumbing"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Expert Plumbing in GTA"
          title="Reliable Plumbing Done Right."
          highlightedWord="Plumbing"
          description="From leaky faucets to full pipe replacements, we match you with licensed plumbers in the GTA. We handle the matching, scheduling, and follow-up — and earn rewards on every completed job."
          ctaText="Request Plumbing Quote"
          ctaLink="/request-service?category=plumbing"
          trustNote="Licensed plumbers, emergency-ready. You earn points on every completed job."
          trustSignals={trustSignals}
          services={plumbingServices}
          heroImage="/images/categories/plumbing/hero.webp"
          heroImageAlt="Professional plumber installing modern faucet in kitchen"
        />

        <ProviderShowcase
          title="Meet Your Local Plumbing Pros"
          subtitle="Licensed, insured plumbers ready for any job — from quick fixes to major installations."
          providers={plumbingProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={plumbingFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
