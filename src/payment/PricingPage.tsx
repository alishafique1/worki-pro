import { CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { cn } from "../client/utils";

const PROVIDER_PLANS = [
  {
    name: "Starter",
    price: "Free",
    priceSub: "forever",
    description: "Get your profile online and start receiving leads in your area.",
    features: [
      "Profile with business info & photo",
      "Receive up to 5 leads/month",
      "Basic appointment management",
      "5% cashback on completed jobs",
      "Worki verified badge",
    ],
    cta: "Start Free",
    ctaLink: "/providers/apply",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$49",
    priceSub: "/month",
    description: "More leads, more tools to turn them into loyal customers.",
    features: [
      "Everything in Starter",
      "Unlimited leads",
      "Priority placement in search results",
      "Automated SMS/email replies",
      "Customer reviews management",
      "Advanced appointment scheduling",
    ],
    cta: "Apply for Growth",
    ctaLink: "/providers/apply",
    highlighted: true,
  },
  {
    name: "Exclusive",
    price: "$149",
    priceSub: "/month",
    description: "Maximum visibility and full-service support for established businesses.",
    features: [
      "Everything in Growth",
      "Top placement in all category searches",
      "Dedicated account manager",
      "Lead matching before they search",
      "Quarterly business review",
      "Priority support (< 2 hour response)",
    ],
    cta: "Apply for Exclusive",
    ctaLink: "/providers/apply",
    highlighted: false,
  },
];

const CONSUMER_PERKS = [
  {
    icon: "🔍",
    title: "Free to Request",
    desc: "Submit service requests at no cost. You're never charged to ask.",
  },
  {
    icon: "✅",
    title: "Verified Pros",
    desc: "Every pro is background-checked, licensed, and insured.",
  },
  {
    icon: "💰",
    title: "5% Cashback",
    desc: "Earn rewards on every completed job —redeemable toward future services.",
  },
  {
    icon: "⚡",
    title: "Real-Time Matching",
    desc: "Your request is matched to available pros in minutes, not days.",
  },
];

const FAQ = [
  {
    q: "Is Worki really free for homeowners?",
    a: "Yes. Creating a service request is completely free. You only pay the pro directly for the completed work, and earn 5% cashback on every booking through Worki Rewards.",
  },
  {
    q: "How does the 5% cashback work?",
    a: "When you complete a job booked through Worki, you earn cashback points. These are added to your Worki Rewards wallet and can be applied to future service requests.",
  },
  {
    q: "What if I'm not satisfied with a pro?",
    a: "Every pro on Worki is vetted before joining. If you're ever unsatisfied, contact us and we'll make it right.",
  },
  {
    q: "How do I become a Worki pro?",
    a: "Click 'Apply as Pro' below. The Starter plan is free — you can start receiving leads immediately after completing your profile.",
  },
  {
    q: "What areas does Worki serve?",
    a: "Worki currently serves Milton, Oakville, Burlington, Mississauga, Brampton, Hamilton, Toronto, Etobicoke, Caledon, Vaughan, Richmond Hill, Markham, and Scarborough.",
  },
];

export default function PricingPage() {
  const { data: user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--surface-raised)] border-b border-[var(--border-default)]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)] via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Simple, transparent pricing.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            For homeowners: free to request, pay only for work done.<br />
            For pros: a plan that scales with your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/request-service"
              className="px-8 py-4 bg-[var(--accent)] text-[#000] font-bold rounded-[20px] text-base hover:scale-105 transition-transform"
            >
              Request a Service — Free
            </Link>
            <Link
              to="/providers/apply"
              className="px-8 py-4 bg-[var(--surface-base)] border border-[var(--border-default)] font-bold rounded-[20px] text-base hover:border-[var(--accent)] transition-colors"
            >
              Apply as a Pro
            </Link>
          </div>
        </div>
      </div>

      {/* Consumer perks */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Why homeowners love Worki</h2>
          <p className="text-[var(--text-secondary)]">No subscriptions. No hidden fees. Just help when you need it.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONSUMER_PERKS.map((perk) => (
            <div
              key={perk.title}
              className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)] transition-colors"
            >
              <div className="text-3xl mb-4">{perk.icon}</div>
              <h3 className="font-bold text-lg mb-2">{perk.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Provider plans */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">For Service Professionals</h2>
          <p className="text-[var(--text-secondary)]">Grow your client base with Worki's lead-matching platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROVIDER_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-[24px] p-8 flex flex-col",
                plan.highlighted
                  ? "bg-[var(--accent)] text-[#000] ring-4 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface-base)]"
                  : "bg-[var(--surface-raised)] border border-[var(--border-default)]"
              )}
            >
              {plan.highlighted && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#000] text-[var(--accent)] text-xs font-bold rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className={cn("text-xl font-bold mb-1", plan.highlighted ? "text-[#000]" : "")}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-4xl font-black tracking-tight", plan.highlighted ? "text-[#000]" : "")}>
                    {plan.price}
                  </span>
                  <span className={cn("text-sm font-medium", plan.highlighted ? "text-[#000]/70" : "text-[var(--text-secondary)]")}>
                    {plan.priceSub}
                  </span>
                </div>
                <p className={cn("text-sm mt-2 leading-relaxed", plan.highlighted ? "text-[#000]/80" : "text-[var(--text-secondary)]")}>
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle
                      className={cn("w-5 h-5 flex-none mt-0.5", plan.highlighted ? "text-[#000]" : "text-[var(--accent)]")}
                    />
                    <span className={cn("text-sm", plan.highlighted ? "text-[#000]/90" : "")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.ctaLink}
                className={cn(
                  "block w-full text-center px-6 py-4 font-bold rounded-[18px] text-base transition-all",
                  plan.highlighted
                    ? "bg-[#000] text-[var(--accent)] hover:bg-[#111]"
                    : "bg-[var(--accent)] text-[#000] hover:opacity-90"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
          All plans include Worki's 5% customer cashback program.{" "}
          <Link to="/how-rewards-work" className="text-[var(--accent)] font-bold hover:underline">
            How rewards work →
          </Link>
        </p>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Frequently asked questions</h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] p-6"
            >
              <h3 className="font-bold text-base mb-2">{item.q}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div className="bg-[var(--accent)] text-[#000]">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to get started?</h2>
          <p className="text-lg font-medium opacity-80 mb-8">
            Join thousands of GTA homeowners who trust Worki for their home services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/request-service"
              className="px-8 py-4 bg-[#000] text-[var(--accent)] font-bold rounded-[20px] text-base hover:bg-[#111] transition-colors"
            >
              Request a Service — Free
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 bg-transparent border-2 border-[#000] font-bold rounded-[20px] text-base hover:bg-[#000]/10 transition-colors"
            >
              Browse Pros First
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
