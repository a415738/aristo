'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Banner {
  id: string;
  title: string | null;
  image: string;
  link: string | null;
}

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="relative h-[200px] sm:h-[300px] md:h-[500px] bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full blur-2xl opacity-60" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-60" />
        
        <div className="text-center px-4 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
            精选美妆好物
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-4 md:mb-6">
            探索全球知名品牌，尽享优质护肤、彩妆体验
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              立即选购
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative h-[200px] sm:h-[300px] md:h-[500px] overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {banner.link ? (
            <Link href={banner.link} className="block w-full h-full">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {banner.title && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-white text-center px-4">
                      {banner.title}
                    </h2>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              {banner.title && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-white text-center px-4">
                    {banner.title}
                  </h2>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Navigation arrows - Hidden on mobile */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
