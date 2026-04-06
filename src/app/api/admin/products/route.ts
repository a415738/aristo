import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const client = getSupabaseClient();
  const { data, error } = await client.from('products').select('*, categories(name), brands(name)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, slug, description, category_id, brand_id, main_image, retail_price, stock, sku, tags, is_active } = body;
  
  const client = getSupabaseClient();
  const { data, error } = await client.from('products').insert({
    id: uuidv4(),
    name,
    slug,
    description,
    category_id,
    brand_id,
    main_image,
    retail_price,
    stock,
    sku,
    tags,
    is_active: is_active ?? true,
  }).select().single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, slug, description, category_id, brand_id, main_image, retail_price, stock, sku, tags, is_active } = body;
  
  const client = getSupabaseClient();
  const { data, error } = await client.from('products').update({
    name,
    slug,
    description,
    category_id,
    brand_id,
    main_image,
    retail_price,
    stock,
    sku,
    tags,
    is_active,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  
  const client = getSupabaseClient();
  const { error } = await client.from('products').delete().eq('id', id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
