import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductTable } from '@/components/admin/ProductTable';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name)')
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data || [];
}

async function getCategories() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
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
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
      </div>

      <ProductTable products={products} categories={categories} brands={brands} />
    </AdminLayout>
  );
}
