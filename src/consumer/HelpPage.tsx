import React from 'react';
import { Link } from 'react-router';
import { FAQAccordion } from '../landing-page/marketplace/components';
import { Container } from '../landing-page/marketplace/components';
import {
  MessageSquare,
  BookOpen,
  CreditCard,
  ShieldCheck,
  CalendarCheck,
  Star,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';

const consumerFaqs = [
  {
    question: 'How do I request a service?',
    answer:
      'Click "Request Service" from your dashboard or the navigation. Fill in the details — category, urgency, property info, and description — and submit. A matching provider will be notified.',
  },
  {
    question: 'How long does it take to get matched with a pro?',
    answer:
      'Once you submit a request, a verified provider in your area is notified immediately. You should hear back within a few hours during business hours.',
  },
  {
    question: 'Are providers background-checked?',
    answer:
      'Provider onboarding includes verification of business details, credentials, and service areas. All providers must meet Worki\'s onboarding standards before accepting jobs.',
  },
  {
    question: 'How do I track my service request?',
    answer:
      'Go to "My Requests" in your dashboard. You\'ll see the current status of each request, any appointments scheduled, and messages from your provider.',
  },
  {
    question: 'How do appointments work?',
    answer:
      'Once a provider accepts your request, they can schedule an appointment time. You\'ll see it in your dashboard and receive any status updates as the job progresses.',
  },
  {
    question: 'How do rewards points work?',
    answer:
      'You earn points on completed services. Points appear in your Rewards wallet and can be redeemed for account credits toward future jobs. Check your points balance on the Rewards page.',
  },
  {
    question: 'How do I earn and use my referral code?',
    answer:
      'Go to the Referral page to find your unique code. Share it with friends — when they complete their first service, you both earn reward points automatically.',
  },
  {
    question: 'Can I message my provider?',
    answer:
      'Yes. Each active request has a messaging thread. You can send updates, ask questions, or clarify details directly from the request detail view.',
  },
  {
    question: 'What if I need to cancel or reschedule?',
    answer:
      'Contact your provider directly through the messaging thread on your request. If you need immediate help, reach out via the Contact page.',
  },
  {
    question: 'How do I leave a review?',
    answer:
      'After a service is completed, you can rate your experience on the request detail page. Your feedback helps other homeowners choose trusted providers.',
  },
  {
    question: 'What service categories are available?',
    answer:
      'Worki covers HVAC, handyman, plumbing, electrical, appliance repair, and smart home installation. Browse all available categories on the Services page.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'Worki currently serves Milton, Oakville, Burlington, Mississauga, Brampton, Hamilton, Toronto, and surrounding GTA areas. Coverage depends on provider availability in your neighbourhood.',
  },
];

const quickLinks = [
  {
    icon: <MessageSquare className="w-5 h-5 text-[var(--accent)]" />,
    label: 'Contact Support',
    description: 'Get help from the Worki team',
    href: '/contact',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-[var(--accent)]" />,
    label: 'How It Works',
    description: 'Understand the full service flow',
    href: '/how-it-works',
  },
  {
    icon: <CreditCard className="w-5 h-5 text-[var(--accent)]" />,
    label: 'Rewards',
    description: 'Check your points & redemption options',
    href: '/rewards',
  },
  {
    icon: <Users className="w-5 h-5 text-[var(--accent)]" />,
    label: 'Refer a Friend',
    description: 'Earn points when friends complete a job',
    href: '/referral',
  },
];

const trustItems = [
  { icon: <ShieldCheck className="w-4 h-4" />, text: 'Verified providers' },
  { icon: <CalendarCheck className="w-4 h-4" />, text: 'Appointment scheduling' },
  { icon: <Star className="w-4 h-4" />, text: 'Provider ratings & reviews' },
  { icon: <Zap className="w-4 h-4" />, text: 'Real-time request status' },
];

export default function HelpPage() {
  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <div className="bg-[var(--surface-raised)] border-b border-[var(--border-default)]">
        <Container>
          <div className="py-14 max-w-2xl">
            <h1 className="text-5xl font-black tracking-tighter mb-3">Help Centre</h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Everything you need to know about using Worki — from submitting your first request to redeeming rewards.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 grid lg:grid-cols-[1fr_300px] gap-10">
          {/* FAQ Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">Frequently Asked Questions</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Can't find what you're looking for?{' '}
                <Link to="/contact" className="text-[var(--accent)] hover:underline">
                  Contact our team
                </Link>
              </p>
            </div>
            <FAQAccordion faqs={consumerFaqs} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] p-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-start gap-3 p-3 rounded-[14px] bg-[var(--surface-base)] hover:bg-[var(--surface-overlay)] transition-colors group"
                  >
                    <div className="mt-0.5">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{link.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors mt-0.5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust strip */}
            <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] p-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-[var(--text-secondary)]">
                What You Get
              </h3>
              <div className="space-y-2.5">
                {trustItems.map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <div className="text-[var(--accent)]">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-[var(--accent)] rounded-[20px] p-5">
              <h3 className="font-bold text-black mb-1">Still need help?</h3>
              <p className="text-sm text-black/70 mb-3">
                Our team is here for you. Send us a message and we'll get back to you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-bold px-4 py-2.5 rounded-[14px] hover:bg-black/80 transition-colors"
              >
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
