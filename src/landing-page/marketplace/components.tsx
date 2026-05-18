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
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  Trophy,
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
    "inline-flex items-center justify-center gap-2 rounded-[23px] px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "bg-[#2563EB] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:bg-[#1D4ED8]",
    variant === "secondary" &&
      "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.06)] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]",
    variant === "ghost" && "text-[#475569] hover:bg-[#F8FAFC]",
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-balance text-[34px] font-bold leading-tight text-[#0F172A] sm:text-[42px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-7 text-[#475569]">
          {description}
        </p>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pb-14 pt-10 sm:pb-20 lg:pt-16">
      {/* Subtle blue gradient bloom */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.06),transparent_65%)]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.04),transparent_60%)]" />
      </div>
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        {/* Left column */}
        <div>
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
            <span className="size-2 rounded-full bg-[#22C55E]" />
            Now serving GTA: Milton, Oakville, Burlington
          </div>

          <h1 className="font-display mt-6 max-w-2xl text-balance text-[42px] font-bold leading-[1.05] text-[#0F172A] sm:text-5xl lg:text-6xl">
            Get help with{" "}
            <span className="text-[#2563EB]">anything.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[#475569] sm:text-lg">
            Connect with verified local pros for HVAC, plumbing, electrical, handyman work, and more, right in your neighbourhood.
          </p>

          {/* Reward pill */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-3 py-1.5 text-xs font-semibold text-[#92400E]">
            <Trophy className="size-3.5 text-[#F59E0B]" />
            🏆 Earn reward points on every completed job
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/request-service">
              Get Free Quotes <ArrowRight className="size-4" />
            </Button>
            <Button href="/providers/apply" variant="secondary">
              Join as a Pro
            </Button>
          </div>

          {/* Trust micro-row */}
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm text-[#475569]">
            {[
              "100% Free for Homeowners",
              "Verified Local Pros",
              "Same-Day Available",
              "500+ GTA Homeowners",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#22C55E]">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Live Activity Card */}
        <div className="relative">
          {/* Floating notification */}
          <div className="absolute -top-4 right-4 z-10 hidden rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-lg sm:block">
            <div className="flex items-center gap-2 text-xs">
              <BellRing className="size-4 text-[#2563EB]" />
              <div>
                <p className="font-semibold text-[#0F172A]">Sarah just earned $5!</p>
                <p className="text-[#94A3B8]">AC repair submitted · Milton, ON</p>
              </div>
            </div>
          </div>

          {/* Live activity dark card */}
          <div className="rounded-2xl bg-[#0F172A] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Live requests near you</p>
              <div className="flex items-center gap-1.5 rounded-full bg-[#22C55E]/10 px-2.5 py-1 text-xs font-semibold text-[#22C55E]">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                Live
              </div>
            </div>

            {/* Request rows */}
            <div className="space-y-3">
              {[
                { service: "HVAC repair", area: "Milton", time: "12 min ago", status: "Done ✓", statusColor: "text-[#22C55E]" },
                { service: "Plumbing", area: "Oakville", time: "8 min ago", status: "Active", statusColor: "text-[#F59E0B]" },
                { service: "Handyman", area: "Burlington", time: "just now", status: "New", statusColor: "text-[#60A5FA]" },
              ].map((row) => (
                <div key={row.service} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{row.service}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[#94A3B8]">
                      <MapPin className="size-3" />
                      {row.area} · {row.time}
                    </p>
                  </div>
                  <span className={cn("text-xs font-semibold", row.statusColor)}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Amber callout */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#FDE68A]/30 bg-[#FEF3C7]/10 px-4 py-3">
              <Trophy className="size-4 text-[#F59E0B]" />
              <p className="text-xs font-medium text-[#FDE68A]">James earned $50 this month</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function MarketplaceMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="rounded-[23px] border border-[#E2E8F0] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.10)] sm:p-5">
        <div className="rounded-[19px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:p-4">
          <div className="flex flex-col gap-3 rounded-[22px] border border-[#E2E8F0] bg-white p-3 shadow-[0_4px_12px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 text-[#94A3B8]">
              <Search className="size-5 text-[#475569]" />
              <span className="text-sm">What service do you need?</span>
            </div>
            <button className="rounded-[22px] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">
              Get Free Quotes
            </button>
          </div>
        </div>
      </div>
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
    <article className="rounded-[22px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
      <div className="mb-4 flex size-11 items-center justify-center rounded-[14px] bg-[#EFF6FF] text-[#2563EB]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-pretty text-sm leading-6 text-[#475569]">
        {description}
      </p>
    </article>
  );
}

export function CategoryCard({
  icon,
  name,
  description,
  href,
  imageUrl,
  comingSoon,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  imageUrl?: string;
  comingSoon?: boolean;
}) {
  return (
    <Link to={comingSoon ? "/request-service" : href}>
      <article className="group relative h-full overflow-hidden rounded-[19px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:shadow-[0_8px_24px_rgba(37,99,235,0.10)]">
        {/* Image section */}
        {imageUrl && (
          <div className="relative h-36 w-full overflow-hidden bg-[#F8FAFC]">
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* Icon badge */}
            <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl bg-white/95 text-[#2563EB] shadow-md backdrop-blur-sm">
              {icon}
            </div>
            {/* Coming soon badge */}
            {comingSoon && (
              <div className="absolute right-3 top-3 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[10px] font-semibold text-[#92400E]">
                Coming Soon
              </div>
            )}
          </div>
        )}
        {/* Content section */}
        <div className="p-4">
          {!imageUrl && (
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#EFF6FF] text-[#2563EB] transition duration-200 group-hover:scale-110 group-hover:bg-[#DBEAFE]">
                {icon}
              </div>
              <ArrowRight className="size-4 text-[#BFDBFE] transition duration-200 group-hover:translate-x-1 group-hover:text-[#2563EB]" />
            </div>
          )}
          <div className={cn("flex items-start justify-between gap-2", imageUrl ? "" : "mt-4")}>
            <h3 className="text-base font-semibold text-[#0F172A]">{name}</h3>
            {imageUrl && (
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#BFDBFE] transition duration-200 group-hover:translate-x-1 group-hover:text-[#2563EB]" />
            )}
          </div>
          <p className="mt-1.5 text-sm leading-6 text-[#475569]">{description}</p>
        </div>
      </article>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[19px] border border-[#E2E8F0] bg-white">
      <div className="h-36 w-full bg-[#E2E8F0]" />
      <div className="p-4">
        <div className="h-5 w-24 rounded bg-[#E2E8F0]" />
        <div className="mt-2 h-4 w-full rounded bg-[#E2E8F0]" />
        <div className="mt-1 h-4 w-3/4 rounded bg-[#E2E8F0]" />
      </div>
    </div>
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
    <article className="rounded-[22px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
      <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
        {step}
      </div>
      <h3 className="text-base font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#475569]">{description}</p>
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
          ? "border-white/10 bg-white/8 text-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
          : "border-[#E2E8F0] bg-white text-[#475569]",
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#0F172A] p-6 text-center">
      <p className="font-display text-2xl font-bold tabular-nums text-[#2563EB]">{value}</p>
      <p className="mt-1 text-sm text-[#94A3B8]">{label}</p>
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
    <article className="rounded-[22px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      <p className="mb-3 text-xs font-semibold uppercase text-[#2563EB]">
        Local marketplace foundation
      </p>
      <h3 className="text-lg font-semibold text-[#0F172A]">
        Built around select local providers.
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#475569]">
        The Helper is starting city by city so provider coverage and customer
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
          className="group rounded-[19px] border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-200 open:border-[#BFDBFE] open:shadow-[0_8px_24px_rgba(37,99,235,0.08)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">
            {faq.question}
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] text-[#94A3B8] transition duration-200 group-open:rotate-45 group-open:border-[#BFDBFE] group-open:bg-[#EFF6FF] group-open:text-[#2563EB]">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-[#475569]">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="bg-[#F8FAFC] py-6">
      <Container>
        <div className="relative overflow-hidden rounded-[23px] bg-[#2563EB] p-6 text-center shadow-[0_16px_48px_rgba(37,99,235,0.35)] sm:p-12">
          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_65%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_65%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              <Zap className="size-4" />
              Takes under 2 minutes
            </div>
            <h2 className="font-display mx-auto mt-5 max-w-3xl text-balance text-[34px] font-bold leading-tight text-white sm:text-[42px]">
              Get matched with a verified pro today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-blue-100">
              Join 500+ GTA homeowners who trust The Helper. 100% free to use — earn $60+ back on your first job.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/request-service"
                className="inline-flex items-center justify-center gap-2 rounded-[23px] bg-white px-5 py-3 text-sm font-semibold text-[#2563EB] shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition duration-200 hover:bg-blue-50"
              >
                Get Free Quotes Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/providers/apply"
                className="inline-flex items-center justify-center gap-2 rounded-[23px] border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/20"
              >
                Join as a Pro
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const footerLinks = {
  services: [
    { label: "HVAC", to: "/hvac" },
    { label: "Plumbing", to: "/plumbing" },
    { label: "Electrical", to: "/electrical" },
    { label: "Handyman", to: "/handyman" },
    { label: "Smart Home", to: "/smart-home" },
  ],
  company: [
    { label: "How it works", to: "/how-it-works" },
    { label: "Rewards", to: "/how-rewards-work" },
    { label: "For Pros", to: "/providers" },
    { label: "Areas served", to: "/areas/milton" },
    { label: "Help centre", to: "/help" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#94A3B8]">
      <Container className="border-t border-white/10 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-xl font-bold text-white">The Helper</p>
            <p className="mt-3 max-w-xs text-sm leading-6">
              Canada's trusted platform for home services and local help.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="text-base">🇨🇦</span>
              <span className="text-xs text-[#64748B]">Made in Canada · Serving the GTA</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Services</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Company</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Legal</p>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition duration-150 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center">
          <p>© 2026 The Helper · 🇨🇦 Made in Canada</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="transition duration-150 hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="transition duration-150 hover:text-white">Terms of Service</Link>
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
