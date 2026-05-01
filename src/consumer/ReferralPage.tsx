import React, { useState } from 'react';
import { useAuth } from 'wasp/client/auth';

export default function ReferralPage() {
  const { data: user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id
    ? `REF-${user.id.slice(-6).toUpperCase()}`
    : 'Loading…';

  function handleCopy() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Refer a Friend</h1>

      <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-4">
        <p className="text-[var(--text-secondary)]">
          Invite friends to Worki — you both earn <span className="text-[var(--accent)] font-semibold">250 reward points</span> when they complete their first service.
        </p>
        <div className="bg-[var(--surface-base)] rounded-[12px] border border-[var(--border-default)] flex items-center justify-between px-4 py-3">
          <code className="text-[var(--accent)] text-lg font-mono tracking-widest">{referralCode}</code>
          <button
            onClick={handleCopy}
            className="ml-4 px-4 py-2 bg-[var(--accent)] text-black rounded-[22px] font-bold text-sm flex items-center gap-1.5 transition-all"
          >
            {copied ? <span>✓ Copied</span> : 'Copy Code'}
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-4">
        <h2 className="text-lg font-bold">How it Works</h2>
        <ol className="space-y-3">
          {[
            'Share your unique referral code with friends.',
            'Your friend signs up and completes their first service.',
            'You both earn 250 reward points automatically.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)] text-black text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-[var(--text-secondary)] text-sm leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-[var(--text-tertiary)] border-t border-[var(--border-default)] pt-3">
          Referral rewards are credited once your friend's first service is completed and verified.
        </p>
      </div>
    </div>
  );
}

