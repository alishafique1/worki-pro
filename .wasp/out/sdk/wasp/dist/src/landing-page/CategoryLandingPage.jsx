import { useParams, Link } from 'react-router';
import { useQuery, getServiceCategories } from 'wasp/client/operations';
const PRICING = {
    hvac: 'Most HVAC repairs in Milton cost $150–$400',
    plumbing: 'Most plumbing jobs in the GTA cost $100–$350',
    electrical: 'Electrical work typically ranges from $120–$500',
    handyman: 'Handyman jobs usually cost $80–$250',
    'smart-home': 'Smart home installs typically cost $150–$600',
    'appliance-repair': 'Appliance repairs usually cost $100–$300',
};
const FAQS = {
    hvac: [
        { q: 'How quickly can I get an HVAC tech?', a: 'Most verified HVAC pros can come within 24–48 hours. Mark urgent for same-day.' },
        { q: 'Is a free quote really free?', a: 'Yes — providers compete for your job. You choose who to hire.' },
        { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
        { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
    ],
    plumbing: [
        { q: 'Can you help with emergency leaks?', a: 'Yes — mark your request as urgent and we\'ll match you with available plumbers immediately.' },
        { q: 'Do plumbers bring their own parts?', a: 'Most do for common repairs. They\'ll let you know if they need to source parts.' },
        { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
        { q: 'Are providers vetted?', a: 'All providers are verified before they can receive leads through The Helper.' },
    ],
};
const DEFAULT_FAQS = [
    { q: 'Is it free to get quotes?', a: 'Yes — getting quotes through The Helper is completely free for homeowners.' },
    { q: 'How quickly will I hear back?', a: 'Most homeowners receive their first quote within a few hours.' },
    { q: 'What areas do you cover?', a: 'Milton, Oakville, Burlington, and surrounding GTA areas.' },
    { q: 'Are providers vetted?', a: 'All providers go through our verification process before receiving leads.' },
];
export default function CategoryLandingPage() {
    const { categorySlug } = useParams();
    const { data: categories, isLoading } = useQuery(getServiceCategories);
    const category = categories?.find(c => c.slug === categorySlug && !c.parentCategoryId);
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
    const faqs = FAQS[categorySlug ?? ''] ?? DEFAULT_FAQS;
    const pricing = PRICING[categorySlug ?? ''];
    return (<div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#0F172A] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-4">{category.name} in Milton, Oakville & Burlington</h1>
          <p className="text-[#94A3B8] text-lg mb-8">
            Get free quotes from verified local {category.name.toLowerCase()} professionals — no commitment required.
          </p>
          <Link to={`/get-quotes?category=${category.id}&slug=${category.slug}`} className="inline-block px-10 py-4 bg-[#2563EB] text-white font-bold rounded-full text-lg hover:bg-[#1D4ED8] transition-colors">
            Get Help →
          </Link>
        </div>
      </section>

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
//# sourceMappingURL=CategoryLandingPage.jsx.map