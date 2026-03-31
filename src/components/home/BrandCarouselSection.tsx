'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
}

interface BrandCarouselSectionProps {
  brands: Brand[];
}

export function BrandCarouselSection({ brands }: BrandCarouselSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [brands]);

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || brands.length <= 5) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
        setTimeout(checkScrollButtons, 350);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, brands.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      setIsAutoPlaying(false);
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(() => {
        checkScrollButtons();
        setIsAutoPlaying(true);
      }, 500);
    }
  };

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            品牌专区
          </h2>
          <Link href="/brands">
            <Button variant="ghost" className="text-primary text-sm">
              全部品牌 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* 轮播容器 */}
        <div className="relative group">
          {/* 左箭头 */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* 品牌列表 */}
          <div
            ref={containerRef}
            onScroll={checkScrollButtons}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="flex-shrink-0 scroll-snap-start"
              >
                <div className="w-28 md:w-32 h-28 md:h-32 flex flex-col items-center justify-center bg-white rounded-xl border hover:shadow-lg transition-all duration-300 group/card">
                  {brand.logo ? (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain group-hover/card:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs md:text-sm font-medium text-center mt-1 line-clamp-1 px-2">
                    {brand.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* 右箭头 */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
