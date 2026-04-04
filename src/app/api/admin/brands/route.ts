import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, logo, banner, is_active } = body;

    if (!name) {
      return NextResponse.json({ error: '品牌名称不能为空' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 检查slug是否已存在
    if (slug) {
      const { data: existing } = await client
        .from('brands')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (existing) {
        return NextResponse.json({ error: '该slug已存在' }, { status: 400 });
      }
    }

    // 插入品牌
    const { data, error } = await client
      .from('brands')
      .insert({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'),
        description: description || null,
        logo: logo || null,
        banner: banner || null,
        is_featured: false,
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
