import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "wasp/client/operations";
import { getPublicProvider } from "wasp/client/operations";

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  const rounded = Math.round((rating ?? 0) * 2) / 2;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rounded ? "text-yellow-400" : "text-[var(--border-default)]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold">
        {rating ? rating.toFixed(1) : "New"}
      </span>
      {count > 0 && (
        <span className="text-xs text-[var(--text-secondary)]">({count} review{count !== 1 ? "s" : ""})</span>
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
    <div className="p-5 rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-raised)]">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              className={`w-3.5 h-3.5 ${s <= review.rating ? "text-yellow-400" : "text-[var(--border-default)]"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      </div>
      {review.title && (
        <p className="font-bold text-sm mb-1">{review.title}</p>
      )}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.body}</p>
    </div>
  );
}

export default function ProPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: provider, isLoading, error } = useQuery(getPublicProvider, { slug: slug ?? "" });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] space-y-6">
        <div className="animate-pulse h-48 bg-[var(--surface-raised)] rounded-[24px]" />
        <div className="animate-pulse h-32 bg-[var(--surface-raised)] rounded-[24px]" />
        <div className="animate-pulse h-56 bg-[var(--surface-raised)] rounded-[24px]" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-[var(--surface-raised)] border border-red-500/30 rounded-[24px] p-12 text-center max-w-md">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">Pro not found</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            This pro may no longer be available or the link is incorrect.
          </p>
          <Link
            to="/discover"
            className="px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-[16px] hover:opacity-90 transition-opacity inline-block"
          >
            Browse all pros
          </Link>
        </div>
      </div>
    );
  }

  const portfolio = provider.portfolioJson ? JSON.parse(provider.portfolioJson) as { url: string; caption?: string }[] : [];
  const accreditations = provider.accreditationsJson ? JSON.parse(provider.accreditationsJson) as { name: string; issuedBy?: string; year?: string }[] : [];
  const reviewCount = provider.reviews?.length ?? 0;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.businessName,
    description: provider.bio ?? `Verified ${provider.categories.map(c => c.serviceCategory.name).join(", ")} professional in the GTA`,
    url: `https://thehelper.ca/pro-public/${provider.slug}`,
    aggregateRating: provider.ratingInternal
      ? { "@type": "AggregateRating", ratingValue: provider.ratingInternal, reviewCount }
      : undefined,
    areaServed: provider.serviceAreas,
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-foreground transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Hero card */}
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {provider.profilePhotoUrl ? (
                <img
                  src={provider.profilePhotoUrl}
                  alt={provider.businessName}
                  className="w-24 h-24 rounded-[18px] object-cover border border-[var(--border-default)]"
                />
              ) : (
                <div className="w-24 h-24 rounded-[18px] bg-[var(--surface-overlay)] border border-[var(--border-default)] flex items-center justify-center">
                  <span className="text-4xl font-black" style={{ color: "var(--accent)" }}>
                    {provider.businessName[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black">{provider.businessName}</h1>
                {provider.verificationStatus === "VERIFIED" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-400/10 text-green-400 border border-green-400/30">
                    Verified
                  </span>
                )}
              </div>

              <div className="mb-3">
                <StarRating rating={provider.ratingInternal} count={reviewCount} />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.categories.map((pc) => (
                  <span
                    key={pc.serviceCategoryId}
                    className="px-3 py-1 rounded-full border border-[var(--border-default)] text-xs font-medium text-[var(--text-secondary)]"
                  >
                    {pc.serviceCategory.name}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                {provider.serviceAreas?.length > 0 && (
                  <span>📍 {provider.serviceAreas.join(", ")}</span>
                )}
                {provider.responseTimeMins && (
                  <span>⚡ Responds in ~{provider.responseTimeMins < 60 ? `${provider.responseTimeMins}m` : `${Math.floor(provider.responseTimeMins / 60)}h`}</span>
                )}
                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    Website ↗
                  </a>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link
                to={`/request-service?provider=${provider.id}`}
                className="inline-block px-6 py-3 bg-[var(--accent)] text-black font-black rounded-[16px] hover:opacity-90 transition-opacity text-sm"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>

        {/* About */}
        {provider.bio && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
            <h2 className="text-xl font-black mb-4">About</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{provider.bio}</p>
          </div>
        )}

        {/* Accreditations */}
        {accreditations.length > 0 && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
            <h2 className="text-xl font-black mb-4">Certifications & Accreditations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accreditations.map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-base)]"
                >
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="font-bold text-sm">{acc.name}</p>
                    {acc.issuedBy && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        {acc.issuedBy}{acc.year ? ` · ${acc.year}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        {portfolio.length > 0 && (
          <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
            <h2 className="text-xl font-black mb-4">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item, i) => (
                <div key={i} className="space-y-1">
                  <img
                    src={item.url}
                    alt={item.caption ?? `Portfolio item ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-[14px] border border-[var(--border-default)]"
                  />
                  {item.caption && (
                    <p className="text-xs text-[var(--text-secondary)] text-center">{item.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">Reviews</h2>
            <StarRating rating={provider.ratingInternal} count={reviewCount} />
          </div>

          {provider.reviews && provider.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)] text-sm">
              No reviews yet — be the first to book this pro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
