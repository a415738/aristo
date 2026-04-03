'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  sales_count: number;
  categories: { name: string } | null;
  brands: { name: string; logo: string | null } | null;
  product_images?: { image: string }[];
  specs?: { name: string; value: string }[] | null;
}

interface ProductListProps {
  products: Product[];
  page: number;
  totalPages: number;
  pageSize: number;
}

function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 获取所有图片
  const images = product.product_images && product.product_images.length > 0
    ? [product.main_image, ...product.product_images.map(img => img.image)]
    : [product.main_image];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card 
        className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* 图片区域 */}
          <div className="relative aspect-square bg-neutral-50 overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            
            {/* 图片切换指示器 */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-3' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
                {images.length > 5 && (
                  <span className="text-white/70 text-xs">+{images.length - 5}</span>
                )}
              </div>
            )}

            {/* 图片切换按钮 */}
            {images.length > 1 && isHovered && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-neutral-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-neutral-700" />
                </button>
              </>
            )}

            {/* 收藏按钮 */}
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-400'
                }`} 
              />
            </button>

            {/* 销量标签 */}
            {product.sales_count > 100 && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded">
                {t.home.hot} {product.sales_count > 999 ? '999+' : product.sales_count}
              </div>
            )}
          </div>

          {/* 信息区域 */}
          <div className="p-4">
            {/* 品牌 */}
            {product.brands && (
              <p className="text-xs text-neutral-400 mb-1 truncate">{product.brands.name}</p>
            )}
            
            {/* 名称 */}
            <h3 className="font-medium text-neutral-800 line-clamp-2 mb-3 min-h-[40px] text-sm leading-5">
              {product.name}
            </h3>

            {/* 价格和销量 */}
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-neutral-400">$</span>
                <span className="text-xl font-bold text-neutral-900">
                  {Number(product.retail_price).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Eye className="h-3 w-3" />
                <span>{product.sales_count}</span>
              </div>
            </div>

            {/* 商品参数 */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-2 space-y-0.5">
                {product.specs.slice(0, 2).map((spec, index) => (
                  <p key={index} className="text-xs text-neutral-500 truncate">
                    <span className="text-neutral-400">{spec.name}:</span> {spec.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProductList({ products, page, totalPages }: ProductListProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-neutral-500 text-lg mb-2">{t.messages.noProducts}</p>
        <p className="text-neutral-400 text-sm mb-6">{t.messages.tryOtherFilters}</p>
        <Link href="/products">
          <Button className="bg-neutral-900 hover:bg-neutral-800">
            {t.nav.allProducts}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button variant="outline" size="icon" className="border-neutral-200 hover:bg-neutral-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-2 text-neutral-300">...</span>
                )}
                <Link href={`?page=${p}`}>
                  <Button
                    variant={p === page ? 'default' : 'outline'}
                    size="icon"
                    className={p === page 
                      ? 'bg-neutral-900 hover:bg-neutral-800' 
                      : 'border-neutral-200 hover:bg-neutral-50'
                    }
                  >
                    {p}
                  </Button>
                </Link>
              </span>
            ))}
          
          {page < totalPages && (
            <Link href={`?page=${page + 1}`}>
              <Button variant="outline" size="icon" className="border-neutral-200 hover:bg-neutral-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
