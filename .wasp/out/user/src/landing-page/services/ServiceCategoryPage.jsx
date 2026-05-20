import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useQuery, getServiceCategories } from "wasp/client/operations";
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, MapPin, Loader2, AirVent, Hammer, WashingMachine, ShowerHead, PlugZap, Wifi, Sparkles, Brush, Layers, Home, Leaf, Wind, TreePine, Bug, KeyRound, Droplets, MoveRight, Package, Trash2, ShieldCheck, ClipboardList, Fence, Waves, PartyPopper, } from "lucide-react";
import PageSeo, { createServiceSchema, createFaqSchema, createBreadcrumbSchema } from "../components/PageSeo";
import { categoryPages } from "./categoryData";
// ── Icon mapping from DB icon names to Lucide components ────────────────────
const ICON_MAP = {
    AirVent,
    Hammer,
    WashingMachine,
    ShowerHead,
    PlugZap,
    Wifi,
    Sparkles,
    Brush,
    Layers,
    Home,
    Leaf,
    Wind,
    TreePine,
    Bug,
    KeyRound,
    Droplets,
    MoveRight,
    Package,
    Trash2,
    ShieldCheck,
    ClipboardList,
    Fence,
    Waves,
    PartyPopper,
};
function CategoryIcon({ iconName, className = "" }) {
    if (!iconName)
        return <Home className={className}/>;
    const IconComponent = ICON_MAP[iconName] || Home;
    return <IconComponent className={className}/>;
}
// ── Service areas ────────────────────────────────────────────────────────────
const SERVICE_AREAS = [
    { name: "Milton", slug: "milton" },
    { name: "Oakville", slug: "oakville" },
    { name: "Burlington", slug: "burlington" },
    { name: "Mississauga", slug: "mississauga" },
    { name: "Brampton", slug: "brampton" },
    { name: "Hamilton", slug: "hamilton" },
];
// ── Layout helpers ────────────────────────────────────────────────────────────
function Container({ children, className = "" }) {
    return (<div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>);
}
// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ name, description }) {
    return (<div className="group flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-[#EFF6FF] p-4 transition duration-150 hover:border-[#BFDBFE] hover:shadow-sm cursor-default">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#0F172A] leading-snug">{name}</p>
        <ArrowRight className="size-4 shrink-0 text-[#BFDBFE] transition duration-150 group-hover:text-[#2563EB] mt-0.5"/>
      </div>
      <p className="text-xs leading-5 text-[#475569]">{description}</p>
    </div>);
}
// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (<div className="border-b border-[#E2E8F0] last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
        <span className="text-sm font-semibold text-[#0F172A]">{question}</span>
        {open ? (<ChevronUp className="size-4 shrink-0 text-[#2563EB]"/>) : (<ChevronDown className="size-4 shrink-0 text-[#475569]"/>)}
      </button>
      {open && (<p className="pb-4 text-sm leading-6 text-[#475569]">{answer}</p>)}
    </div>);
}
// ── How it works step ─────────────────────────────────────────────────────────
function HowItWorksStep({ number, title, description, }) {
    return (<div className="flex flex-col items-center text-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
        <CheckCircle className="size-5 text-[#2563EB]"/>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
        Step {number}
      </p>
      <p className="text-base font-semibold text-[#0F172A]">{title}</p>
      <p className="text-sm leading-6 text-[#475569]">{description}</p>
    </div>);
}
// ── Default FAQs for categories without static data ───────────────────────────
function getDefaultFaqs(categoryName) {
    return [
        {
            question: `How fast can I get ${categoryName.toLowerCase()} help?`,
            answer: "Most homeowners get matched with a verified pro within 15 minutes. For urgent jobs, same-day service is often available.",
        },
        {
            question: "Are the pros verified?",
            answer: "Yes. Every pro is vetted before joining. We verify business credentials, insurance, service areas, and customer reviews. Only approved pros appear on the platform.",
        },
        {
            question: "What areas do you serve?",
            answer: "We currently serve the Greater Toronto Area: Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton. Enter your postal code to check coverage.",
        },
        {
            question: "Is The Helper free for homeowners?",
            answer: "Yes! Submitting requests and getting matched is 100% free for homeowners. You only pay the pro for the actual work, with no platform fees or hidden charges.",
        },
        {
            question: "How do rewards work?",
            answer: "Earn points automatically: $5 when you submit, $5 when you book, and $50+ when your first job completes. Redeem for gift cards or service credits at $100.",
        },
    ];
}
// ── Main page ─────────────────────────────────────────────────────────────────
export default function ServiceCategoryPage() {
    const { categorySlug } = useParams();
    // Fetch categories from DB
    const { data: dbCategories, isLoading: dbLoading } = useQuery(getServiceCategories);
    // Find category from DB first, then fall back to static data
    const dbCategory = useMemo(() => {
        if (!dbCategories)
            return null;
        return dbCategories.find(c => c.slug === categorySlug && !c.parentCategoryId);
    }, [dbCategories, categorySlug]);
    // Get children (sub-categories) from DB
    const dbChildren = useMemo(() => {
        if (!dbCategories || !dbCategory)
            return [];
        return dbCategories.filter(c => c.parentCategoryId === dbCategory.id);
    }, [dbCategories, dbCategory]);
    // Fall back to static category data
    const staticCategory = categoryPages.find((c) => c.slug === categorySlug);
    // Loading state
    if (dbLoading) {
        return (<main className="min-h-screen bg-[#F8FAFC] font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-[#2563EB] animate-spin"/>
          <p className="text-sm text-[#475569]">Loading...</p>
        </div>
      </main>);
    }
    // 404 if neither DB nor static category found
    if (!dbCategory && !staticCategory) {
        return (<main className="min-h-screen bg-[#F8FAFC] font-sans flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-6xl font-bold text-[#E2E8F0] mb-4">404</p>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Category not found</h1>
          <p className="text-[#475569] mb-6">
            We couldn't find a service category for <strong>{categorySlug}</strong>.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition">
            Back to home <ArrowRight className="size-4"/>
          </Link>
        </div>
      </main>);
    }
    // Merge DB and static data - prefer static for rich content (FAQs, sub-categories)
    const category = {
        name: dbCategory?.name || staticCategory?.name || "",
        slug: dbCategory?.slug || staticCategory?.slug || categorySlug || "",
        description: dbCategory?.description || staticCategory?.description || "",
        tagline: staticCategory?.tagline || `${dbCategory?.name || ""} services for GTA homeowners`,
        badge: staticCategory?.badge || `${dbCategory?.name || ""} Specialists`,
        icon: dbCategory?.icon || null,
        imageUrl: dbCategory?.imageUrl || null,
        subCategories: staticCategory?.subCategories || [],
        faqs: staticCategory?.faqs || getDefaultFaqs(dbCategory?.name || ""),
        seo: staticCategory?.seo || {
            title: `${dbCategory?.name || ""} Services in GTA | The Helper`,
            description: dbCategory?.description || `Find verified ${dbCategory?.name?.toLowerCase() || ""} professionals in Milton, Oakville, Burlington, and the GTA.`,
        },
    };
    return (<>
      <PageSeo title={category.seo.title} description={category.seo.description} canonicalPath={`/services/${category.slug}`} keywords={`${category.name.toLowerCase()} Milton, ${category.name.toLowerCase()} Oakville, ${category.name.toLowerCase()} Burlington, ${category.name.toLowerCase()} services GTA`} structuredData={{
            '@context': 'https://schema.org',
            '@graph': [
                createServiceSchema({
                    name: `${category.name} Services`,
                    description: category.description,
                    areaServed: ['Milton', 'Oakville', 'Burlington'],
                    url: `https://thehelper.ca/services/${category.slug}`,
                }),
                createFaqSchema(category.faqs),
                createBreadcrumbSchema([
                    { name: 'Home', url: 'https://thehelper.ca' },
                    { name: category.name, url: `https://thehelper.ca/services/${category.slug}` },
                ]),
            ],
        }}/>

      <main className="min-h-screen bg-[#F8FAFC] font-sans">

        {/* ── Hero with optional image ─────────────────────────────────────── */}
        <section className="relative bg-white pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#E2E8F0]" style={category.imageUrl ? {
            backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%), url(${category.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } : undefined}>
          <Container>
            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-2 text-xs text-[#94A3B8]">
              <Link to="/" className="hover:text-[#2563EB] transition">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-[#2563EB] transition">Services</Link>
              <span>/</span>
              <span className="text-[#475569]">{category.name}</span>
            </nav>

            <div className="flex items-start gap-6">
              {/* Icon */}
              {category.icon && (<div className="hidden sm:flex shrink-0 size-16 items-center justify-center rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE]">
                  <CategoryIcon iconName={category.icon} className="size-8 text-[#2563EB]"/>
                </div>)}

              <div className="flex-1">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
                  {category.badge}
                </span>

                {/* Heading */}
                <h1 className="mt-4 text-[36px] font-bold leading-tight text-[#0F172A] sm:text-5xl max-w-2xl">
                  {category.name}
                </h1>
                <p className="mt-2 text-lg font-medium text-[#2563EB]">{category.tagline}</p>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#475569]">
                  {category.description}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={`/request-service?category=${category.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.25)] transition hover:bg-[#1D4ED8]">
                Get matched now
                <ArrowRight className="size-4"/>
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#475569] transition hover:border-[#BFDBFE] hover:text-[#2563EB]">
                Browse All Services
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Services section (from static data) ───────────────────────────── */}
        {category.subCategories.length > 0 && (<section className="py-14 sm:py-18 bg-[#F8FAFC]">
            <Container>
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl mb-2">
                What we help with
              </h2>
              <p className="text-[#475569] text-sm mb-10">
                All {category.name.toLowerCase()} services available in the GTA.
              </p>

              <div className="flex flex-col gap-10">
                {category.subCategories.map((sub) => (<div key={sub.name}>
                    {/* Sub-category heading */}
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] inline-block px-3 py-1 rounded-full">
                      {sub.name}
                    </p>

                    {/* Service cards grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {sub.services.map((svc) => (<ServiceCard key={svc.name} name={svc.name} description={svc.description}/>))}
                    </div>
                  </div>))}
              </div>
            </Container>
          </section>)}

        {/* ── DB-driven children (if static not available) ─────────────────── */}
        {category.subCategories.length === 0 && dbChildren.length > 0 && (<section className="py-14 sm:py-18 bg-[#F8FAFC]">
            <Container>
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl mb-2">
                What we help with
              </h2>
              <p className="text-[#475569] text-sm mb-10">
                All {category.name.toLowerCase()} services available in the GTA.
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dbChildren.map((child) => (<div key={child.id} className="group flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-[#EFF6FF] p-4 transition duration-150 hover:border-[#BFDBFE] hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <CategoryIcon iconName={child.icon} className="size-5 text-[#2563EB]"/>
                      <p className="text-sm font-semibold text-[#0F172A]">{child.name}</p>
                    </div>
                    {child.description && (<p className="text-xs leading-5 text-[#475569]">{child.description}</p>)}
                  </div>))}
              </div>
            </Container>
          </section>)}

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="py-14 sm:py-18 bg-white border-t border-b border-[#E2E8F0]">
          <Container>
            <div className="text-center mb-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
                HOW IT WORKS
              </p>
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                From request to done, fast.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <HowItWorksStep number="01" title="Submit your request" description={`Describe your ${category.name.toLowerCase()} job, your location, and when you're available.`}/>
              <HowItWorksStep number="02" title="Get matched to a pro" description="We surface a vetted, verified provider for your category and GTA location."/>
              <HowItWorksStep number="03" title="Job done" description="Confirm the appointment, track updates, and rate your pro, all in one place."/>
            </div>
          </Container>
        </section>

        {/* ── Service Areas ────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-18 bg-[#F8FAFC]">
          <Container>
            <div className="text-center mb-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
                SERVICE AREAS
              </p>
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                {category.name} services near you
              </h2>
              <p className="mt-2 text-[#475569] text-sm max-w-md mx-auto">
                We connect GTA homeowners with verified {category.name.toLowerCase()} professionals.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_AREAS.map((area) => (<Link key={area.slug} to={`/services/${category.slug}/${area.slug}`} className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#BFDBFE] hover:bg-[#EFF6FF] transition group">
                  <MapPin className="size-5 text-[#2563EB]"/>
                  <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition">
                    {category.name} in {area.name}
                  </span>
                  <ArrowRight className="size-4 text-[#BFDBFE] group-hover:text-[#2563EB] ml-auto transition"/>
                </Link>))}
            </div>
          </Container>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-18 bg-white border-t border-[#E2E8F0]">
          <Container>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0F172A] sm:text-3xl mb-2 text-center">
                Frequently asked questions
              </h2>
              <p className="text-[#475569] text-sm text-center mb-8">
                Common questions about {category.name.toLowerCase()} services in the GTA.
              </p>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6">
                {category.faqs.map((faq) => (<FaqItem key={faq.question} question={faq.question} answer={faq.answer}/>))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── CTA bar ───────────────────────────────────────────────────── */}
        <section className="bg-[#2563EB] py-12 sm:py-16">
          <Container>
            <div className="flex flex-col items-center gap-5 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl max-w-lg">
                Ready to get started with {category.name.toLowerCase()}?
              </h2>
              <p className="text-[#BFDBFE] text-sm max-w-md">
                Submit a request in under 2 minutes. Vetted GTA pros respond fast.
              </p>
              <Link to={`/request-service?category=${category.slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#2563EB] shadow-lg transition hover:bg-[#EFF6FF]">
                Find a Helper Now
                <ArrowRight className="size-4"/>
              </Link>
            </div>
          </Container>
        </section>
      </main>
    </>);
}
