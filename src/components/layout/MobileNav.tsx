'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [cartCount, setCartCount] = useState(0);

  // 监听购物车变化
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('aristo_cart');
      if (cart) {
        const items = JSON.parse(cart);
        setCartCount(items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      }
    };
    
    updateCartCount();
    window.addEventListener('cart_updated', updateCartCount);
    return () => window.removeEventListener('cart_updated', updateCartCount);
  }, []);

  const navItems = [
    { name: t.nav.home, href: '/', icon: Home },
    { name: t.nav.categories, href: '/products', icon: Search },
    { name: t.nav.cart, href: '/cart', icon: ShoppingCart, badge: true },
    { name: t.nav.service, href: '#chat', icon: MessageCircle },
    { name: t.nav.account, href: '/account', icon: User },
  ];

// 自定义事件名称
const CHAT_TOGGLE_EVENT = 'aristo:toggle-chat';

  const handleChatClick = () => {
    // 发送自定义事件打开聊天窗口
    window.dispatchEvent(new CustomEvent(CHAT_TOGGLE_EVENT));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.href === '#chat') {
            return (
              <button
                key={item.name}
                onClick={handleChatClick}
                className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 active:text-primary"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
              {item.badge && cartCount > 0 && (
                <span className="absolute top-0.5 right-1/4 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
