import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Heart, Eye } from 'lucide-react';

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
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {showMore && (
            <Link href={moreLink}>
              <Button variant="ghost" className="text-primary">
                查看更多 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
            />
            
            {/* 标签 */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.tags && product.tags.includes('热销') && (
                <Badge className="bg-red-500 text-white text-xs">热销</Badge>
              )}
              {product.tags && product.tags.includes('新品') && (
                <Badge className="bg-green-500 text-white text-xs">新品</Badge>
              )}
              {product.wholesale_price && discount > 0 && (
                <Badge className="bg-orange-500 text-white text-xs">省{discount}%</Badge>
              )}
            </div>

            {/* 库存预警 */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-xs">仅剩{product.stock}件</Badge>
              </div>
            )}

            {/* 悬浮操作 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
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
          <div className="p-4">
            {/* 品牌 */}
            {product.brands && (
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                {product.brands.name}
              </p>
            )}
            
            {/* 商品名称 */}
            <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[48px] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* 价格 */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-bold text-primary">
                ${Number(product.retail_price).toFixed(2)}
              </span>
              {product.wholesale_price && (
                <span className="text-sm text-gray-400 line-through">
                  ${Number(product.wholesale_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* 批发价 */}
            {product.wholesale_price && (
              <div className="bg-green-50 rounded-lg p-2 mb-2">
                <p className="text-sm text-green-600 font-medium">
                  批发价: ${Number(product.wholesale_price).toFixed(2)}
                </p>
                {product.min_wholesale_qty && (
                  <p className="text-xs text-green-500">
                    起批量: {product.min_wholesale_qty}件
                  </p>
                )}
              </div>
            )}

            {/* 销量 */}
            <div className="flex items-center justify-between">
              {product.sales_count > 0 && (
                <p className="text-xs text-gray-400">
                  已售 {product.sales_count > 1000 ? `${(product.sales_count / 1000).toFixed(1)}k` : product.sales_count} 件
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
