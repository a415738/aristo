import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { BrandsPageClient } from '@/components/brands/BrandsPageClient';

export const dynamic = 'force-dynamic';

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*, products(count)')
    .eq('is_active', true);
  
  if (error) throw error;
  return data || [];
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <Layout>
      <BrandsPageClient brands={brands} />
    </Layout>
  );
}
