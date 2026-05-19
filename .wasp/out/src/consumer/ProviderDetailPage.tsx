import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getProviderById, getServiceCategories } from 'wasp/client/operations';

export default function ProviderDetailPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const { data: provider, isLoading, error } = useQuery(getProviderById, { providerId: providerId ?? '' });
  const { data: categories } = useQuery(getServiceCategories);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] space-y-8">
        <div className="animate-pulse h-40 bg-white rounded-[24px] border border-[#E2E8F0]" />
        <div className="animate-pulse h-60 bg-white rounded-[24px] border border-[#E2E8F0]" />
        <div className="animate-pulse h-40 bg-white rounded-[24px] border border-[#E2E8F0]" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="p-8 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">
        <div className="bg-white border border-red-200 rounded-[24px] p-12 text-center max-w-md">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2 text-[#0F172A]">Pro not found</h2>
          <p className="text-[#475569] mb-6">
            This pro may no longer be available or the link may be incorrect.
          </p>
          <Link
            to="/discover"
            className="px-6 py-3 bg-[#2563EB] text-white font-bold rounded-[16px] hover:bg-[#1D4ED8] transition-colors inline-block"
          >
            Browse all pros
          </Link>
        </div>
      </div>
    );
  }

  const categoryMap: Record<string, string> = {};
  provider.categories.forEach((pc) => {
    categoryMap[pc.serviceCategory.slug] = pc.serviceCategory.name;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[80vh]">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors mb-8 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to search
      </button>

      {/* Hero card */}
      <div className="bg-white border border-[#E2E8F0] rounded-[28px] p-8 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-[#EFF6FF] flex items-center justify-center text-4xl font-bold text-[#2563EB] shrink-0">
            {provider.businessName.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1 flex flex-wrap items-center gap-3 text-[#0F172A]">
                  {provider.businessName}
                  {provider.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold border border-green-200">
                      ✓ Verified
                    </span>
                  )}
                </h1>
                {provider.contactName && (
                  <p className="text-[#475569] text-lg">{provider.contactName}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm font-bold rounded-full uppercase tracking-wider">
                  {provider.verificationStatus}
                </span>
                {provider.ratingInternal && (
                  <div className="flex items-center gap-1">
                    <span className="text-[#F59E0B] font-bold text-lg">{provider.ratingInternal.toFixed(1)}</span>
                    <span className="text-[#475569] text-sm">rating</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-4 mb-5">
              {provider.phone && (
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-sm font-medium hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors text-[#0F172A]"
                >
                  <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {provider.phone}
                </a>
              )}
              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-sm font-medium hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors text-[#0F172A]"
                >
                  <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {provider.email}
                </a>
              )}
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-sm font-medium hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors text-[#0F172A]"
                >
                  <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}
            </div>

            {/* Service areas */}
            {provider.serviceAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-[#475569] font-medium">Serves:</span>
                {provider.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-sm rounded-full text-[#475569]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#0F172A]">Services Offered</h2>
            {provider.services.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 text-center">
                <p className="text-[#475569]">No services listed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 hover:border-[#BFDBFE] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-bold text-lg text-[#0F172A]">{service.name}</h3>
                      {service.price && (
                        <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full text-sm font-bold shrink-0">
                          ${service.price.toFixed(2)} CAD
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-[#475569] text-sm mb-3">{service.description}</p>
                    )}
                    {service.categorySlug && categoryMap[service.categorySlug] && (
                      <span className="inline-block px-3 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full border border-[#BFDBFE]">
                        {categoryMap[service.categorySlug]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#0F172A]">Service Categories</h2>
            <div className="flex flex-wrap gap-3">
              {provider.categories.map((pc) => (
                <span
                  key={pc.serviceCategory.id}
                  className="px-4 py-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full text-sm font-medium text-[#2563EB]"
                >
                  {pc.serviceCategory.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sticky top-8">
            <h3 className="text-lg font-bold mb-3 text-[#0F172A]">Request this pro</h3>
            <p className="text-[#475569] text-sm mb-5">
              Ready to get started? Submit a service request and we'll match you with {provider.businessName}.
            </p>
            <Link
              to={`/request-service?proId=${provider.id}`}
              className="block w-full text-center px-6 py-4 bg-[#2563EB] text-white font-bold rounded-[18px] hover:bg-[#1D4ED8] transition-colors mb-3"
            >
              Request Service
            </Link>
            <Link
              to="/discover"
              className="block w-full text-center px-6 py-3 bg-[#F8FAFC] border border-[#E2E8F0] font-medium rounded-[18px] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors text-sm text-[#475569]"
            >
              Browse other pros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
