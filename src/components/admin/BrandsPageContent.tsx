'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { adminTranslations } from '@/lib/admin-translations';
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogoUploader, BannerUploader } from './BrandImageUploader';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  country: string | null;
}

export function BrandsPageContent() {
  const t = adminTranslations;
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
    banner: '',
    country: '',
    is_active: true,
    is_featured: false,
  });

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo: '',
      banner: '',
      country: '',
      is_active: true,
      is_featured: false,
    });
    setEditingBrand(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logo: brand.logo || '',
      banner: brand.banner || '',
      country: brand.country || '',
      is_active: brand.is_active,
      is_featured: brand.is_featured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert('请输入品牌名称');
      return;
    }

    const method = editingBrand ? 'PUT' : 'POST';
    const url = editingBrand ? `/api/admin/brands?id=${editingBrand.id}` : '/api/admin/brands';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchBrands();
        setDialogOpen(false);
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || '操作失败');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该品牌？')) return;

    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== id));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除失败');
    }
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t.admin.brands}</h1>
        <p className="text-gray-600 mt-1">管理品牌信息</p>
      </div>

      {/* 操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索品牌..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          添加品牌
        </Button>
      </div>

      {/* 品牌列表 */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>品牌名称</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>国家</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredBrands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  暂无品牌，点击上方按钮添加
                </TableCell>
              </TableRow>
            ) : (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 object-contain rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-gray-500">{brand.slug}</TableCell>
                  <TableCell>{brand.country || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        brand.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {brand.is_active ? '启用' : '禁用'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(brand)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(brand.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBrand ? '编辑品牌' : '添加品牌'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Logo 上传 */}
            <div>
              <LogoUploader
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                label="品牌 Logo *"
              />
            </div>

            {/* Banner 上传 */}
            <BannerUploader
              value={formData.banner}
              onChange={(url) => setFormData({ ...formData, banner: url })}
              label="品牌 Banner（可选）"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>品牌名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：SK-II"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="如：sk-ii（自动生成）"
                />
              </div>
            </div>

            <div>
              <Label>国家/地区</Label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="如：Japan、France、China"
              />
            </div>

            <div>
              <Label>描述</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md min-h-[80px]"
                placeholder="品牌描述..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>启用</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label>推荐品牌</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingBrand ? '保存' : '添加'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
