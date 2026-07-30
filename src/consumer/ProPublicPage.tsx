import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";

import {
  MapPin,
  Zap,
  Award,
  Search,
  ArrowLeft,
  BadgeCheck,
  ImageOff,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "wasp/client/operations";
import { getPublicProvider, getProviders } from "wasp/client/operations";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  const rounded = Math.round((rating ?? 0) * 2) / 2;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rounded ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold text-[#0F172A]">
        {rating ? rating.toFixed(1) : "New"}
      </span>
      {count > 0 && (
        <span className="text-xs text-[#475569]">
          ({count} review{count !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: { id: string; rating: number; title: string | null; body: string; createdAt: Date | string };
}) {
  return (
    <div className="p-5 rounded-[16px] border border-[#E2E8F0] bg-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              className={`w-3.5 h-3.5 ${s <= review.rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-[#475569]">
          {new Date(review.createdAt).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      {review.title && <p className="font-bold text-sm mb-1 text-[#0F172A]">{review.title}</p>}
      <p className="text-sm text-[#475569] leading-relaxed">{review.body}</p>
    </div>
  );
}

// Portfolio image with graceful broken-image fallback
function PortfolioImage({
  url,
  caption,
  index,
  onClick,
}: {
  url: string;
  caption?: string;
  index: number;
  onClick: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="w-full aspect-square rounded-[14px] border border-[#E2E8F0] bg-[#F1F5F9] flex flex-col items-center justify-center gap-2 cursor-pointer"
        onClick={onClick}
      >
        <ImageOff className="size-6 text-[#CBD5E1]" />
        <span className="text-xs text-[#CBD5E1]">Image unavailable</span>
        {caption && <span className="text-xs text-[#94A3B8] text-center px-2">{caption}</span>}
      </div>
    );
  }

  return (
    <button onClick={onClick} className="block w-full text-left space-y-1">
      <div className="relative overflow-hidden rounded-[14px] border border-[#E2E8F0] aspect-square bg-[#F1F5F9]">
        <img
          src={url}
          alt={caption ?? `Portfolio item ${index + 1}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setFailed(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
      </div>
      {caption && (
        <p className="text-xs text-[#475569] text-center px-1">{caption}</p>
      )}
    </button>
  );
}

// Lightbox for portfolio
function PortfolioLightbox({
  items,
  startIndex,
  onClose,
}: {
  items: { url: string; caption?: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [idx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % items.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [items.length, onClose]);

  const item = items[idx];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
        >
          Close ✕
        </button>

        {/* Image */}
        <div className="relative w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden max-h-[75vh]">
          {failed ? (
            <div className="flex flex-col items-center gap-3 py-20 text-white/40">
              <ImageOff className="size-8" />
              <span className="text-sm">Image unavailable</span>
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.caption ?? `Portfolio item ${idx + 1}`}
              className="max-h-[75vh] max-w-full object-contain"
              onError={() => setFailed(true)}
            />
          )}

          {items.length > 1 && (
            <>
              <button
                onClick={() => setIdx((p) => (p - 1 + items.length) % items.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => setIdx((p) => (p + 1) % items.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        {/* Caption + counter */}
        <div className="flex items-center gap-4 text-white/70 text-sm">
          {item.caption && <span>{item.caption}</span>}
          <span>{idx + 1} / {items.length}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = window.location.pathname;

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Redirect /pro-public/:slug → /pros/:slug
  useEffect(() => {
    if (location.startsWith("/pro-public/") && slug) {
      navigate(`/pros/${slug}`, { replace: true });
    }
  }, [location, slug, navigate]);

  const { data: provider, isLoading, error } = useQuery(getPublicProvider, { slug: slug ?? "" });

  // Fetch similar providers once we know the categories
  const firstCategorySlug = provider?.categories?.[0]?.serviceCategory?.slug ?? "";
  const { data: similarRaw } = useQuery(
    getProviders,
    { categorySlug: firstCategorySlug },
    { enabled: !!firstCategorySlug }
  );
  const similarProviders = (similarRaw ?? [])
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] space-y-6">
        <div className="animate-pulse h-48 bg-white rounded-[24px] border border-[#E2E8F0]" />
        <div className="animate-pulse h-32 bg-white rounded-[24px] border border-[#E2E8F0]" />
        <div className="animate-pulse h-56 bg-white rounded-[24px] border border-[#E2E8F0]" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-white border border-red-200 rounded-[24px] p-12 text-center max-w-md">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
            <Search className="size-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#0F172A]">Pro not found</h2>
          <p className="text-[#475569] mb-6">
            This pro may no longer be available or the link is incorrect.
          </p>
          <Link
            to="/discover"
            className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[16px] hover:bg-[#1D4ED8] transition-colors inline-block shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Browse all pros
          </Link>
        </div>
      </div>
    );
  }

  const portfolio = provider.portfolioJson
    ? (JSON.parse(provider.portfolioJson) as { url: string; caption?: string }[])
    : [];
  const accreditations = provider.accreditationsJson
    ? (JSON.parse(provider.accreditationsJson) as { name: string; issuedBy?: string; year?: string }[])
    : [];
  const reviewCount = provider.reviews?.length ?? 0;

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.businessName,
    description:
      provider.bio ??
      `Verified ${provider.categories.map((c) => c.serviceCategory.name).join(", ")} professional in the GTA`,
    url: `https://thehelper.ca/pros/${provider.slug}`,
    aggregateRating: provider.ratingInternal
      ? { "@type": "AggregateRating", ratingValue: provider.ratingInternal, reviewCount }
      : undefined,
    areaServed: provider.serviceAreas,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Portfolio lightbox */}
      {lightboxIdx !== null && portfolio.length > 0 && (
        <PortfolioLightbox
          items={portfolio}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero card */}
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <ProfilePhoto
                url={provider.profilePhotoUrl}
                name={provider.businessName}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-[#0F172A]">{provider.businessName}</h1>
                {provider.verificationStatus === "VERIFIED" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-[#22C55E] border border-green-200">
                    <BadgeCheck className="size-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="mb-3">
                <StarRating rating={provider.ratingInternal} count={reviewCount} />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.categories.map((pc) => (
                  <Link
                    key={pc.serviceCategoryId}
                    to={`/services/${pc.serviceCategory.slug}`}
                    className="px-3 py-1 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-xs font-medium text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                  >
                    {pc.serviceCategory.name}
                  </Link>
                ))}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-[#475569]">
                {provider.serviceAreas?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {provider.serviceAreas.join(", ")}
                  </span>
                )}
                {provider.responseTimeMins && (
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="size-4 text-[#F59E0B]" />
                    Responds in ~
                    {provider.responseTimeMins < 60
                      ? `${provider.responseTimeMins}m`
                      : `${Math.floor(provider.responseTimeMins / 60)}h`}
                  </span>
                )}
                {provider.website && (
                  <a
                    href={provider.website.startsWith("http") ? provider.website : `https://${provider.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline text-[#2563EB]"
                  >
                    Website <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link
                to={`/get-quotes?provider=${provider.id}`}
                className="inline-block px-6 py-3 bg-[#2563EB] text-white font-black rounded-[16px] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors text-sm whitespace-nowrap"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>

        {/* About */}
        {provider.bio && (
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <h2 className="text-xl font-black mb-4 text-[#0F172A]">About</h2>
            <p className="text-[#475569] leading-relaxed whitespace-pre-wrap">{provider.bio}</p>
          </div>
        )}

        {/* Accreditations */}
        {accreditations.length > 0 && (
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <h2 className="text-xl font-black mb-4 text-[#0F172A]">
              Certifications & Accreditations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accreditations.map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#2563EB]">
                    <Award className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0F172A]">{acc.name}</p>
                    {acc.issuedBy && (
                      <p className="text-xs text-[#475569]">
                        {acc.issuedBy}
                        {acc.year ? ` · ${acc.year}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio / See it in action */}
        {portfolio.length > 0 && (
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-[#0F172A]">See it in action</h2>
                <p className="text-sm text-[#475569] mt-0.5">
                  Past work from {provider.businessName}
                </p>
              </div>
              <Link
                to={`/get-quotes?provider=${provider.id}`}
                className="text-sm font-bold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                Request a quote →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item, i) => (
                <PortfolioImage
                  key={i}
                  url={item.url}
                  caption={item.caption}
                  index={i}
                  onClick={() => setLightboxIdx(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#0F172A]">Reviews</h2>
            <StarRating rating={provider.ratingInternal} count={reviewCount} />
          </div>

          {provider.reviews && provider.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-[#475569] text-sm">
              No reviews yet. Be the first to book this pro.
            </p>
          )}
        </div>

        {/* Similar providers */}
        {similarProviders.length > 0 && (
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-[#0F172A]">Similar projects</h2>
                <p className="text-sm text-[#475569] mt-0.5">
                  Other verified pros in the same category
                </p>
              </div>
              <Link
                to={`/discover?category=${firstCategorySlug}`}
                className="text-sm font-bold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarProviders.map((p) => {
                const catName = p.categories?.[0]?.serviceCategory?.name ?? "";
                const initials = p.businessName
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <Link
                    key={p.slug}
                    to={`/pros/${p.slug}`}
                    className="flex items-center gap-4 p-4 rounded-[18px] border border-[#E2E8F0] hover:border-[#BFDBFE] hover:shadow-sm transition-all"
                  >
                    <SimilarProviderAvatar
                      url={p.profilePhotoUrl}
                      initials={initials}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0F172A] truncate">
                        {p.businessName}
                      </p>
                      {catName && (
                        <p className="text-xs text-[#475569] truncate">{catName}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        {p.ratingInternal ? (
                          <>
                            <Star className="size-3 text-[#F59E0B] fill-[#F59E0B]" />
                            <span className="text-xs font-bold text-[#0F172A]">
                              {p.ratingInternal.toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">New</span>
                        )}
                        <span className="text-xs text-[#94A3B8] ml-1">
                          · {p.serviceAreas?.[0] ?? "GTA"}
                        </span>
                      </div>
                    </div>
                    <BadgeCheck className="size-4 text-[#22C55E] shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="rounded-[24px] bg-[#0F172A] p-8 text-center">
          <h2 className="text-xl font-black text-white mb-2">
            Ready to book {provider.businessName}?
          </h2>
          <p className="text-[#94A3B8] text-sm mb-6">
            Free to request. No commitment until you decide.
          </p>
          <Link
            to={`/get-quotes?provider=${provider.id}`}
            className="inline-block px-8 py-4 bg-[#2563EB] text-white font-black rounded-[18px] hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfilePhoto({ url, name }: { url: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name[0]?.toUpperCase() ?? "?";

  if (!url || failed) {
    return (
      <div className="w-24 h-24 rounded-[18px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
        <span className="text-4xl font-black text-[#2563EB]">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="w-24 h-24 rounded-[18px] object-cover border border-[#E2E8F0]"
      onError={() => setFailed(true)}
    />
  );
}

function SimilarProviderAvatar({
  url,
  initials,
}: {
  url: string | null;
  initials: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div className="w-12 h-12 rounded-[12px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
        <span className="text-sm font-black text-[#2563EB]">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="w-12 h-12 rounded-[12px] object-cover border border-[#E2E8F0] shrink-0"
      onError={() => setFailed(true)}
    />
  );
}
