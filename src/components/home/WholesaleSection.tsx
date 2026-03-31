import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <section className="py-6 md:py-12 px-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold">批发专区</h2>
              <p className="text-xs md:text-sm text-gray-600">批量采购，更低价格</p>
            </div>
          </div>
          <Link href="/wholesale">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              查看全部
            </Button>
          </Link>
        </div>

        {products.length > 0 && (
          <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 scrollbar-hide">
            {products.map((product) => {
              const discount = product.wholesale_price 
                ? Math.round((1 - Number(product.wholesale_price) / Number(product.retail_price)) * 100)
                : 0;
              
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="flex-shrink-0 w-[160px] md:w-auto">
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                        <img
                          src={product.main_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
                            省{discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-2 md:p-4">
                        <h3 className="font-medium text-xs md:text-sm text-gray-800 line-clamp-2 mb-1.5 md:mb-2 min-h-[32px] md:min-h-[40px]">
                          {product.name}
                        </h3>
                        <div className="flex flex-col gap-0.5 md:gap-1">
                          <span className="text-[10px] md:text-sm text-gray-400 line-through">
                            零售: ${Number(product.retail_price).toFixed(2)}
                          </span>
                          <span className="text-sm md:text-lg font-bold text-green-600">
                            批发: ${Number(product.wholesale_price || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] md:text-xs text-gray-500">
                            起订: {product.min_wholesale_qty || 10} 件
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无批发商品</p>
          </div>
        )}
      </div>
    </section>
  );
}
