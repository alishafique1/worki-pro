import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "wasp/client/operations";
import { getProviders } from "wasp/client/operations";
import { SERVICE_ZONES } from "../shared/geoConfig";

const SERVICE_META: Record<
  string,
  { label: string; icon: string; description: string; bullets: string[] }
> = {
  hvac: {
    label: "HVAC",
    icon: "❄️",
    description: "heating, cooling & air quality repairs",
    bullets: [
      "Furnace repair & replacement",
      "Air conditioner service",
      "Heat pump installation",
      "Duct cleaning & tune-ups",
    ],
  },
  handyman: {
    label: "Handyman",
    icon: "🔨",
    description: "home repairs, mounting & installations",
    bullets: [
      "TV & picture mounting",
      "Furniture assembly",
      "Drywall patching",
      "Door & lock repairs",
    ],
  },
  plumbing: {
    label: "Plumbing",
    icon: "🚰",
    description: "leak repairs, drain cleaning & fixture installs",
    bullets: [
      "Leak detection & repair",
      "Toilet & faucet installation",
      "Drain cleaning",
      "Water heater service",
    ],
  },
  electrical: {
    label: "Electrical",
    icon: "⚡",
    description: "panel upgrades, outlet installs & EV chargers",
    bullets: [
      "Outlet & switch installation",
      "Panel upgrades",
      "EV charger installation",
      "Lighting & ceiling fans",
    ],
  },
  "appliance-repair": {
    label: "Appliance Repair",
    icon: "🔧",
    description: "fridge, washer, dryer & oven repairs",
    bullets: [
      "Refrigerator repair",
      "Washer & dryer service",
      "Dishwasher repair",
      "Oven & stove fixes",
    ],
  },
  "smart-home": {
    label: "Smart Home",
    icon: "🏠",
    description: "smart device setup, cameras & automation",
    bullets: [
      "Smart thermostat install",
      "Security camera setup",
      "Smart lock installation",
      "Home automation wiring",
    ],
  },
};

function slugToLabel(slug: string) {
  return (
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export default function ServiceAreaLandingPage() {
  const { serviceSlug, areaSlug } = useParams<{
    serviceSlug: string;
    areaSlug: string;
  }>();

  const serviceMeta = SERVICE_META[serviceSlug ?? ""];
  const areaName =
    SERVICE_ZONES.find(
      (z) => z.name.toLowerCase().replace(/\s+/g, "-") === areaSlug,
    )?.name ?? slugToLabel(areaSlug ?? "");

  const serviceLabel = serviceMeta?.label ?? slugToLabel(serviceSlug ?? "");

  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: serviceSlug,
    areaSlug,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceLabel} in ${areaName}`,
    description: `Find verified, insured ${serviceLabel.toLowerCase()} professionals in ${areaName}. Get matched in minutes with TheHelper.`,
    areaServed: areaName,
    provider: {
      "@type": "Organization",
      name: "TheHelper Home Services",
      url: "https://thehelper.ca",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          {serviceMeta?.icon && (
            <span className="text-5xl">{serviceMeta.icon}</span>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#0F172A]">
              {serviceLabel} in {areaName}
            </h1>
            <p className="text-[#475569] mt-1">
              Find verified, insured {serviceLabel.toLowerCase()} pros near you, matched in minutes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to={`/request-service?service=${serviceSlug}`}
            className="inline-block px-7 py-4 bg-[#2563EB] text-white font-black rounded-[18px] hover:bg-[#1D4ED8] transition-colors text-base"
          >
            Get quotes (it's free)
          </Link>
          <Link
            to="/discover"
            className="inline-block px-7 py-4 border border-[#E2E8F0] rounded-[18px] font-bold hover:border-[#BFDBFE] hover:text-[#2563EB] transition-colors text-base"
          >
            Browse all pros
          </Link>
        </div>
      </section>

      {/* Service bullets */}
      {serviceMeta?.bullets && (
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <div>
              <h2 className="text-xl font-black mb-4 text-[#0F172A]">
                {serviceLabel} services in {areaName}
              </h2>
              <ul className="space-y-2">
                {serviceMeta.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-[#475569]">
                    <svg className="w-4 h-4 shrink-0 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-black mb-4 text-[#0F172A]">How it works</h2>
              <ol className="space-y-3">
                {[
                  "Describe your job in 30 seconds",
                  "Get matched with verified local pros",
                  "Compare quotes with no obligation",
                  "Book & earn reward points",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#475569]">
                    <span
                      className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5"
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Providers grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-black mb-6 text-[#0F172A]">
          Top {serviceLabel} pros in {areaName}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse h-40 bg-white rounded-[18px] border border-[#E2E8F0]" />
            ))}
          </div>
        )}

        {!isLoading && providers && providers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((pro) => (
              <Link
                key={pro.id}
                to={`/pro/${pro.id}`}
                className="block rounded-[18px] border border-[#E2E8F0] bg-white p-5 hover:border-[#BFDBFE] transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-[12px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                    <span className="text-xl font-black text-[#2563EB]">
                      {pro.businessName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm leading-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {pro.businessName}
                    </p>
                    {pro.ratingInternal && (
                      <p className="text-xs text-yellow-500 font-bold">
                        ★ {pro.ratingInternal.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {pro.categories.slice(0, 2).map((c) => (
                    <span
                      key={c.serviceCategoryId}
                      className="px-2 py-0.5 rounded-full border border-[#E2E8F0] text-xs text-[#475569]"
                    >
                      {c.serviceCategory.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (!providers || providers.length === 0) && (
          <div className="text-center py-12 text-[#475569]">
            <p className="text-lg font-bold mb-2">No pros listed yet in this area.</p>
            <p className="text-sm mb-4">
              Post your request and we'll match you with the best available pro.
            </p>
            <Link
              to={`/request-service?service=${serviceSlug}`}
              className="inline-block px-6 py-3 bg-[#2563EB] text-white font-black rounded-[16px] hover:bg-[#1D4ED8] transition-colors"
            >
              Post a request
            </Link>
          </div>
        )}
      </section>

      {/* Area cross-links */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-black mb-4 text-[#0F172A]">
          {serviceLabel} in other GTA cities
        </h2>
        <div className="flex flex-wrap gap-3">
          {SERVICE_ZONES.filter((z) => z.active).map((zone) => {
            const href = `/services/${serviceSlug}/${zone.name.toLowerCase().replace(/\s+/g, "-")}`;
            const isCurrent =
              zone.name.toLowerCase().replace(/\s+/g, "-") === areaSlug;
            return (
              <Link
                key={zone.name}
                to={href}
                className={`px-4 py-2 rounded-[12px] border text-sm font-bold transition-all ${
                  isCurrent
                    ? "border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] text-[#475569] hover:border-[#BFDBFE] hover:text-[#2563EB]"
                }`}
              >
                {serviceLabel} in {zone.name}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
