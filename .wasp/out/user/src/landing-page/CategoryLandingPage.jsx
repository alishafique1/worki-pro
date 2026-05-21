import { useParams, Link } from 'react-router';
import { useQuery, getServiceCategories } from 'wasp/client/operations';
import PageSeo, { createServiceSchema, createFaqSchema, createBreadcrumbSchema } from './components/PageSeo';
import { categoryPages } from './services/categoryData';
const PRICING = {
    hvac: 'Most HVAC repairs in Milton cost $150–$400',
    plumbing: 'Most plumbing jobs in the GTA cost $100–$350',
    electrical: 'Electrical work typically ranges from $120–$500',
    handyman: 'Handyman jobs usually cost $80–$250',
    'smart-home': 'Smart home installs typically cost $150–$600',
    'appliance-repair': 'Appliance repairs usually cost $100–$300',
};
const DEFAULT_FAQS = [
    { q: 'Is it free to get quotes?', a: 'Yes — getting quotes through The Helper is completely free for homeowners.' },
    { q: 'How quickly will I hear back?', a: 'Most homeowners receive their first quote within a few hours.' },
    { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
    { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
];
const GTA_AREAS = [
    { name: 'Milton', slug: 'milton' },
    { name: 'Oakville', slug: 'oakville' },
    { name: 'Burlington', slug: 'burlington' },
    { name: 'Mississauga', slug: 'mississauga' },
    { name: 'Brampton', slug: 'brampton' },
];
export default function CategoryLandingPage() {
    const { categorySlug } = useParams();
    const { data: categories, isLoading } = useQuery(getServiceCategories);
    const category = categories?.find(c => c.slug === categorySlug && !c.parentCategoryId);
    const pageData = categoryPages.find(p => p.slug === categorySlug);
    const faqs = pageData?.faqs?.length
        ? pageData.faqs.map(f => ({ q: f.question, a: f.answer }))
        : DEFAULT_FAQS;
    const faqSchemaItems = faqs.map(f => ({ question: f.q, answer: f.a }));
    const pricing = PRICING[categorySlug ?? ''];
    const areas = GTA_AREAS;
    if (isLoading) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse text-[#475569]">Loading…</div>
      </div>);
    }
    if (!category) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black text-[#0F172A]">Service not found</h1>
        <Link to="/" className="text-[#2563EB] hover:underline">← Back to home</Link>
      </div>);
    }
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <PageSeo title={pageData?.seo?.title ?? `${category.name} in Milton, Oakville & Burlington | The Helper`} description={pageData?.seo?.description ?? `Get free quotes from verified ${category.name.toLowerCase()} professionals in Milton, Oakville, and Burlington.`} ogTitle={`${category.name} Services in GTA | The Helper`} ogDescription={pageData?.description ?? `Find trusted ${category.name.toLowerCase()} pros serving Milton, Oakville, and Burlington.`} canonicalPath={`/services/${categorySlug}`} keywords={`${category.name.toLowerCase()} repair Milton, ${category.name.toLowerCase()} Oakville, ${category.name.toLowerCase()} Burlington, GTA ${category.name.toLowerCase()}, home services`} structuredData={{
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
        }}/>

      {/* Hero */}
      <section className="bg-[#0F172A] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#60A5FA] mb-3">
            {pageData?.badge ?? `${category.name} · GTA`}
          </span>
          <h1 className="text-4xl font-black mb-4">
            {category.name} in Milton, Oakville & Burlington
          </h1>
          <p className="text-[#94A3B8] text-lg mb-8 max-w-2xl mx-auto">
            {pageData?.description ?? `Get free quotes from verified local ${category.name.toLowerCase()} professionals — no commitment required.`}
          </p>
          <Link to={`/get-quotes?category=${category.id}&slug=${category.slug}`} className="inline-block px-10 py-4 bg-[#2563EB] text-white font-bold rounded-full text-lg hover:bg-[#1D4ED8] transition-colors">
            Get Help →
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10 px-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <div className="text-2xl mb-1">✓</div>
            <p className="font-semibold text-[#0F172A] text-sm">Verified pros</p>
            <p className="text-xs text-[#64748B]">Every provider is background-checked</p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <div className="text-2xl mb-1">💰</div>
            <p className="font-semibold text-[#0F172A] text-sm">Free quotes</p>
            <p className="text-xs text-[#64748B]">No obligation, compare & choose</p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
            <div className="text-2xl mb-1">📅</div>
            <p className="font-semibold text-[#0F172A] text-sm">Fast response</p>
            <p className="text-xs text-[#64748B]">Most quotes arrive within hours</p>
          </div>
        </div>
      </section>

      {/* Service grid */}
      {pageData?.subCategories && pageData.subCategories.length > 0 && (<section className="py-16 px-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-[#0F172A] mb-8 text-center">
            {category.name} services we cover
          </h2>
          <div className="space-y-10">
            {pageData.subCategories.map(sub => (<div key={sub.name}>
                <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2563EB] rounded-full inline-block"/>
                  {sub.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sub.services.map(s => (<div key={s.name} className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#2563EB]/30 transition-colors">
                      <h4 className="font-bold text-[#0F172A] text-sm mb-1">{s.name}</h4>
                      <p className="text-xs text-[#475569] leading-relaxed">{s.description}</p>
                    </div>))}
                </div>
              </div>))}
          </div>
        </section>)}

      {/* How it works */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#0F172A] mb-8 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Describe your job', desc: 'Tell us what you need — takes 2 minutes.' },
            { n: '2', title: 'Get matched', desc: 'Verified local pros receive your request and send quotes.' },
            { n: '3', title: 'Choose your Helper', desc: 'Compare quotes, read reviews, book with confidence.' },
        ].map(step => (<div key={step.n} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{step.n}</div>
              <h3 className="font-bold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#475569]">{step.desc}</p>
            </div>))}
        </div>
      </section>

      {/* Pricing */}
      {pricing && (<section className="py-8 px-6 max-w-4xl mx-auto">
          <div className="bg-[#FEF3C7] border border-[#F59E0B]/30 rounded-2xl p-6">
            <h2 className="font-bold text-[#92400E] mb-1">Typical pricing</h2>
            <p className="text-[#78350F]">{pricing}</p>
            <p className="text-sm text-[#92400E] mt-2">Exact quotes depend on scope — get yours free in 2 minutes.</p>
          </div>
        </section>)}

      {/* Service areas */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#0F172A] mb-4 text-center">
          {category.name} in your area
        </h2>
        <p className="text-[#475569] text-center mb-8 max-w-xl mx-auto">
          We cover homes across the GTA. Select your area to see local {category.name.toLowerCase()} providers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {areas.map(area => (<Link key={area.slug} to={`/services/${categorySlug}/${area.slug}`} className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-full text-sm font-semibold text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
              {area.name}
            </Link>))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#0F172A] mb-8">Common questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (<div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
              <h3 className="font-bold text-[#0F172A] mb-2">{faq.q}</h3>
              <p className="text-[#475569] text-sm">{faq.a}</p>
            </div>))}
        </div>
      </section>

      {/* Trust + Footer CTA */}
      <section className="py-16 px-6 bg-[#0F172A] text-white text-center">
        <p className="text-[#94A3B8] mb-4">Verified {category.name.toLowerCase()} pros serving Milton · Oakville · Burlington</p>
        <Link to={`/get-quotes?category=${category.id}&slug=${category.slug}`} className="inline-block px-10 py-4 bg-[#2563EB] text-white font-bold rounded-full text-lg hover:bg-[#1D4ED8] transition-colors">
          Get Help →
        </Link>
      </section>
    </div>);
}
