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
    .select(`
      *,
      categories(name),
      brands(name),
      product_images(image),
      product_variants(name, sku, price, stock)
    `)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data || [];
}

async function getCategories() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order');
  
  if (error) throw error;
  return data || [];
}

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
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
