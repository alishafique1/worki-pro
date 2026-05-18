import React from 'react';
import PageSeo from './components/PageSeo';
import {
  CategoryHero,
  ProviderShowcase,
  CTASection,
  Container,
  FAQAccordion,
} from './marketplace/components';

const handymanServices = [
  {
    title: 'Mounting',
    description: 'Expert mounting for TVs, shelves, mirrors, and artwork on any wall type.',
    icon: '🖼️',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    title: 'Repairs',
    description: 'Drywall patching, leaky faucet fixes, and general home maintenance.',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
  },
  {
    title: 'Assembly',
    description: 'Professional furniture assembly for IKEA, Wayfair, and other major brands.',
    icon: '📦',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80',
  },
];

const trustSignals = [
  { label: 'Verified Pros', icon: '✅' },
  { label: 'Background Checked', icon: '🔍' },
  { label: 'Satisfaction Guaranteed', icon: '⭐' },
];

const handymanProviders = [
  { name: 'James Kowalski', specialty: 'All-Around Pro', rating: 4.9, jobCount: 234 },
  { name: 'Alex Thompson', specialty: 'TV Mounting Expert', rating: 4.8, jobCount: 167 },
  { name: 'Miguel Rodriguez', specialty: 'Furniture Assembly', rating: 5.0, jobCount: 189 },
  { name: 'Steve Morrison', specialty: 'Home Repairs', rating: 4.9, jobCount: 145 },
];

const handymanFaqs = [
  {
    question: 'What kind of jobs can a handyman do?',
    answer: 'Our handyman pros handle TV mounting, furniture assembly, drywall repairs, painting touch-ups, door/lock fixes, shelf installation, and general home maintenance tasks.',
  },
  {
    question: 'How do you vet your handyman pros?',
    answer: 'All handyman providers go through background checks and credential verification. We also monitor reviews and ratings to maintain quality.',
  },
  {
    question: 'Can I book for multiple small jobs at once?',
    answer: 'Absolutely! Many customers save by booking a "punch list" — a collection of small tasks completed in one visit. Just list everything in your request.',
  },
  {
    question: 'Do handyman pros bring their own tools?',
    answer: 'Yes, our pros come equipped with standard tools. For specialized equipment or specific materials, they\'ll let you know what\'s needed beforehand.',
  },
];

export default function HandymanLandingPage() {
  return (
    <>
      <PageSeo
        title="Handyman Services in Oakville & Burlington | TheHelper"
        description="Trusted handyman pros for mounting, furniture assembly, drywall, and home repairs in Oakville, Burlington & Milton. Verified, insured, and background-checked."
        ogTitle="Handyman Services in GTA | TheHelper"
        ogDescription="Book background-checked handyman pros in Oakville, Burlington & the GTA. TV mounting, furniture assembly, painting, and home repairs — matched and managed for you."
        canonicalPath="/handyman"
      />
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHero
          badge="Trusted Handyman in GTA"
          title="Tackle Your To-Do List."
          highlightedWord="To-Do"
          description="Professional help for furniture assembly, mounting, painting, and small repairs. Our concierge handles everything — so you can focus on what matters, and earn rewards on every completed job."
          ctaText="Get Help Now"
          ctaLink="/request-service?category=handyman"
          trustNote="Verified handyman pros in Oakville, Burlington & Milton. You earn points on every completed job."
          trustSignals={trustSignals}
          services={handymanServices}
          heroImage="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1200&q=80"
          heroImageAlt="Handyman mounting TV on living room wall"
        />

        <ProviderShowcase
          title="Meet Your Local Handyman Pros"
          subtitle="Background-checked, reliable pros ready to tackle your to-do list."
          providers={handymanProviders}
        />

        <section className="py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-8">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={handymanFaqs} />
            </div>
          </Container>
        </section>

        <CTASection />
      </div>
    </>
  );
}
