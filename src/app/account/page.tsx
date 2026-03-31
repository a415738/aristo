'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Package, 
  MapPin, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShoppingBag,
  Heart,
  Ticket,
  Bell,
  Crown,
  Gift,
  Star,
  CreditCard,
  HelpCircle,
  Shield
} from 'lucide-react';

// 用户菜单项
interface MenuItem {
  name: string;
  icon: typeof Package;
  href: string;
  count?: number;
  badge?: string;
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: '我的服务',
    items: [
      { name: '我的订单', icon: Package, href: '/account/orders', count: 3 },
      { name: '收货地址', icon: MapPin, href: '/account/addresses' },
      { name: '个人资料', icon: User, href: '/account/profile' },
      { name: '我的收藏', icon: Heart, href: '/account/favorites', count: 12 },
    ]
  },
  {
    title: '会员权益',
    items: [
      { name: '优惠券', icon: Ticket, href: '/account/coupons', count: 5 },
      { name: '积分商城', icon: Gift, href: '/account/points' },
      { name: '会员特权', icon: Crown, href: '/account/membership' },
    ]
  },
  {
    title: '其他',
    items: [
      { name: '消息通知', icon: Bell, href: '/account/notifications', badge: '新' },
      { name: '支付管理', icon: CreditCard, href: '/account/payment' },
      { name: '账户安全', icon: Shield, href: '/account/security' },
      { name: '帮助中心', icon: HelpCircle, href: '/account/help' },
      { name: '设置', icon: Settings, href: '/account/settings' },
    ]
  }
];

export default function AccountPage() {
  const router = useRouter();
  const [user] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: null,
    level: 'VIP会员',
    points: 2580,
    nextLevel: 3000,
  });

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          
          {/* 用户信息卡片 */}
          <div className="relative mb-6">
            {/* 背景 */}
            <div className="bg-neutral-900 rounded-2xl overflow-hidden">
              {/* 装饰元素 */}
              <div className="absolute top-[-30px] right-[-30px] w-40 h-40 border border-white/5 rounded-full" />
              <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 border border-white/5 rounded-full" />
              
              <div className="relative z-10 p-5">
                {/* 顶部：会员等级 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-white/60" />
                    <span className="text-xs text-white/80 font-medium">{user.level}</span>
                  </div>
                  <Link 
                    href="/account/membership"
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
                  >
                    查看权益
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                
                {/* 用户信息 */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/20">
                    <AvatarImage src={user.avatar || ''} />
                    <AvatarFallback className="text-sm bg-white/10 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-sm font-medium text-white truncate">{user.name}</h1>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                  </div>
                  <Link href="/account/profile">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="h-7 px-3 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      编辑
                    </Button>
                  </Link>
                </div>
                
                {/* 积分进度 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 text-white/50" />
                      <span className="text-xs text-white/60">积分</span>
                    </div>
                    <span className="text-xs font-medium text-white">{user.points.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/40 rounded-full"
                      style={{ width: `${(user.points / user.nextLevel) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    再消费 ${(user.nextLevel - user.points) / 100} 升级为 SVIP
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: Package, label: '待付款', count: 1, href: '/account/orders?status=pending' },
              { icon: ShoppingBag, label: '待收货', count: 2, href: '/account/orders?status=shipped' },
              { icon: Heart, label: '收藏', count: 12, href: '/account/favorites' },
              { icon: Ticket, label: '优惠券', count: 5, href: '/account/coupons' },
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="text-center py-4 border-0 shadow-sm hover:shadow-md transition-all bg-white rounded-xl overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-neutral-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <item.icon className="h-5 w-5 text-neutral-600" />
                    </div>
                    <p className="text-xs text-neutral-500 mb-0.5">{item.label}</p>
                    <p className="text-base font-semibold text-neutral-900">{item.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 菜单列表 */}
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-4' : ''}>
              <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h3>
              <Card className="border-0 shadow-sm overflow-hidden rounded-xl bg-white">
                <CardContent className="p-0">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group ${
                          index !== section.items.length - 1 ? 'border-b border-neutral-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <Icon className="h-4 w-4 text-neutral-500" />
                          </div>
                          <span className="font-medium text-neutral-700">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-900 text-white">
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-900 text-white">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* 退出登录 */}
          <Button
            variant="outline"
            className="w-full mt-6 h-11 rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>

          {/* 底部间距 */}
          <div className="h-8" />
        </div>
      </div>
    </Layout>
  );
}
