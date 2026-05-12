import React from 'react';
import { Link, useParams } from 'react-router';
import PageSeo from './components/PageSeo';

interface AreaData {
  name: string;
  region: string;
  population: string;
  tagline: string;
  nearby: string[];
}

const AREA_DATA: Record<string, AreaData> = {
  milton: {
    name: 'Milton',
    region: 'Halton Region',
    population: '130,000+',
    tagline: "Milton's Trusted Home Service Concierge",
    nearby: ['Oakville', 'Burlington', 'Halton Hills', 'Georgetown'],
  },
  oakville: {
    name: 'Oakville',
    region: 'Halton Region',
    population: '230,000+',
    tagline: "Oakville's Expert Home Service Pros",
    nearby: ['Burlington', 'Milton', 'Mississauga', 'Brampton'],
  },
  burlington: {
    name: 'Burlington',
    region: 'Halton Region',
    population: '195,000+',
    tagline: "Burlington's Vetted Home Service Concierge",
    nearby: ['Oakville', 'Hamilton', 'Milton', 'Stoney Creek'],
  },
  mississauga: {
    name: 'Mississauga',
    region: 'Peel Region',
    population: '720,000+',
    tagline: 'Expert Home Services in Mississauga',
    nearby: ['Brampton', 'Oakville', 'Toronto', 'Etobicoke'],
  },
  brampton: {
    name: 'Brampton',
    region: 'Peel Region',
    population: '660,000+',
    tagline: 'Expert Home Service Pros in Brampton',
    nearby: ['Mississauga', 'Caledon', 'Vaughan', 'Etobicoke'],
  },
  hamilton: {
    name: 'Hamilton',
    region: 'Hamilton-Wentworth',
    population: '580,000+',
    tagline: "Hamilton's Top-Rated Home Services",
    nearby: ['Burlington', 'Ancaster', 'Stoney Creek', 'Brantford'],
  },
};

const SERVICES = [
  { slug: 'hvac',             label: 'HVAC',            icon: '❄️', color: 'blue',    desc: 'Furnace, AC, heat pumps & air quality' },
  { slug: 'handyman',         label: 'Handyman',        icon: '🔨', color: 'amber',   desc: 'Mounting, repairs, assembly & painting' },
  { slug: 'plumbing',         label: 'Plumbing',        icon: '🚿', color: 'cyan',    desc: 'Leaks, drains, fixtures & waterlines' },
  { slug: 'electrical',       label: 'Electrical',      icon: '⚡', color: 'yellow',  desc: 'Panel upgrades, outlets, fixtures & EV' },
  { slug: 'appliance-repair', label: 'Appliance Repair',icon: '🔧', color: 'emerald', desc: 'Fridge, washer, stove & dishwasher repair' },
  { slug: 'smart-home',       label: 'Smart Home',      icon: '🏠', color: 'purple',  desc: 'Cameras, thermostats, locks & automation' },
];

const SERVICE_COLOR_CLASSES: Record<string, { badge: string; icon: string }> = {
  blue:    { badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',    icon: 'text-blue-400' },
  amber:   { badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',  icon: 'text-amber-400' },
  cyan:    { badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',    icon: 'text-cyan-400' },
  yellow:  { badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',icon: 'text-yellow-400' },
  emerald: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',icon: 'text-emerald-400' },
  purple:  { badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400',icon: 'text-purple-400' },
};

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us what you need',
    desc: 'Fill out a simple 60-second form describing your issue. No account required.',
    icon: '📝',
  },
  {
    step: '02',
    title: 'We match you with a vetted expert pro',
    desc: 'Our concierge reviews your request and connects you with a background-checked, licensed specialist.',
    icon: '🤝',
  },
  {
    step: '03',
    title: 'Job done — we follow up',
    desc: 'Your pro arrives on time. We check in after the job to ensure you are 100% satisfied.',
    icon: '✅',
  },
];

const TRUST_BADGES = [
  { icon: '🔍', label: 'Background-checked' },
  { icon: '🛡️', label: 'Licensed & insured' },
  { icon: '⭐', label: 'Satisfaction guaranteed' },
  { icon: '🎯', label: 'Expert-matched' },
];

export default function AreaLandingPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const area = areaSlug ? AREA_DATA[areaSlug.toLowerCase()] : undefined;

  if (!area) {
    return (
      <div className="min-h-screen mesh-gradient dark:mesh-gradient-dark flex items-center justify-center px-6">
        <div className="glass dark:glass-dark rounded-[40px] border border-[var(--border-default)] p-16 text-center max-w-md">
          <div className="text-5xl mb-6">📍</div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">Area Coming Soon</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            We're expanding quickly. Enter your postal code on the request form and we'll let you know when The Helper arrives near you.
          </p>
          <Link
            to="/request-service"
            className="inline-block px-8 py-4 bg-[var(--accent)] text-black font-black rounded-[22px] hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Request Service Anyway
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title={`Home Services in ${area.name}, ${area.region} | TheHelper`}
        description={`${area.tagline}. Vetted HVAC, plumbing, electrical, handyman, appliance repair & smart home pros in ${area.name}. Earn 5% cashback on every job.`}
        ogTitle={`Home Services in ${area.name} | TheHelper`}
        ogDescription={`Book verified home service pros in ${area.name}. HVAC, plumbing, electrical, handyman & more — matched, scheduled, and followed up for you.`}
        canonicalPath={`/areas/${areaSlug}`}
      />
    <div className="min-h-screen bg-background mesh-gradient dark:mesh-gradient-dark">
      {/* ── Hero ── */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6">
            {area.region} · {area.population} residents
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-3xl">
            {area.name}'s Home Service{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-rose-400">
              Concierge
            </span>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mb-10">
            {area.tagline}. Expert, vetted pros matched to your job — scheduling, coordination, and follow-up all handled for you.
          </p>

          <Link
            to="/request-service"
            className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-lg hover:shadow-[0_0_30px_rgba(242,181,215,0.4)] transition-all hover:-translate-y-1"
          >
            Request Service in {area.name} →
          </Link>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3">Services in {area.name}</h2>
            <p className="text-[var(--text-secondary)]">Expert pros for every home need.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ slug, label, icon, color, desc }) => {
              const c = SERVICE_COLOR_CLASSES[color];
              return (
                <Link
                  key={slug}
                  to={`/request-service?service=${slug}&postalCode=`}
                  className="group p-8 glass dark:glass-dark rounded-[32px] border border-[var(--border-default)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-5 text-2xl ${c.badge}`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-black mb-2">{label}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{desc}</p>
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.icon} group-hover:underline`}>
                    Book in {area.name} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 bg-[var(--surface-base)]/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tighter mb-3">How The Helper Works</h2>
            <p className="text-[var(--text-secondary)]">Three simple steps to a job well done.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
              <div
                key={step}
                className="glass dark:glass-dark rounded-[32px] border border-[var(--border-default)] p-8 flex flex-col gap-4 animate-in fade-in duration-500"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--accent)]">Step {step}</span>
                </div>
                <h3 className="text-lg font-black leading-tight">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3">Every Pro is Verified</h2>
            <p className="text-[var(--text-secondary)]">Your home is in safe hands — always.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon, label }) => (
              <div
                key={label}
                className="glass dark:glass-dark rounded-[24px] border border-[var(--border-default)] p-6 flex flex-col items-center gap-3 text-center hover:border-[var(--accent)]/50 transition-colors"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-black leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Areas ── */}
      <section className="py-16 px-6 bg-[var(--surface-base)]/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black tracking-tighter mb-6 text-center">Also Serving Nearby</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {area.nearby.map((city) => {
              const slug = city.toLowerCase().replace(/\s+/g, '-');
              const isInData = Object.keys(AREA_DATA).includes(slug);
              return isInData ? (
                <Link
                  key={city}
                  to={`/areas/${slug}`}
                  className="px-5 py-2.5 rounded-full glass dark:glass-dark border border-[var(--border-default)] text-sm font-bold hover:border-[var(--accent)]/60 hover:-translate-y-0.5 transition-all"
                >
                  {city} →
                </Link>
              ) : (
                <span
                  key={city}
                  className="px-5 py-2.5 rounded-full bg-[var(--surface-base)] border border-[var(--border-default)] text-sm font-bold text-[var(--text-secondary)]"
                >
                  {city}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass dark:glass-dark rounded-[40px] border border-[var(--border-default)] p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none rounded-[40px]" />
            <div className="relative">
              <div className="text-5xl mb-6">🏠</div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">
                Ready for a pro in {area.name}?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
                Describe your issue once. We'll match you with the right expert, manage scheduling, and follow up until the job is done.
              </p>
              <Link
                to="/request-service"
                className="inline-block px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-lg hover:shadow-[0_0_30px_rgba(242,181,215,0.4)] transition-all hover:-translate-y-1"
              >
                Get Started — It's Free →
              </Link>
              <p className="mt-4 text-xs text-[var(--text-secondary)]">🎁 Plus earn cashback on every job booked</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
