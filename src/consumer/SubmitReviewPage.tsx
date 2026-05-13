import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getMyRequests, submitReview } from "wasp/client/operations";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-9 h-9 ${star <= (hovered || value) ? "text-yellow-400" : "text-[var(--border-default)]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function SubmitReviewPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const { data: requests, isLoading } = useQuery(getMyRequests);
  const submitReviewFn = useAction(submitReview);

  const request = requests?.find((r) => r.id === requestId);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (!body.trim()) { setError("Please write a review."); return; }
    if (!request?.assignedProvider?.id) { setError("No provider found for this request."); return; }

    setSubmitting(true);
    setError(null);
    try {
      await submitReviewFn({
        providerId: request.assignedProvider.id,
        serviceRequestId: requestId,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="animate-pulse h-64 bg-[var(--surface-raised)] rounded-[24px]" />
      </div>
    );
  }

  if (!request || !request.assignedProvider) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-[var(--text-secondary)] mb-4">
          Request not found or no provider assigned.
        </p>
        <Link to="/my-requests" className="text-sm font-bold underline" style={{ color: "var(--accent)" }}>
          Back to my requests
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-green-400/10 border-2 border-green-400 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black mb-3">Review submitted!</h2>
        <p className="text-[var(--text-secondary)] mb-8 text-center">
          Thank you for helping other homeowners find great pros.
        </p>
        <Link
          to="/my-requests"
          className="px-6 py-3 bg-[var(--accent)] text-black font-black rounded-[16px] hover:opacity-90 transition-opacity"
        >
          Back to my requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-[80vh]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-foreground transition-colors text-sm font-medium mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
        <h1 className="text-3xl font-black mb-2">Leave a review</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          How did your experience go with{" "}
          <span className="font-bold text-foreground">{request.assignedProvider.businessName}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">
              Overall rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="mt-2 text-sm font-bold" style={{ color: "var(--accent)" }}>
                {RATING_LABELS[rating]}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
              Title <span className="font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Fixed my furnace same day"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full p-4 rounded-[16px] border-2 border-[var(--border-default)] bg-[var(--surface-base)] text-foreground placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
              Your review
            </label>
            <textarea
              placeholder="Tell other homeowners what went well (or didn't)…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={1000}
              className="w-full p-4 rounded-[16px] border-2 border-[var(--border-default)] bg-[var(--surface-base)] text-foreground placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">
              {body.length}/1000
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !rating || !body.trim()}
            className="w-full py-4 bg-[var(--accent)] text-black font-black rounded-[20px] hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}
