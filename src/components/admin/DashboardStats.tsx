'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface DashboardStatsProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();
  
  const cards = [
    {
      title: t.admin.totalRevenue,
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: t.admin.totalOrders,
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: t.admin.totalProducts,
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: t.admin.totalUsers,
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
