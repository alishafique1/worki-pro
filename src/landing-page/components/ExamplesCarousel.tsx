// ExamplesCarousel — repurposed to show verified TheHelper pros.
// Pass a list of providers; each card links to the real /pros/:slug profile.
import { forwardRef, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../client/components/ui/card";
import { BadgeCheck, Star } from "lucide-react";

const CAROUSEL_INTERVAL = 3500;
const SCROLL_DEBOUNCE = 200;

export interface ProCard {
  slug: string;
  businessName: string;
  profilePhotoUrl: string | null;
  ratingInternal: number | null;
  reviewCount: number;
  category: string;
  serviceAreas: string[];
}

const ExamplesCarousel = ({ pros }: { pros: ProCard[] }) => {
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4, rootMargin: "-100px 0px -100px 0px" }
    );
    if (containerRef.current) observerRef.current.observe(containerRef.current);
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (inView && pros.length > 1) {
      intervalRef.current = setInterval(
        () => setCurrent((p) => (p + 1) % pros.length),
        CAROUSEL_INTERVAL
      );
    }
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollRef.current) return;
      const target = scrollRef.current.children[current] as HTMLElement | undefined;
      if (!target) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const cardRect = target.getBoundingClientRect();
      scrollRef.current.scrollTo({
        left: target.offsetLeft - scrollRef.current.offsetLeft - rect.width / 2 + cardRect.width / 2,
        behavior: "smooth",
      });
    }, SCROLL_DEBOUNCE);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [inView, pros.length, current]);

  if (!pros.length) return null;

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 my-16 flex w-screen -translate-x-1/2 flex-col items-center"
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-6 text-center">
        Verified pros on The Helper
      </p>
      <div className="w-full max-w-full overflow-hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-10 pt-4"
          ref={scrollRef}
        >
          {pros.map((pro, i) => (
            <ProCarouselCard
              key={pro.slug}
              pro={pro}
              index={i}
              isCurrent={i === current}
              onMouseEnter={(idx) => {
                setCurrent(idx);
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (inView && pros.length > 1) {
                  intervalRef.current = setInterval(
                    () => setCurrent((p) => (p + 1) % pros.length),
                    CAROUSEL_INTERVAL
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProCarouselCardProps {
  pro: ProCard;
  index: number;
  isCurrent: boolean;
  onMouseEnter: (index: number) => void;
}

const ProCarouselCard = forwardRef<HTMLDivElement, ProCarouselCardProps>(
  ({ pro, isCurrent, onMouseEnter, index }, ref) => {
    const initials = pro.businessName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <a
        href={`/pros/${pro.slug}`}
        className="shrink-0 snap-center"
        onMouseEnter={() => onMouseEnter(index)}
      >
        <Card
          ref={ref}
          className="w-[260px] overflow-hidden transition-all duration-200 hover:scale-105 sm:w-[290px]"
          variant={isCurrent ? "default" : "faded"}
        >
          <CardContent className="h-full p-0">
            {/* Photo or initials */}
            <div className="relative h-40 bg-[#EFF6FF] flex items-center justify-center overflow-hidden">
              {pro.profilePhotoUrl ? (
                <img
                  src={pro.profilePhotoUrl}
                  alt={pro.businessName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "text-5xl font-black text-[#2563EB]";
                      fallback.textContent = initials;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span className="text-5xl font-black text-[#2563EB]">{initials}</span>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-[#22C55E]">
                <BadgeCheck className="size-3" /> Verified
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-[#0F172A] text-sm mb-0.5 truncate">{pro.businessName}</p>
              <p className="text-xs text-[#475569] mb-2 truncate">{pro.category}</p>
              <div className="flex items-center gap-1.5">
                {pro.ratingInternal ? (
                  <>
                    <Star className="size-3 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-xs font-bold text-[#0F172A]">{pro.ratingInternal.toFixed(1)}</span>
                    {pro.reviewCount > 0 && (
                      <span className="text-xs text-[#94A3B8]">({pro.reviewCount})</span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-[#94A3B8]">New pro</span>
                )}
                {pro.serviceAreas.length > 0 && (
                  <span className="ml-auto text-xs text-[#94A3B8] truncate">
                    {pro.serviceAreas[0]}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    );
  }
);

ProCarouselCard.displayName = "ProCarouselCard";

export default ExamplesCarousel;
