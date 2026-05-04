import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
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
  servicesJson: string;
  categories: { serviceCategory: { id: string; slug: string; name: string } }[];
  serviceAreas: string[];
};

type SortOption = 'name-asc' | 'price-asc' | 'price-desc' | 'popular';

export default function ListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const { data: categories } = useQuery(getServiceCategories);
  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  // Extract all individual service listings from all providers
  const allListingsMap = useMemo(() => {
    const map = new Map<string, {
      service: ServiceListing;
      providerCount: number;
      providers: { id: string; businessName: string; ratingInternal: number | null }[];
      minPrice: number | null;
    }>();

    (providers as ProviderWithServices[] | undefined)?.forEach((provider) => {
      const defaultCategory = provider.categories?.[0]?.serviceCategory;
      const services: ServiceListing[] = provider.servicesJson
        ? JSON.parse(provider.servicesJson)
        : [];

      services.forEach((svc) => {
        const catSlug = svc.categorySlug || defaultCategory?.slug || 'other';
        const key = `${svc.name.toLowerCase()}__${catSlug}`;

        if (!map.has(key)) {
          map.set(key, {
            service: { ...svc, categorySlug: catSlug },
            providerCount: 0,
            providers: [],
            minPrice: svc.price,
          });
        }

        const entry = map.get(key)!;
        if (!entry.providers.some((p) => p.id === provider.id)) {
          entry.providerCount++;
          entry.providers.push({
            id: provider.id,
            businessName: provider.businessName,
            ratingInternal: provider.ratingInternal,
          });
          if (svc.price !== null && (entry.minPrice === null || svc.price < entry.minPrice)) {
            entry.minPrice = svc.price;
          }
        }
      });
    });

    return map;
  }, [providers]);

  // Apply category filter
  let listings = Array.from(allListingsMap.values()).filter((entry) =>
    selectedCategory ? entry.service.categorySlug === selectedCategory : true
  );

  // Apply search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    listings = listings.filter(
      (s) =>
        s.service.name.toLowerCase().includes(q) ||
        s.service.description.toLowerCase().includes(q)
    );
  }

  // Apply sort
  listings = [...listings].sort((a, b) => {
    if (sortBy === 'name-asc') return a.service.name.localeCompare(b.service.name);
    if (sortBy === 'price-asc') return (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity);
    if (sortBy === 'price-desc') return (b.minPrice ?? -Infinity) - (a.minPrice ?? -Infinity);
    if (sortBy === 'popular') return b.providerCount - a.providerCount;
    return 0;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3">Service Listings</h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Browse every service offered by verified pros in the GTA.
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-5 py-4 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[20px] text-base focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer min-w-[160px]"
        >
          <option value="name-asc">Name A–Z</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text-secondary)]">
          {isLoading
            ? 'Loading...'
            : `${listings.length} service${listings.length !== 1 ? 's' : ''} found${
                selectedCategory && categories?.find((c) => c.slug === selectedCategory)
                  ? ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`
                  : ''
              }`}
        </p>
      </div>

      {/* Listings grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-[var(--surface-raised)] rounded-[24px] h-52 border border-[var(--border-default)]" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[var(--surface-raised)] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50">🛠️</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No listings found</h3>
          <p className="text-[var(--text-secondary)]">
            {searchQuery ? 'Try a different search term.' : 'Try a different category filter.'}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
              className="mt-4 px-5 py-2 bg-[var(--accent)] text-[#000] font-bold rounded-[16px] text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((entry) => {
            const key = `${entry.service.name}-${entry.service.categorySlug}`;
            return (
              <div
                key={key}
                className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)] transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <span className="text-lg">🔧</span>
                  </div>
                  {entry.minPrice !== null && (
                    <span className="px-3 py-1 bg-[var(--accent)] text-[#000] rounded-full text-sm font-bold">
                      ${entry.minPrice.toFixed(2)}
                      {entry.providerCount > 1 ? '+' : ''}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-1">{entry.service.name}</h3>
                {entry.service.description && (
                  <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 flex-grow">
                    {entry.service.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-[var(--border-default)]">
                  <div className="flex items-center justify-between mb-3">
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

                  {/* Provider previews */}
                  {entry.providers.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.providers.slice(0, 3).map((pro) => (
                        <Link
                          key={pro.id}
                          to={`/pro/${pro.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-overlay)] rounded-full text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                        >
                          <span className="font-semibold">{pro.businessName}</span>
                          {pro.ratingInternal && (
                            <span className="text-[var(--accent)]">★ {pro.ratingInternal.toFixed(1)}</span>
                          )}
                        </Link>
                      ))}
                      {entry.providers.length > 3 && (
                        <span className="text-xs text-[var(--text-tertiary)] px-1">
                          +{entry.providers.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

      {/* CTA */}
      <div className="mt-12 pt-8 border-t border-[var(--border-default)] text-center">
        <h2 className="text-xl font-bold mb-3">Can&apos;t find what you need?</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Submit a service request and Worki will match you with the right pro.
        </p>
        <Link
          to="/request-service"
          className="px-8 py-4 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] hover:opacity-90 transition-opacity inline-block"
        >
          Submit a Request
        </Link>
      </div>
    </div>
  );
}
