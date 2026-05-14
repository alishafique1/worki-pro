import React, { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getProviders, getServiceCategories } from 'wasp/client/operations';
import { SERVICE_ZONES } from '../shared/geoConfig';

const AREAS = [
  { slug: '', label: 'All Areas' },
  ...SERVICE_ZONES.filter(z => z.active).map(z => ({
    slug: z.name.toLowerCase(),
    label: z.name,
  })),
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

type SortValue = 'rating' | 'name';

export default function DiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [sortBy, setSortBy] = useState<SortValue>('rating');

  const { data: categories } = useQuery(getServiceCategories);
  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
    areaSlug: selectedArea || undefined,
  });

  // Sort providers client-side (server always returns rating-desc)
  const sortedProviders = React.useMemo(() => {
    if (!providers) return [];
    const list = [...providers];
    if (sortBy === 'name') {
      list.sort((a, b) => a.businessName.localeCompare(b.businessName));
    }
    // rating is already server-sorted desc
    return list;
  }, [providers, sortBy]);

  const featuredProviders = React.useMemo(() => {
    return sortedProviders.slice(0, 3);
  }, [sortedProviders]);

  const remainingProviders = React.useMemo(() => {
    return sortedProviders.slice(3);
  }, [sortedProviders]);

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3 text-[#0F172A]">Discover Pros</h1>
        <p className="text-[#475569] text-lg">Browse verified, background-checked service professionals in your area.</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[200px]"
        >
          <option value="">All Services</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[180px]"
        >
          {AREAS.map((area) => (
            <option key={area.slug} value={area.slug}>{area.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortValue)}
          className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[140px]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-[24px] h-52 border border-[#E2E8F0]" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-[24px] h-52 border border-[#E2E8F0]" />
            ))}
          </div>
        </div>
      ) : sortedProviders?.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50">🔍</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#0F172A]">No pros found</h3>
          <p className="text-[#475569]">
            {selectedArea
              ? `No pros serving ${AREAS.find(a => a.slug === selectedArea)?.label} yet. Try another area.`
              : 'Try adjusting your search or category filter.'}
          </p>
          {selectedArea && (
            <button
              onClick={() => setSelectedArea('')}
              className="mt-4 px-5 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Clear Area Filter
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Featured Pros — only when no filters active */}
          {!selectedCategory && !searchQuery && !selectedArea && featuredProviders.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">⭐</span>
                <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Top Rated Near You</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProviders.map((provider: any, index: number) => (
                  <Link
                    key={provider.id}
                    to={`/pro/${provider.id}`}
                    className="relative block bg-white border-2 border-[#2563EB] rounded-[24px] p-6 hover:scale-105 transition-all duration-300 group shadow-lg"
                  >
                    {index === 0 && (
                      <span className="absolute -top-3 left-6 px-3 py-1 bg-[#2563EB] text-white text-xs font-black rounded-full uppercase tracking-wider">
                        #1 Rated
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center text-2xl font-black text-[#2563EB]">
                        {provider.businessName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full uppercase tracking-wider">
                          {provider.verificationStatus}
                        </span>
                        {provider.ratingInternal && (
                          <span className="text-[#F59E0B] font-black text-lg">
                            ★ {provider.ratingInternal.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-black mb-1 flex flex-wrap items-center gap-2 truncate text-[#0F172A]">
                      <span className="truncate">{provider.businessName}</span>
                      {provider.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold border border-green-200">
                          ✓ Verified
                        </span>
                      )}
                    </h3>
                    {provider.contactName && (
                      <p className="text-[#475569] text-sm mb-3">{provider.contactName}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.categories.slice(0, 2).map((pc: any) => (
                        <span key={pc.serviceCategory.id} className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full border border-[#BFDBFE]">
                          {pc.serviceCategory.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                      <span className="text-sm text-[#475569]">
                        {provider.serviceAreas?.slice(0, 2).join(', ')}
                      </span>
                      <span className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-sm">
                        View Profile
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Providers */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {remainingProviders.length > 0 || featuredProviders.length === 0
                  ? `${sortedProviders.length} Pro${sortedProviders.length !== 1 ? 's' : ''} Found`
                  : `All Pros (${sortedProviders.length})`}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProviders.length > 0 ? remainingProviders : sortedProviders)?.map((provider: any) => (
                <Link
                  key={provider.id}
                  to={`/pro/${provider.id}`}
                  className="block bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#BFDBFE] transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center text-2xl font-bold text-[#2563EB]">
                      {provider.businessName.charAt(0).toUpperCase()}
                    </div>
                    <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full uppercase tracking-wider">
                      {provider.verificationStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 flex flex-wrap items-center gap-2 truncate text-[#0F172A]">
                    <span className="truncate">{provider.businessName}</span>
                    {provider.verificationStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E] text-xs font-bold border border-green-200">
                        ✓ Verified
                      </span>
                    )}
                  </h3>
                  {provider.contactName && (
                    <p className="text-[#475569] text-sm mb-3">{provider.contactName}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.categories.slice(0, 3).map((pc: any) => (
                      <span key={pc.serviceCategory.id} className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full border border-[#BFDBFE]">
                        {pc.serviceCategory.name}
                      </span>
                    ))}
                    {provider.categories.length > 3 && (
                      <span className="px-3 py-1 bg-[#F8FAFC] text-[#94A3B8] text-xs font-medium rounded-full border border-[#E2E8F0]">
                        +{provider.categories.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-1">
                      {provider.ratingInternal ? (
                        <>
                          <span className="text-[#F59E0B] font-bold">{provider.ratingInternal.toFixed(1)}</span>
                          <span className="text-[#475569] text-sm">rating</span>
                        </>
                      ) : (
                        <span className="text-[#94A3B8] text-sm">New pro</span>
                      )}
                    </div>
                    <span className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-sm">
                      View Profile
                    </span>
                  </div>

                  {provider.serviceAreas?.length > 0 && (
                    <p className="text-[#94A3B8] text-xs mt-3">
                      Serves: {provider.serviceAreas.slice(0, 2).join(', ')}
                      {provider.serviceAreas.length > 2 && ` +${provider.serviceAreas.length - 2} more`}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Category quick-links */}
      <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
        <h2 className="text-lg font-bold mb-4 text-[#0F172A]">Browse by Service</h2>
        <div className="flex flex-wrap gap-3">
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#2563EB] text-[#475569]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Area quick-links */}
      <div className="mt-8 pb-12">
        <h2 className="text-lg font-bold mb-4 text-[#0F172A]">Browse by Area</h2>
        <div className="flex flex-wrap gap-3">
          {AREAS.slice(1).map((area) => (
            <button
              key={area.slug}
              onClick={() => {
                setSelectedArea(area.slug);
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                selectedArea === area.slug
                  ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#2563EB] text-[#475569]'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
