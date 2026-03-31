import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CategorySectionProps {
  categories: Category[];
}

const defaultImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
];

const defaultCategories = [
  { id: '1', name: '护肤', slug: 'skincare', icon: '💧' },
  { id: '2', name: '彩妆', slug: 'makeup', icon: '💄' },
  { id: '3', name: '香水', slug: 'fragrance', icon: '🌸' },
  { id: '4', name: '工具', slug: 'tools', icon: '✨' },
];

export function CategorySection({ categories }: CategorySectionProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories.map(c => ({
    ...c,
    image: null,
  }));

  return (
    <section className="py-6 md:py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8">
          商品分类
        </h2>
        
        {/* Mobile: 横向滚动 */}
        <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-6 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 scrollbar-hide">
          {displayCategories.map((category, index) => {
            const defaultCat = defaultCategories[index % defaultCategories.length];
            
            return (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className="flex-shrink-0 w-[calc(50%-6px)] md:w-auto"
              >
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {category.image ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 group-hover:from-pink-100 group-hover:to-purple-100 transition-colors">
                        <span className="text-4xl md:text-5xl">
                          {defaultCat?.icon || '🛍️'}
                        </span>
                      </div>
                    )}
                    <div className="p-2 md:p-4 text-center bg-white">
                      <h3 className="font-medium text-sm md:text-base text-gray-800">
                        {category.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
