'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flame, Percent, Gift, Tag, Clock, ChevronRight, 
  ShoppingCart, Ticket, CheckCircle2, Zap
} from 'lucide-react';

// 模拟促销商品数据
const mockFlashSaleProducts = [
  {
    id: '1',
    name: '兰蔻小黑瓶精华肌底液 30ml',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
    originalPrice: 89,
    salePrice: 59,
    discount: 34,
    stock: 100,
    sold: 87,
    endTime: '2024-12-31T10:00:00',
  },
  {
    id: '2',
    name: '雅诗兰黛特润修护肌透精华 50ml',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    originalPrice: 120,
    salePrice: 79,
    discount: 34,
    stock: 50,
    sold: 45,
    endTime: '2024-12-31T10:00:00',
  },
  {
    id: '3',
    name: 'SK-II护肤精华水 230ml',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=300&h=300&fit=crop',
    originalPrice: 199,
    salePrice: 149,
    discount: 25,
    stock: 30,
    sold: 28,
    endTime: '2024-12-31T10:00:00',
  },
];

const mockBundleDeals = [
  {
    id: '1',
    title: '护肤套装优惠',
    description: '买2件享9折，买3件享85折',
    products: ['洁面乳', '爽肤水', '面霜'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    minPrice: 99,
  },
  {
    id: '2',
    title: '彩妆组合优惠',
    description: '满$200减$30',
    products: ['口红', '眼影', '粉底'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    minPrice: 159,
  },
];

const mockCoupons = [
  {
    id: '1',
    name: '新人专享券',
    type: 'fixed' as const,
    value: 20,
    minOrder: 100,
    validUntil: '2024-12-31',
    description: '新用户首单可用',
    claimed: false,
  },
  {
    id: '2',
    name: '满减优惠券',
    type: 'fixed' as const,
    value: 50,
    minOrder: 300,
    validUntil: '2024-12-31',
    description: '全场通用',
    claimed: false,
  },
  {
    id: '3',
    name: '护肤品类券',
    type: 'percent' as const,
    value: 15,
    minOrder: 150,
    validUntil: '2024-12-15',
    description: '仅限护肤品类',
    claimed: false,
  },
  {
    id: '4',
    name: '会员专属',
    type: 'percent' as const,
    value: 10,
    minOrder: 0,
    validUntil: '2024-12-31',
    description: '会员专享折扣',
    claimed: false,
  },
];

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-xs">
      <Clock className="h-3 w-3" />
      <span className="font-mono">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

function FlashSaleCard({ product }: { product: typeof mockFlashSaleProducts[0] }) {
  const soldPercent = Math.round((product.sold / product.stock) * 100);

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{product.discount}%
          </Badge>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[40px]">{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-red-500">${product.salePrice}</span>
            <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
          </div>
          <div className="mb-2">
            <CountdownTimer endTime={product.endTime} />
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">已抢 {product.sold} 件</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CouponCard({ coupon, onClaim }: { coupon: typeof mockCoupons[0]; onClaim: () => void }) {
  const [claimed, setClaimed] = useState(coupon.claimed);

  const handleClaim = () => {
    setClaimed(true);
    onClaim();
  };

  return (
    <div className={`relative flex overflow-hidden rounded-xl border ${claimed ? 'opacity-60' : ''}`}>
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
      <div className="flex-1 p-3 bg-white">
        <h4 className="font-medium text-sm md:text-base mb-1">{coupon.name}</h4>
        <p className="text-xs text-gray-500 mb-2">{coupon.description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>有效期至 {coupon.validUntil}</span>
        </div>
        {coupon.minOrder > 0 && (
          <p className="text-xs text-gray-400 mt-1">满${coupon.minOrder}可用</p>
        )}
      </div>
      <div className="flex items-center px-3 bg-gray-50 border-l border-dashed">
        {claimed ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-xs mt-1">已领取</span>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleClaim}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
          >
            领取
          </Button>
        )}
      </div>
      <div className="absolute left-20 md:left-24 top-0 w-4 h-4 bg-gray-100 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-20 md:left-24 bottom-0 w-4 h-4 bg-gray-100 rounded-full -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}

export default function PromotionsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'flash';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* 页面标题 */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" />
            促销活动中心
          </h1>
          <p className="text-gray-500 mt-1">精选优惠，超值好物</p>
        </div>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="w-full h-12 bg-gray-100 rounded-xl p-1 mb-6">
            <TabsTrigger value="flash" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Flame className="h-4 w-4 mr-1" />
              限时秒杀
            </TabsTrigger>
            <TabsTrigger value="bundle" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Percent className="h-4 w-4 mr-1" />
              组合优惠
            </TabsTrigger>
            <TabsTrigger value="newuser" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Gift className="h-4 w-4 mr-1" />
              新人专享
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              <Ticket className="h-4 w-4 mr-1" />
              领券中心
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flash">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 md:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className="font-bold">限时秒杀</span>
                  <Badge className="bg-red-500 text-white animate-pulse">进行中</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  每日10点、14点、20点开抢
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockFlashSaleProducts.map((product) => (
                  <FlashSaleCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bundle">
            <div className="space-y-4">
              {mockBundleDeals.map((deal) => (
                <Card key={deal.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-32 md:h-auto relative">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-purple-500 text-white">
                          组合优惠
                        </Badge>
                      </div>
                      <div className="flex-1 p-4 md:p-6">
                        <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                        <p className="text-gray-600 mb-3">{deal.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {deal.products.map((p) => (
                            <Badge key={p} variant="outline">{p}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">起</span>
                            <span className="text-2xl font-bold text-primary ml-1">${deal.minPrice}</span>
                          </div>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                            立即选购 <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newuser">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 text-center">
              <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">新人专享福利</h2>
              <p className="text-gray-600 mb-6">注册即享多重好礼</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">$20</div>
                    <p className="text-sm text-gray-600">新用户首单立减</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">10%</div>
                    <p className="text-sm text-gray-600">首单额外折扣</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">免邮</div>
                    <p className="text-sm text-gray-600">首单包邮</p>
                  </CardContent>
                </Card>
              </div>
              <Button size="lg" className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500">
                立即注册领取
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="coupons">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">可领取优惠券</h3>
                <span className="text-sm text-gray-500">每周更新</span>
              </div>
              {mockCoupons.map((coupon) => (
                <CouponCard 
                  key={coupon.id} 
                  coupon={coupon} 
                  onClaim={() => console.log('Claimed:', coupon.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
