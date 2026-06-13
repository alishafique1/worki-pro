import React from 'react';
import { Link } from 'react-router';
import PageSeo, { createFaqSchema } from './components/PageSeo';
import { CheckCircle2, CreditCard, Gift, ArrowRight, TrendingUp, Coffee, Home } from 'lucide-react';

const rewardsFaqs = [
  {
    question: 'How do I earn rewards with The Helper?',
    answer: 'You earn rewards at three stages: 500 points when you submit a service request, 500 points when your appointment is booked, and 5,000 bonus points on your first completed job. After your first job, you earn 5% points back on every completed service.',
  },
  {
    question: 'How do I redeem my rewards?',
    answer: 'Once your balance reaches 10,000 points ($100 cash value), you can redeem for Amazon gift cards, Starbucks cards, or credits toward your next The Helper booking. Redemptions are processed within 24 hours.',
  },
  {
    question: 'Do rewards expire?',
    answer: 'No, your earned rewards never expire. You can accumulate points over time and redeem whenever you reach the 10,000 point threshold ($100).',
  },
  {
    question: 'Can I earn rewards on every job?',
    answer: 'Yes, after your first completed job, you earn 5% of the job value in TheHelper points on every subsequent service. A $200 plumbing job earns 2,000 points, a $500 HVAC service earns 5,000 points.',
  },
];

const FIRST_JOB_TIERS = [
  {
    step: '01',
    title: 'Submit a Request: Earn 500 pts',
    points: '500 pts',
    dollar: '($5)',
    color: 'text-[#2563EB]',
    bg: 'bg-[#EFF6FF] border-[#BFDBFE]',
    icon: <CreditCard className="size-7 text-[#2563EB]" />,
    desc: 'Fill out our 60-second concierge form describing what you need. The moment your request is submitted, 500 points are added to your wallet. No appointment needed — just asking counts.',
  },
  {
    step: '02',
    title: 'Get Booked: Earn Another 500 pts',
    points: '500 pts',
    dollar: '($5)',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#FEF3C7] border-[#FDE68A]',
    icon: <CheckCircle2 className="size-7 text-[#F59E0B]" />,
    desc: 'When a vetted TheHelper pro accepts and schedules your appointment, another 500 points are credited. You are already at 1,000 points before the work starts.',
  },
  {
    step: '03',
    title: 'First Job Done: Earn 5,000 Bonus pts',
    points: '5,000 pts',
    dollar: '($50)',
    color: 'text-[#22C55E]',
    bg: 'bg-green-50 border-green-200',
    icon: <Gift className="size-7 text-[#22C55E]" />,
    desc: 'Once your pro marks the first job complete and our team verifies it, 5,000 bonus points land in your wallet. Total first job value: up to 6,000 points.',
  },
];

export default function HowRewardsWorkPage() {
  return (
    <>
      <PageSeo
        title="How Rewards Work — Earn Points on Every Home Service | The Helper"
        description="Earn up to 6,000 points on your first completed job, then 5% back on every job after. Points never expire. Redeem for Amazon gift cards, Starbucks, or service credits at 10,000 points."
        ogTitle="Earn Points on Every Home Service Job | The Helper"
        ogDescription="Stack 5% points back on every home service job. 6,000 points on your first completed job. Redeem for Amazon, Starbucks, or service credits."
        canonicalPath="/how-rewards-work"
        keywords="home services rewards, points program GTA, earn on home repairs, HVAC rewards, plumbing loyalty, handyman rewards"
        structuredData={createFaqSchema(rewardsFaqs)}
      />
    <div className='min-h-screen bg-[#F8FAFC]'>
      <main className='max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-32'>

        {/* Hero */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-6'>
            TheHelper Rewards
          </div>
          <h1 className='text-5xl sm:text-6xl font-black tracking-tighter mb-6 text-[#0F172A]'>
            Get Paid for Getting Things <span className='text-[#2563EB]'>Done.</span><br />
          </h1>
          <p className='text-xl text-[#475569] max-w-2xl mx-auto'>
            Your credit card earns points on purchases. The Helper <strong className='text-[#0F172A]'>pays you back on top of that</strong> for completing real home service jobs. <strong className='text-[#0F172A]'>6,000 points on your first job</strong>, then <strong className='text-[#0F172A]'>5% back</strong> on every job after. Never expires.
            <br /><span className='text-sm mt-2 inline-block text-[#94A3B8]'>100 pts = $1 · Cash out at 10,000 pts · Amazon, Starbucks, or service credits</span>
          </p>
        </div>

        {/* First Job Section */}
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-sm font-bold uppercase tracking-widest'>First Job</span>
            <span className='text-[#475569] font-bold'>Earn up to 6,000 pts</span>
          </div>
          <div className='space-y-6'>
            {FIRST_JOB_TIERS.map((tier) => (
              <div
                key={tier.step}
                className='bg-white rounded-[32px] border border-[#E2E8F0] p-10 flex flex-col md:flex-row items-start md:items-center gap-8'
              >
                <div className='shrink-0 text-center'>
                  <div className={`text-5xl font-black ${tier.color} mb-1`}>{tier.step}</div>
                  <div className='text-4xl'>{tier.icon}</div>
                </div>
                <div className='flex-1'>
                  <h2 className='text-2xl font-black mb-3 text-[#0F172A]'>{tier.title}</h2>
                  <p className='text-[#475569] leading-relaxed'>{tier.desc}</p>
                </div>
                <div className={`shrink-0 text-center px-8 py-6 rounded-2xl border ${tier.bg}`}>
                  <div className={`text-3xl font-black ${tier.color}`}>{tier.points}</div>
                  <div className='text-xs font-bold uppercase tracking-widest text-[#475569] mt-1'>{tier.dollar} value</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ongoing Cashback Section */}
        <div className='mb-16'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-sm font-bold uppercase tracking-widest'>Every Job After That</span>
            <span className='text-[#475569] font-bold'>5% points back</span>
          </div>
          <div className='bg-white rounded-[32px] border border-[#E2E8F0] p-10 flex flex-col md:flex-row items-start md:items-center gap-8'>
            <div className='shrink-0 text-center'>
              <div className='text-5xl font-black text-[#2563EB] mb-1'>5%</div>
              <div className='mt-2 mx-auto w-fit p-3 rounded-xl bg-[#EFF6FF]'>
                <CreditCard className='size-7 text-[#2563EB]' />
              </div>
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-black mb-3 text-[#0F172A]'>Ongoing 5% Points Back on Every Job</h2>
              <p className='text-[#475569] leading-relaxed'>
                After your first job, every completed booking earns you 5% of the job value in TheHelper points.
                A $200 plumbing job earns 2,000 points. A $500 HVAC service earns 5,000 points. It adds up fast and never expires.
              </p>
            </div>
            <div className='shrink-0'>
              <div className='text-center px-8 py-6 rounded-2xl border bg-[#EFF6FF] border-[#BFDBFE]'>
                <div className='text-sm font-bold text-[#475569] mb-2'>Example</div>
                <div className='text-xl font-black text-[#2563EB]'>$200 job</div>
                <div className='text-3xl font-black text-[#2563EB]'>= 2,000 pts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash out threshold callout */}
        <div className='bg-white rounded-[32px] border border-[#E2E8F0] p-10 mb-16'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='shrink-0 p-4 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]'>
              <TrendingUp className='size-8 text-[#F59E0B]' />
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-black mb-2 text-[#0F172A]'>Cash Out at 10,000 pts</h2>
              <p className='text-[#475569] leading-relaxed'>
                Once your balance hits <strong className='text-[#0F172A]'>10,000 points ($100 cash value)</strong>, you can redeem for Amazon gift cards, Starbucks, or credits toward your next TheHelper booking.
                Most homeowners hit 10,000 points after their second or third job. Redemptions are processed within 24 hours.
              </p>
            </div>
            <div className='shrink-0 text-center px-8 py-6 rounded-2xl border bg-[#FEF3C7] border-[#FDE68A]'>
              <div className='text-xs font-bold uppercase tracking-widest text-[#475569] mb-1'>Minimum Cashout</div>
              <div className='text-4xl font-black text-[#F59E0B]'>10,000 pts</div>
              <div className='text-sm text-[#94A3B8] font-semibold'>$100 value</div>
            </div>
          </div>
        </div>

        {/* Redemption options */}
        <div className='bg-white rounded-[32px] border border-[#E2E8F0] p-10 mb-16 text-center'>
          <h2 className='text-3xl font-black mb-4 text-[#0F172A]'>How to Redeem</h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-left'>
            {[
              { icon: <Gift className='size-7 text-[#2563EB]' />, label: 'Amazon Gift Cards', desc: 'Spend on anything you need' },
              { icon: <Coffee className='size-7 text-[#2563EB]' />, label: 'Starbucks Cards', desc: 'Your next coffee, on us' },
              { icon: <Home className='size-7 text-[#2563EB]' />, label: 'Service Discounts', desc: 'Apply to your next TheHelper booking' },
            ].map(r => (
              <div key={r.label} className='p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]'>
                <div className='mb-3 w-fit p-2.5 rounded-xl bg-[#EFF6FF]'>{r.icon}</div>
                <div className='font-bold mb-1 text-[#0F172A]'>{r.label}</div>
                <div className='text-sm text-[#475569]'>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center'>
          <Link
            to='/get-quotes'
            className='inline-block px-14 py-6 bg-[#2563EB] text-white font-black rounded-[30px] text-xl hover:bg-[#1D4ED8] transition-colors hover:scale-105 shadow-[0_8px_24px_rgba(37,99,235,0.3)]'
          >
            Start Earning: Request a Service
          </Link>
          <p className='mt-4 text-sm text-[#475569]'>No account required to get started.</p>
        </div>
      </main>
    </div>
    </>
  );
}
