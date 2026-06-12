import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { MapPin, Zap, Award, Search, ArrowLeft } from 'lucide-react';
import { useQuery } from "wasp/client/operations";
import { getPublicProvider } from "wasp/client/operations";
function StarRating({ rating, count }) {
    const rounded = Math.round((rating ?? 0) * 2) / 2;
    return (<div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (<svg key={star} className={`w-4 h-4 ${star <= rounded ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>))}
      </div>
      <span className="text-sm font-bold text-[#0F172A]">
        {rating ? rating.toFixed(1) : "New"}
      </span>
      {count > 0 && (<span className="text-xs text-[#475569]">({count} review{count !== 1 ? "s" : ""})</span>)}
    </div>);
}
function ReviewCard({ review, }) {
    return (<div className="p-5 rounded-[16px] border border-[#E2E8F0] bg-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (<svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>))}
        </div>
        <span className="text-xs text-[#475569]">
          {new Date(review.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      </div>
      {review.title && (<p className="font-bold text-sm mb-1 text-[#0F172A]">{review.title}</p>)}
      <p className="text-sm text-[#475569] leading-relaxed">{review.body}</p>
    </div>);
}
export default function ProPublicPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: provider, isLoading, error } = useQuery(getPublicProvider, { slug: slug ?? "" });
    if (isLoading) {
        return (<div className="p-8 max-w-5xl mx-auto min-h-[80vh] space-y-6">
        <div className="animate-pulse h-48 bg-white rounded-[24px] border border-[#E2E8F0]"/>
        <div className="animate-pulse h-32 bg-white rounded-[24px] border border-[#E2E8F0]"/>
        <div className="animate-pulse h-56 bg-white rounded-[24px] border border-[#E2E8F0]"/>
      </div>);
    }
    if (error || !provider) {
        return (<div className="p-8 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-white border border-red-200 rounded-[24px] p-12 text-center max-w-md">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
            <Search className="size-6 text-red-400"/>
          </div>
          <h2 className="text-xl font-bold mb-2 text-[#0F172A]">Pro not found</h2>
          <p className="text-[#475569] mb-6">
            This pro may no longer be available or the link is incorrect.
          </p>
          <Link to="/discover" className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[16px] hover:bg-[#1D4ED8] transition-colors inline-block">
            Browse all pros
          </Link>
        </div>
      </div>);
    }
    const portfolio = provider.portfolioJson ? JSON.parse(provider.portfolioJson) : [];
    const accreditations = provider.accreditationsJson ? JSON.parse(provider.accreditationsJson) : [];
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
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back nav */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4"/>
          Back
        </button>

        {/* Hero card */}
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {provider.profilePhotoUrl ? (<img src={provider.profilePhotoUrl} alt={provider.businessName} className="w-24 h-24 rounded-[18px] object-cover border border-[#E2E8F0]"/>) : (<div className="w-24 h-24 rounded-[18px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                  <span className="text-4xl font-black text-[#2563EB]">
                    {provider.businessName[0]}
                  </span>
                </div>)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-[#0F172A]">{provider.businessName}</h1>
                {provider.verificationStatus === "VERIFIED" && (<span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-[#22C55E] border border-green-200">
                    ✓ Verified
                  </span>)}
              </div>

              <div className="mb-3">
                <StarRating rating={provider.ratingInternal} count={reviewCount}/>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.categories.map((pc) => (<span key={pc.serviceCategoryId} className="px-3 py-1 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] text-xs font-medium text-[#2563EB]">
                    {pc.serviceCategory.name}
                  </span>))}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-[#475569]">
                {provider.serviceAreas?.length > 0 && (<span className="inline-flex items-center gap-1.5"><MapPin className="size-4"/> {provider.serviceAreas.join(", ")}</span>)}
                {provider.responseTimeMins && (<span className="inline-flex items-center gap-1.5"><Zap className="size-4 text-[#F59E0B]"/> Responds in ~{provider.responseTimeMins < 60 ? `${provider.responseTimeMins}m` : `${Math.floor(provider.responseTimeMins / 60)}h`}</span>)}
                {provider.website && (<a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#2563EB]">
                    Website ↗
                  </a>)}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link to={`/get-quotes?provider=${provider.id}`} className="inline-block px-6 py-3 bg-[#2563EB] text-white font-black rounded-[16px] shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors text-sm">
                Request a quote
              </Link>
            </div>
          </div>
        </div>

        {/* About */}
        {provider.bio && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <h2 className="text-xl font-black mb-4 text-[#0F172A]">About</h2>
            <p className="text-[#475569] leading-relaxed whitespace-pre-wrap">{provider.bio}</p>
          </div>)}

        {/* Accreditations */}
        {accreditations.length > 0 && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <h2 className="text-xl font-black mb-4 text-[#0F172A]">Certifications & Accreditations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accreditations.map((acc, i) => (<div key={i} className="flex items-center gap-3 p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#2563EB]">
                    <Award className="size-4"/>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0F172A]">{acc.name}</p>
                    {acc.issuedBy && (<p className="text-xs text-[#475569]">
                        {acc.issuedBy}{acc.year ? ` · ${acc.year}` : ""}
                      </p>)}
                  </div>
                </div>))}
            </div>
          </div>)}

        {/* Portfolio */}
        {portfolio.length > 0 && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <h2 className="text-xl font-black mb-4 text-[#0F172A]">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item, i) => (<div key={i} className="space-y-1">
                  <img src={item.url} alt={item.caption ?? `Portfolio item ${i + 1}`} className="w-full aspect-square object-cover rounded-[14px] border border-[#E2E8F0]"/>
                  {item.caption && (<p className="text-xs text-[#475569] text-center">{item.caption}</p>)}
                </div>))}
            </div>
          </div>)}

        {/* Reviews */}
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#0F172A]">Reviews</h2>
            <StarRating rating={provider.ratingInternal} count={reviewCount}/>
          </div>

          {provider.reviews && provider.reviews.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.reviews.map((review) => (<ReviewCard key={review.id} review={review}/>))}
            </div>) : (<p className="text-[#475569] text-sm">
              No reviews yet. Be the first to book this pro.
            </p>)}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=ProPublicPage.jsx.map