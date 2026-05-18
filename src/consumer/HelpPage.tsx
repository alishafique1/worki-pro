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
      'Click "Request Service" from your dashboard or the navigation. Fill in the details (category, urgency, property info, and description) and submit. A matching provider will be notified.',
  },
  {
    question: 'How long does it take to get matched with a pro?',
    answer:
      'Once you submit a request, a verified provider in your area is notified immediately. You should hear back within a few hours during business hours.',
  },
  {
    question: 'Are providers background-checked?',
    answer:
      'Provider onboarding includes verification of business details, credentials, and service areas. All providers must meet TheHelper\'s onboarding standards before accepting jobs.',
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
      'Go to the Referral page to find your unique code. Share it with friends. When they complete their first service, you both earn reward points automatically.',
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
      'TheHelper covers HVAC, handyman, plumbing, electrical, appliance repair, and smart home installation. Browse all available categories on the Services page.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'TheHelper currently serves Milton, Oakville, Burlington, Mississauga, Brampton, Hamilton, Toronto, and surrounding GTA areas. Coverage depends on provider availability in your neighbourhood.',
  },
];

const quickLinks = [
  {
    icon: <MessageSquare className="w-5 h-5 text-[#2563EB]" />,
    label: 'Contact Support',
    description: 'Get help from the TheHelper team',
    href: '/contact',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
    label: 'How It Works',
    description: 'Understand the full service flow',
    href: '/how-it-works',
  },
  {
    icon: <CreditCard className="w-5 h-5 text-[#2563EB]" />,
    label: 'Rewards',
    description: 'Check your points & redemption options',
    href: '/rewards',
  },
  {
    icon: <Users className="w-5 h-5 text-[#2563EB]" />,
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
    <div className="min-h-[80vh] bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <Container>
          <div className="py-14 max-w-2xl">
            <h1 className="text-5xl font-black tracking-tighter mb-3 text-[#0F172A]">Help Centre</h1>
            <p className="text-[#475569] text-lg">
              Everything you need to know about using TheHelper, from submitting your first request to redeeming rewards.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12 grid lg:grid-cols-[1fr_300px] gap-10">
          {/* FAQ Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1 text-[#0F172A]">Frequently Asked Questions</h2>
              <p className="text-[#475569] text-sm">
                Can't find what you're looking for?{' '}
                <Link to="/contact" className="text-[#2563EB] hover:underline">
                  Contact our team
                </Link>
              </p>
            </div>
            <FAQAccordion faqs={consumerFaqs} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-[#475569]">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-start gap-3 p-3 rounded-[14px] bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors group"
                  >
                    <div className="mt-0.5">{link.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover:text-[#2563EB] transition-colors text-[#0F172A]">
                        {link.label}
                      </p>
                      <p className="text-xs text-[#475569] mt-0.5">{link.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors mt-0.5 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust strip */}
            <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-5">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-[#475569]">
                What You Get
              </h3>
              <div className="space-y-2.5">
                {trustItems.map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <div className="text-[#2563EB]">{item.icon}</div>
                    <span className="text-sm text-[#0F172A]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-[#2563EB] rounded-[20px] p-5">
              <h3 className="font-bold text-white mb-1">Still need help?</h3>
              <p className="text-sm text-white/70 mb-3">
                Our team is here for you. Send us a message and we'll get back to you.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 bg-white text-[#2563EB] text-sm font-bold px-4 py-2.5 rounded-[14px] hover:bg-[#EFF6FF] transition-colors"
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
