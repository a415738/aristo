'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Loader2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { adminTranslations } from '@/lib/admin-translations';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Spec {
  name: string;
  value: string;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    main_image: string;
    retail_price: string;
    stock: number;
    sku: string | null;
    category_id: string | null;
    brand_id: string | null;
    specs?: Spec[];
    tags: string[] | null;
    product_images?: { image: string }[];
    product_variants?: { name: string; sku: string | null; price: string; stock: number }[];
  } | null;
  categories: Category[];
  brands: Brand[];
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  images: string[];
  retail_price: string;
  stock: number;
  sku: string;
  category_id: string;
  brand_id: string;
  specs: Spec[];
  tags: string[];
  is_active: boolean;
}

export function ProductForm({ product, categories, brands, onSave, onCancel }: ProductFormProps) {
  const t = adminTranslations;
  const [loading, setLoading] = useState(false);
  
  // 主图
  const [mainImage, setMainImage] = useState(product?.main_image || '');
  
  // 商品名称（自动拼接品牌前缀）
  const [name, setName] = useState(product?.name || '');
  
  // Slug
  const [slug, setSlug] = useState(product?.slug || '');
  
  // 描述
  const [description, setDescription] = useState(product?.description || '');
  
  // 价格和库存
  const [retailPrice, setRetailPrice] = useState(product?.retail_price || '');
  const [stock, setStock] = useState(product?.stock || 0);
  const [sku, setSku] = useState(product?.sku || '');
  
  // 分类和品牌
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [brandId, setBrandId] = useState(product?.brand_id || '');
  
  // 属性列表
  const [specs, setSpecs] = useState<Spec[]>(product?.specs || []);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  
  // 标签
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  const handleBrandChange = (id: string) => {
    setBrandId(id);
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setSelectedBrandName(brand.name);
      // 如果商品名称没有品牌前缀，自动拼接
      if (name && !name.includes(brand.name)) {
        // 不自动修改名称，让用户自己输入
      }
    }
  };

  const handleAddSpec = () => {
    if (newSpecName.trim() && newSpecValue.trim()) {
      setSpecs([...specs, { name: newSpecName.trim(), value: newSpecValue.trim() }]);
      setNewSpecName('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入商品名称');
      return;
    }
    if (!mainImage) {
      alert('请上传商品主图');
      return;
    }
    if (!retailPrice) {
      alert('请输入零售价');
      return;
    }
    if (!categoryId) {
      alert('请选择分类');
      return;
    }
    if (!brandId) {
      alert('请选择品牌');
      return;
    }

    setLoading(true);

    // 自动生成slug
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');

    // 组合完整商品名称（品牌 + 名称）
    const fullName = selectedBrandName && !name.includes(selectedBrandName) 
      ? `${selectedBrandName} ${name}` 
      : name;

    const data: ProductFormData = {
      name: fullName,
      slug: finalSlug,
      description,
      images: mainImage ? [mainImage] : [],
      retail_price: retailPrice,
      stock,
      sku,
      category_id: categoryId,
      brand_id: brandId,
      specs,
      tags,
      is_active: true,
    };

    try {
      await onSave(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 主图上传 */}
      <div>
        <Label className="text-base font-medium">商品主图 *</Label>
        <p className="text-sm text-gray-500 mb-3">第一张图片将作为商品主图，建议尺寸 800×800</p>
        <ImageUploader
          images={mainImage ? [mainImage] : []}
          onChange={(images) => setMainImage(images[0] || '')}
          maxImages={1}
        />
      </div>

      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="font-medium text-base border-b pb-2">基本信息</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>品牌 *</Label>
            <select
              value={brandId}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            >
              <option value="">选择品牌</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>商品名称 *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入商品名称"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>零售价 ($) *</Label>
            <Input
              type="number"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <Label>库存 *</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="0"
              className="mt-1"
            />
          </div>
          <div>
            <Label>SKU</Label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="可选"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>分类 *</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">选择分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>商品描述</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md mt-1 min-h-[100px]"
            placeholder="输入商品描述..."
          />
        </div>
      </div>

      {/* 属性规格 - 小红书风格 */}
      <div className="space-y-4">
        <h3 className="font-medium text-base border-b pb-2">商品属性</h3>
        <p className="text-sm text-gray-500">添加商品规格属性，如功效、适用肤质、保质期等</p>
        
        {/* 已有属性列表 */}
        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group">
              <div className="flex-1 flex items-center gap-3">
                <span className="px-3 py-1.5 bg-white border rounded-full text-sm font-medium text-gray-700">
                  {spec.name}
                </span>
                <span className="text-gray-400">:</span>
                <span className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-sm text-blue-600">
                  {spec.value}
                </span>
              </div>
              <button
                onClick={() => handleRemoveSpec(index)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border hover:bg-red-50 hover:border-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* 添加新属性 */}
        <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-gray-400 transition-colors">
          <Input
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            placeholder="属性名称（如：功效、规格、产地）"
            className="flex-1"
          />
          <span className="text-gray-400">:</span>
          <Input
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            placeholder="属性值（如：保湿、50ml、日本）"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddSpec}
            disabled={!newSpecName.trim() || !newSpecValue.trim()}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>

        {/* 快捷属性 */}
        <div className="text-sm text-gray-500">
          <span>快捷添加：</span>
          {['功效', '规格', '保质期', '适用肤质', '产地'].map(specName => (
            <button
              key={specName}
              onClick={() => !specs.find(s => s.name === specName) && (setNewSpecName(specName), setNewSpecValue(''))}
              className="ml-1 px-2 py-1 text-xs border rounded-full hover:bg-gray-100 disabled:opacity-50"
              disabled={!!specs.find(s => s.name === specName)}
            >
              {specName}
            </button>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="space-y-3">
        <h3 className="font-medium text-base border-b pb-2">商品标签</h3>
        
        {/* 已添加标签 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-full text-sm text-pink-600 group"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-pink-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* 添加标签 */}
        <div className="flex items-center gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="输入标签后按回车添加"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            添加标签
          </Button>
        </div>

        {/* 推荐标签 */}
        <div className="text-sm text-gray-500">
          <span>推荐标签：</span>
          {['热卖', '新品', '爆款', '推荐', '限时优惠'].map(recommendTag => (
            <button
              key={recommendTag}
              onClick={() => !tags.includes(recommendTag) && setTags([...tags, recommendTag])}
              className="ml-1 px-2 py-1 text-xs border rounded-full hover:bg-gray-100 disabled:opacity-50"
              disabled={tags.includes(recommendTag)}
            >
              + {recommendTag}
            </button>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            product ? '保存修改' : '添加商品'
          )}
        </Button>
      </div>
    </div>
  );
}
