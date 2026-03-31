import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
}

interface BrandSectionProps {
  brands: Brand[];
}

export function BrandSection({ brands }: BrandSectionProps) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold">品牌馆</h2>
          <Link href="/brands">
            <Button variant="ghost" className="text-primary text-sm">
              全部品牌 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        {/* Mobile: 横向滚动 | Desktop: 网格 */}
        <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 scrollbar-hide">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`} className="flex-shrink-0 w-[100px] md:w-auto">
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center aspect-square">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 md:w-full md:h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-full md:h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                      <span className="text-lg md:text-xl font-bold text-primary">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs md:text-sm font-medium text-center mt-1.5 md:mt-2 line-clamp-1">
                    {brand.name}
                  </p>
                  {brand.country && (
                    <p className="text-[10px] md:text-xs text-gray-500">{brand.country}</p>
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
