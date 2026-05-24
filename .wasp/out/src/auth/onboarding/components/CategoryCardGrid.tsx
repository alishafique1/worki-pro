import { useQuery, getServiceCategories } from 'wasp/client/operations';
import type { ServiceCategory } from 'wasp/entities';
import {
  AirVent,
  Hammer,
  WashingMachine,
  ShowerHead,
  PlugZap,
  Wifi,
  PaintBucket,
  SprayCan,
  TreePine,
  Bug,
  Lock,
  GlassWater,
  Truck,
  ChevronRight,
  Building2,
  Home,
  Warehouse,
  Wind,
  Droplets,
  Sun,
  Snowflake,
  Leaf,
  Cat,
  Shield,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  AirVent,
  Hammer,
  WashingMachine,
  ShowerHead,
  PlugZap,
  Wifi,
  PaintBucket,
  SprayCan,
  TreePine,
  Bug,
  Lock,
  GlassWater,
  Truck,
  ChevronRight,
  Building2,
  Home,
  Warehouse,
  Wind,
  Droplets,
  Sun,
  Snowflake,
  Leaf,
  Cat,
  Shield,
};

function getIcon(iconName: string | null | undefined): LucideIcon {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  return Hammer;
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[#E2E8F0] p-5 animate-pulse">
          <div className="size-10 rounded-xl bg-[#E2E8F0] mb-3" />
          <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#E2E8F0] rounded w-full" />
        </div>
      ))}
    </div>
  );
}

type CategoryCardGridProps = {
  title: string;
  subtitle: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  max?: number;
};

export default function CategoryCardGrid({ title, subtitle, selectedIds, onToggle, max }: CategoryCardGridProps) {
  const { data: categories, isLoading, isError, error } = useQuery(getServiceCategories);

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">{title}</h3>
        <p className="text-[#475569] text-sm mb-5">{subtitle}</p>
        <Skeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">{title}</h3>
        <p className="text-[#475569] text-sm mb-5">{subtitle}</p>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-600">Unable to load services</p>
          <p className="text-xs text-red-500 mt-1">Please try refreshing the page.</p>
          <p className="text-xs text-red-400 mt-2 opacity-60">{(error as any)?.message || 'Connection error'}</p>
        </div>
      </div>
    );
  }

  const parents = (categories as ServiceCategory[] || []).filter(c => !c.parentCategoryId);

  if (parents.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">{title}</h3>
        <p className="text-[#475569] text-sm mb-5">{subtitle}</p>
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center">
          <p className="text-sm font-semibold text-[#475569]">No services available yet</p>
          <p className="text-xs text-[#94A3B8] mt-1">We're adding new services soon. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-black text-[#0F172A]">{title}</h3>
        {selectedIds.length > 0 && (
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] rounded-full px-3 py-1">
            {selectedIds.length} selected
          </span>
        )}
      </div>
      <p className="text-[#475569] text-sm mb-5">{subtitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {parents.map((cat) => {
          const Icon = getIcon(cat.icon);
          const selected = selectedIds.includes(cat.id);
          const atLimit = max ? selectedIds.length >= max && !selected : false;

          return (
            <button
              key={cat.id}
              type="button"
              disabled={atLimit}
              onClick={() => onToggle(cat.id)}
              className={`group relative rounded-2xl border-2 text-left transition-all cursor-pointer overflow-hidden ${
                selected
                  ? 'border-[#2563EB] bg-[#EFF6FF]'
                  : atLimit
                  ? 'border-[#E2E8F0] bg-[#F8FAFC] opacity-40 cursor-not-allowed'
                  : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:shadow-sm'
              }`}
            >
              {cat.imageUrl && (
                <div className="relative h-20 sm:h-24 overflow-hidden">
                  <img
                    src={cat.imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
              <div className={`p-5 ${cat.imageUrl ? 'pt-3' : ''}`}>
                <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${
                  selected ? 'bg-[#2563EB] text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
                }`}>
                  <Icon className="size-5" />
                </div>
                <p className={`text-sm font-bold ${
                  selected ? 'text-[#2563EB]' : 'text-[#0F172A]'
                }`}>{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
