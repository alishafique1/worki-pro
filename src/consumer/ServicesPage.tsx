import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getProviders, getServiceCategories } from 'wasp/client/operations';

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

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useQuery(getServiceCategories);
  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Extract all unique services from all providers, grouped by category
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

  const servicesList = Array.from(allServicesMap.values()).sort((a, b) => a.service.name.localeCompare(b.service.name));

  // Filter by search
  const filtered = searchQuery
    ? servicesList.filter((s) =>
        s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : servicesList;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3">Browse Services</h1>
        <p className="text-[var(--text-secondary)] text-lg">
          See all services offered by verified pros in your area.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] text-base focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-4 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] text-base focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer min-w-[200px]"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)]">
          {isLoading ? 'Loading...' : `${filtered.length} service${filtered.length !== 1 ? 's' : ''} found`}
          {selectedCategory && categories?.find((c) => c.slug === selectedCategory)
            ? ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`
            : ''}
        </p>
      </div>

      {/* Services grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-[var(--surface-raised)] rounded-[24px] h-44 border border-[var(--border-default)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[var(--surface-raised)] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50">🛠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No services found</h3>
          <p className="text-[var(--text-secondary)]">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <div
              key={`${entry.service.name}-${entry.service.categorySlug}`}
              className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <span className="text-lg">🔧</span>
                </div>
                {entry.service.price && (
                  <span className="px-3 py-1 bg-[var(--accent)] text-[#000] rounded-full text-sm font-bold">
                    ${entry.service.price.toFixed(2)}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-1">{entry.service.name}</h3>
              {entry.service.description && (
                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                  {entry.service.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-[var(--border-default)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {entry.providerCount} pro{entry.providerCount !== 1 ? 's' : ''} offering
                  </span>
                  <Link
                    to={`/discover${selectedCategory ? `?category=${selectedCategory}` : ''}`}
                    className="px-4 py-2 bg-[var(--accent)] text-[#000] font-bold rounded-[16px] text-xs hover:opacity-90 transition-opacity"
                  >
                    Find Pros
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category quick-links */}
      <div className="mt-12 pt-8 border-t border-[var(--border-default)]">
        <h2 className="text-lg font-bold mb-4">Browse by Category</h2>
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
                  ? 'bg-[var(--accent)] text-[#000] border-[var(--accent)]'
                  : 'bg-[var(--surface-raised)] border-[var(--border-default)] hover:border-[var(--accent)]'
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
