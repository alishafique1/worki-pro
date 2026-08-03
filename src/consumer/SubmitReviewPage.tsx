import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getMyRequests, submitReview, createFileUploadUrl } from "wasp/client/operations";
import { useRoleGuard } from '../shared/useRoleGuard';
import { CheckCircle2, ArrowLeft, Camera, X } from 'lucide-react';

const MAX_PHOTOS = 3;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number];

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
            className={`w-9 h-9 ${star <= (hovered || value) ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}
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
  useRoleGuard('CONSUMER');
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const { data: requests, isLoading } = useQuery(getMyRequests);
  const submitReviewFn = useAction(submitReview);
  const createUploadUrlFn = useAction(createFileUploadUrl);

  const request = requests?.find((r) => r.id === requestId);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining).filter(
      (f) => ALLOWED_IMAGE_TYPES.includes(f.type as AllowedImageType)
    );
    const previews = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const s3Keys: string[] = [];
    for (const { file } of photos) {
      const { s3UploadUrl, s3UploadFields, s3Key } = await createUploadUrlFn({
        fileType: file.type as AllowedImageType,
        fileName: file.name,
      });
      const form = new FormData();
      Object.entries(s3UploadFields).forEach(([k, v]) => form.append(k, v as string));
      form.append('file', file);
      const res = await fetch(s3UploadUrl, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Photo upload failed. Please try again.');
      s3Keys.push(s3Key);
    }
    return s3Keys;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (!body.trim()) { setError("Please write a review."); return; }
    if (!request?.assignedProvider?.id) { setError("No provider found for this request."); return; }

    setSubmitting(true);
    setError(null);
    try {
      const photoS3Keys = photos.length > 0 ? await uploadPhotos() : [];
      await submitReviewFn({
        providerId: request.assignedProvider.id,
        serviceRequestId: requestId,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
        photoS3Keys,
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
      <div className="p-8 max-w-2xl mx-auto bg-[#F8FAFC] min-h-screen">
        <div className="animate-pulse h-64 bg-white rounded-[24px] border border-[#E2E8F0]" />
      </div>
    );
  }

  if (!request || !request.assignedProvider) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center bg-[#F8FAFC] min-h-screen">
        <p className="text-[#475569] mb-4">
          Request not found or no provider assigned.
        </p>
        <Link to="/account/requests" className="text-sm font-bold underline text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
          Back to my requests
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] bg-[#F8FAFC]">
        <div className="w-20 h-20 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
        </div>
        <h2 className="text-3xl font-black mb-3 text-[#0F172A]">Review submitted!</h2>
        <p className="text-[#475569] mb-8 text-center">
          Thank you for helping other homeowners find great pros.
        </p>
        <Link
          to="/account/requests"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-black rounded-[16px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
        >
          Back to my requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-[80vh] bg-[#F8FAFC]">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm font-medium mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black mb-2 text-[#0F172A]">Leave a review</h1>
        <p className="text-[#475569] mb-6">
          How did your experience go with{" "}
          <span className="font-bold text-[#0F172A]">{request.assignedProvider.businessName}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">
              Overall rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="mt-2 text-sm font-bold text-[#2563EB]">
                {RATING_LABELS[rating]}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
              Title <span className="font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Fixed my furnace same day"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full p-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 focus:outline-none transition-colors"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
              Your review
            </label>
            <textarea
              placeholder="Tell other homeowners what went well (or didn't)…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={1000}
              className="w-full p-4 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-[#94A3B8] mt-1 text-right">
              {body.length}/1000
            </p>
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
              Photos <span className="font-normal">(optional, up to {MAX_PHOTOS})</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {photos.map(({ preview }, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={preview}
                    alt={`Photo ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-[10px] border border-[#E2E8F0]"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3 h-3 text-[#475569]" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-[10px] border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF] flex flex-col items-center justify-center gap-1 hover:border-[#2563EB] transition-colors"
                >
                  <Camera className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-xs text-[#2563EB] font-bold">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !rating || !body.trim()}
            className="w-full py-4 bg-[#2563EB] text-white font-black rounded-[20px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
}
