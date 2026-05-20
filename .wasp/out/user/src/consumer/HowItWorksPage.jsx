import { Link } from 'react-router';
import { AirVent, ArrowRight, BadgeCheck, CalendarCheck, ClipboardList, Clock3, Hammer, MapPin, MessageSquareText, PlugZap, Search, ShieldCheck, ShowerHead, WashingMachine, Wrench, } from 'lucide-react';
const SERVICES = [
    { icon: <AirVent className="size-6"/>, name: 'HVAC', desc: 'Repairs, tune-ups, installs, seasonal maintenance' },
    { icon: <ShowerHead className="size-6"/>, name: 'Plumbing', desc: 'Leaks, fixtures, drains, water heaters' },
    { icon: <PlugZap className="size-6"/>, name: 'Electrical', desc: 'Panels, outlets, EV chargers, safety checks' },
    { icon: <WashingMachine className="size-6"/>, name: 'Appliance Repair', desc: 'Fridges, washers, dryers, dishwashers' },
    { icon: <Hammer className="size-6"/>, name: 'Handyman', desc: 'Repairs, mounting, assembly, punch lists' },
    { icon: <Wrench className="size-6"/>, name: 'Smart Home', desc: 'Cameras, thermostats, locks, sensors' },
];
const STEPS = [
    {
        num: '01',
        icon: <Search className="size-5"/>,
        title: 'Submit your request',
        desc: 'Takes under 2 minutes. Tell us what you need, where you are, and when works for you. 100% free.',
    },
    {
        num: '02',
        icon: <BadgeCheck className="size-5"/>,
        title: 'Get matched fast',
        desc: 'We connect you with a verified local pro, typically within 15 minutes. Same-day service available.',
    },
    {
        num: '03',
        icon: <CalendarCheck className="size-5"/>,
        title: 'Book your appointment',
        desc: 'The pro texts you to confirm details and schedule. Pick a time that works for you.',
    },
    {
        num: '04',
        icon: <ClipboardList className="size-5"/>,
        title: 'Job done. Get rewarded.',
        desc: 'Earn up to $60 back on your first job. Track everything from your dashboard.',
    },
];
const TRUST_POINTS = [
    { icon: <ShieldCheck className="size-5"/>, title: 'Verified local pros', desc: 'Every pro is vetted before joining. Credentials, insurance, and reviews verified.' },
    { icon: <Clock3 className="size-5"/>, title: 'Fast matching', desc: 'Most homeowners get matched within 15 minutes. Same-day service available.' },
    { icon: <MessageSquareText className="size-5"/>, title: '100% free for homeowners', desc: 'No platform fees, no credit card required. You only pay the pro for the work.' },
    { icon: <MapPin className="size-5"/>, title: 'Local GTA coverage', desc: 'Serving Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton.' },
];
export default function HowItWorksPage() {
    return (<div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#0F172A]">TheHelper</Link>
          <div className="flex items-center gap-4">
            <Link to="/discover" className="text-sm font-semibold text-[#475569] hover:text-[#0F172A] transition-colors">
              Browse Pros
            </Link>
            <Link to="/request-service" className="px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors text-sm">
              Request Service
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB] mb-4">How TheHelper works</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-[#0F172A]">
            Submit. Match. Book. Done.
          </h1>
          <p className="text-xl text-[#475569] leading-relaxed">
            Get connected to a verified local pro in under 15 minutes. 100% free for homeowners.
            No more calling around or waiting for callbacks.
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[#475569]">
            {['100% Free for Homeowners', 'Verified Local Pros', 'Same-Day Available', '500+ GTA Homeowners'].map((item) => (<span key={item} className="flex items-center gap-1.5">
                <span className="text-[#22C55E] font-bold">✓</span>
                {item}
              </span>))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request-service" className="px-8 py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] transition-colors">
              Get Free Quotes Now
            </Link>
            <Link to="/providers/apply" className="px-8 py-4 bg-white border border-[#E2E8F0] font-bold rounded-[22px] hover:border-[#2563EB] transition-colors text-[#0F172A]">
              Join as a Pro
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB] mb-3">The process</p>
            <h2 className="text-4xl font-black tracking-tight text-[#0F172A]">From request to resolution</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (<div key={step.num} className="step-card bg-white rounded-[24px] border border-[#E2E8F0] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-[#94A3B8]">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-black text-lg mb-1 text-[#0F172A]">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
                </div>
              </div>))}
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB] mb-3">What we cover</p>
            <h2 className="text-4xl font-black tracking-tight text-[#0F172A]">Service categories in TheHelper</h2>
            <p className="text-[#475569] mt-3">Select the category that fits your job when you submit a request.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc) => (<div key={svc.name} className="flex items-start gap-4 bg-white rounded-[20px] border border-[#E2E8F0] p-5 hover:border-[#BFDBFE] transition-colors">
                <div className="w-11 h-11 rounded-[12px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="font-black text-base mb-1 text-[#0F172A]">{svc.name}</h3>
                  <p className="text-sm text-[#475569]">{svc.desc}</p>
                </div>
              </div>))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#475569]">
              Don't see your job?{' '}
              <Link to="/contact" className="text-[#2563EB] font-semibold hover:underline">Get in touch</Link>
              {' '}and we'll try to match you with the right pro.
            </p>
          </div>
        </section>

        {/* Trust */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB] mb-3">Why TheHelper</p>
            <h2 className="text-4xl font-black tracking-tight text-[#0F172A]">Built for trust and clarity</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRUST_POINTS.map((point) => (<div key={point.title} className="flex items-start gap-4 bg-white rounded-[20px] border border-[#E2E8F0] p-5">
                <div className="w-10 h-10 rounded-[12px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-black text-base mb-1 text-[#0F172A]">{point.title}</h3>
                  <p className="text-sm text-[#475569]">{point.desc}</p>
                </div>
              </div>))}
          </div>
        </section>

        {/* Areas */}
        <section className="bg-white rounded-[32px] border border-[#E2E8F0] p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2563EB] mb-3">Service areas</p>
          <h2 className="text-3xl font-black tracking-tight mb-4 text-[#0F172A]">Serving the GTA</h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            TheHelper is available across Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton.
            Coverage grows as we onboard verified providers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Hamilton'].map((area) => (<Link key={area} to={`/areas/${area.toLowerCase()}`} className="px-4 py-2 rounded-full border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                {area}
              </Link>))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4 text-[#0F172A]">Ready to get matched?</h2>
          <p className="text-[#475569] mb-4">Takes under 2 minutes. 100% free, no credit card required.</p>
          <p className="text-sm text-[#22C55E] font-semibold mb-8">Earn up to $60 back on your first completed job</p>
          <Link to="/request-service" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] transition-colors">
            Get Free Quotes Now <ArrowRight className="size-5"/>
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-10 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#94A3B8]">
          <p>© 2026 TheHelper Home Services. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-[#0F172A] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[#0F172A] transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>);
}
