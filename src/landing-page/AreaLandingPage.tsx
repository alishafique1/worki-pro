import React from 'react';
import { Link, useParams } from 'react-router';
import {
  CheckCircle2,
  Gift,
  Home,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Smartphone,
  Star,
  Target,
  Users,
  Wrench,
  Zap,
} from 'lucide-react', Gift, Home, Lightbulb, MapPin from "lucide-react";
import PageSeo, { createLocalBusinessSchema } from './components/PageSeo';

interface Testimonial {
  name: string;
  neighborhood: string;
  service: string;
  quote: string;
  rating: number;
}

interface LocalContent {
  heroHeadline: string;
  heroSubtext: string;
  aboutArea: string;
  neighborhoods: string[];
  localLandmarks: string[];
  stats: {
    homeownersServed: string;
    avgResponseTime: string;
    satisfactionRate: string;
    localPros: string;
  };
  testimonials: Testimonial[];
  seasonalTip: string;
}

interface AreaData {
  name: string;
  region: string;
  population: string;
  tagline: string;
  nearby: string[];
  localContent?: LocalContent;
}

const AREA_DATA: Record<string, AreaData> = {
  milton: {
    name: 'Milton',
    region: 'Halton Region',
    population: '130,000+',
    tagline: "Milton's Trusted Home Service Concierge",
    nearby: ['Oakville', 'Burlington', 'Halton Hills', 'Georgetown'],
    localContent: {
      heroHeadline: "One of Canada's Fastest-Growing Towns Deserves Fast, Reliable Home Service",
      heroSubtext: "From the new builds in Boyne to the established homes near Main Street, Milton homeowners trust The Helper to connect them with vetted local pros who understand the unique needs of this rapidly expanding community.",
      aboutArea: "Milton has transformed from a small Escarpment town into one of Canada's fastest-growing communities. With thousands of new homes built in developments like Scott, Willmott, and Harrison, many families are settling into brand-new construction that needs finishing touches - from smart home installations to HVAC tune-ups. Meanwhile, homes closer to downtown and the historic Main Street area often need updates to electrical panels, plumbing, and seasonal maintenance. Whether you're in a new build or a century home, The Helper knows Milton.",
      neighborhoods: ['Old Milton', 'Boyne', 'Scott', 'Willmott', 'Harrison', 'Timberlea', 'Dorset Park', 'Dempsey', 'Clarke'],
      localLandmarks: ['Rattlesnake Point', 'Kelso Conservation Area', 'Crawford Lake', 'Main Street Milton', 'Milton GO Station'],
      stats: {
        homeownersServed: '850+',
        avgResponseTime: '12 min',
        satisfactionRate: '97%',
        localPros: '45+',
      },
      testimonials: [
        {
          name: 'Jennifer M.',
          neighborhood: 'Scott neighbourhood',
          service: 'HVAC',
          quote: "Our new build's AC stopped working during the heat wave. The Helper matched us with a pro who came same-day and fixed the issue. As new Milton residents, we didn't know who to call - this made it easy.",
          rating: 5,
        },
        {
          name: 'David K.',
          neighborhood: 'Old Milton',
          service: 'Electrical',
          quote: "Needed a panel upgrade in our 1970s home near Main Street. The electrician was knowledgeable about older homes and handled the permit process. Highly recommend.",
          rating: 5,
        },
        {
          name: 'Priya S.',
          neighborhood: 'Willmott',
          service: 'Smart Home',
          quote: "Just moved to Milton from Toronto and wanted cameras and a smart doorbell installed. Pro arrived on time, clean work, explained everything. Already referred two neighbours.",
          rating: 5,
        },
      ],
      seasonalTip: "Milton winters hit hard. Book your furnace tune-up before November to avoid the rush - our HVAC pros fill up fast once temperatures drop below zero.",
    },
  },
  oakville: {
    name: 'Oakville',
    region: 'Halton Region',
    population: '230,000+',
    tagline: "Oakville's Expert Home Service Pros",
    nearby: ['Burlington', 'Milton', 'Mississauga', 'Brampton'],
    localContent: {
      heroHeadline: "Premium Home Services for Oakville's Established Neighbourhoods",
      heroSubtext: "From the waterfront estates of Bronte to the mature trees of Old Oakville, The Helper connects you with pros who understand the craftsmanship your home deserves.",
      aboutArea: "Oakville is known for its tree-lined streets, heritage homes, and high standards. Whether you own a lakefront property in Bronte Harbour, a mid-century modern in River Oaks, or a newer home in North Oakville, maintaining your investment requires skilled tradespeople who respect quality. Many Oakville homes feature custom finishes, older plumbing systems, and sophisticated HVAC needs. The Helper vets every pro to ensure they meet Oakville homeowners' expectations for professionalism and attention to detail.",
      neighborhoods: ['Old Oakville', 'Bronte', 'Glen Abbey', 'River Oaks', 'Clearview', 'College Park', 'Eastlake', 'Joshua Creek', 'Iroquois Ridge'],
      localLandmarks: ['Bronte Harbour', 'Glen Abbey Golf Course', 'Coronation Park', 'Downtown Oakville', 'Sixteen Mile Creek'],
      stats: {
        homeownersServed: '1,200+',
        avgResponseTime: '10 min',
        satisfactionRate: '98%',
        localPros: '60+',
      },
      testimonials: [
        {
          name: 'Margaret T.',
          neighborhood: 'Old Oakville',
          service: 'Plumbing',
          quote: "Our 1920s home has original copper pipes. Finding a plumber who wouldn't just suggest ripping everything out was a challenge - until The Helper. The pro was respectful of the heritage details and fixed the leak properly.",
          rating: 5,
        },
        {
          name: 'Robert C.',
          neighborhood: 'Glen Abbey',
          service: 'HVAC',
          quote: "We needed a full AC replacement before summer. The matched contractor handled the Town of Oakville permit, arrived when promised, and the install was flawless. Professional from start to finish.",
          rating: 5,
        },
        {
          name: 'Anita L.',
          neighborhood: 'Joshua Creek',
          service: 'Handyman',
          quote: "Moved into a new build with a punch list of small issues. The handyman addressed everything in one visit - mounting, caulking, adjustments. Worth every dollar.",
          rating: 5,
        },
      ],
      seasonalTip: "Lakefront and south Oakville homes face extra humidity in summer. Consider a dehumidifier or AC check-up before June to protect your home's interior.",
    },
  },
  burlington: {
    name: 'Burlington',
    region: 'Halton Region',
    population: '195,000+',
    tagline: "Burlington's Vetted Home Service Concierge",
    nearby: ['Oakville', 'Hamilton', 'Milton', 'Stoney Creek'],
    localContent: {
      heroHeadline: "From the Waterfront to the Escarpment: Home Services for Every Burlington Home",
      heroSubtext: "Burlington's diverse housing - lakeside condos, Aldershot bungalows, Tyandaga family homes - needs pros who adapt. The Helper matches you with tradespeople who know Burlington inside and out.",
      aboutArea: "Burlington blends the best of urban convenience and natural beauty. The city stretches from Lake Ontario's waterfront up to the Niagara Escarpment, with housing that ranges from post-war Aldershot homes to modern Roseland townhouses. Downtown Burlington's Spencer Smith Park area features heritage buildings alongside new condos, while established neighbourhoods like Tyandaga and Headon Forest have mature homes needing regular maintenance. The Helper serves all of Burlington with pros who understand this diversity.",
      neighborhoods: ['Downtown Burlington', 'Aldershot', 'Tyandaga', 'Headon Forest', 'Roseland', 'Orchard', 'Shoreacres', 'Appleby', 'Millcroft'],
      localLandmarks: ['Spencer Smith Park', 'Burlington Bay', 'Mount Nemo', 'Royal Botanical Gardens', 'Burlington GO Station'],
      stats: {
        homeownersServed: '1,050+',
        avgResponseTime: '11 min',
        satisfactionRate: '97%',
        localPros: '55+',
      },
      testimonials: [
        {
          name: 'Steve P.',
          neighborhood: 'Aldershot',
          service: 'Electrical',
          quote: "Our 1960s bungalow needed a full electrical inspection and some updates before we could install an EV charger. The electrician knew exactly what Aldershot homes typically need. Smooth process, fair price.",
          rating: 5,
        },
        {
          name: 'Linda W.',
          neighborhood: 'Downtown Burlington',
          service: 'Appliance Repair',
          quote: "Condo dishwasher stopped draining. Within 2 hours of submitting my request, a tech was at my door. Fixed the pump, explained what happened, and didn't try to upsell me. Refreshing experience.",
          rating: 5,
        },
        {
          name: 'Mohammed A.',
          neighborhood: 'Millcroft',
          service: 'HVAC',
          quote: "Needed a second opinion on our furnace - another company quoted a full replacement. The Helper pro diagnosed a simpler fix and saved us thousands. Honest and competent.",
          rating: 5,
        },
      ],
      seasonalTip: "Burlington's lake-effect weather means unpredictable spring storms. Have your sump pump inspected before April to avoid basement flooding surprises.",
    },
  },
  mississauga: {
    name: 'Mississauga',
    region: 'Peel Region',
    population: '720,000+',
    tagline: 'Expert Home Services in Mississauga',
    nearby: ['Brampton', 'Oakville', 'Toronto', 'Etobicoke'],
  },
  brampton: {
    name: 'Brampton',
    region: 'Peel Region',
    population: '660,000+',
    tagline: 'Expert Home Service Pros in Brampton',
    nearby: ['Mississauga', 'Caledon', 'Vaughan', 'Etobicoke'],
  },
  hamilton: {
    name: 'Hamilton',
    region: 'Hamilton-Wentworth',
    population: '580,000+',
    tagline: "Hamilton's Top-Rated Home Services",
    nearby: ['Burlington', 'Ancaster', 'Stoney Creek', 'Brantford'],
  },
};

const SERVICES = [
  { slug: 'hvac',             label: 'HVAC',            icon: <Zap className="size-7" />, color: 'blue',    desc: 'Furnace, AC, heat pumps & air quality' },
  { slug: 'handyman',         label: 'Handyman',        icon: <Wrench className="size-7" />, color: 'amber',   desc: 'Mounting, repairs, assembly & painting' },
  { slug: 'plumbing',         label: 'Plumbing',        icon: <Target className="size-7" />, color: 'cyan',    desc: 'Leaks, drains, fixtures & waterlines' },
  { slug: 'electrical',       label: 'Electrical',      icon: <Lightbulb className="size-7" />, color: 'yellow',  desc: 'Panel upgrades, outlets, fixtures & EV' },
  { slug: 'appliance-repair', label: 'Appliance Repair',icon: <Home className="size-7" />, color: 'emerald', desc: 'Fridge, washer, stove & dishwasher repair' },
  { slug: 'smart-home',       label: 'Smart Home',      icon: <Smartphone className="size-7" />, color: 'purple',  desc: 'Cameras, thermostats, locks & automation' },
];

const SERVICE_COLOR_CLASSES: Record<string, { badge: string; icon: string }> = {
  blue:    { badge: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]',    icon: 'text-[#2563EB]' },
  amber:   { badge: 'bg-[#FEF3C7] border-[#FDE68A] text-[#F59E0B]',    icon: 'text-[#F59E0B]' },
  cyan:    { badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600',  icon: 'text-cyan-600' },
  yellow:  { badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600', icon: 'text-yellow-600' },
  emerald: { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600', icon: 'text-emerald-600' },
  purple:  { badge: 'bg-purple-500/10 border-purple-500/20 text-purple-600', icon: 'text-purple-600' },
};

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us what you need',
    desc: 'Fill out a simple 60-second form describing your issue. No account required.',
    icon: <Target className="size-6" />,
  },
  {
    step: '02',
    title: 'We match you with a vetted expert pro',
    desc: 'Our concierge reviews your request and connects you with a background-checked, licensed specialist.',
    icon: <Users className="size-6" />,
  },
  {
    step: '03',
    title: 'Job done, we follow up',
    desc: 'Your pro arrives on time. We check in after the job to ensure you are 100% satisfied.',
    icon: <CheckCircle2 className="size-6" />,
  },
];

const TRUST_BADGES = [
  { icon: <Target className="size-6" />, label: 'Background-checked' },
  { icon: <ShieldCheck className="size-6" />, label: 'Licensed & insured' },
  { icon: <Star className="size-6" />, label: 'Satisfaction guaranteed' },
  { icon: <MapPin className="size-6" />, label: 'Expert-matched' },
];

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function AreaLandingPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const area = areaSlug ? AREA_DATA[areaSlug.toLowerCase()] : undefined;

  if (!area) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="bg-white rounded-[40px] border border-[#E2E8F0] p-16 text-center max-w-md">
          <div className="text-5xl mb-6"><MapPin</div>
          <h1 className="text-3xl font-black tracking-tighter mb-4 text-[#0F172A]">Area Coming Soon</h1>
          <p className="text-[#475569] mb-8">
            We're expanding quickly. Enter your postal code on the request form and we'll let you know when The Helper arrives near you.
          </p>
          <Link
            to="/get-quotes"
            className="inline-block px-8 py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] hover:-translate-y-0.5 transition-all"
          >
            Get Help
          </Link>
        </div>
      </div>
    );
  }

  // Generate unique meta content based on area
  const getMetaContent = () => {
    const baseServices = 'HVAC, Plumber, Electrician, Handyman';

    if (areaSlug === 'milton') {
      return {
        title: `Milton Home Services | ${baseServices} | New Builds & Established Homes | The Helper`,
        description: `Serving ${area.localContent?.stats.homeownersServed || '850+'} Milton homeowners. Vetted HVAC, plumbing, electrical & handyman pros for new builds in Boyne, Scott, Willmott and established homes near Main Street. Same-day service available.`,
        ogTitle: `Home Services in Milton, ON | Fast-Growing Community, Reliable Pros`,
        ogDescription: `From new construction in Scott to century homes on Main Street - The Helper matches Milton homeowners with verified local contractors. ${area.localContent?.stats.satisfactionRate || '97%'} satisfaction rate.`,
        keywords: `Milton home services, Milton HVAC, Milton plumber, Milton electrician, Milton handyman, Boyne home services, Scott neighbourhood contractor, Milton new build services, Main Street Milton repairs`,
      };
    }

    if (areaSlug === 'oakville') {
      return {
        title: `Oakville Home Services | ${baseServices} | Premium Homes, Expert Pros | The Helper`,
        description: `Trusted by ${area.localContent?.stats.homeownersServed || '1,200+'} Oakville homeowners. Vetted pros for waterfront estates in Bronte, heritage homes in Old Oakville, and modern builds in North Oakville. ${area.localContent?.stats.satisfactionRate || '98%'} satisfaction.`,
        ogTitle: `Home Services in Oakville, ON | Quality Craftsmen for Quality Homes`,
        ogDescription: `Oakville's established neighbourhoods deserve expert care. The Helper connects you with ${area.localContent?.stats.localPros || '60+'} verified local pros who understand heritage and premium homes.`,
        keywords: `Oakville home services, Oakville HVAC, Oakville plumber, Oakville electrician, Oakville handyman, Old Oakville contractor, Bronte home services, Glen Abbey repairs, heritage home specialist Oakville`,
      };
    }

    if (areaSlug === 'burlington') {
      return {
        title: `Burlington Home Services | ${baseServices} | Waterfront to Escarpment | The Helper`,
        description: `Serving ${area.localContent?.stats.homeownersServed || '1,050+'} Burlington homeowners. Expert HVAC, plumbing, electrical & handyman pros for Aldershot bungalows, downtown condos, and Tyandaga family homes. ${area.localContent?.stats.avgResponseTime || '11 min'} avg response.`,
        ogTitle: `Home Services in Burlington, ON | Diverse Housing, Adaptable Pros`,
        ogDescription: `From lakeside condos to Escarpment-area homes - Burlington's diverse housing needs pros who adapt. ${area.localContent?.stats.localPros || '55+'} verified contractors ready to help.`,
        keywords: `Burlington home services, Burlington HVAC, Burlington plumber, Burlington electrician, Burlington handyman, Aldershot home services, Downtown Burlington contractor, Tyandaga repairs, Burlington condo services`,
      };
    }

    // Default for other areas
    return {
      title: `Home Services in ${area.name}, ON | ${baseServices} | The Helper`,
      description: `Find vetted HVAC, plumbing, electrical, handyman, appliance repair & smart home pros in ${area.name}, ${area.region}. Licensed, insured contractors. Get matched and book today.`,
      ogTitle: `Home Services in ${area.name} | The Helper`,
      ogDescription: `Book verified home service pros in ${area.name}. HVAC, plumbing, electrical, handyman and more - matched, scheduled, and followed up for you.`,
      keywords: `home services ${area.name}, HVAC ${area.name}, plumber ${area.name}, electrician ${area.name}, handyman ${area.name}, appliance repair ${area.name}`,
    };
  };

  const metaContent = getMetaContent();

  return (
    <>
      <PageSeo
        title={metaContent.title}
        description={metaContent.description}
        ogTitle={metaContent.ogTitle}
        ogDescription={metaContent.ogDescription}
        canonicalPath={`/areas/${areaSlug}`}
        keywords={metaContent.keywords}
        structuredData={createLocalBusinessSchema({
          name: `The Helper - ${area.name}`,
          description: `Home services marketplace connecting ${area.name} homeowners with vetted local service providers for HVAC, plumbing, electrical, handyman, appliance repair and smart home installation.`,
          areaServed: [area.name, ...area.nearby],
          serviceType: ['HVAC Repair', 'Plumbing Services', 'Electrical Services', 'Handyman Services', 'Appliance Repair', 'Smart Home Installation'],
        })}
      />
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ── */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            {area.region} · {area.population} residents
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.95] mb-8 max-w-4xl text-[#0F172A]">
            {area.localContent ? (
              area.localContent.heroHeadline
            ) : (
              <>
                {area.name}'s Home Service{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
                  Concierge
                </span>
              </>
            )}
          </h1>

          <p className="text-xl text-[#475569] max-w-2xl mb-10">
            {area.localContent ? area.localContent.heroSubtext : `${area.tagline}. Expert, vetted pros matched to your job. Scheduling, coordination, and follow-up all handled for you.`}
          </p>

          <Link
            to="/get-quotes"
            className="px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
          >
            Get Help in {area.name} →
          </Link>
        </div>
      </section>

      {/* ── Local Stats (only for areas with localContent) ── */}
      {area.localContent && (
        <section className="py-12 px-6 bg-white border-y border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2563EB] mb-1">
                  {area.localContent.stats.homeownersServed}
                </div>
                <div className="text-sm text-[#475569] font-medium">{area.name} Homeowners Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2563EB] mb-1">
                  {area.localContent.stats.avgResponseTime}
                </div>
                <div className="text-sm text-[#475569] font-medium">Avg. Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2563EB] mb-1">
                  {area.localContent.stats.satisfactionRate}
                </div>
                <div className="text-sm text-[#475569] font-medium">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2563EB] mb-1">
                  {area.localContent.stats.localPros}
                </div>
                <div className="text-sm text-[#475569] font-medium">Verified Local Pros</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Services Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">Services in {area.name}</h2>
            <p className="text-[#475569]">Expert pros for every home need.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ slug, label, icon, color, desc }) => {
              const c = SERVICE_COLOR_CLASSES[color];
              return (
                <Link
                  key={slug}
                  to={`/get-quotes?service=${slug}`}
                  className="group p-8 bg-white rounded-[32px] border border-[#E2E8F0] hover:border-[#BFDBFE] transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-5 ${c.badge}`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-[#0F172A]">{label}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{desc}</p>
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.icon} group-hover:underline`}>
                    Book in {area.name} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Local Testimonials (only for areas with localContent) ── */}
      {area.localContent && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">
                What {area.name} Homeowners Say
              </h2>
              <p className="text-[#475569]">Real reviews from your neighbours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {area.localContent.testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] p-8 flex flex-col"
                >
                  <StarRating rating={testimonial.rating} />
                  <p className="text-[#475569] mt-4 mb-6 flex-grow leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-[#E2E8F0] pt-4">
                    <div className="font-bold text-[#0F172A]">{testimonial.name}</div>
                    <div className="text-sm text-[#475569]">
                      {testimonial.neighborhood} · {testimonial.service}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About This Area (only for areas with localContent) ── */}
      {area.localContent && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[40px] border border-[#E2E8F0] p-10 md:p-14">
              <h2 className="text-3xl font-black tracking-tighter mb-6 text-[#0F172A]">
                Home Services in {area.name}: We Know Your Area
              </h2>
              <p className="text-[#475569] leading-relaxed mb-8">
                {area.localContent.aboutArea}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                    <span className="text-xl"><MapPin</span> Neighbourhoods We Serve
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {area.localContent.neighborhoods.map((hood) => (
                      <span
                        key={hood}
                        className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-sm text-[#475569]"
                      >
                        {hood}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                    <span className="text-xl">🏛️</span> Local Landmarks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {area.localContent.localLandmarks.map((landmark) => (
                      <span
                        key={landmark}
                        className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-sm text-[#475569]"
                      >
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seasonal Tip */}
              <div className="mt-8 p-6 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl"><Lightbulb</span>
                  <div>
                    <div className="font-bold text-[#0F172A] mb-1">Local Tip</div>
                    <p className="text-sm text-[#475569]">{area.localContent.seasonalTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">How The Helper Works</h2>
            <p className="text-[#475569]">Three simple steps to a job well done.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc, icon }) => (
              <div
                key={step}
                className="bg-[#F8FAFC] rounded-[32px] border border-[#E2E8F0] p-8 flex flex-col gap-4 animate-in fade-in duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#2563EB]">{icon}</div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#2563EB]">Step {step}</span>
                </div>
                <h3 className="text-lg font-black leading-tight text-[#0F172A]">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-[#0F172A]">Every Pro is Verified</h2>
            <p className="text-[#475569]">Your home is in safe hands, always.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon, label }) => (
              <div
                key={label}
                className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col items-center gap-3 text-center hover:border-[#BFDBFE] transition-colors"
              >
                {icon}
                <span className="text-sm font-black leading-tight text-[#0F172A]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Areas ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black tracking-tighter mb-3 text-center text-[#0F172A]">Also Serving Nearby</h2>
          <p className="text-center text-[#475569] mb-8">
            The Helper connects homeowners with vetted pros across Halton Region.
          </p>

          {/* Primary Areas - Milton, Oakville, Burlington */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {['Milton', 'Oakville', 'Burlington']
              .filter((city) => city.toLowerCase() !== areaSlug?.toLowerCase())
              .map((city) => {
                const slug = city.toLowerCase();
                const cityData = AREA_DATA[slug];
                return (
                  <Link
                    key={city}
                    to={`/areas/${slug}`}
                    className="group p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-white transition-all"
                  >
                    <div className="font-black text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition-colors">
                      {city} →
                    </div>
                    <div className="text-sm text-[#475569]">
                      {cityData?.population} residents · {cityData?.localContent?.stats.localPros || '40+'} pros
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* Other nearby areas */}
          <div className="flex flex-wrap justify-center gap-3">
            {area.nearby
              .filter((city) => !['Milton', 'Oakville', 'Burlington'].includes(city))
              .map((city) => {
                const slug = city.toLowerCase().replace(/\s+/g, '-');
                const isInData = Object.keys(AREA_DATA).includes(slug);
                return isInData ? (
                  <Link
                    key={city}
                    to={`/areas/${slug}`}
                    className="px-5 py-2.5 rounded-full bg-white border border-[#E2E8F0] text-sm font-bold hover:border-[#BFDBFE] hover:text-[#2563EB] hover:-translate-y-0.5 transition-all"
                  >
                    {city} →
                  </Link>
                ) : (
                  <span
                    key={city}
                    className="px-5 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-bold text-[#475569]"
                  >
                    {city}
                  </span>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0F172A] rounded-[40px] p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent pointer-events-none rounded-[40px]" />
            <div className="relative">
              <div className="text-5xl mb-6"><Home</div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">
                Ready for a pro in {area.name}?
              </h2>
              <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
                Describe your issue once. We'll match you with the right expert, manage scheduling, and follow up until the job is done.
              </p>
              <Link
                to="/get-quotes"
                className="inline-block px-10 py-5 bg-[#2563EB] text-white font-black rounded-3xl text-lg hover:bg-[#1D4ED8] transition-all hover:-translate-y-1"
              >
                Get Help Now →
              </Link>
              <p className="mt-4 text-xs text-[#94A3B8]"><Gift Plus earn cashback on every job booked</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
