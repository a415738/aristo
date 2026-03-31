import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { brandId, name, logo, country, description, sort_order } = await request.json();

    if (!brandId) {
      return NextResponse.json({ error: '缺少品牌ID' }, { status: 400 });
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('brands')
      .update({ 
        name, 
        logo, 
        country, 
        description,
        sort_order 
      })
      .eq('id', brandId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update brand:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
