'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

// 模拟订单数据
const mockOrders = [
  {
    id: '1',
    order_no: 'ORD-2024-001',
    status: 'delivered',
    statusText: '已完成',
    total: '150.00',
    created_at: '2024-01-15',
    items: [
      { name: '保湿面霜', quantity: 2, image: '' },
      { name: '奢华香水套装', quantity: 1, image: '' },
    ],
  },
  {
    id: '2',
    order_no: 'ORD-2024-002',
    status: 'shipped',
    statusText: '运输中',
    total: '89.99',
    created_at: '2024-01-20',
    items: [
      { name: '维C精华液', quantity: 1, image: '' },
    ],
  },
  {
    id: '3',
    order_no: 'ORD-2024-003',
    status: 'pending',
    statusText: '待付款',
    total: '45.00',
    created_at: '2024-01-22',
    items: [
      { name: '口红套装', quantity: 3, image: '' },
    ],
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusFilters = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待付款' },
  { value: 'shipped', label: '运输中' },
  { value: 'delivered', label: '已完成' },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* 页面标题 */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/account" className="text-gray-500 hover:text-gray-700">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Link>
            <h1 className="text-xl font-bold">我的订单</h1>
          </div>

          {/* 筛选按钮 */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {statusFilters.map((item) => (
              <Button
                key={item.value}
                variant={filter === item.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(item.value)}
                className="flex-shrink-0"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* 订单列表 */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 mb-4">暂无订单</p>
                <Link href="/products">
                  <Button>去逛逛</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                    <span className="text-sm text-gray-500">订单号：{order.order_no}</span>
                    <Badge className={statusColors[order.status]}>
                      {order.statusText}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    {/* 商品列表 */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="h-6 w-6 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 订单底部 */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <span className="text-sm text-gray-500">下单时间：</span>
                        <span className="text-sm">{order.created_at}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">${order.total}</span>
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            详情
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
