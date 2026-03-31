import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BrandTable } from '@/components/admin/BrandTable';

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">品牌管理</h1>
        <p className="text-gray-600 mt-1">管理品牌信息及首页轮播展示</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>说明：</strong>勾选"首页轮播"的品牌将显示在首页品牌专区轮播图中，可拖动排序调整展示顺序。
          </p>
        </div>
        <BrandTable brands={brands} />
      </div>
    </AdminLayout>
  );
}
