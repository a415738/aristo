'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, Plus, Loader2, Trash2, Edit2
} from 'lucide-react';
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
  brand_name?: string; // 新品牌名称
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

// 从商品名称中提取纯产品名称（去除品牌前缀）
function extractProductName(fullName: string, brandName?: string): string {
  if (!brandName) return fullName;
  // 尝试移除品牌名称前缀
  const patterns = [
    new RegExp(`^${brandName}[\\s-]+(.+)$`, 'i'),
    new RegExp(`^${brandName}(.+)$`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = fullName.match(pattern);
    if (match) return match[1].trim();
  }
  return fullName;
}

export function ProductForm({ product, categories, brands, onSave, onCancel }: ProductFormProps) {
  const t = adminTranslations;
  const [loading, setLoading] = useState(false);
  
  // 基础信息
  const [productName, setProductName] = useState(() => {
    if (product?.name && product?.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      return extractProductName(product.name, brand?.name);
    }
    return product?.name || '';
  });
  
  // 显示的完整名称（品牌 + 产品名）
  const [name, setName] = useState(() => {
    if (product?.name && product?.brand_id) {
      return product.name;
    }
    return product?.name || '';
  });
  
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [images, setImages] = useState<string[]>(
    product ? [product.main_image, ...(product.product_images?.map(img => img.image) || [])] : []
  );
  const [retailPrice, setRetailPrice] = useState(product?.retail_price || '');
  const [stock, setStock] = useState(product?.stock || 0);
  const [sku, setSku] = useState(product?.sku || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [brandId, setBrandId] = useState(product?.brand_id || '');
  const [newBrandName, setNewBrandName] = useState('');
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  
  // 获取当前选择的品牌名称
  const selectedBrand = brands.find(b => b.id === brandId);
  const isCustomNewBrand = brandId === '__new_brand__';
  
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

  // 当品牌或产品名称改变时，更新完整名称
  useEffect(() => {
    if (selectedBrand && productName) {
      setName(`${selectedBrand.name} ${productName}`);
    } else if (productName) {
      setName(productName);
    } else {
      setName('');
    }
  }, [selectedBrand, productName]);

  // 当选择品牌时，如果产品名称为空，自动focus
  useEffect(() => {
    if (brandId && !productName && !product) {
      // 新建商品且选择了品牌，productName为空时不做特殊处理
    }
  }, [brandId, productName, product]);

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

  // 当编辑已有商品且切换品牌时
  const handleBrandChange = (newBrandId: string) => {
    setBrandId(newBrandId);
    // 如果是编辑模式且切换了品牌，需要重新提取产品名称
    if (product && product.name) {
      const oldBrand = brands.find(b => b.id === product.brand_id);
      const newBrand = brands.find(b => b.id === newBrandId);
      // 从原完整名称中提取纯产品名（基于旧品牌）
      const extractedName = extractProductName(product.name, oldBrand?.name);
      setProductName(extractedName);
      // 新名称会在 useEffect 中自动计算
    }
  };

  const handleSubmit = async () => {
    // 验证
    if (!productName.trim()) {
      alert('请填写商品名称');
      return;
    }
    if (images.length === 0) {
      alert(t.productForm.images + ' ' + t.common.required);
      return;
    }
    if (!retailPrice || Number(retailPrice) <= 0) {
      alert(t.productForm.price + ' ' + t.common.required);
      return;
    }
    if (!categoryId) {
      alert(t.productForm.category + ' ' + t.common.required);
      return;
    }
    
    // 验证品牌
    if (isCustomNewBrand && !newBrandName.trim()) {
      alert('请输入新品牌名称');
      return;
    }

    setLoading(true);
    try {
      // 保存时使用拼接后的完整名称
      // 如果是新品牌，使用新品牌名称；否则使用选中的品牌
      const finalBrandName = isCustomNewBrand ? newBrandName : (selectedBrand?.name || '');
      const finalName = finalBrandName ? `${finalBrandName} ${productName}` : productName;
      
      await onSave({
        name: finalName, // 完整名称：品牌 + 产品名
        slug: slug || finalName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description,
        images,
        retail_price: retailPrice,
        stock,
        sku,
        category_id: categoryId,
        brand_id: isCustomNewBrand ? '__new_brand__' : brandId,
        brand_name: isCustomNewBrand ? newBrandName : undefined, // 新品牌名称
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
        <h3 className="text-lg font-semibold text-neutral-900">{t.productForm.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* 品牌选择 - 放在最前面 */}
          <div className="col-span-2">
            <Label>{t.productForm.brand} <span className="text-red-500">*</span></Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  id="brand"
                  value={brandId}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '__add_new__') {
                      setShowNewBrandInput(true);
                      setBrandId('__new_brand__');
                    } else {
                      setShowNewBrandInput(false);
                      handleBrandChange(value);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg bg-white"
                >
                  <option value="">请选择品牌</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                  <option value="__add_new__">+ 添加新品牌</option>
                </select>
                {brandId && brandId !== '__new_brand__' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewBrandInput(true);
                      setBrandId('__new_brand__');
                    }}
                    className="px-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* 新品牌输入框 */}
              {showNewBrandInput && (
                <div className="flex gap-2 items-start">
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="请输入新品牌名称"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewBrandInput(false);
                      setBrandId('');
                      setNewBrandName('');
                    }}
                  >
                    取消
                  </Button>
                </div>
              )}
              
              {/* 显示当前新品牌名称预览 */}
              {isCustomNewBrand && newBrandName && (
                <p className="text-sm text-neutral-500">
                  品牌将显示为：<span className="font-medium text-neutral-700">{newBrandName}</span>
                </p>
              )}
            </div>
          </div>

          {/* 商品名称 */}
          <div className="col-span-2">
            <Label htmlFor="name">
              {t.productForm.name} <span className="text-red-500">*</span>
              {(selectedBrand || (isCustomNewBrand && newBrandName)) && (
                <span className="text-sm text-neutral-500 font-normal ml-2">
                  （将显示为：{isCustomNewBrand ? newBrandName : selectedBrand?.name} {productName || 'xxx'}）
                </span>
              )}
            </Label>
            <div className="relative">
              {(selectedBrand || (isCustomNewBrand && newBrandName)) && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                  {isCustomNewBrand ? newBrandName : selectedBrand?.name}
                </span>
              )}
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={selectedBrand ? "请输入产品名称" : "请先选择品牌"}
                disabled={!brandId}
                className={selectedBrand ? "pl-24" : ""}
              />
            </div>
            {/* 预览完整名称 */}
            {productName && (selectedBrand || (isCustomNewBrand && newBrandName)) && (
              <p className="text-sm text-neutral-500 mt-1">
                完整标题预览：<span className="font-medium text-neutral-700">{name}</span>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">{t.productForm.slug}</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={t.productForm.slug}
            />
          </div>

          <div>
            <Label htmlFor="sku">{t.productForm.sku}</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder={t.productForm.sku}
            />
          </div>

          <div>
            <Label htmlFor="category">{t.productForm.category} <span className="text-red-500">*</span></Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white"
            >
              <option value="">{t.productForm.category}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="price">{t.productForm.retailPrice} <span className="text-red-500">*</span> <span className="text-xs font-normal text-neutral-500">(USD 美元)</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                placeholder="0.00"
                className="pl-7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">USD</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">请填写美元价格，系统会自动按汇率转换显示</p>
          </div>

          <div>
            <Label htmlFor="stock">{t.productForm.stock}</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">{t.productForm.description}</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg min-h-[80px] resize-none"
              placeholder={t.productForm.description}
            />
          </div>

          {/* 标签 */}
          <div className="col-span-2">
            <Label>{t.productForm.tags}</Label>
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
                placeholder={t.productForm.tags}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                {t.common.add}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 商品图片 */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-neutral-900">{t.productForm.images}</h3>
        <div className="space-y-4">
          <Label>{t.productForm.images} <span className="text-red-500">*</span>（{t.productForm.maxImages}）</Label>
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
          <h3 className="text-lg font-semibold text-neutral-900">{t.productForm.specs}</h3>
          <div className="flex gap-2">
            {categoryId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadCategoryTemplate}
              >
                {t.productForm.loadTemplate}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpec}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t.productForm.addSpec}
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-3 items-start">
              <Input
                value={spec.name}
                onChange={(e) => updateSpec(index, 'name', e.target.value)}
                placeholder={t.productForm.specName}
                className="w-40"
              />
              <Input
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                placeholder={t.productForm.specValue}
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
              <p>{t.productForm.noSpecs}</p>
            </div>
          )}
        </div>
      </div>

      {/* 规格变体 */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">{t.productForm.variants}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t.productForm.addVariant}
          </Button>
        </div>

        {variants.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">{t.productForm.variantName}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">{t.productForm.sku}</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">{t.productForm.variantPrice} (USD)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-neutral-600">{t.productForm.variantStock}</th>
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
                        placeholder={t.productForm.variantName}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder={t.productForm.sku}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          placeholder="0.00"
                          className="pl-6 pr-10"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">USD</span>
                      </div>
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
            <p>{t.productForm.noVariants}</p>
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
              {t.common.loading}
            </>
          ) : (
            t.productForm.save
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {t.productForm.cancel}
        </Button>
      </div>
    </div>
  );
}
