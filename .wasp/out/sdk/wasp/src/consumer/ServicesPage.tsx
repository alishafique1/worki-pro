import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { categories } from '../landing-page/marketplace/content';

const liveCategories = categories.filter((c) => c.live);
const comingSoonCategories = categories.filter((c) => !c.live);

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredLive = useMemo(() =>
    search.trim()
      ? liveCategories.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
        )
      : liveCategories,
    [search]
  );

  const filteredSoon = useMemo(() =>
    search.trim()
      ? comingSoonCategories.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      : comingSoonCategories,
    [search]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredLive.length === 1) navigate(filteredLive[0].href);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Compact search header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-black text-[#0F172A] mb-1">
            What do you need help with?
          </h1>
          <p className="text-[#475569] mb-6 text-sm">
            Vetted, insured pros in Milton · Oakville · Burlington · GTA
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="e.g. furnace repair, leaking pipe, outlet install…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-base focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            />
            <Link
              to={`/request-service${search ? `?q=${encodeURIComponent(search)}` : ''}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-full text-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Get Quotes
            </Link>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Live category grid — primary UI */}
        {filteredLive.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-5">
              {search ? `Matching services` : `Browse by service`}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredLive.map((cat) => (
                <Link
                  key={cat.slug}
                  to={cat.href}
                  className="group relative bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden hover:border-[#BFDBFE] hover:shadow-[0_4px_20px_rgba(37,99,235,0.10)] transition-all duration-200"
                >
                  {/* Image strip */}
                  <div className="relative h-32 overflow-hidden bg-[#F1F5F9]">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Category name over image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white drop-shadow">{cat.icon}</span>
                        <span className="text-white font-bold text-base drop-shadow">{cat.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description + CTA */}
                  <div className="px-4 py-3">
                    <p className="text-xs text-[#475569] line-clamp-2 mb-3">{cat.description}</p>
                    <span className="text-xs font-bold text-[#2563EB] group-hover:underline">
                      See services →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Request service fallback if search yields no live match */}
        {search && filteredLive.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 text-center mb-10">
            <p className="text-[#475569] mb-4">
              No live category matches "<strong>{search}</strong>" yet — but our pros can still help.
            </p>
            <Link
              to={`/request-service?q=${encodeURIComponent(search)}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-full text-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Request this service →
            </Link>
          </div>
        )}

        {/* Coming soon — compact chips */}
        {filteredSoon.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-4">
              Coming soon
            </h2>
            <div className="flex flex-wrap gap-3">
              {filteredSoon.map((cat) => (
                <div
                  key={cat.slug}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-full opacity-60"
                >
                  <span className="text-[#94A3B8] scale-75">{cat.icon}</span>
                  <span className="text-sm font-medium text-[#475569]">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA — only show when not searching */}
        {!search && (
          <div className="mt-14 bg-[#0F172A] rounded-[28px] p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Not sure what you need?</h2>
              <p className="text-[#94A3B8] text-sm">Describe the problem — we'll figure out the rest.</p>
            </div>
            <Link
              to="/request-service"
              className="shrink-0 px-7 py-4 bg-[#2563EB] text-white font-bold rounded-full text-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Get Free Quotes →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
