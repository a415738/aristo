'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory?: string;
  selectedBrand?: string;
  minPrice?: string;
  maxPrice?: string;
}

export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [priceMin, setPriceMin] = useState(minPrice || '');
  const [priceMax, setPriceMax] = useState(maxPrice || '');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(window.location.search);
    
    if (priceMin) params.set('min_price', priceMin);
    else params.delete('min_price');
    
    if (priceMax) params.set('max_price', priceMax);
    else params.delete('max_price');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  // 分类图标映射
  const categoryIcons: Record<string, string> = {
    'skincare': '🧴',
    'makeup': '💄',
    'bodycare': '🛁',
    'fragrance': '🌸',
    'haircare': '💇',
    'tools': '💅',
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Category Pills - Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700">{t.categories?.all || 'Categories'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="text-sm h-8 px-3 flex items-center gap-1"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.common.filter || 'Filter'}
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
        
        {/* Horizontal scroll category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => updateFilter('category', null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {t.categories?.all || 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug === selectedCategory ? null : cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">{t.common.filter || 'Filters'}</h3>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-primary">
                    Clear all
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <button
                  className="flex items-center justify-between w-full font-semibold mb-3"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  {t.categories?.all || 'Categories'}
                  {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showCategories && (
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => updateFilter('category', cat.slug === selectedCategory ? null : cat.slug)}
                        className={`p-3 rounded-xl text-sm text-center transition-colors ${
                          selectedCategory === cat.slug
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands */}
              <div>
                <button
                  className="flex items-center justify-between w-full font-semibold mb-3"
                  onClick={() => setShowBrands(!showBrands)}
                >
                  Brands
                  {showBrands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showBrands && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedBrand === brand.slug}
                          onCheckedChange={(checked) => {
                            updateFilter('brand', checked ? brand.slug : null);
                          }}
                        />
                        <span className="text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <button
                  className="flex items-center justify-between w-full font-semibold mb-3"
                  onClick={() => setShowPrice(!showPrice)}
                >
                  Price Range
                  {showPrice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showPrice && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor="min-price" className="text-xs text-gray-500">Min</Label>
                        <Input
                          id="min-price"
                          type="number"
                          placeholder="0"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="max-price" className="text-xs text-gray-500">Max</Label>
                        <Input
                          id="max-price"
                          type="number"
                          placeholder="1000"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => { applyPriceFilter(); setShowFilters(false); }}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="sticky bottom-0 p-4 bg-white border-t">
              <Button className="w-full" onClick={() => setShowFilters(false)}>
                Show Results ({activeFiltersCount > 0 ? 'Filtered' : 'All'})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Card Filters */}
      <Card className="hidden md:block">
        <CardContent className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <button
              className="flex items-center justify-between w-full font-semibold mb-3"
              onClick={() => setShowCategories(!showCategories)}
            >
              Categories
              {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showCategories && (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                  >
                    <Checkbox
                      checked={selectedCategory === cat.slug}
                      onCheckedChange={(checked) => {
                        updateFilter('category', checked ? cat.slug : null);
                      }}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <button
              className="flex items-center justify-between w-full font-semibold mb-3"
              onClick={() => setShowBrands(!showBrands)}
            >
              Brands
              {showBrands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showBrands && (
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary"
                  >
                    <Checkbox
                      checked={selectedBrand === brand.slug}
                      onCheckedChange={(checked) => {
                        updateFilter('brand', checked ? brand.slug : null);
                      }}
                    />
                    <span className="text-sm">{brand.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button
              className="flex items-center justify-between w-full font-semibold mb-3"
              onClick={() => setShowPrice(!showPrice)}
            >
              Price Range
              {showPrice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPrice && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="min-price-desktop" className="text-xs text-gray-500">Min</Label>
                    <Input
                      id="min-price-desktop"
                      type="number"
                      placeholder="0"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-price-desktop" className="text-xs text-gray-500">Max</Label>
                    <Input
                      id="max-price-desktop"
                      type="number"
                      placeholder="1000"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button size="sm" className="w-full" onClick={applyPriceFilter}>
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedBrand || minPrice || maxPrice) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
