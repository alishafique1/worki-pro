import React from 'react';
import { Link } from 'react-router';

const TIERS = [
  {
    step: '01',
    title: 'Submit a Request — Earn $5',
    points: '500 pts',
    dollar: '$5',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: '📋',
    desc: 'Fill out our 60-second concierge form describing what you need. The moment your request is submitted, 500 points ($5) are added to your wallet, pending verification. No appointment needed — just asking counts.',
  },
  {
    step: '02',
    title: 'Get Booked — Earn Another $5',
    points: '500 pts',
    dollar: '$5',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    icon: '📅',
    desc: 'When a vetted Worki pro accepts and schedules your appointment, another 500 points ($5) are credited. You\'re now at $10 in rewards before the work even starts.',
  },
  {
    step: '03',
    title: 'Job Done — Earn $50',
    points: '5,000 pts',
    dollar: '$50',
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent)]/10 border-[var(--accent)]/20',
    icon: '✅',
    desc: 'Once your pro marks the job complete and our team verifies it, 5,000 points ($50) land in your wallet. One job = up to $60 in total rewards you can spend on gift cards or your next service.',
  },
];

export default function HowRewardsWorkPage() {
  return (
    <div className='min-h-screen bg-background mesh-gradient dark:mesh-gradient-dark'>
      <main className='max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-32'>

        {/* Hero */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6'>
            Worki Rewards
          </div>
          <h1 className='text-5xl sm:text-7xl font-black tracking-tighter mb-6'>
            Earn Up to <span className='text-[var(--accent)]'>$60</span><br />Per Service Job.
          </h1>
          <p className='text-xl text-[var(--text-secondary)] max-w-2xl mx-auto'>
            Most home service platforms charge you more and give you nothing back.
            Worki rewards you at every step — request, booking, and completion.
            <strong className='text-foreground'> 100 points = $1.</strong> Simple.
          </p>
        </div>

        {/* Tier cards */}
        <div className='space-y-8 mb-20'>
          {TIERS.map((tier) => (
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

        {/* Redemption explanation */}
        <div className='glass dark:glass-dark rounded-[32px] border border-white/10 p-10 mb-16 text-center'>
          <h2 className='text-3xl font-black mb-4'>How to Redeem</h2>
          <p className='text-[var(--text-secondary)] max-w-2xl mx-auto mb-8'>
            Once your balance reaches <strong className='text-foreground'>500 points ($5)</strong>, you can redeem for Amazon gift cards,
            Starbucks, or credits towards your next Worki service. Redemptions are processed within 24 hours after admin approval.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-left'>
            {[
              { icon: '🎁', label: 'Amazon Gift Cards', desc: 'Spend on anything you need' },
              { icon: '☕', label: 'Starbucks Cards', desc: 'Your next coffee, on us' },
              { icon: '🏠', label: 'Service Discounts', desc: 'Apply to your next Worki booking' },
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
  );
}
