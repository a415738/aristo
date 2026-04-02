'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, Plus, Loader2, Trash2 
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
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
    specs: { name: string; value: string }[] | null;
    tags: string[] | null;
    product_images: { image: string }[];
    product_variants: { name: string; sku: string | null; price: string; stock: number }[];
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
  specs: { name: string; value: string }[];
  tags: string[];
  variants: { name: string; sku: string; price: string; stock: number }[];
  is_active: boolean;
}

// 分类属性模板
const categorySpecTemplates: Record<string, { name: string; value: string }[]> = {
  'skin-care': [
    { name: '适用肤质', value: '' },
    { name: '产品功效', value: '' },
    { name: '规格', value: '' },
    { name: '保质期', value: '' },
    { name: '产地', value: '' },
  ],
  'makeup': [
    { name: '适用肤质', value: '' },
    { name: '色号', value: '' },
    { name: '妆效', value: '' },
    { name: '规格', value: '' },
    { name: '保质期', value: '' },
  ],
  'base-makeup': [
    { name: '适用肤质', value: '' },
    { name: '色号', value: '' },
    { name: '遮瑕度', value: '' },
    { name: '妆效', value: '' },
    { name: 'SPF值', value: '' },
    { name: '规格', value: '' },
  ],
  'lips': [
    { name: '质地', value: '' },
    { name: '色号', value: '' },
    { name: '妆效', value: '' },
    { name: '规格', value: '' },
    { name: '保质期', value: '' },
  ],
  'eyes': [
    { name: '质地', value: '' },
    { name: '色号', value: '' },
    { name: '妆效', value: '' },
    { name: '规格', value: '' },
    { name: '防水', value: '' },
  ],
  'fragrance': [
    { name: '香调', value: '' },
    { name: '浓度', value: '' },
    { name: '规格', value: '' },
    { name: '适用性别', value: '' },
    { name: '保质期', value: '' },
  ],
  'body-care': [
    { name: '适用肤质', value: '' },
    { name: '产品功效', value: '' },
    { name: '规格', value: '' },
    { name: '香型', value: '' },
    { name: '保质期', value: '' },
  ],
  'hair-care': [
    { name: '适用发质', value: '' },
    { name: '产品功效', value: '' },
    { name: '规格', value: '' },
    { name: '保质期', value: '' },
  ],
  'beauty-tools': [
    { name: '材质', value: '' },
    { name: '用途', value: '' },
    { name: '规格', value: '' },
    { name: '产地', value: '' },
  ],
  'gift-sets': [
    { name: '套装内容', value: '' },
    { name: '适用对象', value: '' },
    { name: '规格', value: '' },
    { name: '产地', value: '' },
  ],
};

export function ProductForm({ product, categories, brands, onSave, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  
  // 基础信息
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(
    product ? [product.main_image, ...product.product_images.map(img => img.image)] : []
  );
  const [retailPrice, setRetailPrice] = useState(product?.retail_price || '');
  const [stock, setStock] = useState(product?.stock || 0);
  const [sku, setSku] = useState(product?.sku || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [brandId, setBrandId] = useState(product?.brand_id || '');
  
  // 商品属性
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>(product?.specs || []);
  
  // 标签
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  // 规格变体
  const [variants, setVariants] = useState<{ name: string; sku: string; price: string; stock: number }[]>(
    product?.product_variants?.map(v => ({
      name: v.name,
      sku: v.sku || '',
      price: v.price,
      stock: v.stock
    })) || []
  );

  // 自动生成slug
  useEffect(() => {
    if (name && !product) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, product]);

  const handleSubmit = async () => {
    // 验证
    if (!name.trim()) {
      alert('请输入商品名称');
      return;
    }
    if (images.length === 0) {
      alert('请至少上传1张商品图片');
      return;
    }
    if (!retailPrice || Number(retailPrice) <= 0) {
      alert('请输入有效的商品价格');
      return;
    }
    if (!categoryId) {
      alert('请选择商品分类');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description,
        images,
        retail_price: retailPrice,
        stock,
        sku,
        category_id: categoryId,
        brand_id: brandId,
        specs: specs.filter(s => s.name && s.value),
        tags,
        variants,
        is_active: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 添加属性
  const addSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  // 更新属性
  const updateSpec = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  // 删除属性
  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 删除标签
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 添加规格变体
  const addVariant = () => {
    setVariants([...variants, { name: '', sku: '', price: retailPrice, stock: 0 }]);
  };

  // 更新规格变体
  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  // 删除规格变体
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // 加载分类属性模板
  const loadCategoryTemplate = () => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const categorySlug = category.name.toLowerCase().replace(/ /g, '-');
      const template = categorySpecTemplates[categorySlug] || categorySpecTemplates[category.name.toLowerCase() as keyof typeof categorySpecTemplates];
      if (template) {
        setSpecs(template);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">商品名称 <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入商品名称"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL别名</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="自动生成或手动输入"
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU编码</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="商品SKU编码"
            />
          </div>

          <div>
            <Label htmlFor="category">分类 <span className="text-red-500">*</span></Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="">请选择分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="brand">品牌</Label>
            <select
              id="brand"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="">请选择品牌</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="price">零售价 <span className="text-red-500">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="stock">库存数量</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">商品描述</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg min-h-[80px] resize-none"
              placeholder="请输入商品描述"
            />
          </div>

          {/* 标签 */}
          <div className="col-span-2">
            <Label>商品标签</Label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="输入标签"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                添加
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 商品图片 */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-neutral-900">商品图片</h3>
        <div className="space-y-4">
          <Label>商品图片 <span className="text-red-500">*</span>（最多12张，第一张为主图）</Label>
          <ImageUploader
            images={images}
            onChange={setImages}
            maxImages={12}
          />
        </div>
      </div>

      {/* 商品属性 */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">商品属性</h3>
          <div className="flex gap-2">
            {categoryId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadCategoryTemplate}
              >
                加载属性模板
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpec}
            >
              <Plus className="h-4 w-4 mr-1" />
              添加属性
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-3 items-start">
              <Input
                value={spec.name}
                onChange={(e) => updateSpec(index, 'name', e.target.value)}
                placeholder="属性名称"
                className="w-40"
              />
              <Input
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                placeholder="属性值"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpec(index)}
                className="text-neutral-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
            
          {specs.length === 0 && (
            <div className="text-center py-4 text-neutral-500">
              <p>暂无商品属性</p>
              <p className="text-sm">点击"加载属性模板"自动填充或手动添加</p>
            </div>
          )}
        </div>
      </div>

      {/* 规格变体 */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">规格变体</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
          >
            <Plus className="h-4 w-4 mr-1" />
            添加规格
          </Button>
        </div>

        {variants.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">规格名称</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">SKU</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">价格</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">库存</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((variant, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        placeholder="如：红色"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder="SKU"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {variants.length === 0 && (
          <div className="text-center py-4 text-neutral-500">
            <p>暂无规格变体</p>
            <p className="text-sm">如商品有多种规格（如颜色、尺寸），可在此添加</p>
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-neutral-900 hover:bg-neutral-800"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            '保存商品'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
      </div>
    </div>
  );
}
