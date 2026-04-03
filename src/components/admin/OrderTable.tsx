'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Order {
  id: string;
  order_no: string;
  status: string;
  payment_status: string;
  total: string;
  currency: string;
  created_at: string;
  shipping_name: string;
  users: { name: string; email: string } | null;
}

interface OrderTableProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export function OrderTable({ orders }: OrderTableProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusLabels: Record<string, string> = {
    pending: t.orderStatus.pending || '待付款',
    paid: t.orderStatus.paid || '已付款',
    shipped: t.orderStatus.shipped || '已发货',
    delivered: t.orderStatus.delivered || '已完成',
    cancelled: t.orderStatus.cancelled || '已取消',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t.nav.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t.filters.title} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.common.all}</SelectItem>
              <SelectItem value="pending">{statusLabels.pending}</SelectItem>
              <SelectItem value="paid">{statusLabels.paid}</SelectItem>
              <SelectItem value="shipped">{statusLabels.shipped}</SelectItem>
              <SelectItem value="delivered">{statusLabels.delivered}</SelectItem>
              <SelectItem value="cancelled">{statusLabels.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.account.orderNumber}</TableHead>
                <TableHead>{t.account.orders}</TableHead>
                <TableHead>{t.cart.total}</TableHead>
                <TableHead>{t.account.orderStatus}</TableHead>
                <TableHead>{t.account.orderStatus}</TableHead>
                <TableHead>{t.account.orderDate}</TableHead>
                <TableHead className="text-right">{t.common.edit}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_no}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.shipping_name}</p>
                      {order.users && (
                        <p className="text-sm text-gray-500">{order.users.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${Number(order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || 'bg-gray-500'}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status === 'paid' ? t.account.orderStatus : t.common.no}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {t.common.edit}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
