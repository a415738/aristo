import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingDown, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getWholesaleProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo)')
    .eq('is_active', true)
    .eq('is_wholesale', true)
    .order('sales_count', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export default async function WholesalePage() {
  const products = await getWholesaleProducts();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Wholesale Zone</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Get exclusive wholesale prices for bulk orders. Perfect for retailers, 
            beauty salons, and resellers across Southeast Asia.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <TrendingDown className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Up to 50% Off</h3>
              <p className="text-gray-600">Special wholesale prices on bulk purchases</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Package className="h-10 w-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Flexible MOQ</h3>
              <p className="text-gray-600">Minimum order quantity starts from just 10 pieces</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-10 w-10 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Priority customer service for wholesale buyers</p>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-bold mb-6">Wholesale Products ({products.length})</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No wholesale products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 relative">
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        Wholesale
                      </Badge>
                    </div>
                    <div className="p-4">
                      {product.brands && (
                        <p className="text-xs text-gray-500 mb-1">{product.brands.name}</p>
                      )}
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-2 min-h-[48px]">
                        {product.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400 line-through">
                          Retail: ${Number(product.retail_price).toFixed(2)}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ${Number(product.wholesale_price || 0).toFixed(2)}
                        </p>
                        {product.min_wholesale_qty && (
                          <p className="text-xs text-gray-500">
                            Min. {product.min_wholesale_qty} pcs
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
