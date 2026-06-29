import { Link } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Award,
  CheckCircle2,
  Crown,
  Gift,
  Home,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";
import PageSeo, { createLocalBusinessSchema } from "./components/PageSeo";
import TrustBadges from "./components/TrustBadges";
import {
  CategoryCard,
  Container,
  CTASection,
  Footer,
  SectionHeader,
} from "./marketplace/components";
import { categories } from "./marketplace/content";

// ── Reward tiers ─────────────────────────────────────────────────────────────

const rewardTiers = [
  {
    icon: <Home className="size-5 text-[#93C5FD]" />,
    label: "New Homeowner",
    range: "0 – 499 pts",
    note: "Start earning from your first booking",
  },
  {
    icon: <Star className="size-5 text-[#60A5FA]" />,
    label: "Active Homeowner",
    range: "500 – 1,999 pts",
    note: "Keep going — your next job unlocks more",
  },
  {
    icon: <Award className="size-5 text-[#3B82F6]" />,
    label: "Smart Maintainer",
    range: "2,000 – 4,999 pts",
    note: "You're a regular — thank you",
  },
  {
    icon: <Crown className="size-5 text-[#BFDBFE]" />,
    label: "Home Rewards Pro",
    range: "5,000+ pts",
    note: "Top tier with maximum rewards every time",
  },
];

// ── Trust pillars ────────────────────────────────────────────────────────────

const trustPillars = [
  {
    icon: <ShieldCheck className="size-6 text-[#60A5FA]" />,
    title: "Every pro verified",
    body: "Licenses, insurance, and service area reviewed before they can accept jobs. No exceptions.",
  },
  {
    icon: <Star className="size-6 text-[#60A5FA]" />,
    title: "Real reviews only",
    body: "Ratings come from verified completed jobs. If a job is not done, the review does not post.",
  },
  {
    icon: <MessageSquare className="size-6 text-[#60A5FA]" />,
    title: "All comms in one place",
    body: "Quotes, scheduling, and job updates stay connected to the job. No scattered texts or voicemails.",
  },
  {
    icon: <MapPin className="size-6 text-[#60A5FA]" />,
    title: "GTA built, GTA focused",
    body: "Built for Milton, Oakville, Burlington, Mississauga, and Brampton homeowners first.",
  },
];

// ── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {

  return (
    <>
      <PageSeo
        title="Book a Verified Home Pro | The Helper"
        description="Stop calling around. Submit one request and get matched with a licensed, insured HVAC, plumbing, electrical, or handyman pro in Milton, Oakville & Burlington. 100% free. Earn 6,000 pts on your first completed job (≈ $60 in gift cards)."
        ogTitle="Book a Verified Home Pro | The Helper"
        ogDescription="One request. Matched with a verified local pro quickly. No calling around. 100% free for homeowners. Earn 6,000 pts on your first completed job (≈ $60 in gift cards)."
        canonicalPath="/"
        keywords="home services GTA, find HVAC pro Milton, plumber Oakville, electrician Burlington, handyman GTA, home repair marketplace, verified contractors Toronto"
        structuredData={createLocalBusinessSchema({
          name: "The Helper Home Services",
          description: "Home services marketplace connecting GTA homeowners with vetted local service providers for HVAC, plumbing, electrical, handyman, appliance repair and smart home installation.",
          areaServed: ["Milton", "Oakville", "Burlington", "Mississauga", "Brampton"],
          serviceType: ["HVAC Repair", "Plumbing Services", "Electrical Services", "Handyman Services", "Appliance Repair", "Smart Home Installation"],
        })}
      />

      <main className="min-h-screen bg-white font-sans">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-24">
          {/* Blue radial glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-20 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.07),transparent_60%)]" />
            <div className="absolute -left-20 bottom-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05),transparent_60%)]" />
          </div>

          <Container className="relative grid items-center gap-8 md:gap-12 md:grid-cols-2 lg:gap-16">
            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
                <span className="size-2 rounded-full bg-[#22C55E] inline-block animate-pulse" />
                Now serving GTA · Milton · Oakville · Burlington
              </span>

              <h1 className="mt-5 text-[40px] font-bold leading-[1.08] text-[#0F172A] sm:text-5xl lg:text-[58px]">
                <span className="text-[#2563EB]">Book a verified pro</span>
                <br />
                <span>in Milton, Oakville & Burlington.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#475569] sm:text-lg">
                Submit one request. Get matched with a local pro who's licensed, insured, and ready today. No calling around. No waiting until Monday.
              </p>

              {/* Reward pill — blue only */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]">
                <Gift className="size-4 text-[#2563EB]" />
                Earn 6,000 pts on your first completed job (≈ $60 in gift cards)
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/get-quotes"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_28px_rgba(37,99,235,0.35)] transition duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_12px_36px_rgba(37,99,235,0.45)]"
                >
                  Get matched now
                  <ArrowRight className="size-4" />
                </Link>
                </div>

              {/* Trust micro-row */}
              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-[#475569]">
                {["100% Free for Homeowners", "Licensed & Insured Pros", "Same-Day Service", "Verified Reviews Only"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                      <CheckCircle2 className="size-3" />
                    </span>
                    {item}
                  </span>
                ))}
              </div>

            </div>

            {/* Right — Activity card */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                  alt="Verified professional completing a home service"
                  className="h-72 w-full object-cover sm:h-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 via-transparent to-transparent" />
                <div className="absolute left-4 top-4">
                  <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-semibold text-[#0F172A] shadow-lg backdrop-blur-sm">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#DBEAFE]">
                      <CheckCircle2 className="size-3 text-[#2563EB]" />
                    </span>
                    Sarah earned 500 pts · AC repair · Milton
                  </div>
                </div>
              </div>

              {/* Overlapping white card */}
              <div className="-mt-6 relative z-10 mx-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0F172A]">Live requests near you</p>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                    <span className="size-1.5 rounded-full bg-[#2563EB] inline-block animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { job: "HVAC Repair", loc: "Milton · Matched in 12 min", badge: "Done", cls: "bg-[#DBEAFE] text-[#1D4ED8]" },
                    { job: "Plumbing", loc: "Oakville · Matched in 8 min", badge: "Active", cls: "bg-[#EFF6FF] text-[#2563EB]" },
                    { job: "Handyman", loc: "Burlington · Just now", badge: "New", cls: "border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]" },
                  ].map((row) => (
                    <div key={row.job} className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{row.job}</p>
                        <p className="text-xs text-[#94A3B8]">{row.loc}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.cls}`}>{row.badge}</span>
                    </div>
                  ))}
                </div>
                {/* Blue reward callout */}
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm font-medium text-[#1D4ED8]">
                  <Gift className="size-4 text-[#2563EB] shrink-0" />
                  James earned 5,000 pts cash back this month
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        <section id="services" className="bg-[#F8FAFC] py-16 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="WHAT WE HELP WITH"
              title="Every home service. One platform."
              description="Handyman, HVAC, plumbing, and smart home — all from verified local pros in your neighbourhood. Event Management, IT Services, and Rental Services coming soon."
            />
            {/* 4 live category cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.filter((c) => c.live).map((category) => (
                <CategoryCard
                  key={category.name}
                  icon={category.icon}
                  name={category.name}
                  description={category.description}
                  href={category.href ?? "/get-quotes"}
                  imageUrl={category.imageUrl}
                />
              ))}
            </div>
            {/* 3 coming-soon category cards (greyed out, no detail link) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.filter((c) => c.comingSoon).map((category) => (
                <div
                  key={category.name}
                  className="group relative flex flex-col rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F1F5F9] p-5"
                  aria-label={`${category.name} — coming soon`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/70 text-[#94A3B8]">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#475569]">{category.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#64748B]">{category.description}</p>
                  <div className="mt-auto pt-4">
                    <a
                      href="mailto:hello@thehelper.ca?subject=Notify%20me%20when%20this%20service%20launches"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition duration-150 hover:border-[#94A3B8] hover:text-[#2563EB]"
                    >
                      <BellRing className="size-4" />
                      Notify me
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/get-quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline">
                View all services <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="HOW IT WORKS"
              title="One request. Matched fast."
              description="Submit in under 2 minutes. We handle the matching, scheduling, and follow-up."
            />
            <div className="relative mt-12">
              {/* Connector line */}
              <div className="absolute top-7 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] hidden h-px bg-[#BFDBFE] lg:block" />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { n: "01", title: "Submit your request", desc: "Takes under 2 minutes. Tell us what's broken. 100% free for homeowners." },
                  { n: "02", title: "Get matched fast", desc: "A verified local pro responds quickly. No calling around." },
                  { n: "03", title: "Book a time that works", desc: "Same-day for urgent jobs. Or schedule a window that fits your week." },
                  { n: "04", title: "Job done. Earn rewards.", desc: "6,000 pts on your first completed job (≈ $60 in gift cards). Redeemable once you hit 10,000 pts." },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#BFDBFE] bg-white text-sm font-bold text-[#2563EB] shadow-[0_0_0_6px_#EFF6FF]">
                      {n}
                    </div>
                    <h3 className="mt-5 text-base font-bold text-[#0F172A]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/get-quotes"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition duration-200 hover:bg-[#1D4ED8]"
              >
                Get matched now <ArrowRight className="size-4" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── REWARDS ───────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#93C5FD]">THE HELPER REWARDS</p>
                <h2 className="text-[34px] font-bold leading-tight text-white sm:text-[42px]">
                  The{" "}
                  <strong className="text-[#93C5FD]">only</strong>{" "}
                  platform where you get rewarded for getting things done.
                </h2>
                <p className="mt-4 text-base leading-7 text-[#BFDBFE]">
                  Every completed job earns you points you can redeem for gift cards. The more you use The Helper, the more you save.
                </p>
                <Link
                  to="/how-rewards-work"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1E3A8A] shadow transition duration-150 hover:bg-[#EFF6FF]"
                >
                  Learn about rewards <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {rewardTiers.map((tier) => (
                  <div
                    key={tier.label}
                    className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">{tier.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{tier.label}</p>
                      <p className="text-xs text-[#93C5FD]">{tier.note}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{tier.range}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-[#BFDBFE]">
                  <Gift className="size-4 text-[#60A5FA] shrink-0" />
                  Refer a friend — both of you earn 500 pts when they submit their first request.
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs text-[#93C5FD]">
                  <span>Submit → +500 pts</span>
                  <span className="text-white/20">·</span>
                  <span>Book → +500 pts</span>
                  <span className="text-white/20">·</span>
                  <span>Job done → <strong className="text-[#60A5FA]">+5,000 pts</strong></span>
                  <span className="text-white/20">·</span>
                  <span>Referral → +500 pts each</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── TRUST ─────────────────────────────────────────────────────── */}
        <section className="bg-[#0F172A] py-16 sm:py-20">
          <Container>
            <div className="mb-12 max-w-3xl mx-auto text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#60A5FA]">BUILT ON TRUST</p>
              <h2 className="text-[34px] font-bold leading-tight text-white sm:text-[42px]">Every pro verified. Every job tracked.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-2xl border border-white/8 bg-white/5 p-6 transition duration-200 hover:bg-white/8"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-white/8">{pillar.icon}</div>
                  <h3 className="text-base font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{pillar.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
        <TrustBadges />

        {/* ── PROVIDER CTA BAND ─────────────────────────────────────────── */}
        <section className="bg-white py-12 sm:py-16 border-t border-[#E2E8F0]">
          <Container>
            <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:justify-between">
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                  Local pro? Stop paying for leads that never close.
                </h3>
                <p className="mt-3 text-base text-[#475569]">
                  Get matched with homeowners in your service area who are ready to book. Manage leads, jobs, and reviews in one dashboard.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {[
                    { icon: <BriefcaseBusiness className="size-3.5" />, text: "4 live categories · 3 more coming soon" },
                    { icon: <MapPin className="size-3.5" />, text: "GTA coverage" },
                    { icon: <BadgeCheck className="size-3.5" />, text: "Free to apply" },
                  ].map(({ icon, text }) => (
                    <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                      {icon}{text}
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

        <CTASection />
        <Footer />
      </main>
    </>
  );
}
