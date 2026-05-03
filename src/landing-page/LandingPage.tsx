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
  TestimonialCard,
  TrustBadge,
} from "./marketplace/components";
import {
  categories,
  customerSteps,
  faqs,
  internalFeatures,
  painPoints,
  providerBenefits,
  providerSteps,
  solutionSteps,
  trustFeatures,
} from "./marketplace/content";
import {
  BadgeCheck,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#000000] font-sans selection:bg-[#F2B5D7] selection:text-[#0C110F]">
      <Hero />

      <section className="bg-[#000000] pb-6">
        <Container>
          <div className="grid gap-3 rounded-[23px] border border-white/10 bg-[#1B1B1C] p-3 sm:grid-cols-3 sm:p-4">
            <StatsCard value="Local-first" label="Service model" />
            <StatsCard value="Select pros" label="Provider onboarding" />
            <StatsCard value="One place" label="Bookings, messages, updates" />
          </div>
        </Container>
      </section>

      <section id="problem" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="The problem"
            title="Finding a reliable pro should not feel like detective work."
            description="Most homeowners still rely on group chats, old referrals, missed calls, and directories that do not tell the full story."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point) => (
              <FeatureCard
                key={point.title}
                icon={point.icon}
                title={point.title}
                description={point.description}
              />
            ))}
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="bg-[#FEFEFD] py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeader
              align="left"
              eyebrow="The solution"
              title="One place to request local home services."
              description="Worki turns a messy service request into a structured intake flow so homeowners can share the right details from the start."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {solutionSteps.map((step) => (
                <FeatureCard
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="services" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Marketplace categories"
            title="The service categories available in Worki today."
            description="Request HVAC, handyman, plumbing, electrical, appliance repair, or smart home help from the live service form."
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
        </Container>
      </section>

      <section className="bg-[#000000] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Two-sided marketplace"
            title="Simple for homeowners. Useful for providers."
            description="The customer journey and provider workflow are designed together so every request has better context from the start."
            className="text-[#FEFEFD] [&_h2]:text-[#FEFEFD] [&_p]:text-[#CCC9D8]"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[23px] border border-white/10 bg-[#1B1B1C] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#F2B5D7] text-[#0C110F]">
                  <UsersRound className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#FEFEFD]">
                    For customers
                  </p>
                  <p className="text-sm text-[#CCC9D8]">
                    Less chasing. More clarity.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {customerSteps.map((step) => (
                  <StepCard
                    key={step.title}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[23px] border border-white/10 bg-[#1B1B1C] p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#F2B5D7] text-[#0C110F]">
                  <ClipboardCheck className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#FEFEFD]">
                    For providers
                  </p>
                  <p className="text-sm text-[#CCC9D8]">
                    Better leads. Less admin.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {providerSteps.map((step) => (
                  <StepCard
                    key={step.title}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#FEFEFD] py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <TrustBadge
                icon={<BadgeCheck className="size-4" />}
                label="Internal roadmap"
              />
              <SectionHeader
                align="left"
                title="Future assistance stays behind the scenes."
                description="Any automation is framed as internal support for clearer requests and operations. Worki's live customer flow is the service request form."
                className="mt-5"
              />
              <Button href="/request-service" className="mt-6">
                Request Service
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {internalFeatures.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="trust" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Trust layer"
            title="Built for trust from the first click."
            description="Worki gives customers and providers shared context, clearer expectations, and a local-first marketplace foundation."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature) => (
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
                title="Apply to become a Worki provider."
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

      <section className="bg-[#FEFEFD] py-16 sm:py-20">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <SectionHeader
              align="left"
              eyebrow="Marketplace foundation"
              title="Starting local. Built to scale."
              description="Worki operates locally first so the marketplace can grow around supported categories, provider coverage, and real service demand."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TestimonialCard />
              <FeatureCard
                icon={<ShieldCheck className="size-5" />}
                title="Select-provider model"
                description="Supply quality comes before broad coverage or vanity metrics."
              />
              <FeatureCard
                icon={<MapPin className="size-5" />}
                title="Local service rollout"
                description="Coverage expands by city, category, and provider availability."
              />
              <FeatureCard
                icon={<ClipboardCheck className="size-5" />}
                title="Marketplace foundation"
                description="Requests, appointments, provider applications, and status updates can scale from the same structure."
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="faq" className="bg-[#F7F3EF] py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            title="Questions before requesting service?"
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
