'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    const storedUsername = localStorage.getItem('admin_username');
    
    if (!loggedIn) {
      router.push('/admin/login');
      return;
    }
    
    setUsername(storedUsername);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_login_time');
    router.push('/admin/login');
  };

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
          <Link href="/admin" className="text-2xl font-bold text-primary">
            Aristo
          </Link>
          <p className="text-sm text-gray-400 mt-1">管理后台</p>
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

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium">{username?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-gray-400">管理员</p>
                </div>
              </div>
              <ChevronDown className={cn('h-4 w-4 transition-transform', showUserMenu && 'rotate-180')} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link 
                  href="/" 
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition-colors text-sm"
                >
                  查看网站
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition-colors text-sm text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
