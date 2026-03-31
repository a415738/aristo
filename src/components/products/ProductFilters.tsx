'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
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

  return (
    <Card>
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
            onClick={() => router.push(pathname)}
          >
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
