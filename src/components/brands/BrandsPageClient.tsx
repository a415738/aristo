'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight } from 'lucide-react';

// 按照指定顺序的品牌列表
const brandOrder = [
  'Chanel', "L’Oréal", 'Gillette', 'Nivea', 'Guerlain', 'Lancôme',
  'Dove', 'Garnier', 'Estée Lauder', 'Pantene', 'Head & Shoulders', 'Maybelline',
  'Clarins', "Johnson’s", 'Pechoin', 'Clinique', 'SK-II', 'Olay',
  'M.A.C', 'Shiseido'
];

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
  description: string | null;
  products?: { count: number }[];
}

interface BrandsPageClientProps {
  brands: Brand[];
}

export function BrandsPageClient({ brands }: BrandsPageClientProps) {
  // 按照指定顺序排序品牌
  const sortedBrands = [...brands].sort((a, b) => {
    const indexA = brandOrder.indexOf(a.name);
    const indexB = brandOrder.indexOf(b.name);
    
    // 如果都在列表中，按列表顺序
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // 如果只有a在列表中，a排前面
    if (indexA !== -1) return -1;
    // 如果只有b在列表中，b排前面
    if (indexB !== -1) return 1;
    // 都不在列表中，按字母顺序
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* 页面标题 */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">品牌馆</h1>
        <p className="text-gray-500">汇聚全球知名美妆品牌</p>
      </div>

      {/* 品牌列表 */}
      <section>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            全部品牌
          </h2>
          <span className="text-sm text-gray-500">{brands.length} 个品牌</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {sortedBrands.map((brand) => {
            const productCount = brand.products?.[0]?.count || 0;
            
            return (
              <Link key={brand.id} href={`/brands/${brand.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center aspect-square">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-medium text-center mt-2 md:mt-3 line-clamp-1">
                      {brand.name}
                    </p>
                    {brand.country && (
                      <p className="text-xs text-gray-500">{brand.country}</p>
                    )}
                    {productCount > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {productCount} 件商品
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
