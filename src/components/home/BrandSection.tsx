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
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Brands</h2>
          <Link href="/brands">
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                      <span className="text-lg font-bold text-gray-400">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium text-center mt-2 line-clamp-1">
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
