'use client';

import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  main_image: string;
  retail_price: string;
  wholesale_price: string | null;
  stock: number;
  is_active: boolean;
  is_wholesale: boolean;
  sales_count: number;
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

export function ProductTable({ products, categories, brands }: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加商品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加新商品</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="name">商品名称</Label>
                  <Input id="name" placeholder="请输入商品名称" />
                </div>
                <div>
                  <Label htmlFor="category">分类</Label>
                  <select id="category" className="w-full px-3 py-2 border rounded-lg">
                    <option value="">请选择分类</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="brand">品牌</Label>
                  <select id="brand" className="w-full px-3 py-2 border rounded-lg">
                    <option value="">请选择品牌</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="retail-price">零售价</Label>
                  <Input id="retail-price" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="wholesale-price">批发价</Label>
                  <Input id="wholesale-price" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="stock">库存</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="min-wholesale">起批量</Label>
                  <Input id="min-wholesale" type="number" placeholder="10" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">商品描述</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                    placeholder="请输入商品描述"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">主图URL</Label>
                  <Input id="image" type="url" placeholder="https://..." />
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button className="flex-1">保存商品</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>品牌</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>销量</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.categories?.name || '-'}</TableCell>
                  <TableCell>{product.brands?.name || '-'}</TableCell>
                  <TableCell>
                    <div>
                      <p>${Number(product.retail_price).toFixed(2)}</p>
                      {product.wholesale_price && (
                        <p className="text-sm text-green-600">
                          ${Number(product.wholesale_price).toFixed(2)} (批发)
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? 'text-red-500' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {product.is_active ? (
                        <Badge className="bg-green-500">上架</Badge>
                      ) : (
                        <Badge variant="secondary">下架</Badge>
                      )}
                      {product.is_wholesale && (
                        <Badge className="bg-blue-500">批发</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.sales_count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="编辑">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="删除">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
