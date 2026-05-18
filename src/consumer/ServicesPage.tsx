import React, { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getProviders, getServiceCategories } from 'wasp/client/operations';
import { categoryImages } from '../landing-page/marketplace/content';

type ServiceListing = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  categorySlug: string;
};

type ProviderWithServices = {
  id: string;
  businessName: string;
  ratingInternal: number | null;
  verificationStatus: string;
  categories: { serviceCategory: { id: string; slug: string; name: string } }[];
  services: ServiceListing[];
};

type SortOption = 'name-asc' | 'price-asc' | 'price-desc' | 'popular';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const { data: categories } = useQuery(getServiceCategories);
  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Extract all unique services from all providers, grouped by service name + categorySlug
  const allServicesMap = new Map<string, { service: ServiceListing; providerCount: number; providers: string[] }>();

  providers?.forEach((provider: any) => {
    const services: ServiceListing[] = provider.servicesJson ? JSON.parse(provider.servicesJson) : [];
    services.forEach((svc) => {
      const key = `${svc.name.toLowerCase()}__${svc.categorySlug}`;
      const cat = provider.categories?.[0]?.serviceCategory;
      const catSlug = svc.categorySlug || cat?.slug || 'other';
      if (!allServicesMap.has(key)) {
        allServicesMap.set(key, {
          service: { ...svc, categorySlug: catSlug },
          providerCount: 0,
          providers: [],
        });
      }
      const entry = allServicesMap.get(key)!;
      if (!entry.providers.includes(provider.id)) {
        entry.providerCount++;
        entry.providers.push(provider.id);
      }
    });
  });

  // Apply category filter client-side (services carry their own categorySlug independent of provider filter)
  let servicesList = Array.from(allServicesMap.values()).filter((entry) =>
    selectedCategory ? entry.service.categorySlug === selectedCategory : true
  );

  // Apply search
  servicesList = searchQuery
    ? servicesList.filter((s) =>
        s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : servicesList;

  // Apply sort
  servicesList = [...servicesList].sort((a, b) => {
    if (sortBy === 'name-asc') return a.service.name.localeCompare(b.service.name);
    if (sortBy === 'price-asc') return (a.service.price ?? Infinity) - (b.service.price ?? Infinity);
    if (sortBy === 'price-desc') return (b.service.price ?? -Infinity) - (a.service.price ?? -Infinity);
    if (sortBy === 'popular') return b.providerCount - a.providerCount;
    return 0;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3 text-[#0F172A]">Browse Services</h1>
        <p className="text-[#475569] text-lg">
          See all services offered by verified pros in your area.
        </p>
      </div>

      {/* Controls bar */}
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
            placeholder="Search for a service..."
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
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[160px]"
        >
          <option value="name-asc">Name A–Z</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-[#475569]">
          {isLoading ? 'Loading...' : `${servicesList.length} service${servicesList.length !== 1 ? 's' : ''} found`}
          {selectedCategory && categories?.find((c) => c.slug === selectedCategory)
            ? ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`
            : ''}
        </p>
      </div>

      {/* Services grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white">
              <div className="h-32 bg-[#E2E8F0]" />
              <div className="p-6">
                <div className="h-5 w-24 rounded bg-[#E2E8F0]" />
                <div className="mt-3 h-4 w-full rounded bg-[#E2E8F0]" />
                <div className="mt-2 h-4 w-3/4 rounded bg-[#E2E8F0]" />
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="h-8 w-24 rounded-full bg-[#E2E8F0]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : servicesList.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50">🛠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#0F172A]">No services found</h3>
          <p className="text-[#475569]">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((entry) => {
            const imageUrl = categoryImages[entry.service.categorySlug];
            return (
              <div
                key={`${entry.service.name}-${entry.service.categorySlug}`}
                className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden hover:border-[#BFDBFE] hover:shadow-[0_8px_24px_rgba(37,99,235,0.10)] transition-all duration-300 flex flex-col group"
              >
                {/* Image header */}
                {imageUrl && (
                  <div className="relative h-32 w-full overflow-hidden bg-[#F8FAFC]">
                    <img
                      src={imageUrl}
                      alt={entry.service.categorySlug}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {entry.service.price && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm font-bold shadow">
                        ${entry.service.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {!imageUrl && (
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                        <span className="text-lg">🔧</span>
                      </div>
                      {entry.service.price && (
                        <span className="px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm font-bold">
                          ${entry.service.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1 text-[#0F172A]">{entry.service.name}</h3>
                  {entry.service.description && (
                    <p className="text-[#475569] text-sm mb-4 line-clamp-2">
                      {entry.service.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#94A3B8]">
                        {entry.providerCount} pro{entry.providerCount !== 1 ? 's' : ''} offering
                      </span>
                      <Link
                        to={`/discover${selectedCategory ? `?category=${selectedCategory}` : ''}`}
                        className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-xs hover:bg-[#1D4ED8] transition-colors"
                      >
                        Find Pros
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category quick-links */}
      <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
        <h2 className="text-lg font-bold mb-4 text-[#0F172A]">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories?.map((cat) => (
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
    </div>
  );
}
