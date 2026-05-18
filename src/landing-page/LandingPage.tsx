import { useState } from "react";
import { Link } from "react-router";
import {
  AirVent,
  ArrowRight,
  Hammer,
  ShowerHead,
} from "lucide-react";
import PageSeo, { createLocalBusinessSchema } from "./components/PageSeo";
import {
  Button,
  CategoryCard,
  Container,
  CTASection,
  Footer,
  SectionHeader,
  StepCard,
  TrustBadge,
} from "./marketplace/components";
import { categories } from "./marketplace/content";

// ── Inline search panel ──────────────────────────────────────────────────────

const popularServices = [
  { icon: <AirVent className="size-4" />, name: "AC not cooling", category: "HVAC" },
  { icon: <ShowerHead className="size-4" />, name: "Leaky faucet", category: "Plumbing" },
  { icon: <Hammer className="size-4" />, name: "Fix a door", category: "Handyman" },
];

function SearchPanel() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_rgba(37,99,235,0.10)] transition-all duration-300">
      <div className="p-4 sm:p-6">
        {/* Search input */}
        <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
          <span className="text-lg">🔍</span>
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
            placeholder={`e.g. "AC not cooling", "leaky faucet", "outdoor lighting"…`}
          />
        </div>

        {/* Browse categories */}
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
            Browse Categories
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.href ?? "/request-service"}>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-[#E2E8F0] p-3 text-center transition duration-150 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] cursor-pointer">
                  <span className="text-[#2563EB]">{cat.icon}</span>
                  <span className="text-xs font-medium text-[#0F172A]">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular services */}
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
            Popular Services
          </p>
          <div className="flex flex-col gap-2">
            {popularServices.map((svc) => (
              <Link
                key={svc.name}
                to="/request-service"
                className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] px-4 py-3 transition duration-150 hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  {svc.icon}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0F172A]">{svc.name}</p>
                  <p className="text-xs text-[#94A3B8]">{svc.category}</p>
                </div>
                <ArrowRight className="size-4 text-[#CBD5E1]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Trust tier cards ─────────────────────────────────────────────────────────

const rewardTiers = [
  { emoji: "🏠", label: "New Homeowner", range: "0 – 499 pts", note: "Start earning from your first booking" },
  { emoji: "⭐", label: "Active Homeowner", range: "500 - 1,999 pts", note: "Keep going, your next job unlocks more" },
  { emoji: "🔧", label: "Smart Maintainer", range: "2,000 - 4,999 pts", note: "You're a regular, thank you" },
  { emoji: "🏆", label: "Home Rewards Pro", range: "5,000+ pts", note: "Top tier with maximum rewards every time" },
];

// ── Trust pillars ────────────────────────────────────────────────────────────

const trustPillars = [
  { emoji: "🛡️", title: "Verified providers", body: "Credentials, insurance, and service areas reviewed before approval." },
  { emoji: "⭐", title: "Real reviews", body: "Ratings from verified completed jobs. No fake reviews, ever." },
  { emoji: "💬", title: "Secure messaging", body: "All communication stays connected to the job, in one place." },
  { emoji: "🇨🇦", title: "Canadian owned", body: "Built for Canadian homeowners. GTA-first, growing city by city." },
];

// ── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "Found an HVAC tech in 3 hours. AC fixed same day. And I earned reward points I didn't even expect.",
    name: "Sarah M.",
    city: "Milton",
  },
  {
    quote: "One request, no calling around. Matched, booked, done. The referral bonus was a nice touch too.",
    name: "James K.",
    city: "Oakville",
  },
  {
    quote: "A platform that actually vets who they send. The rewards program is a great bonus.",
    name: "Priya S.",
    city: "Burlington",
  },
];

// ── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <PageSeo
        title="The Helper | Home Services in Milton, Oakville & Burlington"
        description="Find verified HVAC, plumbing, electrical, handyman & smart home pros in the GTA. Get matched with local experts, book appointments, and earn rewards on every job. Serving Milton, Oakville & Burlington."
        ogTitle="The Helper | Home Services Marketplace in GTA"
        ogDescription="Connect with vetted local pros for HVAC, plumbing, electrical, handyman & more. Serving Milton, Oakville & Burlington homeowners."
        canonicalPath="/"
        keywords="home services GTA, HVAC Milton, plumber Oakville, electrician Burlington, handyman GTA, home repair services, verified contractors Toronto"
        structuredData={createLocalBusinessSchema({
          name: 'The Helper Home Services',
          description: 'Home services marketplace connecting GTA homeowners with vetted local service providers for HVAC, plumbing, electrical, handyman, appliance repair and smart home installation.',
          areaServed: ['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton'],
          serviceType: ['HVAC Repair', 'Plumbing Services', 'Electrical Services', 'Handyman Services', 'Appliance Repair', 'Smart Home Installation'],
        })}
      />
      <main className="min-h-screen bg-[#F8FAFC] font-sans">

        {/* ── Section 1: Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white pt-10 pb-14 sm:pt-14 sm:pb-20">
          {/* Subtle blue bloom */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.06),transparent_65%)]" />
            <div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.04),transparent_65%)]" />
          </div>

          <Container className="relative grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left column */}
            <div>
              {/* Location badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
                <span className="size-2 rounded-full bg-[#22C55E] inline-block" />
                Now serving GTA: Milton, Oakville, Burlington
              </span>

              {/* H1 - Conversion focused headline */}
              <h1 className="mt-5 text-[38px] font-bold leading-[1.1] text-[#0F172A] sm:text-5xl lg:text-[56px]">
                One call.{" "}
                <span className="text-[#2563EB]">Verified pros.</span>{" "}
                <span className="whitespace-nowrap">Same day.</span>
              </h1>

              {/* Subhead */}
              <p className="mt-4 max-w-lg text-base leading-7 text-[#475569] sm:text-lg">
                Stop calling around. Submit one request, get matched with a verified local pro in minutes, and book same-day service.
              </p>

              {/* Amber reward pill */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-4 py-2 text-sm font-medium text-[#92400E]">
                Earn $60+ cash back on your first completed job
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/request-service"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_12px_32px_rgba(37,99,235,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                >
                  Get Free Quotes Now
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  onClick={() => setShowSearch((v) => !v)}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-[#E2E8F0] bg-white px-6 py-3.5 text-sm font-semibold text-[#475569] transition duration-150 hover:border-[#BFDBFE] hover:text-[#2563EB]"
                >
                  Browse services
                </button>
              </div>

              {/* Trust micro-row */}
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#475569]">
                {[
                  "100% Free for Homeowners",
                  "Verified & Insured Pros",
                  "Same-Day Service",
                  "4.9 Average Rating",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#22C55E] text-xs font-bold">✓</span>
                    {item}
                  </span>
                ))}
              </div>

              {/* Inline search panel */}
              {showSearch && <SearchPanel />}
            </div>

            {/* Right column — Live Activity Card */}
            <div className="relative">
              {/* Floating notification */}
              <div className="absolute -top-3 left-0 z-10 sm:-top-4 sm:left-4">
                <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#475569] shadow-lg animate-[bounce_3s_ease-in-out_infinite]">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#DCFCE7] text-sm">✓</span>
                  Sarah just earned $5! · AC repair · Milton
                </div>
              </div>

              {/* Card */}
              <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_64px_rgba(15,23,42,0.10)] sm:mt-10">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-[#0F172A]">Live requests near you</p>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#16A34A]">
                    <span className="size-1.5 rounded-full bg-[#22C55E] inline-block animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Request rows */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">HVAC Repair</p>
                      <p className="text-xs text-[#94A3B8]">Milton · Matched in 12 min</p>
                    </div>
                    <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#16A34A]">Done</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Plumbing</p>
                      <p className="text-xs text-[#94A3B8]">Oakville · Matched in 8 min</p>
                    </div>
                    <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">Active</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Handyman</p>
                      <p className="text-xs text-[#94A3B8]">Burlington · Just now</p>
                    </div>
                    <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-semibold text-[#92400E]">New</span>
                  </div>
                </div>

                {/* Bottom amber callout */}
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FEF3C7] px-4 py-3 text-sm font-medium text-[#92400E]">
                  James earned $50 this month from completed jobs
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Section 2: Services ──────────────────────────────────────── */}
        <section id="services" className="py-16 sm:py-20 bg-[#F8FAFC]">
          <Container>
            <SectionHeader
              eyebrow="WHAT WE HELP WITH"
              title="Every service. One platform."
              description="HVAC, plumbing, electrical, handyman, and more. All from verified local pros."
            />
            {/* Featured services - first 6 with images */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.filter(c => c.live).map((category) => (
                <CategoryCard
                  key={category.name}
                  icon={category.icon}
                  name={category.name}
                  description={category.description}
                  href={category.href ?? "/request-service"}
                  imageUrl={category.imageUrl}
                />
              ))}
            </div>
            {/* Coming soon services */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">Coming Soon</p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {categories.filter(c => c.comingSoon).slice(0, 6).map((category) => (
                  <Link
                    key={category.name}
                    to="/request-service"
                    className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 transition duration-150 hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  >
                    <span className="text-[#2563EB]">{category.icon}</span>
                    <span className="text-sm font-medium text-[#475569]">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                to="/request-service"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
              >
                View all services <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Section 3: How It Works ──────────────────────────────────── */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-[#F8FAFC]">
          <Container>
            <SectionHeader
              eyebrow="HOW IT WORKS"
              title="Submit. Match. Book. Done."
              description="Get connected to a verified local pro in under 15 minutes. 100% free for homeowners."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StepCard
                step="01"
                title="Submit your request"
                description="Takes under 2 minutes. 100% free, no credit card required."
              />
              <StepCard
                step="02"
                title="Get matched fast"
                description="A verified local pro responds, typically within 15 minutes."
              />
              <StepCard
                step="03"
                title="Book same-day or later"
                description="Pick a time that works. Urgent? Same-day service available."
              />
              <StepCard
                step="04"
                title="Job done. Get rewarded."
                description="Earn $60+ back on your first completed job. No extra steps."
              />
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/request-service"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition duration-200 hover:bg-[#1D4ED8]"
              >
                Get Started Now <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Section 4: Rewards ───────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8]">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              {/* Left */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#93C5FD]">
                  THE HELPER REWARDS
                </p>
                <h2 className="text-[34px] font-bold leading-tight text-white sm:text-[42px]">
                  The{" "}
                  <strong className="text-[#FCD34D]">only</strong>{" "}
                  platform where you get rewarded for getting things done.
                </h2>
                <p className="mt-4 text-base leading-7 text-[#BFDBFE]">
                  Every completed job earns you real cash back, redeemable as gift cards. The more you use The Helper, the more you save.
                </p>
                <Link
                  to="/how-rewards-work"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1E3A8A] shadow transition duration-150 hover:bg-[#EFF6FF]"
                >
                  Learn about rewards <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Right — tier cards */}
              <div className="flex flex-col gap-3">
                {rewardTiers.map((tier) => (
                  <div
                    key={tier.label}
                    className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm"
                  >
                    <span className="text-2xl">{tier.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{tier.label}</p>
                      <p className="text-xs text-[#93C5FD]">{tier.note}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      {tier.range}
                    </span>
                  </div>
                ))}

                {/* Referral callout */}
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#FDE68A]/40 bg-[#FEF3C7]/10 px-5 py-3 text-sm font-medium text-[#FCD34D]">
                  🎁 Refer a friend. Both of you earn $5 when they submit their first request.
                </div>

                {/* Earning summary */}
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-[#BFDBFE]">
                  <span>Submit a request → +$5</span>
                  <span className="text-white/30">·</span>
                  <span>Appointment booked → +$5</span>
                  <span className="text-white/30">·</span>
                  <span>Job completed → <strong className="text-[#FCD34D]">+$50</strong></span>
                  <span className="text-white/30">·</span>
                  <span>Referral → +$5 each</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Section 5: Trust ─────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-[#0F172A]">
          <Container>
            <div className="mb-10 max-w-3xl mx-auto text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#93C5FD]">
                BUILT ON TRUST
              </p>
              <h2 className="text-[34px] font-bold leading-tight text-white sm:text-[42px]">
                Every pro verified. Every job tracked.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-200 hover:bg-white/8"
                >
                  <span className="text-2xl">{pillar.emoji}</span>
                  <h3 className="mt-3 text-base font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{pillar.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Section 6: Testimonials ──────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-white">
          <Container>
            <SectionHeader
              eyebrow="WHAT HOMEOWNERS SAY"
              title="Trusted by GTA homeowners."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {testimonials.map((t) => (
                <article
                  key={t.name}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#F59E0B] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-[#475569]">"{t.quote}"</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                      <p className="text-xs text-[#94A3B8]">{t.city}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Section 7: Provider CTA Band ─────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-[#EFF6FF] to-[#F0F9FF]">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left lg:justify-between">
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                  Are you a local pro? Join The Helper network.
                </h3>
                <p className="mt-3 text-base text-[#475569]">
                  Get matched with qualified leads in your service area. Manage bookings, messages, and reviews, all in one place.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {["6 service categories", "GTA coverage", "Free to apply"].map((stat) => (
                    <span
                      key={stat}
                      className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/providers/apply"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0F172A] px-7 py-3.5 text-sm font-semibold text-white shadow transition duration-150 hover:bg-[#1E293B]"
              >
                Apply as a Pro <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Section 8: Final CTA ─────────────────────────────────────── */}
        <CTASection />

        {/* ── Section 9: Footer ────────────────────────────────────────── */}
        <Footer />
      </main>
    </>
  );
}
