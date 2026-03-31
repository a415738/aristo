'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, MessageCircle } from 'lucide-react';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: '分类', href: '/products', icon: Search },
  { name: '购物车', href: '/cart', icon: ShoppingCart, badge: true },
  { name: '客服', href: '#chat', icon: MessageCircle },
  { name: '我的', href: '/account', icon: User },
];

// 自定义事件名称
const CHAT_TOGGLE_EVENT = 'aristo:toggle-chat';

export function MobileNav() {
  const pathname = usePathname();

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
              {item.badge && (
                <span className="absolute top-0.5 right-1/4 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  0
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
