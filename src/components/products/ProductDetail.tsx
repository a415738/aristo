'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, ShoppingCart, Minus, Plus, Share2, Truck, Shield, 
  RotateCcw, ChevronRight, Star, MessageCircle, ThumbsUp,
  Package, Clock, Award
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  main_image: string;
  retail_price: string;
  wholesale_price: string | null;
  min_wholesale_qty: number | null;
  stock: number;
  sku: string | null;
  specs: { name: string; value: string }[] | null;
  tags: string[] | null;
  sales_count: number;
  categories: { id: string; name: string; slug: string } | null;
  brands: { id: string; name: string; slug: string; logo: string | null } | null;
  product_images: { id: string; image: string; sort_order: number }[];
  product_variants: { id: string; name: string; sku: string | null; price: string; stock: number; image: string | null }[];
}

interface ProductDetailProps {
  product: Product;
}

// 模拟评价数据
const mockReviews = [
  {
    id: '1',
    user: '张**',
    rating: 5,
    content: '非常好用！保湿效果很棒，皮肤变得水嫩嫩的，会回购的。',
    date: '2024-01-15',
    helpful: 23,
    images: [],
  },
  {
    id: '2',
    user: '李**',
    rating: 4,
    content: '整体不错，就是快递有点慢。产品质量很好，味道也很清新。',
    date: '2024-01-10',
    helpful: 15,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'],
  },
  {
    id: '3',
    user: '王**',
    rating: 5,
    content: '批发价真的很划算，质量也OK，已经推荐给朋友了。',
    date: '2024-01-08',
    helpful: 8,
    images: [],
  },
];

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.main_image);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.product_variants[0]?.id || null
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const images = [product.main_image, ...product.product_images.map(img => img.image)];
  const currentVariant = product.product_variants.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.retail_price;
  const currentStock = currentVariant?.stock || product.stock;
  const discount = product.wholesale_price 
    ? Math.round((1 - Number(product.wholesale_price) / Number(product.retail_price)) * 100)
    : 0;

  const handleAddToCart = () => {
    console.log('Add to cart:', { productId: product.id, variantId: selectedVariant, quantity });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: product.id, variantId: selectedVariant, quantity });
  };

  const getStockStatus = () => {
    if (currentStock === 0) return { text: '已售罄', color: 'text-red-500' };
    if (currentStock < 10) return { text: `仅剩 ${currentStock} 件`, color: 'text-orange-500' };
    return { text: '有货', color: 'text-green-500' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* 左侧图片区 */}
      <div className="space-y-4">
        {/* 主图 */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* 标签 */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.tags && product.tags.includes('热销') && (
              <Badge className="bg-red-500 text-white">热销</Badge>
            )}
            {product.tags && product.tags.includes('新品') && (
              <Badge className="bg-green-500 text-white">新品</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-orange-500 text-white">省{discount}%</Badge>
            )}
          </div>

          {/* 收藏按钮 */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* 缩略图 */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 右侧信息区 */}
      <div className="space-y-6">
        {/* 面包屑 */}
        <nav className="text-sm text-gray-500 flex items-center flex-wrap">
          <Link href="/" className="hover:text-primary">首页</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          {product.categories && (
            <>
              <Link href={`/products?category=${product.categories.slug}`} className="hover:text-primary">
                {product.categories.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
            </>
          )}
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>

        {/* 品牌和标题 */}
        <div>
          {product.brands && (
            <Link href={`/brands/${product.brands.slug}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-2">
              {product.brands.logo && (
                <img src={product.brands.logo} alt={product.brands.name} className="h-5 w-auto" />
              )}
              {product.brands.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.sku && (
            <p className="text-sm text-gray-400 mt-1">SKU: {product.sku}</p>
          )}
        </div>

        {/* 价格区域 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm text-gray-500">零售价:</span>
            <span className="text-3xl font-bold text-red-500">
              ${Number(currentPrice).toFixed(2)}
            </span>
            {currentVariant && product.retail_price !== currentPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${Number(product.retail_price).toFixed(2)}
              </span>
            )}
          </div>
          
          {product.wholesale_price && (
            <div className="mt-3 pt-3 border-t border-red-100">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-500 text-white">批发价</Badge>
                <span className="text-2xl font-bold text-green-600">
                  ${Number(product.wholesale_price).toFixed(2)}
                </span>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  省{discount}%
                </Badge>
              </div>
              {product.min_wholesale_qty && (
                <p className="text-sm text-green-600">
                  <Package className="h-4 w-4 inline mr-1" />
                  起批量: {product.min_wholesale_qty} 件
                </p>
              )}
            </div>
          )}
        </div>

        {/* 优惠信息 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="h-4 w-4 text-primary" />
            <span>满$99包邮</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="h-4 w-4 text-primary" />
            <span>正品保证</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>7天无理由退换</span>
          </div>
        </div>

        <Separator />

        {/* 规格选择 */}
        {product.product_variants.length > 0 && (
          <div className="space-y-3">
            <label className="font-medium">选择规格:</label>
            <div className="flex flex-wrap gap-2">
              {product.product_variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedVariant === variant.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={variant.stock === 0}
                >
                  {variant.name}
                  {variant.stock === 0 && <span className="text-xs ml-1">(售罄)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 数量选择 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">购买数量:</label>
            <span className={`text-sm ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 rounded-xl overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-none h-12 w-12"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))}
                className="w-20 h-12 text-center border-x font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock}
                className="rounded-none h-12 w-12"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {product.wholesale_price && product.min_wholesale_qty && quantity >= product.min_wholesale_qty && (
              <Badge className="bg-green-500 text-white">
                已达批发价！
              </Badge>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 h-12 text-lg"
            onClick={handleAddToCart}
            disabled={currentStock === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            加入购物车
          </Button>
          <Button 
            size="lg" 
            className="flex-1 h-12 text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            onClick={handleBuyNow}
            disabled={currentStock === 0}
          >
            立即购买
          </Button>
        </div>

        {/* 服务保障 */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex flex-col items-center text-center p-2">
            <Award className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs">正品保障</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <Truck className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs">极速发货</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <Shield className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs">安全支付</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <RotateCcw className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs">无忧退换</span>
          </div>
        </div>
      </div>

      {/* 详情和评价 */}
      <div className="lg:col-span-2 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-12 bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="description" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              商品详情
            </TabsTrigger>
            <TabsTrigger value="specs" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              规格参数
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 h-10 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">
              用户评价 (3)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold mb-4">商品描述</h3>
              <div className="prose prose-gray max-w-none">
                {product.description ? (
                  <p className="whitespace-pre-line text-gray-600 leading-relaxed">{product.description}</p>
                ) : (
                  <p className="text-gray-400">暂无商品描述</p>
                )}
              </div>
              
              {/* 商品特点 */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">💧 深层保湿</h4>
                  <p className="text-sm text-gray-600">富含透明质酸，深层滋润肌肤</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">🌿 天然成分</h4>
                  <p className="text-sm text-gray-600">萃取天然植物精华，温和不刺激</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4">
                  <h4 className="font-medium mb-2">✨ 持久效果</h4>
                  <p className="text-sm text-gray-600">长效锁水，全天候保湿</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold mb-4">规格参数</h3>
              {product.specs && product.specs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b last:border-0 bg-gray-50 px-4 rounded-lg">
                      <span className="font-medium text-gray-700">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b bg-gray-50 px-4 rounded-lg">
                    <span className="font-medium text-gray-700">品牌</span>
                    <span className="text-gray-600">{product.brands?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b bg-gray-50 px-4 rounded-lg">
                    <span className="font-medium text-gray-700">分类</span>
                    <span className="text-gray-600">{product.categories?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b bg-gray-50 px-4 rounded-lg">
                    <span className="font-medium text-gray-700">SKU</span>
                    <span className="text-gray-600">{product.sku || '-'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b bg-gray-50 px-4 rounded-lg">
                    <span className="font-medium text-gray-700">库存</span>
                    <span className="text-gray-600">{product.stock} 件</span>
                  </div>
                  <div className="flex justify-between py-3 border-b bg-gray-50 px-4 rounded-lg">
                    <span className="font-medium text-gray-700">销量</span>
                    <span className="text-gray-600">{product.sales_count} 件</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">用户评价</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">好评率</span>
                  <span className="text-xl font-bold text-primary">98%</span>
                </div>
              </div>

              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white font-bold">
                        {review.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-gray-600 mb-3">{review.content}</p>
                        {review.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {review.images.map((img, i) => (
                              <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <button className="flex items-center gap-1 hover:text-primary">
                            <ThumbsUp className="h-4 w-4" />
                            有帮助 ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <Button variant="outline">查看更多评价</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
