'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, Percent, Clock, Flame, Tag, CheckCircle2, 
  ChevronRight, Ticket, Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Coupon {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  validUntil: string;
  description?: string;
}

const promotionItems = [
  {
    id: 'flash-sale',
    title: '限时秒杀',
    subtitle: '每日10点开抢',
    icon: Flame,
    color: 'from-red-500 to-orange-500',
    href: '/promotions?tab=flash',
    badge: 'HOT',
  },
  {
    id: 'bundle-deal',
    title: '组合优惠',
    subtitle: '满减专区',
    icon: Percent,
    color: 'from-purple-500 to-pink-500',
    href: '/promotions?tab=bundle',
    badge: '省$50',
  },
  {
    id: 'new-user',
    title: '新人专享',
    subtitle: '首单立减',
    icon: Gift,
    color: 'from-blue-500 to-cyan-500',
    href: '/promotions?tab=newuser',
    badge: '新人',
  },
  {
    id: 'weekly',
    title: '周周特惠',
    subtitle: '本周精选',
    icon: Tag,
    color: 'from-green-500 to-teal-500',
    href: '/promotions?tab=weekly',
    badge: '限时',
  },
];

const mockCoupons: Coupon[] = [
  {
    id: '1',
    name: '新人专享券',
    type: 'fixed',
    value: 20,
    minOrder: 100,
    validUntil: '2024-12-31',
    description: '新用户首单可用',
  },
  {
    id: '2',
    name: '满减优惠券',
    type: 'fixed',
    value: 50,
    minOrder: 300,
    validUntil: '2024-12-31',
    description: '全场通用',
  },
  {
    id: '3',
    name: '护肤品类券',
    type: 'percent',
    value: 15,
    minOrder: 150,
    validUntil: '2024-12-15',
    description: '仅限护肤品类',
  },
  {
    id: '4',
    name: '会员专属',
    type: 'percent',
    value: 10,
    minOrder: 0,
    validUntil: '2024-12-31',
    description: '会员专享折扣',
  },
];

function CouponCard({ coupon, onClaim }: { coupon: Coupon; onClaim: (id: string) => void }) {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaim(coupon.id);
  };

  return (
    <div className={`relative flex overflow-hidden rounded-xl border ${claimed ? 'opacity-60' : ''}`}>
      {/* 左侧金额区 */}
      <div className="flex flex-col items-center justify-center w-24 md:w-28 bg-gradient-to-br from-red-500 to-orange-500 text-white p-3">
        {coupon.type === 'percent' ? (
          <>
            <span className="text-2xl md:text-3xl font-bold">{coupon.value}%</span>
            <span className="text-xs">OFF</span>
          </>
        ) : (
          <>
            <span className="text-sm">$</span>
            <span className="text-2xl md:text-3xl font-bold">{coupon.value}</span>
          </>
        )}
      </div>

      {/* 右侧信息区 */}
      <div className="flex-1 p-3 bg-white">
        <h4 className="font-medium text-sm md:text-base mb-1">{coupon.name}</h4>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{coupon.description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <Clock className="h-3 w-3" />
          <span>有效期至 {coupon.validUntil}</span>
        </div>
        {coupon.minOrder > 0 && (
          <p className="text-xs text-gray-400">满${coupon.minOrder}可用</p>
        )}
      </div>

      {/* 领取按钮 */}
      <div className="flex items-center px-2 bg-gray-50 border-l border-dashed">
        {claimed ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xs mt-1">已领取</span>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleClaim}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-xs px-3"
          >
            领取
          </Button>
        )}
      </div>

      {/* 装饰圆点 */}
      <div className="absolute left-20 md:left-24 top-0 w-4 h-4 bg-gray-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-20 md:left-24 bottom-0 w-4 h-4 bg-gray-100 rounded-full -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}

export function PromotionSection() {
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const [showCouponDialog, setShowCouponDialog] = useState(false);

  const handleClaimCoupon = (id: string) => {
    setClaimedCoupons([...claimedCoupons, id]);
  };

  return (
    <section className="py-6 md:py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            促销活动
          </h2>
          <Link href="/promotions">
            <Button variant="ghost" className="text-primary text-sm">
              全部活动 <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* 促销入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {promotionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className={`aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br ${item.color} relative`}>
                      <Badge className="absolute top-2 right-2 bg-white/20 text-white text-[10px]">
                        {item.badge}
                      </Badge>
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-white mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-sm md:text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-white/80">{item.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* 优惠券领取入口 */}
        <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-base md:text-lg">优惠券中心</h3>
            </div>
            <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm">
                  领取优惠券
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    领取优惠券
                  </DialogTitle>
                  <DialogDescription>
                    点击领取按钮即可获得优惠券
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
                  {mockCoupons.map((coupon) => (
                    <CouponCard 
                      key={coupon.id} 
                      coupon={coupon} 
                      onClaim={handleClaimCoupon}
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 优惠券预览 */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {mockCoupons.slice(0, 3).map((coupon) => (
              <div 
                key={coupon.id}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border overflow-hidden w-36 md:w-44"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-2 text-center">
                  {coupon.type === 'percent' ? (
                    <span className="text-lg font-bold">{coupon.value}% OFF</span>
                  ) : (
                    <span className="text-lg font-bold">${coupon.value}</span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{coupon.name}</p>
                  <p className="text-[10px] text-gray-400">满${coupon.minOrder}可用</p>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setShowCouponDialog(true)}
              className="flex-shrink-0 flex items-center justify-center w-20 md:w-24 bg-white/50 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:bg-white hover:text-primary transition-colors"
            >
              <span className="text-xs">更多</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
