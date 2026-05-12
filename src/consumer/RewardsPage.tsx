import React, { useState } from 'react';
import { useQuery, useAction, getMyRewardAccount, redeemPoints } from 'wasp/client/operations';

const LEVELS = [
  { key: 'NEW_HOMEOWNER',    label: 'New Homeowner',    min: 0,    max: 499  },
  { key: 'ACTIVE_HOMEOWNER', label: 'Active Homeowner', min: 500,  max: 1999 },
  { key: 'SMART_MAINTAINER', label: 'Smart Maintainer', min: 2000, max: 4999 },
  { key: 'HOME_REWARDS_PRO', label: 'Home Rewards Pro', min: 5000, max: Infinity },
];

const TYPE_LABELS: Record<string, string> = {
  SIGNUP_BONUS: 'Sign-up Bonus',
  PROFILE_COMPLETION: 'Profile Completion',
  SERVICE_REQUEST: 'Service Request',
  BOOKED_APPOINTMENT: 'Booked Appointment',
  COMPLETED_SERVICE: 'Completed Service',
  REFERRAL: 'Referral',
  MANUAL_ADJUSTMENT: 'Manual Adjustment',
  REDEMPTION: 'Points Redeemed',
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-yellow-900/50 text-yellow-300',
  APPROVED: 'bg-[#567a58] text-white',
  REJECTED: 'bg-red-900/50 text-red-300',
  REDEEMED: 'bg-[#567a58] text-white',
  EXPIRED: 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]',
  REQUESTED: 'bg-blue-900/50 text-blue-300',
  SENT: 'bg-[#567a58] text-white',
  FAILED: 'bg-red-900/50 text-red-300',
  CANCELLED: 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]',
};

const ptsToDollars = (pts: number) => (pts / 100).toFixed(2);

const PRESETS = [
  { points: 500,  label: '$5.00'  },
  { points: 1000, label: '$10.00' },
  { points: 2000, label: '$20.00' },
];

function getLevelInfo(balance: number) {
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
  const { data, isLoading, refetch } = useQuery(getMyRewardAccount);
  const redeemPointsAction = useAction(redeemPoints);

  const [selectedPoints, setSelectedPoints] = useState<number>(500);
  const [customPoints, setCustomPoints] = useState<string>('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const balance = data?.account?.pointsBalance ?? 0;
  const lifetime = data?.account?.lifetimePoints ?? 0;
  const { current, next, progress, toNext } = getLevelInfo(balance);

  const effectivePoints = customPoints ? Math.round(parseFloat(customPoints) * 100) || 0 : selectedPoints;

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) { setError('Please enter a gift card email.'); return; }
    if (effectivePoints < 500 || effectivePoints % 500 !== 0) {
      setError('Amount must be at least $5.00 and a multiple of $5.00.');
      return;
    }
    if (effectivePoints > balance) { setError('Insufficient balance.'); return; }
    setSubmitting(true);
    try {
      await redeemPointsAction({ points: effectivePoints, giftCardEmail: email });
      setSuccess(`Successfully redeemed $${ptsToDollars(effectivePoints)} — check your email!`);
      setEmail('');
      setCustomPoints('');
      setSelectedPoints(500);
      refetch();
    } catch (err: any) {
      setError(err?.message ?? 'Redemption failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Rewards Wallet</h1>

      {/* Hero balance card */}
      <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-4">
        {isLoading ? (
          <p className="text-[var(--text-secondary)]">Loading your wallet…</p>
        ) : (
          <>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-extrabold text-[var(--accent)]">${ptsToDollars(balance)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold bg-[var(--surface-overlay)] px-3 py-1 rounded-full text-[var(--accent)]">
                {current.label}
              </span>
              <span className="text-sm text-[var(--text-tertiary)]">· ${ptsToDollars(lifetime)} lifetime</span>
            </div>
            {next && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
                  <span>${ptsToDollars(toNext)} to {next.label}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Redemption form */}
      <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-4">
        <h2 className="text-lg font-bold">Redeem Points</h2>
        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p.points}
                type="button"
                onClick={() => { setSelectedPoints(p.points); setCustomPoints(''); }}
                className={`px-4 py-2 rounded-[22px] text-sm font-semibold border transition-colors ${
                  !customPoints && selectedPoints === p.points
                    ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                    : 'bg-[var(--surface-overlay)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--accent)]'
                }`}
              >
                Redeem {p.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-1">Custom amount in dollars (multiples of $5.00)</label>
            <input
              type="number"
              min={5}
              step={5}
              value={customPoints}
              onChange={e => setCustomPoints(e.target.value)}
              placeholder="10.00"
              className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-1">Gift card email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
          {success && <p className="text-sm text-[#567a58]">{success}</p>}
          <button
            type="submit"
            disabled={submitting || effectivePoints > balance}
            className="w-full py-2.5 rounded-[22px] bg-[var(--accent)] text-black font-bold text-sm disabled:opacity-40 transition-opacity"
          >
            {submitting
              ? 'Processing…'
              : effectivePoints >= 500
                ? `Redeem $${ptsToDollars(effectivePoints)}`
                : 'Enter an amount'}
          </button>
          {effectivePoints > balance && (
            <p className="text-xs text-[var(--text-tertiary)] text-center">You need ${ptsToDollars(effectivePoints - balance)} more</p>
          )}
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-3">
        <h2 className="text-lg font-bold">Transaction History</h2>
        {isLoading ? (
          <p className="text-[var(--text-secondary)] text-sm">Loading…</p>
        ) : !data?.transactions?.length ? (
          <p className="text-[var(--text-tertiary)] text-sm">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {data.transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[var(--border-default)] last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[tx.status] ?? 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]'}`}>
                      {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.points > 0 ? 'text-[#567a58]' : 'text-[var(--destructive)]'}`}>
                  {tx.points > 0 ? '+' : '-'}${ptsToDollars(Math.abs(tx.points))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redemptions */}
      {!!data?.redemptions?.length && (
        <div className="bg-[var(--surface-raised)] rounded-[16px] border border-[var(--border-default)] p-6 space-y-3">
          <h2 className="text-lg font-bold">Redemption History</h2>
          <div className="space-y-2">
            {data.redemptions.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2.5 border-b border-[var(--border-default)] last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">${ptsToDollars(r.pointsUsed)} gift card</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[r.status] ?? 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]'}`}>
                      {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

