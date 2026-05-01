import React from 'react';
import { Link } from 'react-router';

export default function HowRewardsWorkPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="isolate">
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            How <span className="text-[var(--accent)]">Worki</span> Rewards Work.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Caring for your home should be rewarding. Here is how our 3-step process works.
          </p>
          
          <div className="mt-20 space-y-24 w-full text-left">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="text-4xl font-black text-[var(--accent)] mb-4">01.</div>
                <h2 className="text-3xl font-bold mb-4">Request a Service</h2>
                <p className="text-lg text-[var(--text-secondary)]">
                  Fill out our simple 60-second form or call/text us. We will qualify your request and match you with a vetted pro in your area.
                </p>
              </div>
              <div className="flex-1 h-64 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]"></div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1 text-right">
                <div className="text-4xl font-black text-[var(--accent)] mb-4">02.</div>
                <h2 className="text-3xl font-bold mb-4">Get the Job Done</h2>
                <p className="text-lg text-[var(--text-secondary)]">
                  The provider completes the service to your satisfaction. You pay the provider directly as you normally would.
                </p>
              </div>
              <div className="flex-1 h-64 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="text-4xl font-black text-[var(--accent)] mb-4">03.</div>
                <h2 className="text-3xl font-bold mb-4">Earn & Redeem</h2>
                <p className="text-lg text-[var(--text-secondary)]">
                  Once the job is verified, points are added to your Worki wallet. Redeem 100 points for $1 in gift cards or future service discounts.
                </p>
              </div>
              <div className="flex-1 h-64 bg-[var(--surface-raised)] rounded-3xl border border-[var(--border-default)]"></div>
            </div>
          </div>

          <div className="mt-32">
             <Link
              to="/signup"
              className="px-12 py-5 bg-[var(--accent)] text-[#000] font-bold rounded-[30px] text-xl hover:opacity-90 transition-opacity"
            >
              Start Earning Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
