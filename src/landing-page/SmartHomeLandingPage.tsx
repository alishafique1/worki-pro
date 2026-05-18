import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const smartHomeServices = [
  {
    title: 'Smart Security',
    description: 'Smart locks, video doorbells, cameras, and full security system setup.',
    icon: '🔒',
    image: '/images/categories/smart-home/security.webp',
  },
  {
    title: 'Home Automation',
    description: 'Smart hubs, voice control integration, and full home automation.',
    icon: '🎮',
    image: '/images/categories/smart-home/automation.webp',
  },
  {
    title: 'AV & Connectivity',
    description: 'TV mounting, surround sound, structured wiring, and Wi-Fi optimization.',
    icon: '📡',
    image: '/images/categories/smart-home/av.webp',
  },
];

const trustSignals = [
  { label: 'Certified Installers', icon: '📱' },
  { label: 'All Major Brands', icon: '🏷️' },
  { label: 'Managed Setup', icon: '⚙️' },
];

const smartHomeProviders = [
  { name: 'Derek Kim', specialty: 'Smart Home Expert', rating: 5.0, jobCount: 78 },
  { name: 'Ryan Walsh', specialty: 'Security Systems', rating: 4.9, jobCount: 92 },
  { name: 'Anil Sharma', specialty: 'Home Automation', rating: 4.8, jobCount: 65 },
  { name: 'Jason Lee', specialty: 'AV Installation', rating: 4.9, jobCount: 134 },
];

const smartHomeFaqs = [
  {
    question: 'What smart home brands do you work with?',
    answer: 'Our installers work with all major ecosystems including Google Home, Amazon Alexa, Apple HomeKit, Ring, Nest, Ecobee, Lutron, Sonos, and more.',
  },
  {
    question: 'Can you help me choose the right smart home setup?',
    answer: 'Absolutely! Our techs can assess your home and recommend the best combination of devices for your needs and budget during the consultation.',
  },
  {
    question: 'Do you handle the wiring for smart home devices?',
    answer: 'Yes, our installers handle both wireless setup and hardwired installations. For complex electrical work, we coordinate with licensed electricians.',
  },
  {
    question: 'How long does a typical smart home installation take?',
    answer: 'Simple setups (thermostat, doorbell, a few lights) take 1-2 hours. Full home automation projects may take a full day or multiple visits.',
  },
];

export default function SmartHomeLandingPage() {
  return (
    <>
      <PageSeo
        title="Smart Home Installation in GTA | TheHelper"
        description="Certified smart home installers in Milton, Oakville & the GTA. Smart locks, cameras, thermostats, and full home automation — matched and managed. Earn 5% cashback."
        ogTitle="Smart Home Installation & Automation in GTA | TheHelper"
        ogDescription="Book certified smart home pros in Milton, Oakville & the GTA. Smart security, home automation, and AV setup — vetted installers, managed end-to-end."
        canonicalPath="/services/smart-home"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Smart Home Experts in GTA"
          title="Your Home, Smarter."
          highlightedWord="Smarter."
          description="From smart locks to full home automation, our vetted techs handle installation and setup. We match, schedule, and follow up — you just enjoy the upgrade and earn rewards on every completed job."
          ctaText="Request Smart Home Quote"
          ctaLink="/request-service?category=smart-home"
          trustNote="Certified smart home installers. You earn points on every completed job."
          trustSignals={trustSignals}
          services={smartHomeServices}
          heroImage="/images/categories/smart-home/hero.webp"
          heroImageAlt="Smart home installer configuring thermostat"
        />

        <ProviderShowcase
          title="Meet Your Local Smart Home Pros"
          subtitle="Certified installers ready to upgrade your home with the latest smart technology."
          providers={smartHomeProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={smartHomeFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
