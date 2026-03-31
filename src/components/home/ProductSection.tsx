import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  wholesale_price: string | null;
  min_wholesale_qty: number | null;
  sales_count: number;
  categories: { name: string } | null;
  brands: { name: string; logo: string | null } | null;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export function ProductSection({ title, products }: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link href="/products">
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    {product.brands && (
                      <p className="text-xs text-gray-500 mb-1">{product.brands.name}</p>
                    )}
                    <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[48px]">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-primary">
                        ${Number(product.retail_price).toFixed(2)}
                      </span>
                      {product.wholesale_price && (
                        <span className="text-sm text-green-600">
                          Wholesale: ${Number(product.wholesale_price).toFixed(2)}
                          {product.min_wholesale_qty && ` (Min: ${product.min_wholesale_qty})`}
                        </span>
                      )}
                    </div>
                    {product.sales_count > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        {product.sales_count} sold
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
