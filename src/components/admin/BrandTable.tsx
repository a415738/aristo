'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Edit, Globe } from 'lucide-react';
import { adminTranslations } from '@/lib/admin-translations';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  country: string | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  products?: { count: number }[];
}

interface BrandTableProps {
  brands: Brand[];
}

export function BrandTable({ brands: initialBrands }: BrandTableProps) {
  const t = adminTranslations;
  const [brands, setBrands] = useState(initialBrands);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);

  const handleToggleFeatured = async (brandId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch('/api/admin/brands/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, isFeatured: !currentFeatured }),
      });

      if (response.ok) {
        setBrands(brands.map(b => 
          b.id === brandId ? { ...b, is_featured: !currentFeatured } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update featured status:', error);
    }
  };

  const handleToggleActive = async (brandId: string, currentActive: boolean) => {
    try {
      const response = await fetch('/api/admin/brands/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, isActive: !currentActive }),
      });

      if (response.ok) {
        setBrands(brands.map(b => 
          b.id === brandId ? { ...b, is_active: !currentActive } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update active status:', error);
    }
  };

  const handleSaveBrand = async (brand: Partial<Brand>) => {
    if (!editingBrand) return;
    setSaving(true);

    try {
      const response = await fetch('/api/admin/brands/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: editingBrand.id, ...brand }),
      });

      if (response.ok) {
        setBrands(brands.map(b => 
          b.id === editingBrand.id ? { ...b, ...brand } : b
        ));
        setEditingBrand(null);
      }
    } catch (error) {
      console.error('Failed to update brand:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-gray-600">{t.admin.brands} Logo</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{t.admin.brands}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{t.brands.origin}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{t.brands.products}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{t.admin.marketing}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{t.account.orderStatus}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{t.common.edit}</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => {
            const productCount = brand.products?.[0]?.count || 0;
            
            return (
              <tr key={brand.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {brand.logo ? (
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      className="w-12 h-12 object-contain rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded border">
                      <span className="text-lg font-bold text-gray-400">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{brand.name}</p>
                    <p className="text-xs text-gray-500">{brand.slug}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {brand.country && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{brand.country}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{productCount} {t.brands.products}</Badge>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={brand.is_featured}
                      onCheckedChange={() => handleToggleFeatured(brand.id, brand.is_featured)}
                    />
                    {brand.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch
                    checked={brand.is_active}
                    onCheckedChange={() => handleToggleActive(brand.id, brand.is_active)}
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingBrand(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingBrand?.id === brand.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t.common.edit} {t.admin.brands}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>{t.admin.brands}</Label>
                            <Input 
                              defaultValue={brand.name}
                              id="brand-name"
                            />
                          </div>
                          <div>
                            <Label>Logo URL</Label>
                            <Input 
                              defaultValue={brand.logo || ''}
                              id="brand-logo"
                            />
                          </div>
                          <div>
                            <Label>{t.brands.origin}</Label>
                            <Input 
                              defaultValue={brand.country || ''}
                              id="brand-country"
                            />
                          </div>
                          <div>
                            <Label>{t.productForm.description}</Label>
                            <Textarea 
                              defaultValue={brand.description || ''}
                              id="brand-description"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>{t.filters.sort}</Label>
                            <Input 
                              type="number"
                              defaultValue={brand.sort_order}
                              id="brand-sort-order"
                            />
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => {
                              const name = (document.getElementById('brand-name') as HTMLInputElement).value;
                              const logo = (document.getElementById('brand-logo') as HTMLInputElement).value;
                              const country = (document.getElementById('brand-country') as HTMLInputElement).value;
                              const description = (document.getElementById('brand-description') as HTMLTextAreaElement).value;
                              const sortOrder = parseInt((document.getElementById('brand-sort-order') as HTMLInputElement).value) || 0;
                              handleSaveBrand({ name, logo, country, description, sort_order: sortOrder });
                            }}
                            disabled={saving}
                          >
                            {saving ? t.common.loading : t.common.save}
                          </Button>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {brands.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t.brands.noBrands}
        </div>
      )}
    </div>
  );
}
