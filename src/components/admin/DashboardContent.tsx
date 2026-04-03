'use client';

import { useTranslation } from '@/lib/i18n';
import { DashboardStats } from '@/components/admin/DashboardStats';

interface DashboardContentProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
}

export function DashboardContent({ stats }: DashboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{t.admin.dashboard}</h1>
      <p className="text-gray-600 mt-1">{t.admin.settings}</p>
    </div>
  );
}
