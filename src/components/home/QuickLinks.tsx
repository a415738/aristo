'use client';

import Link from 'next/link';
import { Flame, Sparkles, Gift, Crown } from 'lucide-react';

const quickLinks = [
  { 
    name: '热销榜', 
    href: '/products?sort=sales', 
    icon: Flame, 
    color: 'from-red-500 to-orange-500',
    desc: '爆款推荐'
  },
  { 
    name: '新品', 
    href: '/products?sort=new', 
    icon: Sparkles, 
    color: 'from-blue-500 to-cyan-500',
    desc: '最新上架'
  },
  { 
    name: '特惠', 
    href: '/products?discount=true', 
    icon: Gift, 
    color: 'from-pink-500 to-purple-500',
    desc: '限时折扣'
  },
  { 
    name: '品牌馆', 
    href: '/brands', 
    icon: Crown, 
    color: 'from-amber-500 to-yellow-500',
    desc: '精选品牌'
  },
];

export function QuickLinks() {
  return (
    <section className="px-4 py-4 bg-white md:hidden">
      <div className="flex justify-around">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium">{link.name}</span>
              <span className="text-[10px] text-gray-400">{link.desc}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
