import React, { useState } from 'react';
import { useQuery, useAction, getMyRewardAccount, redeemPoints } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
const LEVELS = [
    { key: 'NEW_HOMEOWNER', label: 'New Homeowner', min: 0, max: 499 },
    { key: 'ACTIVE_HOMEOWNER', label: 'Active Homeowner', min: 500, max: 1999 },
    { key: 'SMART_MAINTAINER', label: 'Smart Maintainer', min: 2000, max: 4999 },
    { key: 'HOME_REWARDS_PRO', label: 'Home Rewards Pro', min: 5000, max: Infinity },
];
const TYPE_LABELS = {
    SIGNUP_BONUS: 'Sign-up Bonus',
    PROFILE_COMPLETION: 'Profile Completion',
    SERVICE_REQUEST: 'Service Request',
    BOOKED_APPOINTMENT: 'Booked Appointment',
    COMPLETED_SERVICE: 'Completed Service',
    REFERRAL: 'Referral',
    MANUAL_ADJUSTMENT: 'Manual Adjustment',
    REDEMPTION: 'Points Redeemed',
};
const STATUS_BADGE = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    APPROVED: 'bg-green-50 text-green-700',
    REJECTED: 'bg-red-50 text-red-600',
    REDEEMED: 'bg-green-50 text-green-700',
    EXPIRED: 'bg-slate-100 text-slate-500',
    REQUESTED: 'bg-[#EFF6FF] text-[#2563EB]',
    SENT: 'bg-green-50 text-green-700',
    FAILED: 'bg-red-50 text-red-600',
    CANCELLED: 'bg-slate-100 text-slate-500',
};
const ptsToDollars = (pts) => (pts / 100).toFixed(2);
const PRESETS = [
    { points: 500, label: '$5.00' },
    { points: 1000, label: '$10.00' },
    { points: 2000, label: '$20.00' },
];
function getLevelInfo(balance) {
    const idx = LEVELS.findIndex(l => balance >= l.min && balance <= l.max);
    const current = LEVELS[idx] ?? LEVELS[LEVELS.length - 1];
    const next = LEVELS[idx + 1] ?? null;
    const progress = next
        ? Math.min(100, ((balance - current.min) / (next.min - current.min)) * 100)
        : 100;
    const toNext = next ? next.min - balance : 0;
    return { current, next, progress, toNext };
}
export default function RewardsPage() {
    useRoleGuard('CONSUMER');
    const { data, isLoading, refetch } = useQuery(getMyRewardAccount);
    const redeemPointsAction = useAction(redeemPoints);
    const [selectedPoints, setSelectedPoints] = useState(500);
    const [customPoints, setCustomPoints] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const balance = data?.account?.pointsBalance ?? 0;
    const lifetime = data?.account?.lifetimePoints ?? 0;
    const { current, next, progress, toNext } = getLevelInfo(balance);
    const effectivePoints = customPoints ? Math.round(parseFloat(customPoints) * 100) || 0 : selectedPoints;
    async function handleRedeem(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email.trim()) {
            setError('Please enter a gift card email.');
            return;
        }
        if (effectivePoints < 500 || effectivePoints % 500 !== 0) {
            setError('Amount must be at least $5.00 and a multiple of $5.00.');
            return;
        }
        if (effectivePoints > balance) {
            setError('Insufficient balance.');
            return;
        }
        setSubmitting(true);
        try {
            await redeemPointsAction({ points: effectivePoints, giftCardEmail: email });
            setSuccess(`Successfully redeemed $${ptsToDollars(effectivePoints)}. Check your email!`);
            setEmail('');
            setCustomPoints('');
            setSelectedPoints(500);
            refetch();
        }
        catch (err) {
            setError(err?.message ?? 'Redemption failed. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    }
    return (<div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Rewards Wallet</h1>

      {/* Hero balance card */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow p-6 space-y-4">
        {isLoading ? (<p className="text-[#475569]">Loading your wallet…</p>) : (<>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-extrabold text-[#2563EB]">${ptsToDollars(balance)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full">
                {current.label}
              </span>
              <span className="text-sm text-[#94A3B8]">· ${ptsToDollars(lifetime)} lifetime</span>
            </div>
            {next && (<div className="space-y-1">
                <div className="flex justify-between text-xs text-[#94A3B8]">
                  <span>${ptsToDollars(toNext)} to {next.label}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
                </div>
              </div>)}
          </>)}
      </div>

      {/* Redemption form */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-lg font-bold">Redeem Points</h2>
        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (<button key={p.points} type="button" onClick={() => { setSelectedPoints(p.points); setCustomPoints(''); }} className={`px-4 py-2 rounded-[22px] text-sm font-semibold border transition-colors ${!customPoints && selectedPoints === p.points
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB]'}`}>
                Redeem {p.label}
              </button>))}
          </div>
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">Custom amount in dollars (multiples of $5.00)</label>
            <input type="number" min={5} step={5} value={customPoints} onChange={e => setCustomPoints(e.target.value)} placeholder="10.00" className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"/>
          </div>
          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">Gift card email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"/>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button type="submit" disabled={submitting || effectivePoints > balance} className="w-full py-2.5 rounded-[22px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors">
            {submitting
            ? 'Processing…'
            : effectivePoints >= 500
                ? `Redeem $${ptsToDollars(effectivePoints)}`
                : 'Enter an amount'}
          </button>
          {effectivePoints > balance && (<p className="text-xs text-[#94A3B8] text-center">You need ${ptsToDollars(effectivePoints - balance)} more</p>)}
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-3">
        <h2 className="text-lg font-bold">Transaction History</h2>
        {isLoading ? (<p className="text-[#475569] text-sm">Loading…</p>) : !data?.transactions?.length ? (<p className="text-[#94A3B8] text-sm">No transactions yet.</p>) : (<div className="space-y-2">
            {data.transactions.map(tx => (<div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[tx.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.points > 0 ? '+' : '-'}${ptsToDollars(Math.abs(tx.points))}
                </span>
              </div>))}
          </div>)}
      </div>

      {/* Redemptions */}
      {!!data?.redemptions?.length && (<div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="text-lg font-bold">Redemption History</h2>
          <div className="space-y-2">
            {data.redemptions.map(r => (<div key={r.id} className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">${ptsToDollars(r.pointsUsed)} gift card</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[r.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>))}
          </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=RewardsPage.jsx.map