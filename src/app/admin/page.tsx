import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';

export const dynamic = 'force-dynamic';

async function getStats() {
  const client = getSupabaseClient();

  const [ordersResult, productsResult, usersResult] = await Promise.all([
    client.from('orders').select('total', { count: 'exact' }),
    client.from('products').select('id', { count: 'exact' }).eq('is_active', true),
    client.from('users').select('id', { count: 'exact' }),
  ]);

  const totalSales = ordersResult.data?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0;
  const totalOrders = ordersResult.count || 0;
  const totalProducts = productsResult.count || 0;
  const totalUsers = usersResult.count || 0;

  return {
    totalSales,
    totalOrders,
    totalProducts,
    totalUsers,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">控制台</h1>
        <p className="text-gray-600 mt-1">欢迎回到管理后台</p>
      </div>

      <DashboardStats stats={stats} />
    </AdminLayout>
  );
}
