'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, ShoppingCart, Minus, Plus, Truck, Shield, 
  RotateCcw, ChevronRight, ChevronLeft, Share2, Eye
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  main_image: string;
  retail_price: string;
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

export function ProductDetail({ product }: ProductDetailProps) {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.product_variants[0]?.id || null
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Get all images
  const images = [product.main_image, ...product.product_images.map(img => img.image)];
  
  const currentVariant = product.product_variants.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.retail_price;
  const currentStock = currentVariant?.stock || product.stock;

  const handleAddToCart = () => {
    console.log('Add to cart:', { productId: product.id, variantId: selectedVariant, quantity });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: product.id, variantId: selectedVariant, quantity });
  };

  const scrollToThumbnail = (direction: 'left' | 'right') => {
    if (thumbnailsRef.current) {
      const scrollAmount = 100;
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-500 flex items-center flex-wrap">
        <Link href="/" className="hover:text-neutral-900 transition-colors">{t.nav.home}</Link>
        <ChevronRight className="h-4 w-4 mx-1.5" />
        {product.categories && (
          <>
            <Link href={`/products?category=${product.categories.slug}`} className="hover:text-neutral-900 transition-colors">
              {product.categories.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1.5" />
          </>
        )}
        <span className="text-neutral-900 truncate">{product.name}</span>
      </nav>

      {/* Product Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left - Images */}
          <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-neutral-100">
            {/* Main Image */}
            <div className="relative aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-4 group">
              <Image
                src={images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-neutral-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 text-neutral-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full">
                {selectedImageIndex + 1} / {images.length}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-2.5 py-1 bg-neutral-900 text-white text-xs font-medium rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-400'}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => scrollToThumbnail('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow rounded-full flex items-center justify-center hover:bg-neutral-50"
                >
                  <ChevronLeft className="h-4 w-4 text-neutral-600" />
                </button>
                
                <div 
                  ref={thumbnailsRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-neutral-900' 
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollToThumbnail('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow rounded-full flex items-center justify-center hover:bg-neutral-50"
                >
                  <ChevronRight className="h-4 w-4 text-neutral-600" />
                </button>
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Brand and Title */}
            <div>
              {product.brands && (
                <Link 
                  href={`/brands/${product.brands.slug}`} 
                  className="inline-block text-xs text-neutral-500 hover:text-neutral-900 transition-colors mb-2 uppercase tracking-wider"
                >
                  {product.brands.name}
                </Link>
              )}
              <h1 className="text-xl lg:text-2xl font-semibold text-neutral-900 leading-tight">{product.name}</h1>
              {product.sku && (
                <p className="text-xs text-neutral-400 mt-1.5">SKU: {product.sku}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-neutral-400">$</span>
              <span className="text-3xl font-bold text-neutral-900">
                {Number(currentPrice).toFixed(2)}
              </span>
              {currentVariant && product.retail_price !== currentPrice && (
                <span className="text-base text-neutral-400 line-through">
                  ${Number(product.retail_price).toFixed(2)}
                </span>
              )}
            </div>

            <Separator className="bg-neutral-100" />

            {/* Variants */}
            {product.product_variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">{t.product.selectOptions}</label>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        selectedVariant === variant.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700'
                      } ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={variant.stock === 0}
                    >
                      {variant.name}
                      {variant.stock === 0 && <span className="ml-1">({t.product.outOfStock})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">{t.product.quantity}</label>
                <span className={`text-xs ${currentStock === 0 ? 'text-red-500' : currentStock < 10 ? 'text-orange-500' : 'text-neutral-500'}`}>
                  {currentStock === 0 ? t.product.outOfStock : currentStock < 10 ? `${currentStock} ${t.product.inStock}` : t.product.inStock}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-neutral-600" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))}
                    className="w-14 h-10 text-center border-x border-neutral-200 text-sm font-medium"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-neutral-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 h-11 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-400"
                onClick={handleAddToCart}
                disabled={currentStock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t.product.addToCart}
              </Button>
              <Button 
                size="lg" 
                className="flex-1 h-11 bg-neutral-900 hover:bg-neutral-800"
                onClick={handleBuyNow}
                disabled={currentStock === 0}
              >
                {t.product.buyNow}
              </Button>
            </div>

            {/* Services */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-neutral-100">
              {[
                { icon: Shield, text: t.footer.privacyPolicy.split(' ')[0] },
                { icon: Truck, text: t.footer.shipping.split(' ')[0] },
                { icon: RotateCcw, text: t.footer.returns.split(' ')[0] },
                { icon: Eye, text: `${product.sales_count} ${t.product.sold}` },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center py-2">
                  <item.icon className="h-5 w-5 text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-500">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details and Reviews */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-neutral-100">
            <TabsList className="w-full h-12 bg-transparent px-6 gap-8">
              <TabsTrigger 
                value="description" 
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t.product.description}
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t.product.specifications}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="p-6 lg:p-8">
            <div className="prose prose-neutral max-w-none">
              {product.description ? (
                <p className="whitespace-pre-line text-neutral-600 leading-relaxed">{product.description}</p>
              ) : (
                <p className="text-neutral-400">{t.product.description}</p>
              )}
            </div>
            
            {/* Product Images */}
            {images.length > 1 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-neutral-50">
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="specs" className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: t.productForm.brand, value: product.brands?.name || '-' },
                { name: t.productForm.category, value: product.categories?.name || '-' },
                { name: 'SKU', value: product.sku || '-' },
                { name: t.productForm.stock, value: `${product.stock}` },
                { name: t.product.sold, value: `${product.sales_count}` },
                ...(product.specs || []),
              ].map((spec, index) => (
                <div key={index} className="flex justify-between py-3 px-4 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-500">{spec.name}</span>
                  <span className="text-sm text-neutral-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
