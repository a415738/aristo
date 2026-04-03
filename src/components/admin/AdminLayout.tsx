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
import { useTranslation } from '@/lib/i18n';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { name: t.admin.dashboard, href: '/admin', icon: LayoutDashboard },
    { name: t.admin.products, href: '/admin/products', icon: Package },
    { name: t.admin.brands, href: '/admin/brands', icon: Tags },
    { name: t.admin.orders, href: '/admin/orders', icon: ShoppingCart },
    { name: t.admin.users, href: '/admin/users', icon: Users },
    { name: t.admin.marketing, href: '/admin/marketing', icon: Megaphone },
    { name: t.admin.settings, href: '/admin/settings', icon: Settings },
    { name: t.admin.chat, href: '/admin/chat', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            Aristo
          </Link>
          <p className="text-sm text-gray-400 mt-1">{t.admin.settings}</p>
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
