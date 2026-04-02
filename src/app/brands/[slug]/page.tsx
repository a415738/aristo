import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBrand(slug: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error) return null;
  return data;
}

async function getBrandProducts(brandId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo), specs')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  
  if (!brand) {
    notFound();
  }

  const products = await getBrandProducts(brand.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/brands">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </Link>

        {/* Brand Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {brand.banner && (
            <div className="h-48 md:h-64 w-full">
              <img
                src={brand.banner}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 flex flex-col md:flex-row items-center gap-6">
            {brand.logo && (
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{brand.name}</h1>
              {brand.country && (
                <p className="text-gray-500 mb-2">Origin: {brand.country}</p>
              )}
              {brand.description && (
                <p className="text-gray-600">{brand.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-bold mb-6">
          {brand.name} Products ({products.length})
        </h2>
        <ProductList
          products={products}
          page={1}
          totalPages={1}
          pageSize={products.length}
        />
      </div>
    </Layout>
  );
}
