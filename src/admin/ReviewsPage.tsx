import React, { useState } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { getAdminReviews, moderateReview } from "wasp/client/operations";

const STATUS_BADGES: Record<string, string> = {
  PUBLISHED: "bg-green-400/10 text-green-400 border-green-400/30",
  PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  REJECTED: "bg-red-400/10 text-red-400 border-red-400/30",
};

import { useRoleGuard } from '../shared/useRoleGuard';

export default function AdminReviewsPage() {
  useRoleGuard('ADMIN');
  const { data: rawReviews, isLoading, error } = useQuery(getAdminReviews);
  const reviews = rawReviews as any[] | undefined;
  const moderateFn = useAction(moderateReview);

  const [moderatingId, setModeratingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [moderateError, setModerateError] = useState<string | null>(null);

  const handleModerate = async (reviewId: string, status: string) => {
    setModeratingId(reviewId);
    setModerateError(null);
    try {
      await moderateFn({ reviewId, status });
    } catch (e: any) {
      setModerateError(e?.message || "Failed to update review.");
    } finally {
      setModeratingId(null);
    }
  };

  const filtered: any[] | undefined =
    filterStatus === "ALL"
      ? reviews
      : reviews?.filter((r: any) => r.status === filterStatus);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {moderateError && (
        <div className="rounded-[12px] bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          <span>{moderateError}</span>
          <button onClick={() => setModerateError(null)} className="ml-3 font-bold">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Review Moderation</h1>
        <div className="flex gap-2">
          {["ALL", "PENDING", "PUBLISHED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-[12px] text-sm font-bold border transition-all ${
                filterStatus === s
                  ? "bg-[var(--accent)] text-black border-transparent"
                  : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse h-24 bg-[var(--surface-raised)] rounded-[16px]" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">Failed to load reviews.</p>
      )}

      {!isLoading && !error && (!filtered || filtered.length === 0) && (
        <p className="text-[var(--text-secondary)] text-sm py-8 text-center">
          No reviews found.
        </p>
      )}

      <div className="space-y-4">
        {filtered?.map((review: any) => (
          <div
            key={review.id}
            className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${s <= review.rating ? "text-yellow-400" : "text-[var(--border-default)]"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-xs font-bold ${STATUS_BADGES[review.status] ?? ""}`}
                  >
                    {review.status}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(review.createdAt).toLocaleDateString("en-CA")}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-1">
                  Provider:{" "}
                  <span className="font-bold text-foreground">
                    {review.provider?.businessName ?? review.providerId}
                  </span>
                </p>

                {review.title && (
                  <p className="font-bold text-sm mb-1">{review.title}</p>
                )}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {review.body}
                </p>
              </div>

              {/* Moderation actions */}
              <div className="flex gap-2 shrink-0">
                {review.status !== "PUBLISHED" && (
                  <button
                    onClick={() => handleModerate(review.id, "PUBLISHED")}
                    disabled={moderatingId === review.id}
                    className="px-4 py-2 rounded-[12px] text-sm font-bold bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400/20 disabled:opacity-50 transition-all"
                  >
                    Publish
                  </button>
                )}
                {review.status !== "REJECTED" && (
                  <button
                    onClick={() => handleModerate(review.id, "REJECTED")}
                    disabled={moderatingId === review.id}
                    className="px-4 py-2 rounded-[12px] text-sm font-bold bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400/20 disabled:opacity-50 transition-all"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
