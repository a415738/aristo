import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrderTable } from '@/components/admin/OrderTable';

export const dynamic = 'force-dynamic';

async function getOrders() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('orders')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data || [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders</p>
      </div>

      <OrderTable orders={orders} />
    </AdminLayout>
  );
}
