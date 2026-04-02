import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  brands: { name: string } | null;
  specs?: { name: string; value: string }[] | null;
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">相关推荐</h2>
        <Link href="/products">
          <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900 text-sm">
            查看更多 <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <div className="group cursor-pointer">
              {/* 图片 */}
              <div className="aspect-square relative rounded-xl overflow-hidden bg-neutral-50 mb-3">
                <Image
                  src={product.main_image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              
              {/* 信息 */}
              <div>
                {product.brands && (
                  <p className="text-xs text-neutral-400 mb-0.5">{product.brands.name}</p>
                )}
                <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 mb-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs text-neutral-400">$</span>
                  <span className="text-lg font-bold text-neutral-900">
                    {Number(product.retail_price).toFixed(2)}
                  </span>
                </div>
                {product.specs && product.specs.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {product.specs.slice(0, 2).map((spec, index) => (
                      <p key={index} className="text-xs text-neutral-500 truncate">
                        <span className="text-neutral-400">{spec.name}:</span> {spec.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
