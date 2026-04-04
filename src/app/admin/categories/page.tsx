import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoryManagement } from '@/components/admin/CategoryManagement';

export default function AdminCategoriesPage() {
  return (
    <AdminPageWrapper>
      <AdminLayout>
        <CategoryManagement />
      </AdminLayout>
    </AdminPageWrapper>
  );
}
