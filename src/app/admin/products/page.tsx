import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductTable } from '@/components/admin/ProductTable';

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
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">商品管理</h1>
        <p className="text-neutral-500 mt-1">管理商品目录和库存</p>
      </div>

      <ProductTable products={products} categories={categories} brands={brands} />
    </AdminLayout>
  );
}
