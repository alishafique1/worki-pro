import React from "react";
import { Link } from "react-router";
import { AirVent, Hammer, PlugZap, ShowerHead, WashingMachine, Wrench, CheckCircle2, Star, Briefcase, } from "lucide-react";
// Category icon mapping
const categoryIcons = {
    hvac: <AirVent className="size-3.5"/>,
    plumbing: <ShowerHead className="size-3.5"/>,
    electrical: <PlugZap className="size-3.5"/>,
    "appliance-repair": <WashingMachine className="size-3.5"/>,
    handyman: <Hammer className="size-3.5"/>,
    "smart-home": <Wrench className="size-3.5"/>,
};
function StarRating({ rating, size = "sm" }) {
    const rounded = Math.round((rating ?? 0) * 2) / 2;
    const iconSize = size === "md" ? "size-4" : "size-3.5";
    return (<div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
            const filled = star <= rounded;
            const halfFilled = star - 0.5 === rounded;
            return (<Star key={star} className={`${iconSize} ${filled
                    ? "text-[#F59E0B] fill-[#F59E0B]"
                    : halfFilled
                        ? "text-[#F59E0B] fill-[#F59E0B]/50"
                        : "text-[#E2E8F0] fill-[#E2E8F0]"}`}/>);
        })}
    </div>);
}
function VerificationBadge() {
    return (<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#22C55E] text-xs font-semibold border border-[#BBF7D0]">
      <CheckCircle2 className="size-3"/>
      Verified
    </span>);
}
function CategoryBadge({ category }) {
    const icon = categoryIcons[category.serviceCategory.slug];
    return (<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full border border-[#BFDBFE]">
      {icon}
      {category.serviceCategory.name}
    </span>);
}
export function ProviderCard({ id, businessName, contactName, ratingInternal, verificationStatus, serviceAreas = [], categories, profilePhotoUrl, bio, completedJobsCount = 0, reviewCount = 0, featured = false, rank, }) {
    const isVerified = verificationStatus === "VERIFIED";
    return (<Link to={`/pro/${id}`} className={`
        block bg-white rounded-[24px] overflow-hidden transition-all duration-300 group
        ${featured
            ? "border-2 border-[#2563EB] shadow-lg hover:shadow-xl hover:scale-[1.02]"
            : "border border-[#E2E8F0] hover:border-[#BFDBFE] hover:shadow-[0_8px_24px_rgba(37,99,235,0.10)]"}
      `}>
      {/* Featured badge */}
      {rank === 1 && (<div className="bg-[#2563EB] text-white text-xs font-bold px-4 py-1.5 text-center uppercase tracking-wider">
          #1 Top Rated
        </div>)}

      <div className="p-6">
        {/* Header: Avatar + Name + Verification */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="shrink-0">
            {profilePhotoUrl ? (<img src={profilePhotoUrl} alt={businessName} className="w-14 h-14 rounded-full object-cover border-2 border-[#E2E8F0] group-hover:border-[#BFDBFE] transition-colors"/>) : (<div className="w-14 h-14 rounded-full bg-[#EFF6FF] border-2 border-[#BFDBFE] flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
                <span className="text-2xl font-black text-[#2563EB]">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>)}
          </div>

          {/* Name + Verification */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
                {businessName}
              </h3>
            </div>

            {contactName && (<p className="text-sm text-[#475569] truncate mb-1">{contactName}</p>)}

            {isVerified && <VerificationBadge />}
          </div>
        </div>

        {/* Rating + Reviews + Jobs */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <StarRating rating={ratingInternal ?? null}/>
            <span className="text-sm font-semibold text-[#0F172A]">
              {ratingInternal ? ratingInternal.toFixed(1) : "New"}
            </span>
            {reviewCount > 0 && (<span className="text-xs text-[#475569]">
                ({reviewCount})
              </span>)}
          </div>

          {completedJobsCount > 0 && (<div className="flex items-center gap-1.5 text-xs text-[#475569]">
              <Briefcase className="size-3.5"/>
              <span>{completedJobsCount} job{completedJobsCount !== 1 ? "s" : ""} done</span>
            </div>)}
        </div>

        {/* Bio excerpt */}
        {bio && (<p className="text-sm text-[#475569] line-clamp-2 mb-4">
            {bio}
          </p>)}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.slice(0, 3).map((pc) => (<CategoryBadge key={pc.serviceCategory.id} category={pc}/>))}
          {categories.length > 3 && (<span className="px-2.5 py-1 bg-[#F8FAFC] text-[#94A3B8] text-xs font-medium rounded-full border border-[#E2E8F0]">
              +{categories.length - 3}
            </span>)}
        </div>

        {/* Footer: Areas + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
          <div className="text-xs text-[#94A3B8] truncate max-w-[50%]">
            {serviceAreas.length > 0 ? (<>
                Serves: {serviceAreas.slice(0, 2).join(", ")}
                {serviceAreas.length > 2 && ` +${serviceAreas.length - 2}`}
              </>) : ("GTA Area")}
          </div>

          <span className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-sm group-hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
            View Profile
          </span>
        </div>
      </div>
    </Link>);
}
// Loading skeleton
export function ProviderCardSkeleton({ featured = false }) {
    return (<div className={`
        bg-white rounded-[24px] overflow-hidden animate-pulse
        ${featured ? "border-2 border-[#BFDBFE]" : "border border-[#E2E8F0]"}
      `}>
      {featured && <div className="h-7 bg-[#E2E8F0]"/>}

      <div className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#E2E8F0]"/>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 rounded bg-[#E2E8F0]"/>
            <div className="h-4 w-1/2 rounded bg-[#E2E8F0]"/>
          </div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="w-3.5 h-3.5 rounded bg-[#E2E8F0]"/>))}
          </div>
          <div className="h-4 w-16 rounded bg-[#E2E8F0]"/>
        </div>

        {/* Bio skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-[#E2E8F0]"/>
          <div className="h-4 w-4/5 rounded bg-[#E2E8F0]"/>
        </div>

        {/* Categories skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-7 w-20 rounded-full bg-[#E2E8F0]"/>
          <div className="h-7 w-24 rounded-full bg-[#E2E8F0]"/>
          <div className="h-7 w-16 rounded-full bg-[#E2E8F0]"/>
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
          <div className="h-4 w-32 rounded bg-[#E2E8F0]"/>
          <div className="h-9 w-24 rounded-[16px] bg-[#E2E8F0]"/>
        </div>
      </div>
    </div>);
}
// Grid container for responsive layout
export function ProviderCardGrid({ children }) {
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>);
}
// Featured grid (for top 3)
export function FeaturedProviderGrid({ children }) {
    return (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {children}
    </div>);
}
//# sourceMappingURL=ProviderCard.jsx.map