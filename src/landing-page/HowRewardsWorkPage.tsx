import React from 'react';
import { Link } from 'react-router';
import PageSeo from './components/PageSeo';

const FIRST_JOB_TIERS = [
  {
    step: '01',
    title: 'Submit a Request — Earn $5',
    points: '500 pts',
    dollar: '$5',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: '📋',
    desc: 'Fill out our 60-second concierge form describing what you need. The moment your request is submitted, 500 points ($5) are added to your wallet. No appointment needed — just asking counts.',
  },
  {
    step: '02',
    title: 'Get Booked — Earn Another $5',
    points: '500 pts',
    dollar: '$5',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    icon: '📅',
    desc: 'When a vetted TheHelper pro accepts and schedules your appointment, another 500 points ($5) are credited. You\'re already at $10 before the work starts.',
  },
  {
    step: '03',
    title: 'First Job Done — Earn $50 Bonus',
    points: '5,000 pts',
    dollar: '$50',
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent)]/10 border-[var(--accent)]/20',
    icon: '🎉',
    desc: 'Once your pro marks the first job complete and our team verifies it, a $50 welcome bonus (5,000 points) lands in your wallet. Total first job value: up to $60 in rewards.',
  },
];

export default function HowRewardsWorkPage() {
  return (
    <>
      <PageSeo
        title="How TheHelper Rewards Work — Earn 5% Cashback on Home Services"
        description="Earn up to $60 back on your first home service job and 5% cashback on every job after. Stack TheHelper rewards on top of your credit card points. Cash out at $100."
        ogTitle="Earn 5% Cashback on Home Services | TheHelper Rewards"
        ogDescription="TheHelper stacks 5% cashback on top of your credit card points. Earn up to $60 on your first job — HVAC, plumbing, electrical & more in the GTA."
        canonicalPath="/how-rewards-work"
      />
    <div className='min-h-screen bg-background mesh-gradient dark:mesh-gradient-dark'>
      <main className='max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-32'>

        {/* Hero */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6'>
            TheHelper Rewards
          </div>
          <h1 className='text-5xl sm:text-7xl font-black tracking-tighter mb-6'>
            Double the Rewards<br /><span className='text-[var(--accent)]'>On Every Job.</span>
          </h1>
          <p className='text-xl text-[var(--text-secondary)] max-w-2xl mx-auto'>
            Your Visa or Amex already gives you points when you pay — TheHelper stacks <strong className='text-foreground'>cashback on top of that</strong>.
            Earn <strong className='text-foreground'>$60 back on your first job</strong>, then <strong className='text-foreground'>5% cashback</strong> on every job after.
            Double the rewards for home services you were always going to pay for.
            <br /><span className='text-sm mt-2 inline-block'>Cash out at $100. 100 pts = $1. Simple.</span>
          </p>
        </div>

        {/* First Job Section */}
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-bold uppercase tracking-widest'>First Job</span>
            <span className='text-[var(--text-secondary)] font-bold'>Earn up to $60</span>
          </div>
          <div className='space-y-6'>
            {FIRST_JOB_TIERS.map((tier) => (
              <div
                key={tier.step}
                className='glass dark:glass-dark rounded-[32px] border border-white/10 p-10 flex flex-col md:flex-row items-start md:items-center gap-8'
              >
                <div className='shrink-0 text-center'>
                  <div className={`text-5xl font-black ${tier.color} mb-1`}>{tier.step}</div>
                  <div className='text-4xl'>{tier.icon}</div>
                </div>
                <div className='flex-1'>
                  <h2 className='text-2xl font-black mb-3'>{tier.title}</h2>
                  <p className='text-[var(--text-secondary)] leading-relaxed'>{tier.desc}</p>
                </div>
                <div className={`shrink-0 text-center px-8 py-6 rounded-2xl border ${tier.bg}`}>
                  <div className={`text-3xl font-black ${tier.color}`}>{tier.dollar}</div>
                  <div className='text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1'>{tier.points}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ongoing Cashback Section */}
        <div className='mb-16'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest'>Every Job After That</span>
            <span className='text-[var(--text-secondary)] font-bold'>5% cashback</span>
          </div>
          <div className='glass dark:glass-dark rounded-[32px] border border-white/10 p-10 flex flex-col md:flex-row items-start md:items-center gap-8'>
            <div className='shrink-0 text-center'>
              <div className='text-5xl font-black text-blue-400 mb-1'>5%</div>
              <div className='text-4xl'>💳</div>
            </div>
            <div className='flex-1'>
              <h2 className='text-2xl font-black mb-3'>Ongoing 5% Cashback — On Every Job</h2>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                After your first job, every completed booking earns you 5% of the job value in TheHelper points.
                A $200 plumbing job? That's $10 back. A $500 HVAC tune-up? $25 back. It adds up fast — and never expires.
              </p>
            </div>
            <div className='shrink-0'>
              <div className='text-center px-8 py-6 rounded-2xl border bg-blue-500/10 border-blue-500/20'>
                <div className='text-sm font-bold text-[var(--text-secondary)] mb-2'>Example</div>
                <div className='text-xl font-black text-blue-400'>$200 job</div>
                <div className='text-3xl font-black text-blue-400'>= $10 back</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash out threshold callout */}
        <div className='glass dark:glass-dark rounded-[32px] border border-white/10 p-10 mb-16'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='text-6xl'>🏦</div>
            <div className='flex-1'>
              <h2 className='text-2xl font-black mb-2'>Cash Out at $100</h2>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                Once your balance hits <strong className='text-foreground'>$100 (10,000 points)</strong>, you can redeem for Amazon gift cards, Starbucks, or credits toward your next TheHelper booking.
                Most homeowners hit $100 after their second or third job. Redemptions are processed within 24 hours.
              </p>
            </div>
            <div className='shrink-0 text-center px-8 py-6 rounded-2xl border bg-[var(--accent)]/10 border-[var(--accent)]/20'>
              <div className='text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1'>Minimum Cashout</div>
              <div className='text-4xl font-black text-[var(--accent)]'>$100</div>
            </div>
          </div>
        </div>

        {/* Redemption options */}
        <div className='glass dark:glass-dark rounded-[32px] border border-white/10 p-10 mb-16 text-center'>
          <h2 className='text-3xl font-black mb-4'>How to Redeem</h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-left'>
            {[
              { icon: '🎁', label: 'Amazon Gift Cards', desc: 'Spend on anything you need' },
              { icon: '☕', label: 'Starbucks Cards', desc: 'Your next coffee, on us' },
              { icon: '🏠', label: 'Service Discounts', desc: 'Apply to your next TheHelper booking' },
            ].map(r => (
              <div key={r.label} className='p-6 bg-[var(--surface-base)] rounded-2xl border border-[var(--border-default)]'>
                <div className='text-3xl mb-3'>{r.icon}</div>
                <div className='font-bold mb-1'>{r.label}</div>
                <div className='text-sm text-[var(--text-secondary)]'>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className='text-center'>
          <Link
            to='/request-service'
            className='inline-block px-14 py-6 bg-[var(--accent)] text-black font-black rounded-[30px] text-xl hover:scale-105 transition-transform'
          >
            Start Earning — Request a Service
          </Link>
          <p className='mt-4 text-sm text-[var(--text-secondary)]'>No account required to get started.</p>
        </div>
      </main>
    </div>
    </>
  );
}
