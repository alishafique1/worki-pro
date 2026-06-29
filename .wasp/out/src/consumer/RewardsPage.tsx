import React, { useState } from 'react';
import {
  useQuery,
  getMyRewardAccount,
  getMyReferral,
  redeemPoints,
} from 'wasp/client/operations';
import {
  Gift,
  Sparkles,
  Crown,
  Star,
  TrendingUp,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Users,
  Copy,
  Check,
  Mail,
  Wallet,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { useRoleGuard } from '../shared/useRoleGuard';

// ── Tier model ────────────────────────────────────────────────
const LEVELS = [
  { key: 'NEW_HOMEOWNER',    label: 'New Homeowner',    min: 0,    max: 499,      icon: Sparkles },
  { key: 'ACTIVE_HOMEOWNER', label: 'Regular',          min: 500,  max: 1999,     icon: Star },
  { key: 'SMART_MAINTAINER', label: 'Gold',             min: 2000, max: 4999,     icon: Crown },
  { key: 'HOME_REWARDS_PRO', label: 'Platinum',         min: 5000, max: Infinity, icon: Crown },
];

// 10,000 pts redemption threshold (≈ $100 in gift cards)
const REDEMPTION_THRESHOLD = 10000;

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
  PENDING: 'bg-[#FEF3C7] text-[#92400E]',
  APPROVED: 'bg-[#DCFCE7] text-[#166534]',
  REJECTED: 'bg-[#FEE2E2] text-[#991B1B]',
  REDEEMED: 'bg-[#DCFCE7] text-[#166534]',
  EXPIRED: 'bg-[#F1F5F9] text-[#475569]',
  REQUESTED: 'bg-[#EFF6FF] text-[#2563EB]',
  SENT: 'bg-[#DCFCE7] text-[#166534]',
  FAILED: 'bg-[#FEE2E2] text-[#991B1B]',
  CANCELLED: 'bg-[#F1F5F9] text-[#475569]',
};

const EARN_ACTIONS = [
  { icon: FileText,      label: 'Submit a request',     pts: '+500',   sub: 'Per service request',  color: '#2563EB' },
  { icon: CalendarCheck, label: 'Book an appointment',  pts: '+500',   sub: 'When a pro is booked', color: '#2563EB' },
  { icon: CheckCircle2,  label: 'Complete a job',       pts: '+5,000', sub: 'After service is done', color: '#22C55E' },
  { icon: Users,         label: 'Refer a friend',       pts: '+500',   sub: 'Each friend who joins', color: '#F59E0B' },
];

const PRESETS = [
  { points: 500,  label: '500 pts' },
  { points: 1000, label: '1,000 pts' },
  { points: 2000, label: '2,000 pts' },
];

const ptsToDollars = (pts: number) => (pts / 100).toFixed(2);

function getLevelInfo(balance: number) {
  const idx = LEVELS.findIndex((l) => balance >= l.min && balance <= l.max);
  const current = LEVELS[idx] ?? LEVELS[LEVELS.length - 1];
  const next = LEVELS[idx + 1] ?? null;
  const progress = next
    ? Math.min(100, ((balance - current.min) / (next.min - current.min)) * 100)
    : 100;
  const toNext = next ? next.min - balance : 0;
  return {
    current,
    currentIdx: idx === -1 ? LEVELS.length - 1 : idx,
    next,
    progress,
    toNext,
  };
}

// ── Skeletons ─────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-8 animate-pulse">
      <div className="h-4 w-28 bg-[#E2E8F0] rounded-full mb-6" />
      <div className="h-12 w-56 bg-[#E2E8F0] rounded-[12px] mb-4" />
      <div className="h-3 w-full bg-[#E2E8F0] rounded-full mb-2" />
      <div className="h-3 w-2/3 bg-[#E2E8F0] rounded-full" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-[12px] bg-[#E2E8F0]" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-[#E2E8F0] rounded-full" />
          <div className="h-2.5 w-20 bg-[#E2E8F0] rounded-full" />
        </div>
      </div>
      <div className="h-3 w-16 bg-[#E2E8F0] rounded-full" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function RewardsPage() {
  useRoleGuard('CONSUMER');
  const { data, isLoading, refetch } = useQuery(getMyRewardAccount);
  const { data: referral } = useQuery(getMyReferral);

  const [selectedPoints, setSelectedPoints] = useState<number>(500);
  const [customPoints, setCustomPoints] = useState<string>('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [historyTab, setHistoryTab] = useState<'all' | 'earned' | 'redeemed'>('all');

  const balance = data?.account?.pointsBalance ?? 0;
  const lifetime = data?.account?.lifetimePoints ?? 0;
  const { current, currentIdx, next, progress, toNext } = getLevelInfo(balance);

  const redemptionProgress = Math.min(100, (balance / REDEMPTION_THRESHOLD) * 100);
  const ptsToThreshold = Math.max(0, REDEMPTION_THRESHOLD - balance);

  const effectivePoints = customPoints
    ? Math.round(parseFloat(customPoints) * 100) || 0
    : selectedPoints;

  const referralCode = referral?.referralCode ?? '';
  const shareUrl =
    typeof window !== 'undefined' && referralCode
      ? `${window.location.origin}/request?ref=${referralCode}`
      : '';

  // ── Filtered transaction rows ───────────────────────────────
  const txns = data?.transactions ?? [];
  const filteredTxns = txns.filter((tx) =>
    historyTab === 'all'
      ? true
      : historyTab === 'earned'
        ? tx.points > 0
        : tx.points < 0
  );

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Please enter a gift card email.');
      return;
    }
    if (effectivePoints < 500 || effectivePoints % 500 !== 0) {
      setError('Amount must be at least 500 points and a multiple of 500 points.');
      return;
    }
    if (effectivePoints > balance) {
      setError('Insufficient balance.');
      return;
    }
    setSubmitting(true);
    try {
      await redeemPoints({ points: effectivePoints, giftCardEmail: email });
      setSuccess(
        `Successfully redeemed ${effectivePoints.toLocaleString()} points. Check your email!`
      );
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

  function copyCode() {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[14px] bg-[#FEF3C7] flex items-center justify-center">
            <Gift className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <h1
              className="text-3xl text-[#0F172A] font-black tracking-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              Rewards Wallet
            </h1>
            <p className="text-sm text-[#475569]">
              Earn points on every job. Redeem for gift cards.
            </p>
          </div>
        </div>

        {/* ── HERO + TIER (2-col on desktop) ───────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hero balance — amber/gold gradient */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <HeroSkeleton />
            ) : (
              <div
                className="relative overflow-hidden rounded-[24px] p-8 text-white shadow-[0_20px_50px_-12px_rgba(245,158,11,0.45)]"
                style={{
                  background:
                    'linear-gradient(135deg, #F59E0B 0%, #FBBF24 55%, #F59E0B 100%)',
                }}
              >
                {/* decorative orbs */}
                <div className="pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/25 backdrop-blur px-3 py-1 rounded-full">
                      <Wallet className="h-3.5 w-3.5" />
                      Points Balance
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/25 backdrop-blur px-3 py-1 rounded-full">
                      {React.createElement(current.icon, { className: 'h-3.5 w-3.5' })}
                      {current.label}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end gap-3">
                    <span
                      className="text-6xl leading-none font-black tracking-tight"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      {balance.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold mb-1.5 opacity-90">pts</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <span className="bg-white/25 backdrop-blur px-2.5 py-1 rounded-full">
                      {balance.toLocaleString()} pts
                    </span>
                    <span className="opacity-90">
                      · {lifetime.toLocaleString()} pts lifetime
                    </span>
                  </div>

                  {/* Progress to 10,000 pts redemption threshold */}
                  <div className="mt-7">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="opacity-95">
                        {ptsToThreshold > 0
                          ? `${ptsToThreshold.toLocaleString()} pts to a 10,000 pts reward`
                          : 'You can redeem a 10,000 pts reward!'}
                      </span>
                      <span className="opacity-95">{Math.round(redemptionProgress)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${redemptionProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tier ladder card */}
          <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Your Tier
              </h2>
              {next && (
                <span className="text-xs text-[#475569]">
                  {Math.round(progress)}% to {next.label}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {LEVELS.map((lvl, i) => {
                const isCurrent = i === currentIdx;
                const isPast = i < currentIdx;
                const Icon = lvl.icon;
                return (
                  <div
                    key={lvl.key}
                    className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors ${
                      isCurrent
                        ? 'bg-[#FEF3C7] border border-[#F59E0B]'
                        : 'border border-transparent'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-[10px] flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#F59E0B] text-white'
                          : isPast
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'bg-[#F1F5F9] text-[#94A3B8]'
                      }`}
                    >
                      {isPast ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold truncate ${
                          isCurrent ? 'text-[#92400E]' : 'text-[#0F172A]'
                        }`}
                      >
                        {lvl.label}
                      </p>
                      <p className="text-xs text-[#475569]">
                        {lvl.min.toLocaleString()}
                        {lvl.max === Infinity ? '+' : `–${lvl.max.toLocaleString()}`} pts
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E]">
                        You
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {next && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[#475569]">
                  {toNext.toLocaleString()} pts to reach{' '}
                  <span className="font-semibold text-[#0F172A]">{next.label}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── HOW TO EARN ─────────────────────────────────────── */}
        <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">How to earn points</h2>
            <span className="ml-auto text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
              1,000 pts ≈ $10 gift card
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EARN_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.label}
                  className="group rounded-[20px] border border-[#E2E8F0] p-5 hover:border-[#2563EB] hover:shadow-[0_8px_24px_-12px_rgba(37,99,235,0.3)] transition-all"
                >
                  <div
                    className="h-11 w-11 rounded-[14px] flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${a.color}1A` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: a.color }} />
                  </div>
                  <p
                    className="text-2xl font-black tracking-tight"
                    style={{ color: a.color, fontFamily: 'Fraunces, serif' }}
                  >
                    {a.pts}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">{a.label}</p>
                  <p className="text-xs text-[#475569]">{a.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── REDEEM + REFERRAL (2-col) ───────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Redemption form */}
          <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Redeem points</h2>
            <p className="text-sm text-[#475569] mb-5">
              Convert points into a gift card, sent to your email.
            </p>
            <form onSubmit={handleRedeem} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => {
                  const active = !customPoints && selectedPoints === p.points;
                  return (
                    <button
                      key={p.points}
                      type="button"
                      onClick={() => {
                        setSelectedPoints(p.points);
                        setCustomPoints('');
                      }}
                      className={`rounded-[14px] border px-3 py-3 text-center transition-all ${
                        active
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[0_8px_24px_-10px_rgba(37,99,235,0.5)]'
                          : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#2563EB]'
                      }`}
                    >
                      <span
                        className="block text-lg font-black"
                        style={{ fontFamily: 'Fraunces, serif' }}
                      >
                        {p.label}
                      </span>
                      <span
                        className={`block text-[11px] font-semibold ${
                          active ? 'text-white/80' : 'text-[#475569]'
                        }`}
                      >
                        {p.points.toLocaleString()} pts
                      </span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Custom amount (points · multiples of 500)
                </label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full bg-white border border-[#E2E8F0] rounded-[12px] px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                  Gift card email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-[#E2E8F0] rounded-[12px] pl-9 pr-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-[#991B1B] bg-[#FEE2E2] rounded-[12px] px-3 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-[#166534] bg-[#DCFCE7] rounded-[12px] px-3 py-2">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || effectivePoints > balance}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[14px] bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_12px_28px_-10px_rgba(37,99,235,0.55)]"
              >
                {submitting
                  ? 'Processing…'
                  : effectivePoints >= 500
                    ? `Redeem ${effectivePoints.toLocaleString()} pts · $${ptsToDollars(effectivePoints)}`
                    : 'Enter an amount'}
                {!submitting && effectivePoints >= 500 && <ArrowRight className="h-4 w-4" />}
              </button>
              {effectivePoints > balance && (
                <p className="text-xs text-[#475569] text-center">
                  You need {(effectivePoints - balance).toLocaleString()} more points
                </p>
              )}
            </form>
          </div>

          {/* Referral callout */}
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-[#0F172A]">Refer &amp; earn</h2>
            </div>
            <p className="text-sm text-[#475569] mb-5">
              Share your code — you both earn{' '}
              <span className="font-semibold text-[#0F172A]">500 pts</span> when a friend
              books their first job.
            </p>

            <div className="rounded-[20px] bg-[#F8FAFC] border border-[#E2E8F0] p-5">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Your referral code
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xl font-bold tracking-[0.2em] text-[#2563EB] bg-white border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-center">
                  {referralCode || '········'}
                </code>
                <button
                  type="button"
                  onClick={copyCode}
                  disabled={!referralCode}
                  className={`h-[50px] w-[50px] shrink-0 rounded-[12px] flex items-center justify-center font-bold transition-all disabled:opacity-40 ${
                    copied
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                  }`}
                  aria-label="Copy referral code"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={
                  shareUrl
                    ? `sms:?&body=${encodeURIComponent(
                        `Get vetted home pros on The Helper — use my code ${referralCode}: ${shareUrl}`
                      )}`
                    : '#'
                }
                className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:border-[#2563EB] transition-colors"
              >
                <Share2 className="h-4 w-4" /> Text
              </a>
              <a
                href={
                  shareUrl
                    ? `mailto:?subject=${encodeURIComponent(
                        'Try The Helper'
                      )}&body=${encodeURIComponent(
                        `Get vetted home pros on The Helper — use my code ${referralCode}: ${shareUrl}`
                      )}`
                    : '#'
                }
                className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:border-[#2563EB] transition-colors"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>

            <div className="mt-auto pt-5 text-xs text-[#475569] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
              Most members refer 3+ neighbours in their first month.
            </div>
          </div>
        </div>

        {/* ── TRANSACTION HISTORY ─────────────────────────────── */}
        <div className="rounded-[24px] bg-white border border-[#E2E8F0] overflow-hidden">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#E2E8F0] px-6 py-4 flex flex-wrap items-center gap-3 justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Transaction history</h2>
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-1">
              {(['all', 'earned', 'redeemed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHistoryTab(tab)}
                  className={`px-3 py-1.5 rounded-[9px] text-xs font-bold capitalize transition-colors ${
                    historyTab === tab
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-2">
            {isLoading ? (
              <div className="divide-y divide-[#E2E8F0]">
                {[0, 1, 2].map((i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            ) : !filteredTxns.length ? (
              <div className="py-14 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-[18px] bg-[#FEF3C7] flex items-center justify-center mb-4">
                  <Gift className="h-7 w-7 text-[#F59E0B]" />
                </div>
                <p className="text-base font-bold text-[#0F172A]">
                  {historyTab === 'all'
                    ? 'No transactions yet'
                    : `No ${historyTab} points yet`}
                </p>
                <p className="text-sm text-[#475569] mt-1 max-w-xs">
                  Submit a service request to earn your first 500 points.
                </p>
                <a
                  href="/request"
                  className="mt-5 inline-flex items-center gap-2 rounded-[14px] bg-[#2563EB] text-white px-5 py-2.5 text-sm font-bold hover:bg-[#1D4ED8] transition-colors"
                >
                  Start a request <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {filteredTxns.map((tx) => {
                  const positive = tx.points > 0;
                  const label = TYPE_LABELS[tx.type] ?? tx.type;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3.5 -mx-2 px-2 rounded-[12px] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-[12px] flex items-center justify-center shrink-0 ${
                            positive ? 'bg-[#DCFCE7]' : 'bg-[#FEF3C7]'
                          }`}
                        >
                          {positive ? (
                            <TrendingUp className="h-4 w-4 text-[#166534]" />
                          ) : (
                            <Gift className="h-4 w-4 text-[#92400E]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0F172A] truncate">{label}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                STATUS_BADGE[tx.status] ?? 'bg-[#F1F5F9] text-[#475569]'
                              }`}
                            >
                              {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                            </span>
                            <span className="text-xs text-[#94A3B8]">
                              {new Date(tx.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-black tabular-nums shrink-0 ${
                          positive ? 'text-[#166534]' : 'text-[#991B1B]'
                        }`}
                      >
                        {positive ? '+' : '−'}
                        {Math.abs(tx.points).toLocaleString()} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── REDEMPTION HISTORY ──────────────────────────────── */}
        {!!data?.redemptions?.length && (
          <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Gift card redemptions</h2>
            <div className="divide-y divide-[#E2E8F0]">
              {data.redemptions.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-3.5 -mx-2 px-2 rounded-[12px] hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-[12px] bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <Gift className="h-4 w-4 text-[#2563EB]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">
                        ${(r.pointsUsed / 100).toFixed(2)} gift card
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            STATUS_BADGE[r.status] ?? 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs text-[#94A3B8]">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black tabular-nums text-[#991B1B] shrink-0">
                    −{r.pointsUsed.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
