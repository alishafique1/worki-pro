import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getPublicLeadFeed, claimLead, getServiceCategories } from "wasp/client/operations";

const URGENCY_LABELS: Record<string, { label: string; color: string }> = {
  EMERGENCY: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-200" },
  STANDARD: { label: "This week", color: "text-amber-700 bg-[#FEF3C7] border-amber-200" },
  PLANNED: { label: "Flexible", color: "text-green-700 bg-green-50 border-green-200" },
};

function timeAgo(date: Date | string) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

import { useRoleGuard } from '../shared/useRoleGuard';
import { getProviderProfile } from 'wasp/client/operations';

export default function ProviderLeadsPage() {
  useRoleGuard('PROVIDER');
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [claimError, setClaimError] = useState<string | null>(null);

  const { data: profile } = useQuery(getProviderProfile);
  const verificationStatus = (profile as any)?.verificationStatus;

  const { data: leads, isLoading, error, refetch } = useQuery(getPublicLeadFeed, {
    categorySlug: categoryFilter || undefined,
    urgency: urgencyFilter || undefined,
    limit: 30,
  });

  const { data: categories } = useQuery(getServiceCategories);

  const claimLeadFn = useAction(claimLead);

  const handleClaim = async (requestId: string) => {
    setClaimingId(requestId);
    setClaimError(null);
    try {
      const result = await claimLeadFn({ requestId });
      setClaimedIds((prev) => new Set([...prev, requestId]));
      if (result.alreadyClaimed) {
        setClaimError("You already claimed this lead.");
      }
    } catch (e: any) {
      setClaimError(e?.message || "Failed to claim lead.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Verification status banner */}
      {verificationStatus && verificationStatus !== 'VERIFIED' && (
        <div className={`rounded-[16px] border px-5 py-4 flex items-start gap-3 ${
          verificationStatus === 'REJECTED'
            ? 'bg-red-500/10 border-red-400/30 text-red-400'
            : 'bg-yellow-500/10 border-yellow-400/30 text-yellow-500'
        }`}>
          <span className="text-xl mt-0.5">{verificationStatus === 'REJECTED' ? '⛔' : '⏳'}</span>
          <div>
            <p className="font-bold text-sm">
              {verificationStatus === 'REJECTED'
                ? 'Your application was not approved'
                : 'Account pending verification'}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {verificationStatus === 'REJECTED'
                ? 'Contact support to appeal or reapply.'
                : 'Our team is reviewing your profile. You can browse leads but cannot claim them until verified.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Lead Feed</h1>
          <p className="mt-2 text-[#475569]">
            Verified service requests near your area — claim a lead to reveal customer contact details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/dashboard"
            className="rounded-[18px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold hover:border-[#2563EB] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/provider/appointments"
            className="rounded-[18px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
          >
            My Bookings
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-[18px] border border-[#E2E8F0] bg-white">
        <div>
          <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"
          >
            <option value="">All categories</option>
            {categories?.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-1">
            Urgency
          </label>
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-3 py-2 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-medium focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"
          >
            <option value="">Any urgency</option>
            <option value="EMERGENCY">Urgent</option>
            <option value="STANDARD">This week</option>
            <option value="PLANNED">Flexible</option>
          </select>
        </div>

        {(categoryFilter || urgencyFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => { setCategoryFilter(""); setUrgencyFilter(""); }}
              className="px-3 py-2 text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Error banner */}
      {claimError && (
        <div className="p-4 rounded-[14px] border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
          {claimError}
        </div>
      )}

      {/* Lead cards */}
      <div className="space-y-4">
        {isLoading && (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-[18px] border border-[#E2E8F0] bg-white p-6 animate-pulse"
              >
                <div className="h-4 w-1/3 bg-[#E2E8F0] rounded mb-3" />
                <div className="h-3 w-2/3 bg-[#E2E8F0] rounded mb-2" />
                <div className="h-3 w-1/2 bg-[#E2E8F0] rounded mb-4" />
                <div className="h-10 w-32 bg-[#E2E8F0] rounded-full" />
              </div>
            ))}
          </>
        )}

        {error && (
          <p className="text-red-400 text-sm">
            Could not load leads. Are you a verified provider?
          </p>
        )}

        {!isLoading && !error && leads?.length === 0 && (
          <div className="text-center py-16 text-[#475569]">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-bold text-lg text-[#0F172A]">No open leads right now</p>
            <p className="text-sm mt-1">
              New leads appear here as soon as a customer submits a request.
            </p>
          </div>
        )}

        {leads?.map((lead) => {
          const urgencyInfo = URGENCY_LABELS[lead.urgency] ?? URGENCY_LABELS.STANDARD;
          const isClaimed = claimedIds.has(lead.id) || lead.claimed;
          const isClaiming = claimingId === lead.id;

          return (
            <div
              key={lead.id}
              className="rounded-[18px] border border-[#E2E8F0] bg-white shadow-sm p-6 transition-all hover:border-[#BFDBFE]"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {lead.serviceCategory && (
                    <span className="px-3 py-1 rounded-full border text-xs font-bold border-[#E2E8F0] text-[#475569]">
                      {lead.serviceCategory.name}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold ${urgencyInfo.color}`}
                  >
                    {urgencyInfo.label}
                  </span>
                  {isClaimed && (
                    <span className="px-3 py-1 rounded-full border text-xs font-bold border-green-200 text-green-700 bg-green-50">
                      Claimed
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#94A3B8] whitespace-nowrap shrink-0">
                  {timeAgo(lead.createdAt)}
                </span>
              </div>

              {/* Location + schedule */}
              <div className="flex flex-wrap gap-4 text-sm text-[#475569] mb-3">
                <span>
                  📍 {lead.city ?? lead.postalCode}
                </span>
                {lead.estimatedSchedule && (
                  <span>🗓️ {lead.estimatedSchedule.replace(/_/g, " ")}</span>
                )}
              </div>

              {/* Description preview */}
              <p className="text-sm text-[#0F172A] leading-relaxed mb-4">
                {lead.description}
              </p>

              {/* CTA */}
              {!isClaimed ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleClaim(lead.id)}
                    disabled={isClaiming}
                    className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-black rounded-[14px] hover:bg-[#1D4ED8] disabled:opacity-50 transition-all"
                  >
                    {isClaiming ? "Claiming…" : "Claim this lead"}
                  </button>
                  <span className="text-xs text-[#94A3B8]">
                    Reveal customer contact · $5 lead fee
                  </span>
                </div>
              ) : (
                <Link
                  to={`/provider/requests/${lead.id}/messages`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] border border-[#BFDBFE] text-[#2563EB] text-sm font-bold hover:bg-[#EFF6FF] transition-all"
                >
                  View & message customer →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
