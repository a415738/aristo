'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Megaphone,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: '控制台', href: '/admin', icon: LayoutDashboard },
  { name: '商品管理', href: '/admin/products', icon: Package },
  { name: '品牌管理', href: '/admin/brands', icon: Tags },
  { name: '订单管理', href: '/admin/orders', icon: ShoppingCart },
  { name: '用户管理', href: '/admin/users', icon: Users },
  { name: '运营管理', href: '/admin/marketing', icon: Megaphone },
  { name: '系统设置', href: '/admin/settings', icon: Settings },
  { name: '客服管理', href: '/admin/chat', icon: MessageSquare },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            BeautyMart
          </Link>
          <p className="text-sm text-gray-400 mt-1">后台管理系统</p>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
