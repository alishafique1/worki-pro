import { useParams, Link } from 'react-router'
import { useQuery, getServiceCategories } from 'wasp/client/operations'
import type { ServiceCategory } from 'wasp/entities'
import PageSeo, { createServiceSchema, createFaqSchema, createBreadcrumbSchema } from './components/PageSeo'
import { categoryPages } from './services/categoryData'
import { ShieldCheck, BadgeDollarSign, CalendarClock } from 'lucide-react'

const PRICING: Record<string, string> = {
  hvac: 'Most HVAC repairs in Milton cost $150–$400',
  plumbing: 'Most plumbing jobs in the GTA cost $100–$350',
  electrical: 'Electrical work typically ranges from $120–$500',
  handyman: 'Handyman jobs usually cost $80–$250',
  'smart-home': 'Smart home installs typically cost $150–$600',
  'appliance-repair': 'Appliance repairs usually cost $100–$300',
  'digital-marketing': 'Most digital marketing retainers start at $500–$2,000/month',
  'software-development': 'Project rates typically range from $1,500–$10,000+ depending on scope',
  'video-editing': 'Short-form video edits typically cost $50–$300 per video',
  'driving-school': 'In-car lessons typically cost $60–$90 per hour in the GTA',
}

const DEFAULT_FAQS = [
  { q: 'Is it free to get quotes?', a: 'Yes — getting quotes through The Helper is completely free for homeowners.' },
  { q: 'How quickly will I hear back?', a: 'Most homeowners receive their first quote within a few hours.' },
  { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
  { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
]

const GTA_AREAS = [
  { name: 'Milton', slug: 'milton' },
  { name: 'Oakville', slug: 'oakville' },
  { name: 'Burlington', slug: 'burlington' },
  { name: 'Mississauga', slug: 'mississauga' },
  { name: 'Brampton', slug: 'brampton' },
]

export default function CategoryLandingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { data: categories, isLoading } = useQuery(getServiceCategories)

  const category = (categories as ServiceCategory[] | undefined)?.find(
    c => c.slug === categorySlug && !c.parentCategoryId
  )

  const pageData = categoryPages.find(p => p.slug === categorySlug) ?? {
    slug: categorySlug ?? '',
    name: category?.name ?? 'Service',
    tagline: `${category?.name ?? 'Service'} pros in the GTA.`,
    description: `Get free quotes from verified local ${category?.name?.toLowerCase() ?? 'service'} professionals — no commitment required.`,
    badge: `${category?.name ?? 'Service'} · GTA`,
    subCategories: [],
    faqs: [],
    seo: {
      title: `${category?.name ?? 'Service'} in Milton, Oakville & Burlington | The Helper`,
      description: `Get free quotes from verified ${category?.name?.toLowerCase() ?? 'service'} professionals in Milton, Oakville, and Burlington.`,
    },
  }
  const faqs = pageData?.faqs?.length
    ? pageData.faqs.map(f => ({ q: f.question, a: f.answer }))
    : DEFAULT_FAQS
  const faqSchemaItems = faqs.map(f => ({ question: f.q, answer: f.a }))
  const pricing = PRICING[categorySlug ?? ''] ?? null
  const areas = GTA_AREAS

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-600">Loading…</div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-black text-slate-900">Service not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Back to home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageSeo
        title={pageData?.seo?.title ?? `${category.name} in Milton, Oakville & Burlington | The Helper`}
        description={pageData?.seo?.description ?? `Get free quotes from verified ${category.name.toLowerCase()} professionals in Milton, Oakville, and Burlington.`}
        ogTitle={`${category.name} Services in GTA | The Helper`}
        ogDescription={pageData?.description ?? `Find trusted ${category.name.toLowerCase()} pros serving Milton, Oakville, and Burlington.`}
        canonicalPath={`/services/${categorySlug}`}
        keywords={`${category.name.toLowerCase()} repair Milton, ${category.name.toLowerCase()} Oakville, ${category.name.toLowerCase()} Burlington, GTA ${category.name.toLowerCase()}, home services`}
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createBreadcrumbSchema([
              { name: 'Home', url: 'https://thehelper.ca/' },
              { name: category.name, url: `https://thehelper.ca/services/${categorySlug}` },
            ]),
            createServiceSchema({
              name: `${category.name} Services in GTA`,
              description: pageData?.description ?? category.description ?? '',
              areaServed: ['Milton', 'Oakville', 'Burlington'],
              url: `https://thehelper.ca/services/${categorySlug}`,
            }),
            createFaqSchema(faqSchemaItems),
          ],
        }}
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
            {pageData?.badge ?? `${category.name} · GTA`}
          </span>
          <h1 className="text-4xl font-black mb-4">
            {category.name} in Milton, Oakville & Burlington
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            {pageData?.description ?? `Get free quotes from verified local ${category.name.toLowerCase()} professionals — no commitment required.`}
          </p>
          <Link
            to={`/get-quotes?category=${category.id}&slug=${category.slug}`}
            className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Get Help →
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10 px-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: <ShieldCheck className="size-6 text-green-500" />, label: 'Verified pros', desc: 'Every provider is background-checked', iconBg: 'bg-green-50 border-green-200' },
            { icon: <BadgeDollarSign className="size-6 text-blue-600" />, label: 'Free quotes', desc: 'No obligation, compare & choose', iconBg: 'bg-blue-50 border-blue-200' },
            { icon: <CalendarClock className="size-6 text-amber-500" />, label: 'Fast response', desc: 'Most quotes arrive within hours', iconBg: 'bg-amber-50 border-amber-200' },
          ].map(item => (
            <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center border ${item.iconBg}`}>{item.icon}</div>
              <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service grid */}
      {pageData?.subCategories && pageData.subCategories.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">
            {category.name} services we cover
          </h2>
          <div className="space-y-10">
            {pageData.subCategories.map(sub => (
              <div key={sub.name}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" />
                  {sub.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sub.services.map(s => (
                    <div
                      key={s.name}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-600/30 transition-colors"
                    >
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{s.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Describe your job', desc: 'Tell us what you need — takes 2 minutes.' },
            { n: '2', title: 'Get matched', desc: 'Verified local pros receive your request and send quotes.' },
            { n: '3', title: 'Choose your Helper', desc: 'Compare quotes, read reviews, book with confidence.' },
          ].map(step => (
            <div key={step.n} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{step.n}</div>
              <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      {pricing && (
        <section className="py-8 px-6 max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-6">
            <h2 className="font-bold text-amber-800 mb-1">Typical pricing</h2>
            <p className="text-amber-900">{pricing}</p>
            <p className="text-sm text-amber-700 mt-2">Exact quotes depend on scope — get yours free in 2 minutes.</p>
          </div>
        </section>
      )}

      {/* Service areas */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-4 text-center">
          {category.name} in your area
        </h2>
        <p className="text-slate-600 text-center mb-8 max-w-xl mx-auto">
          We cover homes across the GTA. Select your area to see local {category.name.toLowerCase()} providers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {areas.map(area => (
            <Link
              key={area.slug}
              to={`/services/${categorySlug}/${area.slug}`}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-900 hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              {area.name}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Common questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust + Footer CTA */}
      <section className="py-16 px-6 bg-slate-900 text-white text-center">
        <p className="text-slate-400 mb-4">Verified {category.name.toLowerCase()} pros serving Milton · Oakville · Burlington</p>
        <Link
          to={`/get-quotes?category=${category.id}&slug=${category.slug}`}
          className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
        >
          Get Help →
        </Link>
      </section>
    </div>
  )
}
