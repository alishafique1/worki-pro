import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const electricalServices = [
  {
    title: 'Repairs & Outlets',
    description: 'Outlet replacements, circuit troubleshooting, and panel breaker fixes.',
    icon: '🔌',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
  },
  {
    title: 'Lighting',
    description: 'Pot light installation, fixture upgrades, and smart lighting setup.',
    icon: '💡',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
  },
  {
    title: 'Panel & Upgrades',
    description: 'Electrical panel upgrades, EV charger installation, and rewiring.',
    icon: '🔋',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
];

const trustSignals = [
  { label: 'Licensed Electricians', icon: '⚡' },
  { label: 'ESA Compliant', icon: '🛡️' },
  { label: 'Managed Scheduling', icon: '📅' },
];

const electricalProviders = [
  { name: 'Sarah Liu', specialty: 'Master Electrician', rating: 5.0, jobCount: 89 },
  { name: 'Kevin O\'Brien', specialty: 'Panel Specialist', rating: 4.9, jobCount: 134 },
  { name: 'Raj Patel', specialty: 'EV Charger Pro', rating: 4.8, jobCount: 67 },
  { name: 'Chris Taylor', specialty: 'Lighting Expert', rating: 4.9, jobCount: 156 },
];

const electricalFaqs = [
  {
    question: 'Are your electricians ESA certified?',
    answer: 'Yes, all electricians on The Helper are licensed and ESA (Electrical Safety Authority) compliant. Work is done to Ontario code standards.',
  },
  {
    question: 'Can you install an EV charger at my home?',
    answer: 'Absolutely! Our electricians specialize in Level 2 EV charger installations. We handle the panel assessment, installation, and any required permits.',
  },
  {
    question: 'How much does a panel upgrade cost?',
    answer: 'Panel upgrades typically range from $1,500-$3,500 depending on your home and requirements. Your matched electrician will provide a detailed quote.',
  },
  {
    question: 'Do you handle pot light installations?',
    answer: 'Yes! Pot light installation is one of our most popular services. Whether it\'s 4 lights or 40, our electricians handle the full job including drywall patching.',
  },
];

export default function ElectricalLandingPage() {
  return (
    <>
      <PageSeo
        title="Licensed Electrician in Milton, GTA | TheHelper"
        description="ESA-compliant electricians for panel upgrades, outlet repairs, and EV charger installs in Milton, Oakville & Burlington. Vetted, insured, and 5% cashback on every job."
        ogTitle="Licensed Electricians in GTA | TheHelper"
        ogDescription="Find trusted electricians in Milton, Oakville & the GTA. Panel upgrades, EV charger installs, pot lights, and electrical repairs — all managed end-to-end."
        canonicalPath="/electrical"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Expert Electrical in GTA"
          title="Safe, Expert Electrical Work."
          highlightedWord="Electrical"
          description="Licensed electricians for everything from outlet repairs to panel upgrades. We vet every pro and manage the whole process so you don't have to — and earn rewards on every completed job."
          ctaText="Request Electrical Quote"
          ctaLink="/request-service?category=electrical"
          trustNote="ESA-certified electricians. You earn points on every completed job."
          trustSignals={trustSignals}
          services={electricalServices}
          heroImage="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80"
          heroImageAlt="Licensed electrician working on modern electrical panel"
        />

        <ProviderShowcase
          title="Meet Your Local Electrical Pros"
          subtitle="ESA-certified electricians ready for repairs, upgrades, and installations."
          providers={electricalProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={electricalFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
