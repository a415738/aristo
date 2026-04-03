'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategorySectionProps {
  categories: Category[];
}

// 分类图标映射
const categoryIcons: Record<string, string> = {
  'skin-care': '🧴',
  'makeup': '💄',
  'base-makeup': '✨',
  'lips': '💋',
  'eyes': '👁️',
  'fragrance': '🌸',
  'body-care': '🛁',
  'hair-care': '💇',
  'beauty-tools': '💅',
  'gift-sets': '🎁',
};

export function CategorySection({ categories }: CategorySectionProps) {
  const { t } = useTranslation();
  
  if (categories.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-lg md:text-xl font-semibold text-neutral-900 mb-6">
          {t.categories.all}
        </h2>
        
        {/* 分类网格 */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="flex flex-col items-center">
                {/* 图标/图片容器 */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-2 group-hover:border-neutral-300 group-hover:bg-neutral-100 transition-all">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xl md:text-2xl">
                      {categoryIcons[category.slug] || '🛍️'}
                    </span>
                  )}
                </div>
                {/* 名称 */}
                <span className="text-xs md:text-sm text-neutral-600 text-center group-hover:text-neutral-900 transition-colors line-clamp-1">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
