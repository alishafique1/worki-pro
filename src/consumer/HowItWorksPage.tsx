import { Link } from 'react-router';
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Hammer,
  MapPin,
  MessageSquareText,
  PlugZap,
  Search,
  ShieldCheck,
  ShowerHead,
  WashingMachine,
  Wrench,
} from 'lucide-react';

const SERVICES = [
  { icon: <AirVent className="size-6" />, name: 'HVAC', desc: 'Repairs, tune-ups, installs, seasonal maintenance' },
  { icon: <ShowerHead className="size-6" />, name: 'Plumbing', desc: 'Leaks, fixtures, drains, water heaters' },
  { icon: <PlugZap className="size-6" />, name: 'Electrical', desc: 'Panels, outlets, EV chargers, safety checks' },
  { icon: <WashingMachine className="size-6" />, name: 'Appliance Repair', desc: 'Fridges, washers, dryers, dishwashers' },
  { icon: <Hammer className="size-6" />, name: 'Handyman', desc: 'Repairs, mounting, assembly, punch lists' },
  { icon: <Wrench className="size-6" />, name: 'Smart Home', desc: 'Cameras, thermostats, locks, sensors' },
];

const STEPS = [
  {
    num: '01',
    icon: <Search className="size-5" />,
    title: 'Describe your job',
    desc: 'Use the service request form to explain what happened, where you are, and when you need help.',
  },
  {
    num: '02',
    icon: <BadgeCheck className="size-5" />,
    title: 'Submit the request',
    desc: 'Add your location, urgency level, preferred schedule, and contact details — all in one place.',
  },
  {
    num: '03',
    icon: <ClipboardList className="size-5" />,
    title: 'We route it forward',
    desc: 'Worki captures the structured details and passes them to the coordination workflow.',
  },
  {
    num: '04',
    icon: <CalendarCheck className="size-5" />,
    title: 'Follow up in your account',
    desc: 'Track your request status, appointment details, and messages from your dashboard.',
  },
];

const TRUST_POINTS = [
  { icon: <ShieldCheck className="size-5" />, title: 'Vetted providers', desc: 'Provider profiles include business details, service categories, and service areas.' },
  { icon: <ClipboardList className="size-5" />, title: 'Structured intake', desc: 'The form captures the right details before any request is sent.' },
  { icon: <MessageSquareText className="size-5" />, title: 'Clear updates', desc: 'Messages, booking details, and status changes stay connected to the job.' },
  { icon: <MapPin className="size-5" />, title: 'Local-first rollout', desc: 'Coverage expands by city and category based on verified provider supply.' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FEFEFD]">
      {/* Header */}
      <header className="border-b border-[var(--border-default)] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter">Worki</Link>
          <div className="flex items-center gap-4">
            <Link to="/discover" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-foreground transition-colors">
              Browse Pros
            </Link>
            <Link
              to="/request-service"
              className="px-5 py-2.5 bg-[var(--accent)] text-black font-bold rounded-[14px] hover:opacity-90 transition-opacity text-sm"
            >
              Request Service
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-4">How Worki works</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            One form. Better home service requests.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
            Worki replaces scattered calls and texts with a structured service request flow —
            so homeowners describe the job clearly and providers get what they need to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/request-service"
              className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-[22px] hover:opacity-90 transition-opacity shadow-[0_0_20px_var(--accent)/30]"
            >
              Submit a Request
            </Link>
            <Link
              to="/providers"
              className="px-8 py-4 bg-[var(--surface-base)] border border-[var(--border-default)] font-bold rounded-[22px] hover:border-[var(--accent)] transition-colors"
            >
              Join as a Pro
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">The process</p>
            <h2 className="text-4xl font-black tracking-tight">From request to resolution</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-[24px] border border-[var(--border-default)] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-[var(--text-tertiary)]">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-black text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">What we cover</p>
            <h2 className="text-4xl font-black tracking-tight">Service categories in Worki</h2>
            <p className="text-[var(--text-secondary)] mt-3">Select the category that fits your job when you submit a request.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="flex items-start gap-4 bg-white rounded-[20px] border border-[var(--border-default)] p-5 hover:border-[var(--accent)]/40 transition-colors">
                <div className="w-11 h-11 rounded-[12px] bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="font-black text-base mb-1">{svc.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't see your job?{' '}
              <Link to="/contact" className="text-[var(--accent)] font-semibold hover:underline">Get in touch</Link>
              {' '}and we'll try to match you with the right pro.
            </p>
          </div>
        </section>

        {/* Trust */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Why Worki</p>
            <h2 className="text-4xl font-black tracking-tight">Built for trust and clarity</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="flex items-start gap-4 bg-white rounded-[20px] border border-[var(--border-default)] p-5">
                <div className="w-10 h-10 rounded-[12px] bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-black text-base mb-1">{point.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Areas */}
        <section className="bg-[var(--surface-base)] rounded-[32px] border border-[var(--border-default)] p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Service areas</p>
          <h2 className="text-3xl font-black tracking-tight mb-4">Serving the GTA</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Worki is available across Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton.
            Coverage grows as we onboard verified providers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton', 'Hamilton'].map((area) => (
              <Link
                key={area}
                to={`/areas/${area.toLowerCase()}`}
                className="px-4 py-2 rounded-full border border-[var(--border-default)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {area}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to submit a request?</h2>
          <p className="text-[var(--text-secondary)] mb-8">It takes about 2 minutes to fill out the service request form.</p>
          <Link
            to="/request-service"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-black font-black rounded-[22px] hover:opacity-90 transition-opacity shadow-[0_0_20px_var(--accent)/30]"
          >
            Request Service <ArrowRight className="size-5" />
          </Link>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-10 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-tertiary)]">
          <p>© 2026 Worki Home Services. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
