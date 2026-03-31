import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  wholesale_price: string | null;
  min_wholesale_qty: number | null;
}

interface WholesaleSectionProps {
  products: Product[];
}

export function WholesaleSection({ products }: WholesaleSectionProps) {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Wholesale Zone</h2>
              <p className="text-gray-600">Special prices for bulk orders</p>
            </div>
          </div>
          <Link href="/wholesale">
            <Button>View All Wholesale Products</Button>
          </Link>
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[48px]">
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400 line-through">
                          Retail: ${Number(product.retail_price).toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          Wholesale: ${Number(product.wholesale_price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Min. Order: {product.min_wholesale_qty || 10} pcs
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
