import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取所有分类
export async function GET() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, is_active, sort_order } = body;

    if (!name) {
      return NextResponse.json({ error: '分类名称不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查slug是否已存在
    if (slug) {
      const { data: existing } = await client
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (existing) {
        return NextResponse.json({ error: '该slug已存在' }, { status: 400 });
      }
    }

    // 获取最大排序值
    const { data: maxOrder } = await client
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    // 插入分类
    const { data, error } = await client
      .from('categories')
      .insert({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description: description || null,
        icon: icon || null,
        is_active: is_active !== false,
        sort_order: sort_order ?? (maxOrder?.sort_order ?? 0) + 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert category error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
  }
}

// 更新分类
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, icon, is_active, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: '分类ID不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查slug是否被其他分类使用
    if (slug) {
      const { data: existing } = await client
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();
      
      if (existing) {
        return NextResponse.json({ error: '该slug已被其他分类使用' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data, error } = await client
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update category error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: '更新分类失败' }, { status: 500 });
  }
}

// 删除分类
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '分类ID不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查是否有商品使用该分类
    const { data: products } = await client
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json({ error: '该分类下有商品，无法删除' }, { status: 400 });
    }

    const { error } = await client
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete category error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 });
  }
}
