import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { ProductDetail } from '@/components/products/ProductDetail';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(id, name, slug), brands(id, name, slug, logo)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (error) return null;
  return data;
}

async function getRelatedProducts(productId: string, categoryId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(8);
  
  if (error) throw error;
  return data || [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </Layout>
  );
}
