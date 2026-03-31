import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// 生成slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
}

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = getSupabaseClient();

    const {
      name,
      slug,
      description,
      images,
      retail_price,
      stock,
      sku,
      category_id,
      brand_id,
      specs,
      tags,
      variants,
      is_active,
    } = body;

    // 验证必填字段
    if (!name || !images || images.length < 6 || !retail_price || !category_id) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    const productId = uuidv4();
    const productSlug = slug || generateSlug(name);
    const mainImage = images[0];

    // 创建商品
    const { error: productError } = await client
      .from('products')
      .insert({
        id: productId,
        name,
        slug: productSlug,
        description,
        main_image: mainImage,
        retail_price: retail_price.toString(),
        stock: stock || 0,
        sku: sku || null,
        category_id,
        brand_id: brand_id || null,
        specs: specs && specs.length > 0 ? specs : null,
        tags: tags && tags.length > 0 ? tags : null,
        is_active: is_active !== false,
        sales_count: 0,
      });

    if (productError) {
      console.error('Product insert error:', productError);
      return NextResponse.json(
        { error: '创建商品失败' },
        { status: 500 }
      );
    }

    // 插入商品图片
    if (images.length > 1) {
      const imageRecords = images.slice(1).map((image: string, index: number) => ({
        id: uuidv4(),
        product_id: productId,
        image,
        sort_order: index + 1,
      }));

      const { error: imagesError } = await client
        .from('product_images')
        .insert(imageRecords);

      if (imagesError) {
        console.error('Images insert error:', imagesError);
      }
    }

    // 插入规格变体
    if (variants && variants.length > 0) {
      const variantRecords = variants.map((variant: { name: string; sku: string; price: string; stock: number }) => ({
        id: uuidv4(),
        product_id: productId,
        name: variant.name,
        sku: variant.sku || null,
        price: variant.price.toString(),
        stock: variant.stock || 0,
      }));

      const { error: variantsError } = await client
        .from('product_variants')
        .insert(variantRecords);

      if (variantsError) {
        console.error('Variants insert error:', variantsError);
      }
    }

    return NextResponse.json({
      success: true,
      product_id: productId,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新商品
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const client = getSupabaseClient();

    const {
      id,
      name,
      slug,
      description,
      images,
      retail_price,
      stock,
      sku,
      category_id,
      brand_id,
      specs,
      tags,
      variants,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: '商品ID不能为空' },
        { status: 400 }
      );
    }

    const mainImage = images[0];

    // 更新商品
    const { error: productError } = await client
      .from('products')
      .update({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description,
        main_image: mainImage,
        retail_price: retail_price.toString(),
        stock: stock || 0,
        sku: sku || null,
        category_id,
        brand_id: brand_id || null,
        specs: specs && specs.length > 0 ? specs : null,
        tags: tags && tags.length > 0 ? tags : null,
        is_active: is_active !== false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (productError) {
      console.error('Product update error:', productError);
      return NextResponse.json(
        { error: '更新商品失败' },
        { status: 500 }
      );
    }

    // 删除旧图片
    await client.from('product_images').delete().eq('product_id', id);

    // 插入新图片
    if (images.length > 1) {
      const imageRecords = images.slice(1).map((image: string, index: number) => ({
        id: uuidv4(),
        product_id: id,
        image,
        sort_order: index + 1,
      }));

      await client.from('product_images').insert(imageRecords);
    }

    // 删除旧变体
    await client.from('product_variants').delete().eq('product_id', id);

    // 插入新变体
    if (variants && variants.length > 0) {
      const variantRecords = variants.map((variant: { name: string; sku: string; price: string; stock: number }) => ({
        id: uuidv4(),
        product_id: id,
        name: variant.name,
        sku: variant.sku || null,
        price: variant.price.toString(),
        stock: variant.stock || 0,
      }));

      await client.from('product_variants').insert(variantRecords);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除商品
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '商品ID不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 删除商品图片
    await client.from('product_images').delete().eq('product_id', id);
    
    // 删除商品变体
    await client.from('product_variants').delete().eq('product_id', id);
    
    // 删除商品
    const { error } = await client.from('products').delete().eq('id', id);

    if (error) {
      console.error('Delete product error:', error);
      return NextResponse.json(
        { error: '删除商品失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
