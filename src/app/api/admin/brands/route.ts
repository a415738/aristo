import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get brands error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Get brands error:', error);
    return NextResponse.json({ error: '获取品牌列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, logo, banner, is_active, is_featured, country } = body;

    if (!name) {
      return NextResponse.json({ error: '品牌名称不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查slug是否已存在
    const slugValue = slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
    const { data: existing } = await client
      .from('brands')
      .select('id')
      .eq('slug', slugValue)
      .single();
    
    if (existing) {
      return NextResponse.json({ error: '该slug已存在' }, { status: 400 });
    }

    // 插入品牌
    const { data, error } = await client
      .from('brands')
      .insert({
        name,
        slug: slugValue,
        description: description || null,
        logo: logo || null,
        banner: banner || null,
        country: country || null,
        is_featured: is_featured || false,
        is_active: is_active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert brand error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json({ error: '创建品牌失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '品牌ID不能为空' }, { status: 400 });
    }

    const body = await request.json();
    const { name, slug, description, logo, banner, is_active, is_featured, country } = body;

    if (!name) {
      return NextResponse.json({ error: '品牌名称不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查slug是否被其他品牌使用
    if (slug) {
      const { data: existing } = await client
        .from('brands')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();
      
      if (existing) {
        return NextResponse.json({ error: '该slug已被其他品牌使用' }, { status: 400 });
      }
    }

    // 更新品牌
    const { data, error } = await client
      .from('brands')
      .update({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description: description || null,
        logo: logo || null,
        banner: banner || null,
        country: country || null,
        is_featured: is_featured || false,
        is_active: is_active !== false,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update brand error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update brand error:', error);
    return NextResponse.json({ error: '更新品牌失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '品牌ID不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    const { error } = await client
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete brand error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json({ error: '删除品牌失败' }, { status: 500 });
  }
}
