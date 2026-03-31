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

export function CategorySection({ categories }: CategorySectionProps) {
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Skincare', slug: 'skincare', image: defaultImages[0] },
    { id: '2', name: 'Makeup', slug: 'makeup', image: defaultImages[1] },
    { id: '3', name: 'Fragrance', slug: 'fragrance', image: defaultImages[2] },
    { id: '4', name: 'Tools', slug: 'tools', image: defaultImages[3] },
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || defaultImages[index % defaultImages.length]}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
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
