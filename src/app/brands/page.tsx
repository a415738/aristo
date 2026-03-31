import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*, products(count)')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export default async function BrandsPage() {
  const brands = await getBrands();

  // Group by first letter
  const groupedBrands = brands.reduce<Record<string, typeof brands>>((acc, brand) => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {});

  const letters = Object.keys(groupedBrands).sort();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Brand Gallery
        </h1>

        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Brands List */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <div key={letter} id={letter}>
              <h2 className="text-2xl font-bold text-primary mb-4 border-b pb-2">
                {letter}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedBrands[letter].map((brand) => (
                  <Link key={brand.id} href={`/brands/${brand.slug}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                            <span className="text-3xl font-bold text-gray-300">
                              {brand.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <p className="text-sm font-medium text-center mt-2">
                          {brand.name}
                        </p>
                        {brand.country && (
                          <p className="text-xs text-gray-500">{brand.country}</p>
                        )}
                        {brand.products && (
                          <p className="text-xs text-gray-400 mt-1">
                            {brand.products[0]?.count || 0} products
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
