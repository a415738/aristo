'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Minus, Plus, Share2, Truck, Shield, RotateCcw } from 'lucide-react';

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

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.main_image);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.product_variants[0]?.id || null
  );

  const images = [product.main_image, ...product.product_images.map(img => img.image)];
  const currentVariant = product.product_variants.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.retail_price;
  const currentStock = currentVariant?.stock || product.stock;

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log('Add to cart:', { productId: product.id, variantId: selectedVariant, quantity });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === img ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          {' / '}
          {product.categories && (
            <>
              <Link href={`/products?category=${product.categories.slug}`} className="hover:text-primary">
                {product.categories.name}
              </Link>
              {' / '}
            </>
          )}
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Title & Brand */}
        <div>
          {product.brands && (
            <Link href={`/brands/${product.brands.slug}`} className="text-sm text-primary hover:underline">
              {product.brands.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${Number(currentPrice).toFixed(2)}
            </span>
            {currentVariant && (
              <span className="text-lg text-gray-400 line-through">
                ${Number(product.retail_price).toFixed(2)}
              </span>
            )}
          </div>
          {product.wholesale_price && (
            <p className="text-green-600">
              Wholesale: ${Number(product.wholesale_price).toFixed(2)}
              {product.min_wholesale_qty && ` (Min. ${product.min_wholesale_qty} pcs)`}
            </p>
          )}
        </div>

        {/* Variants */}
        {product.product_variants.length > 0 && (
          <div className="space-y-2">
            <label className="font-medium">Select Option:</label>
            <Select value={selectedVariant || ''} onValueChange={setSelectedVariant}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.product_variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.name} - ${Number(variant.price).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <label className="font-medium">Quantity:</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              {currentStock} available
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          <Button size="lg" variant="outline" className="flex-1">
            Buy Now
          </Button>
          <Button size="lg" variant="ghost">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="ghost">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          <div className="flex flex-col items-center text-center p-3">
            <Truck className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs">100% Authentic</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <RotateCcw className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs">Easy Returns</span>
          </div>
        </div>

        {/* Description & Specs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4 border rounded-lg mt-2">
            <p className="text-gray-600 whitespace-pre-line">
              {product.description || 'No description available.'}
            </p>
          </TabsContent>
          <TabsContent value="specs" className="p-4 border rounded-lg mt-2">
            {product.specs && product.specs.length > 0 ? (
              <div className="space-y-2">
                {product.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
