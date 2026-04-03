import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BrandTable } from '@/components/admin/BrandTable';
import { BrandsPageContent } from '@/components/admin/BrandsPageContent';

export const dynamic = 'force-dynamic';

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*, products(count)')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export default async function BrandsAdminPage() {
  const brands = await getBrands();

  return (
    <AdminLayout>
      <BrandsPageContent />
      <BrandTable brands={brands} />
    </AdminLayout>
  );
}
