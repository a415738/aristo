'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

// 首页展示的指定品牌（按用户要求的顺序）
const featuredBrandNames = [
  'Chanel',
  'Guerlain',
  "L'Oréal",
  'Lancôme',
  'SK-II',
  'Clarins',
  'Natural 堂',
  'Yves Saint Laurent',
  'Bulgari',
  'Gucci',
];

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
}

interface FeaturedBrandsSectionProps {
  brands: Brand[];
}

export function FeaturedBrandsSection({ brands }: FeaturedBrandsSectionProps) {
  // 按照指定顺序筛选和排序品牌
  const sortedBrands = featuredBrandNames
    .map((name) => brands.find((b) => b.name === name))
    .filter((b): b is Brand => b !== undefined);

  // 如果没有匹配的品牌，显示占位
  const displayBrands = sortedBrands.length > 0 ? sortedBrands : brands.slice(0, 10);

  if (displayBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            品牌专区
          </h2>
          <Link href="/brands">
            <Button variant="ghost" className="text-primary text-sm">
              全部品牌 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* 品牌Logo展示 - 响应式网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {displayBrands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center aspect-[4/3]">
                  {brand.logo ? (
                    <div className="w-full h-16 md:h-20 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-16 md:h-20 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm md:text-base font-medium text-center mt-2 md:mt-3 line-clamp-1">
                    {brand.name}
                  </p>
                  {brand.country && (
                    <p className="text-xs text-gray-500">{brand.country}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
