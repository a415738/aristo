import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { brandId, isActive } = await request.json();

    if (!brandId) {
      return NextResponse.json({ error: '缺少品牌ID' }, { status: 400 });
    }

    const client = getSupabaseClient();
    const { error } = await client
      .from('brands')
      .update({ is_active: isActive })
      .eq('id', brandId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update brand active status:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
