import {
  ShieldCheck,
  Bolt,
  HardHat,
  BadgeCheck,
  Search,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";
import { Container, SectionHeader } from "../marketplace/components";

// ── Trust badges ────────────────────────────────────────────────────────────
// Replaces the prior 3-card testimonial section. Each badge is a single
// licensing/insurance signal — verifiable on a public registry, not a quote
// from a person.

const trustBadges = [
  {
    icon: <ShieldCheck className="size-7 text-[#2563EB]" />,
    title: "TSSA-licensed",
    body: "Gas techs verified against the Ontario Technical Standards & Safety Authority public registry.",
    href: "https://www.tssa.org/en/contractor-search",
    hrefLabel: "Verify on TSSA",
  },
  {
    icon: <Bolt className="size-7 text-[#2563EB]" />,
    title: "ESA-licensed electricians",
    body: "Every electrician holds a valid Electrical Safety Authority licence number on file.",
    href: "https://esasafe.com/contractor-search/",
    hrefLabel: "Verify on ESA",
  },
  {
    icon: <HardHat className="size-7 text-[#2563EB]" />,
    title: "WSIB-insured contractors",
    body: "Active WSIB clearance certificates are checked before any pro can accept jobs.",
    href: "https://eservices.wsib.on.ca/portal/",
    hrefLabel: "Verify on WSIB",
  },
  {
    icon: <BadgeCheck className="size-7 text-[#2563EB]" />,
    title: "Reviews from real, completed jobs",
    body: "Ratings only post after a job is marked done by both the homeowner and the pro.",
    href: "/how-rewards-work",
    hrefLabel: "How reviews work",
  },
];

// ── "How we verify pros" 3-step explainer ────────────────────────────────────

const verifySteps = [
  {
    icon: <Search className="size-5 text-[#2563EB]" />,
    title: "License check",
    body: "TSSA / ESA / trade licences are matched against the public registry within 24–48 hours.",
  },
  {
    icon: <ClipboardCheck className="size-5 text-[#2563EB]" />,
    title: "Insurance + WSIB",
    body: "Liability coverage and an active WSIB clearance certificate are uploaded and re-checked yearly.",
  },
  {
    icon: <UserCheck className="size-5 text-[#2563EB]" />,
    title: "Background check",
    body: "Identity + background screening on every pro before they can see or accept a request.",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="LICENSED. INSURED. VERIFIED."
          title="Every pro is verified before they can accept a job."
          description="Real licensing bodies, real insurance, real reviews — not marketing claims."
        />

        {/* ── Badge row ─────────────────────────────────────────────── */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <article
              key={badge.title}
              className="flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition duration-200 hover:border-[#BFDBFE] hover:shadow-[0_8px_28px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#EFF6FF]">
                {badge.icon}
              </div>
              <h3 className="text-base font-semibold text-[#0F172A]">
                {badge.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#475569]">
                {badge.body}
              </p>
              <a
                href={badge.href}
                target={badge.href.startsWith("http") ? "_blank" : undefined}
                rel={badge.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline"
              >
                {badge.hrefLabel}
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

        {/* ── How we verify pros ─────────────────────────────────────── */}
        <div className="mt-14">
          <div className="mb-6 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
              HOW WE VERIFY PROS
            </p>
            <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
              Three checks before a pro sees your request.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {verifySteps.map((step, idx) => (
              <div
                key={step.title}
                className="flex h-full gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-[#94A3B8]">
                      STEP {idx + 1}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-[#0F172A]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#475569]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}