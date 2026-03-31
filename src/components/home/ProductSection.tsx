import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Heart, Eye, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  wholesale_price: string | null;
  min_wholesale_qty: number | null;
  sales_count: number;
  stock: number;
  tags: string[] | null;
  categories: { name: string } | null;
  brands: { name: string; logo: string | null } | null;
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  showMore?: boolean;
  moreLink?: string;
}

export function ProductSection({ title, subtitle, products, showMore = true, moreLink = '/products' }: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary md:hidden" />
            <h2 className="text-lg md:text-2xl font-bold">{title}</h2>
          </div>
          {showMore && (
            <Link href={moreLink}>
              <Button variant="ghost" className="text-primary text-sm">
                更多 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile: 横向滚动 | Desktop: 网格 */}
        <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-6 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[160px] md:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.wholesale_price 
    ? Math.round((1 - Number(product.wholesale_price) / Number(product.retail_price)) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
        <CardContent className="p-0">
          {/* 图片区域 */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.main_image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* 标签 */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.tags && product.tags.includes('热销') && (
                <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0.5">热销</Badge>
              )}
              {product.tags && product.tags.includes('新品') && (
                <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0.5">新品</Badge>
              )}
              {product.wholesale_price && discount > 0 && (
                <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5">省{discount}%</Badge>
              )}
            </div>

            {/* 库存预警 */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">仅剩{product.stock}件</Badge>
              </div>
            )}

            {/* 悬浮操作 - 仅桌面端 */}
            <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 信息区域 */}
          <div className="p-2 md:p-4">
            {/* 品牌 */}
            {product.brands && (
              <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 md:mb-1 uppercase tracking-wide truncate">
                {product.brands.name}
              </p>
            )}
            
            {/* 商品名称 */}
            <h3 className="font-medium text-xs md:text-sm text-gray-800 line-clamp-2 mb-1 md:mb-2 min-h-[32px] md:min-h-[40px] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* 价格 */}
            <div className="flex items-baseline gap-1 md:gap-2 mb-1 md:mb-2">
              <span className="text-base md:text-xl font-bold text-primary">
                ${Number(product.retail_price).toFixed(2)}
              </span>
              {product.wholesale_price && (
                <span className="text-[10px] md:text-sm text-gray-400 line-through">
                  ${Number(product.wholesale_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* 批发价 */}
            {product.wholesale_price && (
              <div className="bg-green-50 rounded-md md:rounded-lg p-1.5 md:p-2 mb-1 md:mb-2">
                <p className="text-[10px] md:text-sm text-green-600 font-medium">
                  批发: ${Number(product.wholesale_price).toFixed(2)}
                </p>
                {product.min_wholesale_qty && (
                  <p className="text-[10px] text-green-500">
                    起{product.min_wholesale_qty}件
                  </p>
                )}
              </div>
            )}

            {/* 销量 */}
            <div className="hidden md:flex items-center justify-between">
              {product.sales_count > 0 && (
                <p className="text-xs text-gray-400">
                  已售 {product.sales_count > 1000 ? `${(product.sales_count / 1000).toFixed(1)}k` : product.sales_count}
                </p>
              )}
              {product.categories && (
                <p className="text-xs text-gray-300">{product.categories.name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
