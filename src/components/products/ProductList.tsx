import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  sales_count: number;
  categories: { name: string } | null;
  brands: { name: string; logo: string | null } | null;
}

interface ProductListProps {
  products: Product[];
  page: number;
  totalPages: number;
  pageSize: number;
}

export function ProductList({ products, page, totalPages }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">未找到商品</p>
        <Link href="/products">
          <Button className="mt-4">查看全部商品</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <Link href={`?page=${p}`}>
                  <Button
                    variant={p === page ? 'default' : 'outline'}
                    size="icon"
                  >
                    {p}
                  </Button>
                </Link>
              </span>
            ))}
          
          {page < totalPages && (
            <Link href={`?page=${page + 1}`}>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
