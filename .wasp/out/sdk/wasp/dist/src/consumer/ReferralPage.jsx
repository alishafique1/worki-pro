import React, { useState } from 'react';
import { useQuery, getMyReferral } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
export default function ReferralPage() {
    useRoleGuard('CONSUMER');
    const { data: referral, isLoading } = useQuery(getMyReferral);
    const [copied, setCopied] = useState(false);
    const referralCode = referral?.referralCode ?? 'Loading…';
    function handleCopy() {
        navigator.clipboard.writeText(referralCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
    const referralsCompleted = referral?.status === 'REWARDED' ? 1 : referral?.referredUserId ? 1 : 0;
    return (<div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Refer a Friend</h1>

      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4">
        <p className="text-[#475569]">
          Earn $5 for every friend you refer, and they earn $5 too. <span className="text-[#2563EB] font-semibold">500 reward points ($5)</span> credited after their first completed service.
        </p>
        {isLoading ? (<div className="h-12 bg-[#F8FAFC] rounded-[12px] animate-pulse"/>) : (<div className="bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0] flex items-center justify-between px-4 py-3">
            <code className="text-[#2563EB] text-lg font-mono tracking-widest">{referralCode}</code>
            <button onClick={handleCopy} className="ml-4 px-4 py-2 bg-[#2563EB] text-white rounded-[22px] font-bold text-sm flex items-center gap-1.5 hover:bg-[#1D4ED8] transition-colors">
              {copied ? <span>✓ Copied</span> : 'Copy Code'}
            </button>
          </div>)}
        {referral?.referredUserId && (<p className="text-sm text-[#2563EB] font-semibold">
            {referral.status === 'REWARDED'
                ? '🎉 Your referral is complete. You both earned 500 points!'
                : '⏳ Friend signed up. Points will land when their first service is complete.'}
          </p>)}
      </div>

      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-lg font-bold">How it Works</h2>
        <ol className="space-y-3">
          {[
            'Share your unique referral code with friends.',
            'Your friend signs up and enters the code during onboarding.',
            'You both earn 500 points ($5) automatically after their first service.',
        ].map((step, i) => (<li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-[#475569] text-sm leading-relaxed pt-0.5">{step}</span>
            </li>))}
        </ol>
        <p className="text-xs text-[#94A3B8] border-t border-[#E2E8F0] pt-3">
          Referral rewards are credited once your friend's first service is completed and verified.
        </p>
      </div>
    </div>);
}
//# sourceMappingURL=ReferralPage.jsx.map