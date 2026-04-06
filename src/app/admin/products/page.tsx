import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductsPageContent } from '@/components/admin/ProductsPageContent';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name)')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) return [];
  return data || [];
}

async function getCategories() {
  const client = getSupabaseClient();
  const { data, error } = await client.from('categories').select('*').order('name');
  if (error) return [];
  return data || [];
}

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client.from('brands').select('*').order('name');
  if (error) return [];
  return data || [];
}

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <AdminPageWrapper>
      <AdminLayout>
        <ProductsPageContent />
        <ProductTable products={products} categories={categories} brands={brands} />
      </AdminLayout>
    </AdminPageWrapper>
  );
}
