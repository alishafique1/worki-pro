import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const applianceServices = [
  {
    title: 'Kitchen',
    description: 'Expert repair for refrigerators, dishwashers, ovens, and stoves.',
    icon: '🍳',
    image: '/images/categories/appliance-repair/kitchen.webp',
  },
  {
    title: 'Laundry',
    description: 'Washer and dryer repair for all major brands and models.',
    icon: '👕',
    image: '/images/categories/appliance-repair/laundry.webp',
  },
  {
    title: 'Maintenance',
    description: 'Preventative checkups to keep your appliances running efficiently.',
    icon: '🛡️',
    image: '/images/categories/appliance-repair/maintenance.webp',
  },
];

const trustSignals = [
  { label: 'Certified Techs', icon: '📜' },
  { label: 'All Brands Covered', icon: '🏷️' },
  { label: 'Managed End-to-End', icon: '🎯' },
];

const applianceProviders = [
  { name: 'Tony Martino', specialty: 'All Appliances', rating: 4.9, jobCount: 203 },
  { name: 'Jin Park', specialty: 'Samsung/LG Expert', rating: 4.8, jobCount: 145 },
  { name: 'Vlad Petrov', specialty: 'Refrigeration Pro', rating: 5.0, jobCount: 98 },
  { name: 'Maria Santos', specialty: 'Laundry Specialist', rating: 4.9, jobCount: 112 },
];

const applianceFaqs = [
  {
    question: 'What appliance brands do you service?',
    answer: 'Our techs work with all major brands including Samsung, LG, Whirlpool, GE, Bosch, KitchenAid, Maytag, Frigidaire, and more. Just describe your appliance in your request.',
  },
  {
    question: 'How fast can you get someone out?',
    answer: 'Most appliance repair requests are matched within 24 hours. Many of our techs offer same-day or next-day service depending on availability.',
  },
  {
    question: 'Is it worth repairing or should I replace?',
    answer: 'Our techs will give you an honest assessment. Generally, if the repair cost exceeds 50% of a new appliance, replacement might make more sense.',
  },
  {
    question: 'Do you carry parts?',
    answer: 'Many common parts are carried by our techs. For specialty parts, your tech will order and schedule a follow-up visit, often within 2-3 days.',
  },
];

export default function ApplianceLandingPage() {
  return (
    <>
      <PageSeo
        title="Appliance Repair in Mississauga & GTA | TheHelper"
        description="Same-day appliance repair in Mississauga, Brampton & the GTA. Certified techs for fridges, washers, ovens, and dishwashers — all brands covered. Verified and insured pros."
        ogTitle="Same-Day Appliance Repair in GTA | TheHelper"
        ogDescription="Book certified appliance repair techs in Mississauga, Brampton & the GTA. Fridges, washers, dryers, ovens — all brands, managed end-to-end."
        canonicalPath="/services/appliance-repair"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Fast Appliance Repair in GTA"
          title="Pro Appliance Repair."
          highlightedWord="Appliance"
          description="Broken fridge? Malfunctioning washer? We match you with certified repair techs and manage the whole process — and earn rewards on every completed job."
          ctaText="Book Repair Now"
          ctaLink="/request-service?category=appliance-repair"
          trustNote="Certified appliance techs, all brands covered. You earn points on every completed job."
          trustSignals={trustSignals}
          services={applianceServices}
          heroImage="/images/categories/appliance-repair/hero.webp"
          heroImageAlt="Appliance repair technician diagnosing refrigerator"
        />

        <ProviderShowcase
          title="Meet Your Local Appliance Pros"
          subtitle="Certified technicians covering all major brands and appliance types."
          providers={applianceProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={applianceFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
