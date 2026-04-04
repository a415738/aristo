'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { ProductForm, ProductFormData } from './ProductForm';
import { adminTranslations } from '@/lib/admin-translations';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  stock: number;
  is_active: boolean;
  sales_count: number;
  sku: string | null;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  specs: { name: string; value: string }[] | null;
  tags: string[] | null;
  product_images: { image: string }[];
  product_variants: { name: string; sku: string | null; price: string; stock: number }[];
  categories: { name: string } | null;
  brands: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

export function ProductTable({ products: initialProducts, categories, brands }: ProductTableProps) {
  const t = adminTranslations;
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: ProductFormData) => {
    try {
      const url = '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct ? { ...data, id: editingProduct.id } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        // 刷新商品列表
        window.location.reload();
      } else {
        alert(result.error || t.common.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(t.common.error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(t.common.confirm + '?')) return;

    setDeleting(productId);
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        const result = await response.json();
        alert(result.error || t.common.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(t.common.error);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder={t.nav.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-neutral-200"
            />
          </div>

          <Button
            onClick={handleAddNew}
            className="bg-neutral-900 hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.common.add}
          </Button>
        </div>

        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="w-12">{t.productForm.images}</TableHead>
                <TableHead>{t.productForm.name}</TableHead>
                <TableHead>{t.productForm.category}</TableHead>
                <TableHead>{t.productForm.brand}</TableHead>
                <TableHead className="text-right">{t.productForm.price}</TableHead>
                <TableHead className="text-right">{t.productForm.stock}</TableHead>
                <TableHead className="text-right">{t.product.sold}</TableHead>
                <TableHead className="text-center">{t.account.orderStatus}</TableHead>
                <TableHead className="w-24 text-center">{t.common.edit}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-neutral-50">
                  <TableCell>
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-neutral-100">
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900 line-clamp-1">{product.name}</p>
                      {product.sku && (
                        <p className="text-xs text-neutral-400">SKU: {product.sku}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {product.categories?.name || '-'}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {product.brands?.name || '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-neutral-900">
                    ${Number(product.retail_price).toFixed(2)} USD
                  </TableCell>
                  <TableCell className="text-right text-neutral-600">
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-right text-neutral-600">
                    {product.sales_count}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.is_active ? 'default' : 'secondary'}
                      className={product.is_active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-100'
                      }
                    >
                      {product.is_active ? t.product.inStock : t.product.outOfStock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-neutral-500 hover:text-neutral-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="text-neutral-500 hover:text-red-500"
                      >
                        {deleting === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-neutral-500">
                    {searchQuery ? t.messages.noResults : t.messages.noProducts}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 添加/编辑商品弹窗 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? t.common.edit : t.common.add}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories}
              brands={brands}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
