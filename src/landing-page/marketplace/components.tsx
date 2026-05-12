import React from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarCheck,
  Check,
  ClipboardList,
  Clock3,
  Home,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { cn } from "../../client/utils";

export type LandingButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className,
}: LandingButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-[23px] px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B5D7] disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "btn-shine bg-[#F2B5D7] text-[#0C110F] shadow-[0_18px_44px_rgba(242,181,215,0.35)] hover:bg-[#f5c6e1] hover:shadow-[0_22px_52px_rgba(242,181,215,0.5)]",
    variant === "secondary" &&
      "border border-[#E8E2DE] bg-[#FEFEFD] text-[#232323] shadow-[0_12px_32px_rgba(12,17,15,0.08)] hover:bg-white hover:border-[#D4CCC8]",
    variant === "ghost" && "text-[#5C5B60] hover:bg-[#FEFEFD]",
    className,
  );

  if (href) {
    return (
      <Link to={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles}>
      {children}
    </button>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9E9EA7]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-balance text-[34px] font-bold leading-tight text-[#1D1C27] sm:text-[42px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-7 text-[#797886]">
          {description}
        </p>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#000000] pb-14 pt-10 sm:pb-20 lg:pt-16">
      {/* Atmospheric gradient bloom */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(242,181,215,0.18),transparent_65%)]" />
        <div className="absolute right-0 top-0 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(254,254,253,0.06),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(242,181,215,0.08),transparent_70%)]" />
      </div>
      <Container className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="text-[#FEFEFD]">
          <TrustBadge
            icon={<Sparkles className="size-4" />}
            label="Verified local pros, matched to your job"
            dark
          />
          <h1 className="font-display mt-6 max-w-3xl text-balance text-[42px] font-bold leading-[1.04] text-[#FEFEFD] sm:text-6xl lg:text-7xl">
            The right pro, matched and vetted —
            <br />
            <span className="text-[#F2B5D7]">for every job at home.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#CCC9D8] sm:text-lg">
            One request. One verified pro. GTA West only.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/request-service">
              Request a Pro <ArrowRight className="size-4" />
            </Button>
            <Button href="/providers/apply" variant="secondary">
              Become a Provider
            </Button>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-3">You earn points on every completed job.</p>
          <div className="mt-7 grid gap-3 text-sm text-[#B7B7B7] sm:grid-cols-2">
            {[
              "Licensed & insured pros",
              "Verified pros only",
              "Matched to your job",
              "Free to request",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#F2B5D7] text-[#0C110F]">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="animate-float">
          <MarketplaceMockup />
        </div>
      </Container>
    </section>
  );
}

export function MarketplaceMockup() {
  const providers = [
    {
      name: "HVAC repair",
      type: "Heating, cooling, maintenance",
      meta: "Service category selected",
    },
    {
      name: "Plumbing",
      type: "Leaks, drains, fixtures",
      meta: "Postal code captured",
    },
    {
      name: "Handyman",
      type: "Handyman",
      meta: "Schedule preference added",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -right-3 top-10 hidden rounded-[22px] border border-white/10 bg-[#1B1B1C] px-4 py-3 text-sm text-[#FEFEFD] shadow-2xl sm:block">
        <div className="flex items-center gap-2">
          <BellRing className="size-4 text-[#F2B5D7]" /> Request update
        </div>
      </div>
      <div className="rounded-[23px] border border-[#252327] bg-[#FEFEFD] p-3 shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:p-5">
        <div className="rounded-[19px] border border-[#EEE9E5] bg-[#FBF8F6] p-3 sm:p-4">
          <div className="flex flex-col gap-3 rounded-[22px] border border-[#E8E2DE] bg-white p-3 shadow-[0_14px_34px_rgba(12,17,15,0.08)] sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 text-[#797886]">
              <Search className="size-5 text-[#5C5B60]" />
              <span className="text-sm">What service do you need?</span>
            </div>
            <button className="rounded-[22px] bg-[#F2B5D7] px-4 py-2 text-sm font-semibold text-[#0C110F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B5D7]">
              Start request
            </button>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {providers.map((provider) => (
                <ProviderCard key={provider.name} {...provider} />
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-[19px] border border-[#E8E2DE] bg-white p-4 shadow-[0_14px_34px_rgba(12,17,15,0.07)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#232323]">
                    Request details
                  </p>
                  <SlidersHorizontal className="size-4 text-[#9E9EA7]" />
                </div>
                <div className="mt-4 space-y-3">
                  {providers.slice(0, 2).map((provider) => (
                    <div
                      key={provider.name}
                      className="flex items-center justify-between rounded-[14px] bg-[#FBF8F6] px-3 py-2 text-sm"
                    >
                      <span className="text-[#5C5B60]">{provider.meta}</span>
                      <span className="font-semibold tabular-nums text-[#232323]">
                        Added
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[19px] border border-[#E8E2DE] bg-[#1B1B1C] p-4 text-[#FEFEFD] shadow-[0_14px_34px_rgba(12,17,15,0.16)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Request status</p>
                  <CalendarCheck className="size-4 text-[#F2B5D7]" />
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#CCC9D8]">
                  <StatusLine done label="Service selected" />
                  <StatusLine done label="Details captured" />
                  <StatusLine label="Ready to submit" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({
  name,
  type,
  meta,
}: {
  name: string;
  type: string;
  meta: string;
}) {
  return (
    <div className="rounded-[19px] border border-[#E8E2DE] bg-white p-4 shadow-[0_14px_34px_rgba(12,17,15,0.07)]">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-[14px] bg-[#F2B5D7] text-[#0C110F]">
          <Home className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-[#232323]">
              {name}
            </p>
          </div>
          <p className="mt-1 text-xs text-[#797886]">{type}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#797886]">
            <span className="rounded-[22px] bg-[#FBF8F6] px-2 py-1">
              {meta}
            </span>
            <span className="rounded-[22px] bg-[#FBF8F6] px-2 py-1">
              Supported
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusLine({
  label,
  done = false,
}: {
  label: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border",
          done
            ? "border-[#F2B5D7] bg-[#F2B5D7] text-[#0C110F]"
            : "border-[#797886]",
        )}
      >
        {done && <Check className="size-3" />}
      </span>
      {label}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[22px] border border-[#E8E2DE] bg-[#FEFEFD] p-5 shadow-[0_20px_45px_rgba(12,17,15,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(12,17,15,0.1)]">
      <div className="mb-4 flex size-11 items-center justify-center rounded-[14px] bg-[#F8E1EF] text-[#0C110F]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#232323]">{title}</h3>
      <p className="mt-2 text-pretty text-sm leading-6 text-[#797886]">
        {description}
      </p>
    </article>
  );
}

export function CategoryCard({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) {
  return (
    <article className="card-glow-pink group rounded-[19px] border border-[#E8E2DE] bg-white p-4 shadow-[0_14px_32px_rgba(12,17,15,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#FBF8F6] text-[#5C5B60] transition duration-200 group-hover:bg-[#F8E1EF] group-hover:text-[#0C110F] group-hover:scale-110">
          {icon}
        </div>
        <ArrowRight className="size-4 text-[#C7C0BC] transition duration-200 group-hover:translate-x-1 group-hover:text-[#F2B5D7]" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#232323]">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-[#797886]">{description}</p>
    </article>
  );
}

export function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[22px] border border-[#E8E2DE] bg-white p-5 shadow-[0_18px_40px_rgba(12,17,15,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(12,17,15,0.1)]">
      <div className="mb-4 inline-flex rounded-[22px] bg-[#1B1B1C] px-3 py-1 text-xs font-semibold tracking-wider text-[#F2B5D7]">
        {step}
      </div>
      <h3 className="text-base font-semibold text-[#232323]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#797886]">{description}</p>
    </article>
  );
}

export function TrustBadge({
  icon,
  label,
  dark = false,
}: {
  icon: React.ReactNode;
  label: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[22px] border px-3 py-2 text-xs font-semibold tracking-wide",
        dark
          ? "border-[#F2B5D7]/20 bg-[#F2B5D7]/8 text-[#F2B5D7] shadow-[0_0_20px_rgba(242,181,215,0.12)]"
          : "border-[#E8E2DE] bg-[#FEFEFD] text-[#5C5B60]",
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#0E0D0F] p-6 text-center">
      <p className="font-display text-2xl font-bold tabular-nums text-[#F2B5D7]">{value}</p>
      <p className="mt-1 text-sm text-[#9E9EA7]">{label}</p>
    </div>
  );
}

export function ProviderBenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <FeatureCard
      icon={<UserCheck className="size-5" />}
      title={title}
      description={description}
    />
  );
}

export function TestimonialCard() {
  return (
    <article className="rounded-[22px] border border-[#E8E2DE] bg-[#FEFEFD] p-6 shadow-[0_20px_45px_rgba(12,17,15,0.06)]">
      <p className="mb-3 text-xs font-semibold uppercase text-[#9E9EA7]">
        Local marketplace foundation
      </p>
      <h3 className="text-lg font-semibold text-[#232323]">
        Built around select local providers.
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#797886]">
        TheHelper is starting city by city so provider coverage and customer
        trust can grow around real requests.
      </p>
    </article>
  );
}

export function FAQAccordion({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-[19px] border border-[#E8E2DE] bg-[#FEFEFD] p-5 shadow-[0_14px_34px_rgba(12,17,15,0.05)] open:border-[#F2B5D7]/40 open:shadow-[0_14px_34px_rgba(242,181,215,0.1)] transition-all duration-200"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#232323] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B5D7]">
            {faq.question}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#E8E2DE] text-[#9E9EA7] transition duration-200 group-open:rotate-45 group-open:border-[#F2B5D7]/40 group-open:bg-[#FBF8F6] group-open:text-[#232323]">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-[#797886]">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="bg-[#000000] py-6">
      <Container>
        <div className="relative overflow-hidden rounded-[23px] border border-white/10 bg-[#0E0D0F] p-6 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-12">
          {/* Pink bloom top-left */}
          <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(242,181,215,0.18),transparent_65%)]" />
          {/* Pink bloom bottom-right */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(242,181,215,0.12),transparent_65%)]" />
          <div className="relative">
            <TrustBadge
              dark
              icon={<Zap className="size-4" />}
              label="Takes less than 30 seconds"
            />
            <h2 className="font-display mx-auto mt-5 max-w-3xl text-balance text-[34px] font-bold leading-tight text-[#FEFEFD] sm:text-[42px]">
              Ready to get it handled?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-[#CCC9D8]">
              Submit your first request and get matched with a verified local pro. Providers — apply to join a flexible marketplace built for local pros.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/request-service">Get Your Pro</Button>
              <Button href="/providers/apply" variant="secondary">
                Become a Provider
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const footerLinks = {
  services: [
    { label: "HVAC Repair", to: "/hvac" },
    { label: "Plumbing", to: "/plumbing" },
    { label: "Electrical", to: "/electrical" },
    { label: "Handyman", to: "/handyman" },
    { label: "Appliance Repair", to: "/appliance-repair" },
    { label: "Smart Home", to: "/smart-home" },
  ],
  cities: [
    { label: "Milton", to: "/areas/milton" },
    { label: "Oakville", to: "/areas/oakville" },
    { label: "Burlington", to: "/areas/burlington" },
    { label: "Mississauga", to: "/areas/mississauga" },
    { label: "Brampton", to: "/areas/brampton" },
    { label: "Hamilton", to: "/areas/hamilton" },
  ],
  company: [
    { label: "How It Works", to: "/how-it-works" },
    { label: "Rewards", to: "/how-rewards-work" },
    { label: "For Pros", to: "/providers" },
    { label: "Apply as Pro", to: "/providers/apply" },
    { label: "Contact", to: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#000000] text-[#9E9EA7]">
      <Container className="border-t border-white/10 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-[#FEFEFD]">TheHelper</p>
            <p className="mt-3 max-w-xs text-sm leading-6">
              Verified home service pros in the GTA. Licensed, insured, and matched to your job.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#F2B5D7] text-[#0C110F]">
                <Check className="size-3" />
              </span>
              <span className="text-xs text-[#B7B7B7]">Serving the Greater Toronto Area</span>
            </div>
          </div>
          {/* Services */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#FEFEFD]">Services</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-[#FEFEFD]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Cities */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#FEFEFD]">Service Areas</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.cities.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-[#FEFEFD]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#FEFEFD]">Company</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-[#FEFEFD]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} TheHelper. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-[#FEFEFD] transition duration-150">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#FEFEFD] transition duration-150">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export const marketplaceIcons = {
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Clock3,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
};
