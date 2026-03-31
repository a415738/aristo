'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye } from 'lucide-react';

// Mock orders
const mockOrders = [
  {
    id: '1',
    order_no: 'ORD-2024-001',
    status: 'delivered',
    total: '150.00',
    created_at: '2024-01-15',
    items: [
      { name: 'Hydrating Face Cream', quantity: 2 },
      { name: 'Luxury Perfume Set', quantity: 1 },
    ],
  },
  {
    id: '2',
    order_no: 'ORD-2024-002',
    status: 'shipped',
    total: '89.99',
    created_at: '2024-01-20',
    items: [
      { name: 'Vitamin C Serum', quantity: 1 },
    ],
  },
  {
    id: '3',
    order_no: 'ORD-2024-003',
    status: 'pending',
    total: '45.00',
    created_at: '2024-01-22',
    items: [
      { name: 'Lipstick Set', quantity: 3 },
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

export function OrderList() {
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'shipped' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('shipped')}
        >
          Shipped
        </Button>
        <Button
          variant={filter === 'delivered' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </Button>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{order.order_no}</span>
                      <Badge className={statusColors[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-600">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name} x{item.quantity}
                          {idx < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">${order.total}</span>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
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
  );
}
