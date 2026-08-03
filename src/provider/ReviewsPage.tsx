import React, { useState } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { getMyProviderReviews, respondToReview } from "wasp/client/operations";
import { useRoleGuard } from "../shared/useRoleGuard";
import { Star, MessageSquare, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-[#DCFCE7] text-[#15803D]",
  PENDING: "bg-[#FEF9C3] text-[#92400E]",
  REJECTED: "bg-[#FEE2E2] text-[#991B1B]",
};

function ReviewRow({ review }: { review: any }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const respondFn = useAction(respondToReview);

  const handleRespond = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      await respondFn({ reviewId: review.id, response: draft.trim() });
      setSaved(true);
      setOpen(false);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save response.");
    } finally {
      setSaving(false);
    }
  };

  const canRespond = review.status === "PUBLISHED" && !review.providerResponse && !saved;

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <StarRow rating={review.rating} />
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[review.status] ?? "bg-[#F1F5F9] text-[#475569]"}`}>
              {review.status}
            </span>
            <span className="text-xs text-[#475569]">
              {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          {review.title && (
            <p className="font-bold text-sm text-[#0F172A] mb-1">{review.title}</p>
          )}
          <p className="text-sm text-[#475569] leading-relaxed">{review.body}</p>

          {/* Review photos */}
          {review.photoUrls?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.photoUrls.map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`Review photo ${i + 1}`}
                    className="w-16 h-16 object-cover rounded-[8px] border border-[#E2E8F0] hover:opacity-90 transition-opacity"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Existing provider response */}
      {(review.providerResponse || saved) && (
        <div className="mt-3 pl-3 border-l-2 border-[#BFDBFE] bg-[#EFF6FF] rounded-r-[10px] p-3">
          <p className="text-xs font-bold text-[#2563EB] mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Your response
          </p>
          <p className="text-xs text-[#475569] leading-relaxed">
            {saved ? draft : review.providerResponse}
          </p>
        </div>
      )}

      {/* Respond CTA */}
      {canRespond && review.status === "PUBLISHED" && (
        <div className="mt-3">
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Respond to this review
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-widest">Your public response</p>
                <button onClick={() => setOpen(false)} className="text-xs text-[#94A3B8] hover:text-[#475569] flex items-center gap-0.5">
                  <ChevronUp className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Thank the homeowner or address their concern professionally…"
                className="w-full p-3 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#94A3B8]">{draft.length}/1000</p>
                <button
                  onClick={handleRespond}
                  disabled={saving || !draft.trim()}
                  className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-[10px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Post response"}
                </button>
              </div>
              {err && <p className="text-xs text-red-600">{err}</p>}
            </div>
          )}
        </div>
      )}

      {/* Pending note */}
      {review.status === "PENDING" && (
        <p className="mt-3 text-xs text-[#92400E] bg-[#FEF9C3] rounded-[8px] px-3 py-2">
          This review is under admin review. You can respond once it's published.
        </p>
      )}
    </div>
  );
}

export default function ProviderReviewsPage() {
  useRoleGuard("PROVIDER");

  const { data: reviews, isLoading, error } = useQuery(getMyProviderReviews);

  if (isLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-32 bg-white rounded-[16px] border border-[#E2E8F0]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-red-600 text-sm">
        Failed to load reviews.
      </div>
    );
  }

  const published = (reviews ?? []).filter((r: any) => r.status === "PUBLISHED");
  const pending = (reviews ?? []).filter((r: any) => r.status === "PENDING");
  const rejected = (reviews ?? []).filter((r: any) => r.status === "REJECTED");

  const avgRating =
    published.length > 0
      ? (published.reduce((sum: number, r: any) => sum + r.rating, 0) / published.length).toFixed(1)
      : null;

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen bg-[#F8FAFC]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0F172A] mb-1">Your reviews</h1>
        <p className="text-[#475569] text-sm">
          Respond to homeowner reviews to build trust on your public profile.
        </p>
      </div>

      {/* Summary bar */}
      {(reviews?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-[16px] border border-[#E2E8F0] bg-white p-5 flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-3xl font-black text-[#0F172A]">{avgRating ?? "—"}</p>
            <p className="text-xs text-[#475569] mt-0.5">avg rating</p>
          </div>
          <div className="h-10 w-px bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-3xl font-black text-[#0F172A]">{published.length}</p>
            <p className="text-xs text-[#475569] mt-0.5">published</p>
          </div>
          <div className="h-10 w-px bg-[#E2E8F0]" />
          <div className="text-center">
            <p className="text-3xl font-black text-[#F59E0B]">{pending.length}</p>
            <p className="text-xs text-[#475569] mt-0.5">pending</p>
          </div>
          {rejected.length > 0 && (
            <>
              <div className="h-10 w-px bg-[#E2E8F0]" />
              <div className="text-center">
                <p className="text-3xl font-black text-[#EF4444]">{rejected.length}</p>
                <p className="text-xs text-[#475569] mt-0.5">rejected</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reviews list */}
      {(reviews?.length ?? 0) === 0 ? (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#EFF6FF]">
            <Star className="size-6 text-[#2563EB]" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-2">No reviews yet</h2>
          <p className="text-sm text-[#475569]">
            Reviews appear here once homeowners complete a job with you.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(reviews ?? []).map((review: any) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
