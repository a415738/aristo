'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Bell
} from 'lucide-react';

// 用户菜单项
const menuItems = [
  { name: '我的订单', icon: Package, href: '/account/orders', count: 3 },
  { name: '收货地址', icon: MapPin, href: '/account/addresses' },
  { name: '个人资料', icon: User, href: '/account/profile' },
  { name: '我的收藏', icon: Heart, href: '/account/favorites', count: 12 },
  { name: '优惠券', icon: Ticket, href: '/account/coupons', count: 5 },
  { name: '消息通知', icon: Bell, href: '/account/notifications' },
  { name: '账户设置', icon: Settings, href: '/account/settings' },
];

export default function AccountPage() {
  const router = useRouter();
  const [user] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: null,
  });

  const handleLogout = () => {
    // TODO: 登出逻辑
    router.push('/');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* 用户信息卡片 */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-24" />
            <CardContent className="relative pt-0 pb-4">
              <div className="flex items-end gap-4 -mt-10">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-400 to-purple-400 text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pb-2">
                  <h1 className="text-xl font-bold">{user.name}</h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link href="/account/profile">
                  <Button variant="outline" size="sm">
                    编辑资料
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 快捷入口 */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Link href="/account/orders?status=pending">
              <Card className="text-center py-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="text-xs text-gray-600">待付款</p>
                  <p className="text-lg font-bold">1</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/orders?status=shipped">
              <Card className="text-center py-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">待收货</p>
                  <p className="text-lg font-bold">2</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/favorites">
              <Card className="text-center py-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-pink-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-600">收藏</p>
                  <p className="text-lg font-bold">12</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/account/coupons">
              <Card className="text-center py-4 hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-600">优惠券</p>
                  <p className="text-lg font-bold">5</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* 菜单列表 */}
          <Card>
            <CardContent className="p-0">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      index !== menuItems.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {item.count}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* 退出登录 */}
          <Button
            variant="outline"
            className="w-full mt-6 h-12 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </div>
    </Layout>
  );
}
