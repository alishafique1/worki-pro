import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { useQuery } from 'wasp/client/operations';
import { getProviders, getServiceCategories } from 'wasp/client/operations';
import { Wrench, Search } from 'lucide-react';
import useDebounce from '../client/hooks/useDebounce';
export default function ListingsPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 12;
    // Debounce the search so the query only fires 300ms after the user stops typing.
    // The raw `searchQuery` value keeps the input field snappy.
    const debouncedSearch = useDebounce(searchQuery, 300);
    const { data: categories } = useQuery(getServiceCategories);
    const { data: providers, isLoading } = useQuery(getProviders, {
        categorySlug: selectedCategory || undefined,
        search: debouncedSearch || undefined,
    });
    // Extract all individual service listings from all providers
    const allListingsMap = useMemo(() => {
        const map = new Map();
        providers?.forEach((provider) => {
            const defaultCategory = provider.categories?.[0]?.serviceCategory;
            const services = provider.servicesJson
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
                const entry = map.get(key);
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
    let listings = Array.from(allListingsMap.values()).filter((entry) => selectedCategory ? entry.service.categorySlug === selectedCategory : true);
    // Apply search (use debounced value so filtering is in sync with the query)
    if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        listings = listings.filter((s) => s.service.name.toLowerCase().includes(q) ||
            s.service.description.toLowerCase().includes(q));
    }
    // Apply sort
    listings = [...listings].sort((a, b) => {
        if (sortBy === 'name-asc')
            return a.service.name.localeCompare(b.service.name);
        if (sortBy === 'price-asc')
            return (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity);
        if (sortBy === 'price-desc')
            return (b.minPrice ?? -Infinity) - (a.minPrice ?? -Infinity);
        if (sortBy === 'popular')
            return b.providerCount - a.providerCount;
        return 0;
    });
    const totalPages = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
    const paginatedListings = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const handleFilterChange = (setter) => (val) => {
        setter(val);
        setPage(1);
    };
    return (<div className="p-8 max-w-7xl mx-auto min-h-[80vh]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-3 text-[#0F172A]">Service Listings</h1>
        <p className="text-[#475569] text-lg">
          Browse every service offered by verified pros in the GTA.
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]"/>
          <input type="text" placeholder="Search for a service..." value={searchQuery} onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors"/>
        </div>

        <select value={selectedCategory} onChange={(e) => handleFilterChange(setSelectedCategory)(e.target.value)} className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[200px]">
          <option value="">All Categories</option>
          {categories?.map((cat) => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
        </select>

        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="px-5 py-4 bg-white border border-[#E2E8F0] rounded-[20px] text-base focus:outline-none focus:border-[#2563EB] transition-colors cursor-pointer min-w-[160px]">
          <option value="name-asc">Name A–Z</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-[#475569]">
          {isLoading
            ? 'Loading...'
            : `${listings.length} service${listings.length !== 1 ? 's' : ''} found${selectedCategory && categories?.find((c) => c.slug === selectedCategory)
                ? ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`
                : ''}`}
        </p>
      </div>

      {/* Listings grid */}
      {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="animate-pulse bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col">
              {/* Icon + price badge row */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0]"/>
                <div className="h-6 w-16 rounded-full bg-[#E2E8F0]"/>
              </div>
              {/* Title */}
              <div className="h-5 w-3/4 rounded bg-[#E2E8F0] mb-2"/>
              {/* Description lines */}
              <div className="space-y-1.5 flex-grow">
                <div className="h-4 w-full rounded bg-[#E2E8F0]"/>
                <div className="h-4 w-4/5 rounded bg-[#E2E8F0]"/>
              </div>
              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-[#E2E8F0]"/>
                <div className="h-8 w-20 rounded-[16px] bg-[#E2E8F0]"/>
              </div>
            </div>))}
        </div>) : listings.length === 0 ? (<div className="text-center py-20">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl opacity-50"><Wrench className="size-6"/></span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#0F172A]">No listings found</h3>
          <p className="text-[#475569]">
            {searchQuery ? 'Try a different search term.' : 'Try a different category filter.'}
          </p>
          {(searchQuery || selectedCategory) && (<button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }} className="mt-4 px-5 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-sm hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
              Clear filters
            </button>)}
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedListings.map((entry) => {
                const key = `${entry.service.name}-${entry.service.categorySlug}`;
                return (<div key={key} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#BFDBFE] transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                    <Wrench className="size-5"/>
                  </div>
                  {entry.minPrice !== null && (<span className="px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm font-bold">
                      ${entry.minPrice.toFixed(2)}
                      {entry.providerCount > 1 ? '+' : ''}
                    </span>)}
                </div>

                <h3 className="text-lg font-bold mb-1 text-[#0F172A]">{entry.service.name}</h3>
                {entry.service.description && (<p className="text-[#475569] text-sm mb-4 line-clamp-2 flex-grow">
                    {entry.service.description}
                  </p>)}

                <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#94A3B8]">
                      {entry.providerCount} pro{entry.providerCount !== 1 ? 's' : ''} offering
                    </span>
                    <Link to={`/discover${selectedCategory ? `?category=${selectedCategory}` : ''}`} className="px-4 py-2 bg-[#2563EB] text-white font-bold rounded-[16px] text-xs hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                      Find Pros
                    </Link>
                  </div>

                  {/* Provider previews */}
                  {entry.providers.length > 0 && (<div className="flex items-center gap-1.5 flex-wrap">
                      {entry.providers.slice(0, 3).map((pro) => (<Link key={pro.id} to={`/pro/${pro.id}`} className="inline-flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors">
                          <span className="font-semibold">{pro.businessName}</span>
                          {pro.ratingInternal && (<span className="text-[#F59E0B]">★ {pro.ratingInternal.toFixed(1)}</span>)}
                        </Link>))}
                      {entry.providers.length > 3 && (<span className="text-xs text-[#94A3B8] px-1">
                          +{entry.providers.length - 3} more
                        </span>)}
                    </div>)}
                </div>
              </div>);
            })}
        </div>)}



          {/* Pagination */}
          {totalPages > 1 && (<div className="mt-10 flex items-center justify-center gap-3">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-[16px] border border-[#E2E8F0] text-sm font-medium text-[#475569] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${p === page
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB]'}`}>
                    {p}
                  </button>))}
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-[16px] border border-[#E2E8F0] text-sm font-medium text-[#475569] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                Next
              </button>
            </div>)}

      {/* Category quick-links */}
      <div className="mt-12 pt-8 border-t border-[#E2E8F0]">
        <h2 className="text-lg font-bold mb-4 text-[#0F172A]">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories?.map((cat) => (<button key={cat.id} onClick={() => {
                handleFilterChange(setSelectedCategory)(cat.slug);
            }} className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.slug
                ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                : 'bg-white border-[#E2E8F0] hover:border-[#2563EB] text-[#475569]'}`}>
              {cat.name}
            </button>))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 pt-8 border-t border-[#E2E8F0] text-center">
        <h2 className="text-xl font-bold mb-3 text-[#0F172A]">Can&apos;t find what you need?</h2>
        <p className="text-[#475569] mb-6">
          Submit a service request and The Helper will match you with the right pro.
        </p>
        <Link to="/get-quotes" className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors inline-block shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
          Submit a Request
        </Link>
      </div>
    </div>);
}
//# sourceMappingURL=ListingsPage.jsx.map