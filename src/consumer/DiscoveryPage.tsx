import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getProviders, getServiceCategories } from 'wasp/client/operations';

export default function DiscoveryPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useQuery(getServiceCategories);
  const { data: providers, isLoading } = useQuery(getProviders, {
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3">Discover Pros</h1>
        <p className="text-[var(--text-secondary)] text-lg">Browse verified, background-checked service professionals in your area.</p>
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
            placeholder="Search by name or service..."
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
          <option value="">All Services</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-[var(--surface-raised)] rounded-[24px] h-52 border border-[var(--border-default)]" />
          ))}
        </div>
      ) : providers?.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-[var(--surface-raised)] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50">🔍</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No pros found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((provider) => (
            <div
              key={provider.id}
              className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)] transition-all duration-300 group"
            >
              {/* Provider header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-[var(--surface-overlay)] flex items-center justify-center text-2xl font-bold text-[var(--accent)] mb-3">
                  {provider.businessName.charAt(0).toUpperCase()}
                </div>
                <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold rounded-full uppercase tracking-wider">
                  {provider.verificationStatus}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-1 truncate">{provider.businessName}</h3>
              {provider.contactName && (
                <p className="text-[var(--text-secondary)] text-sm mb-3">{provider.contactName}</p>
              )}

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.categories.slice(0, 3).map((pc) => (
                  <span
                    key={pc.serviceCategory.id}
                    className="px-3 py-1 bg-[var(--surface-overlay)] text-xs font-medium rounded-full"
                  >
                    {pc.serviceCategory.name}
                  </span>
                ))}
                {provider.categories.length > 3 && (
                  <span className="px-3 py-1 bg-[var(--surface-overlay)] text-xs font-medium rounded-full text-[var(--text-secondary)]">
                    +{provider.categories.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-default)]">
                <div className="flex items-center gap-1">
                  {provider.ratingInternal ? (
                    <>
                      <span className="text-[var(--accent)] font-bold">{provider.ratingInternal.toFixed(1)}</span>
                      <span className="text-[var(--text-secondary)] text-sm">rating</span>
                    </>
                  ) : (
                    <span className="text-[var(--text-secondary)] text-sm">New pro</span>
                  )}
                </div>
                <a
                  href={`/request-service?serviceType=${provider.categories[0]?.serviceCategory.slug ?? ''}`}
                  className="px-4 py-2 bg-[var(--accent)] text-[#000] font-bold rounded-[16px] text-sm hover:scale-105 transition-transform"
                >
                  Request
                </a>
              </div>

              {/* Service areas */}
              {provider.serviceAreas.length > 0 && (
                <p className="text-[var(--text-secondary)] text-xs mt-3">
                  Serves: {provider.serviceAreas.slice(0, 2).join(', ')}
                  {provider.serviceAreas.length > 2 && ` +${provider.serviceAreas.length - 2} more`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category quick-links */}
      <div className="mt-12 pt-8 border-t border-[var(--border-default)]">
        <h2 className="text-lg font-bold mb-4">Browse by Service</h2>
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
