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
  blue:    { badge: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]',    icon: 'text-[#2563EB]' },
  amber:   { badge: 'bg-[#FEF3C7] border-[#FDE68A] text-[#F59E0B]',    icon: 'text-[#F59E0B]' },
  cyan:    { badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600',  icon: 'text-cyan-600' },
  yellow:  { badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600', icon: 'text-yellow-600' },
  emerald: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600', icon: 'text-emerald-600' },
  purple:  { badge: 'bg-purple-500/10 border-purple-500/20 text-purple-600', icon: 'text-purple-600' },
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="bg-white rounded-[40px] border border-[#E2E8F0] p-16 text-center max-w-md">
          <div className="text-5xl mb-6">📍</div>
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-[#0F172A]">Area Coming Soon</h1>
          <p className="text-[#475569] mb-8">
            We're expanding quickly. Enter your postal code on the request form and we'll let you know when The Helper arrives near you.
          </p>
          <Link
            to="/request-service"
            className="inline-block px-8 py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] hover:-translate-y-0.5 transition-all"
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ── */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            {area.region} · {area.population} residents
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-8 max-w-3xl text-[#0F172A]">
            {area.name}'s Home Service{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
              Concierge
            </span>
          </h1>

          <p className="text-xl text-[#475569] max-w-2xl mb-10">
            {area.tagline}. Expert, vetted pros matched to your job — scheduling, coordination, and follow-up all handled for you.
          </p>

          <Link
            to="/request-service"
            className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
          >
            Request Service in {area.name} →
          </Link>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">Services in {area.name}</h2>
            <p className="text-[#475569]">Expert pros for every home need.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ slug, label, icon, color, desc }) => {
              const c = SERVICE_COLOR_CLASSES[color];
              return (
                <Link
                  key={slug}
                  to={`/request-service?service=${slug}&postalCode=`}
                  className="group p-8 bg-white rounded-[32px] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-5 text-2xl ${c.badge}`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-[#0F172A]">{label}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{desc}</p>
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
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">How The Helper Works</h2>
            <p className="text-[#475569]">Three simple steps to a job well done.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
              <div
                key={step}
                className="bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] p-8 flex flex-col gap-4 animate-in fade-in duration-500"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#2563EB]">Step {step}</span>
                </div>
                <h3 className="text-lg font-black leading-tight text-[#0F172A]">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">Every Pro is Verified</h2>
            <p className="text-[#475569]">Your home is in safe hands — always.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon, label }) => (
              <div
                key={label}
                className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col items-center gap-3 text-center hover:border-[#BFDBFE] transition-colors"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-sm font-black leading-tight text-[#0F172A]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Areas ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black tracking-tighter mb-6 text-center text-[#0F172A]">Also Serving Nearby</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {area.nearby.map((city) => {
              const slug = city.toLowerCase().replace(/\s+/g, '-');
              const isInData = Object.keys(AREA_DATA).includes(slug);
              return isInData ? (
                <Link
                  key={city}
                  to={`/areas/${slug}`}
                  className="px-5 py-2.5 rounded-full bg-white border border-[#E2E8F0] text-sm font-bold hover:border-[#BFDBFE] hover:text-[#2563EB] hover:-translate-y-0.5 transition-all"
                >
                  {city} →
                </Link>
              ) : (
                <span
                  key={city}
                  className="px-5 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-bold text-[#475569]"
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
          <div className="bg-[#0F172A] rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent pointer-events-none rounded-[40px]" />
            <div className="relative">
              <div className="text-5xl mb-6">🏠</div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">
                Ready for a pro in {area.name}?
              </h2>
              <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
                Describe your issue once. We'll match you with the right expert, manage scheduling, and follow up until the job is done.
              </p>
              <Link
                to="/request-service"
                className="inline-block px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
              >
                Get Started — It's Free →
              </Link>
              <p className="mt-4 text-xs text-[#94A3B8]">🎁 Plus earn cashback on every job booked</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
