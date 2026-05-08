import {
  Button,
  CategoryCard,
  Container,
  CTASection,
  FAQAccordion,
  FeatureCard,
  Footer,
  Hero,
  ProviderBenefitCard,
  SectionHeader,
  StatsCard,
  StepCard,
  TrustBadge,
} from "./marketplace/components";
import { categories, faqs, providerBenefits } from "./marketplace/content";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarCheck,
  Clock3,
  CreditCard,
  Gift,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

const howItWorks = [
  {
    step: "01",
    title: "Describe your task",
    description:
      "Tell Taskora what you need done, where you are, and when you are available.",
  },
  {
    step: "02",
    title: "AI helps you get it right",
    description:
      "Our AI assistant refines your request so the right pro gets the full context before they show up.",
  },
  {
    step: "03",
    title: "Match with a verified pro",
    description:
      "Taskora connects your request to a verified local professional for your category and area.",
  },
  {
    step: "04",
    title: "Job done. Cashback earned.",
    description:
      "Every task completed through Taskora gets you 5% cashback — on top of your credit card rewards.",
  },
];

const painPoints = [
  {
    icon: <Clock3 className="size-5" />,
    pain: "Hours spent finding a pro",
    solution: "One request, we match you",
  },
  {
    icon: <ShieldCheck className="size-5" />,
    pain: "No idea if they're qualified",
    solution: "Verified before they work",
  },
  {
    icon: <Zap className="size-5" />,
    pain: "Rewards cards give 1-2% back",
    solution: "Taskora stacks 5% cashback on top",
  },
];

const comingSoon = [
  {
    icon: <Bot className="size-5" />,
    title: "AI chat assistant",
    description:
      "A conversational assistant that helps you describe, scope, and submit your task in under 60 seconds.",
  },
  {
    icon: <Zap className="size-5" />,
    title: "Instant pro matching",
    description:
      "Smart matching surfaces the best-fit verified provider for your category, location, and schedule.",
  },
  {
    icon: <Star className="size-5" />,
    title: "Ratings & reviews",
    description:
      "Transparent provider ratings from real completed jobs so trust is built into every booking.",
  },
  {
    icon: <Trophy className="size-5" />,
    title: "Rewards milestones",
    description:
      "Track your progress toward rewards and unlock benefits the more tasks you complete.",
  },
  {
    icon: <MessageSquareText className="size-5" />,
    title: "In-app messaging",
    description:
      "Message your pro directly through Taskora without back-and-forth phone calls or texts.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Expanded service areas",
    description:
      "Taskora is growing city by city. More coverage is coming to your area soon.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#000000] font-sans selection:bg-[#F2B5D7] selection:text-[#0C110F]">
      <Hero />

      <section className="bg-[#000000] pb-6">
        <Container>
          <div className="grid gap-3 rounded-[23px] border border-white/10 bg-[#1B1B1C] p-3 sm:grid-cols-3 sm:p-4">
            <StatsCard value="AI-assisted" label="Lead intake & matching" />
            <StatsCard value="Verified only" label="Pro onboarding" />
            <StatsCard value="Every task" label="Earns you rewards" />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#FEFEFD] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="How Taskora works"
            title="From task to done — with rewards along the way."
            description="Taskora turns a home service request into a structured, AI-assisted intake so verified pros get what they need from the start."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <StepCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Pain Points */}
      <section className="bg-[#000000] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Why Taskora"
            title="Tired of the home service grind?"
            description="Finding reliable help shouldn't be this hard."
            className="text-[#FEFEFD] [&_h2]:text-[#FEFEFD] [&_p]:text-[#CCC9D8]"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {painPoints.map((point) => (
              <div
                key={point.pain}
                className="rounded-[22px] border border-white/10 bg-[#1B1B1C] p-5"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-[14px] bg-[#F8E1EF] text-[#0C110F]">
                  {point.icon}
                </div>
                <p className="text-sm font-semibold text-[#FEFEFD]">{point.pain}</p>
                <p className="mt-2 text-xs text-[#B7B7B7]">→ {point.solution}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Service categories */}
      <section id="services" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Service categories"
            title="What can Taskora help you with today?"
            description="Request HVAC, handyman, plumbing, electrical, appliance repair, or smart home help through the live intake form."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                icon={category.icon}
                name={category.name}
                description={category.description}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/get-a-pro">
              Get Your Pro Today <ArrowRight className="size-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Coming soon */}
      <section className="bg-[#000000] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="What's coming to Taskora"
            title="A flexible marketplace built for the way you actually get things done."
            description="We're shipping fast. These features are in the pipeline — submit your first request now and be first in line when they go live."
            className="text-[#FEFEFD] [&_h2]:text-[#FEFEFD] [&_p]:text-[#CCC9D8]"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Rewards */}
      <section className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <TrustBadge
                icon={<Trophy className="size-4" />}
                label="Rewards program"
              />
              <SectionHeader
                align="left"
                title="Every task earns you cashback"
                description="The more you get done through Taskora, the more you earn. Request a service today and start building toward your first reward."
                className="mt-5"
              />
              <Button href="/get-a-pro" className="mt-6">
                Start Earning Today
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<BadgeCheck className="size-5" />}
                title="5% cashback on every job"
                description="Earn 5% back on every home service job you complete through Taskora."
              />
              <FeatureCard
                icon={<Gift className="size-5" />}
                title="Gift card rewards"
                description="Redeem your cashback for gift cards to popular retailers."
              />
              <FeatureCard
                icon={<Sparkles className="size-5" />}
                title="$60 welcome bonus"
                description="Complete your first task and get a bonus loaded to your account."
              />
              <FeatureCard
                icon={<CreditCard className="size-5" />}
                title="Stack on credit card points"
                description="Use your rewards credit card AND Taskora — stack the benefits."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* For providers */}
      <section id="providers" className="bg-[#FEFEFD] py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <TrustBadge
                icon={<MapPin className="size-4" />}
                label="Provider applications open"
              />
              <SectionHeader
                align="left"
                title="Apply to become a Taskora provider."
                description="Providers can apply to be considered for categories and service areas supported by the marketplace."
                className="mt-5"
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/providers/apply">Become a Provider</Button>
                <Button href="/request-service" variant="secondary">
                  Request Service
                </Button>
              </div>
              <p className="mt-4 text-sm text-[#797886]">
                Provider availability depends on category and service area.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {providerBenefits.map((benefit) => (
                <ProviderBenefitCard
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            title="Questions before you request?"
            description="Straight answers for homeowners and providers."
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <FAQAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
