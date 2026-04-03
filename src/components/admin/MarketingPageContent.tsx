'use client';

import { useState } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  Megaphone,
  Image,
  Ticket,
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Calendar,
  Percent,
  Gift,
  Clock,
  Eye,
  EyeOff,
  Copy,
  MoreVertical,
} from 'lucide-react';

const t = adminTranslations.common;

// Banner 数据
const mockBanners = [
  {
    id: '1',
    title: 'Summer Sale 2024',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    link: '/products?sale=summer',
    position: 'home_hero',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'active',
    views: 12500,
  },
  {
    id: '2',
    title: 'New Arrivals - SK-II',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&h=400&fit=crop',
    link: '/brands/sk-ii',
    position: 'home_hero',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    status: 'active',
    views: 8900,
  },
  {
    id: '3',
    title: 'Free Shipping Over $50',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    link: '/shipping',
    position: 'home_mid',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'active',
    views: 5600,
  },
  {
    id: '4',
    title: 'Valentine Special',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=400&fit=crop',
    link: '/products?category=gift',
    position: 'home_hero',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    status: 'inactive',
    views: 3200,
  },
];

// 优惠券数据
const mockCoupons = [
  {
    id: '1',
    code: 'WELCOME20',
    name: '新用户首单优惠',
    type: 'percentage',
    value: 20,
    minOrder: 50,
    maxDiscount: 30,
    usageLimit: 1000,
    usedCount: 456,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
  },
  {
    id: '2',
    code: 'FREESHIP',
    name: '免运费券',
    type: 'free_shipping',
    value: 0,
    minOrder: 30,
    maxDiscount: 0,
    usageLimit: 500,
    usedCount: 189,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
  },
  {
    id: '3',
    code: 'SAVE10',
    name: '满100减10',
    type: 'fixed',
    value: 10,
    minOrder: 100,
    maxDiscount: 0,
    usageLimit: 200,
    usedCount: 87,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    status: 'active',
  },
  {
    id: '4',
    code: 'VIP30',
    name: 'VIP会员专享',
    type: 'percentage',
    value: 30,
    minOrder: 100,
    maxDiscount: 50,
    usageLimit: 50,
    usedCount: 23,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'inactive',
  },
];

type MarketingTab = 'banners' | 'coupons' | 'promotions';

export default function MarketingPageContent() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('banners');
  const [banners, setBanners] = useState(mockBanners);
  const [coupons, setCoupons] = useState(mockCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const tabs = [
    { id: 'banners' as const, name: 'Banner 管理', icon: Image, count: banners.length },
    { id: 'coupons' as const, name: '优惠券', icon: Ticket, count: coupons.length },
    { id: 'promotions' as const, name: '促销活动', icon: Tag, count: 3 },
  ];

  const handleToggleStatus = (
    items: any[],
    setItems: React.Dispatch<React.SetStateAction<any[]>>,
    id: string
  ) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{adminTranslations.admin.marketing}</h1>
          <p className="text-gray-500 mt-1">管理 Banner、优惠券和促销活动</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'banners' && (
            <button
              onClick={() => setShowBannerModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              添加 Banner
            </button>
          )}
          {activeTab === 'coupons' && (
            <button
              onClick={() => setShowCouponModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              创建优惠券
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'banners' ? '搜索 Banner...' : '搜索优惠券...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Banners Tab */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(banners, setBanners, banner.id)}
                          className={`p-2 rounded-lg ${
                            banner.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                          }`}
                        >
                          {banner.status === 'active' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white rounded-lg hover:bg-gray-100 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          banner.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {banner.status === 'active' ? '显示中' : '已隐藏'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{banner.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {banner.startDate} - {banner.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {banner.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          位置: {banner.position === 'home_hero' ? '首页顶部' : '首页中部'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">优惠券</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">类型</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">使用条件</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">有效期</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">使用量</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{coupon.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-gray-100 px-2 py-0.5 rounded font-mono">
                              {coupon.code}
                            </code>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <Copy className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          coupon.type === 'percentage'
                            ? 'bg-purple-100 text-purple-700'
                            : coupon.type === 'free_shipping'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {coupon.type === 'percentage' ? '百分比' : coupon.type === 'free_shipping' ? '免运费' : '固定金额'}
                          {coupon.type !== 'free_shipping' && ` - ${coupon.value}${coupon.type === 'percentage' ? '%' : '$'}`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <div>满 ${coupon.minOrder}</div>
                        {coupon.maxDiscount > 0 && (
                          <div className="text-xs text-gray-400">最高减 ${coupon.maxDiscount}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <div>{coupon.startDate}</div>
                        <div className="text-xs text-gray-400">至 {coupon.endDate}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{coupon.usedCount}/{coupon.usageLimit}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(coupons, setCoupons, coupon.id)}
                          className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full ${
                            coupon.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {coupon.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          {coupon.status === 'active' ? '启用' : '禁用'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Promotions Tab */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              {/* Active Promotions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  进行中的促销
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: '新年特惠', discount: '20%', products: 45, endsIn: '15天' },
                    { name: '限时秒杀', discount: '最高50%', products: 20, endsIn: '3天' },
                    { name: '品牌周', discount: '买二送一', products: 80, endsIn: '7天' },
                  ].map((promo, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{promo.name}</h4>
                          <p className="text-2xl font-bold text-primary mt-1">{promo.discount}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          进行中
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{promo.products} 件商品</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          剩余 {promo.endsIn}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                          编辑
                        </button>
                        <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm">
                          结束
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Promotion */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">创建新促销</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: '折扣促销', icon: Percent, desc: '设置商品折扣比例' },
                    { name: '买赠活动', icon: Gift, desc: '买指定商品送赠品' },
                    { name: '满减活动', icon: Tag, desc: '满额立减优惠' },
                    { name: '限时秒杀', icon: Clock, desc: '限定时间的超低价' },
                  ].map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={index}
                        className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <Icon className="h-8 w-8 text-primary mb-3" />
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">添加 Banner</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner 标题</label>
                <input
                  type="text"
                  placeholder="输入 Banner 标题"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner 图片</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Image className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">拖拽图片到此处或点击上传</p>
                  <p className="text-xs text-gray-400 mt-1">建议尺寸: 1200 x 400 像素</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">显示位置</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="home_hero">首页顶部</option>
                    <option value="home_mid">首页中部</option>
                    <option value="category">分类页</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">链接地址</label>
                  <input
                    type="text"
                    placeholder="/products?sale=summer"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowBannerModal(false)}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">创建优惠券</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">优惠券名称</label>
                <input
                  type="text"
                  placeholder="例如: 新用户首单优惠"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">优惠券代码</label>
                <input
                  type="text"
                  placeholder="例如: WELCOME20"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">优惠类型</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="percentage">百分比折扣</option>
                    <option value="fixed">固定金额</option>
                    <option value="free_shipping">免运费</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">优惠值</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最低消费</label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">使用上限</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCouponModal(false)}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
