import { getSupabaseClient } from '@/storage/database/supabase-client';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrderTable } from '@/components/admin/OrderTable';
import { OrdersPageContent } from '@/components/admin/OrdersPageContent';

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
    <AdminPageWrapper>
      <AdminLayout>
        <OrdersPageContent />
        <OrderTable orders={orders} />
      </AdminLayout>
    </AdminPageWrapper>
  );
}
