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
  Sparkles,
  CreditCard,
  HelpCircle,
  Shield
} from 'lucide-react';

// 用户菜单项
interface MenuItem {
  name: string;
  icon: typeof Package;
  href: string;
  color: string;
  count?: number;
  badge?: string;
}

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: '我的服务',
    items: [
      { name: '我的订单', icon: Package, href: '/account/orders', count: 3, color: '#C9A99A' },
      { name: '收货地址', icon: MapPin, href: '/account/addresses', color: '#B890A0' },
      { name: '个人资料', icon: User, href: '/account/profile', color: '#A8B090' },
      { name: '我的收藏', icon: Heart, href: '/account/favorites', count: 12, color: '#D4A5A5' },
    ]
  },
  {
    title: '会员福利',
    items: [
      { name: '优惠券', icon: Ticket, href: '/account/coupons', count: 5, color: '#C9A99A' },
      { name: '积分商城', icon: Gift, href: '/account/points', color: '#B890A0' },
      { name: '会员特权', icon: Crown, href: '/account/membership', color: '#D4B896' },
    ]
  },
  {
    title: '其他',
    items: [
      { name: '消息通知', icon: Bell, href: '/account/notifications', badge: '新', color: '#A8B090' },
      { name: '支付管理', icon: CreditCard, href: '/account/payment', color: '#B890A0' },
      { name: '账户安全', icon: Shield, href: '/account/security', color: '#9B8B83' },
      { name: '帮助中心', icon: HelpCircle, href: '/account/help', color: '#A89890' },
      { name: '设置', icon: Settings, href: '/account/settings', color: '#9B8B83' },
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
      <div className="min-h-screen bg-[#FAF8F6]">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          
          {/* 用户信息卡片 */}
          <div className="relative mb-6">
            {/* 背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355] via-[#9B8B83] to-[#B890A0] rounded-3xl" />
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* 装饰元素 */}
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute top-1/2 right-8 w-20 h-20 border border-white/20 rounded-full" />
            </div>
            
            <div className="relative z-10 p-6">
              {/* 顶部：会员等级 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-[#E8D5CE]" />
                  <span className="text-sm text-white/90 font-medium">{user.level}</span>
                </div>
                <Link 
                  href="/account/membership"
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                >
                  查看权益
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              
              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white/30 shadow-lg ring-2 ring-white/20">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-xl bg-white/20 text-white backdrop-blur-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-white mb-1">{user.name}</h1>
                  <p className="text-sm text-white/70">{user.email}</p>
                </div>
                <Link href="/account/profile">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                  >
                    编辑
                  </Button>
                </Link>
              </div>
              
              {/* 积分进度 */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#E8D5CE]" />
                    <span className="text-sm text-white/90">积分</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{user.points.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E8D5CE] to-[#F5E6E0] rounded-full"
                    style={{ width: `${(user.points / user.nextLevel) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-1.5">
                  再消费 ${(user.nextLevel - user.points) / 100} 升级为 SVIP
                </p>
              </div>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: Package, label: '待付款', count: 1, href: '/account/orders?status=pending', color: '#C9A99A', bg: '#F5EDE8' },
              { icon: ShoppingBag, label: '待收货', count: 2, href: '/account/orders?status=shipped', color: '#B890A0', bg: '#F5EBF0' },
              { icon: Heart, label: '收藏', count: 12, href: '/account/favorites', color: '#D4A5A5', bg: '#F5E8EB' },
              { icon: Ticket, label: '优惠券', count: 5, href: '/account/coupons', color: '#D4B896', bg: '#F5EDE5' },
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="text-center py-4 border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl overflow-hidden group">
                  <CardContent className="p-0">
                    <div 
                      className="w-11 h-11 mx-auto mb-2 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: item.bg }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <p className="text-xs text-[#9B8B83] mb-0.5">{item.label}</p>
                    <p className="text-lg font-semibold text-[#5D4E47]">{item.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 菜单列表 */}
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-4' : ''}>
              <h3 className="text-xs font-medium text-[#9B8B83] uppercase tracking-wider mb-2 px-1">
                {section.title}
              </h3>
              <Card className="border-0 shadow-sm overflow-hidden rounded-2xl bg-white">
                <CardContent className="p-0">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors group ${
                          index !== section.items.length - 1 ? 'border-b border-[#F5EDE8]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <Icon className="h-4.5 w-4.5" style={{ color: item.color }} />
                          </div>
                          <span className="font-medium text-[#5D4E47]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count && (
                            <span 
                              className="px-2 py-0.5 text-xs font-medium rounded-full"
                              style={{ backgroundColor: `${item.color}15`, color: item.color }}
                            >
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span 
                              className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#C9A99A] text-white"
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-[#C9A99A] group-hover:text-[#8B7355] transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* 推广横幅 */}
          <Card className="mt-6 border-0 shadow-sm overflow-hidden rounded-2xl bg-gradient-to-r from-[#F5EDE8] to-[#F5EBF0]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#C9A99A]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#5D4E47]">邀请好友，双方各得 $10</p>
                  <p className="text-xs text-[#9B8B83]">邀请越多，奖励越多</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#C9A99A]" />
              </div>
            </CardContent>
          </Card>

          {/* 退出登录 */}
          <Button
            variant="outline"
            className="w-full mt-6 h-12 rounded-xl border-[#E8D5CE] text-[#8B7355] hover:bg-[#F5EDE8] hover:text-[#5D4E47] transition-all duration-300"
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
