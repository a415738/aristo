import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrandCarouselSection } from '@/components/home/BrandCarouselSection';
import { ProductSection } from '@/components/home/ProductSection';

export const dynamic = 'force-dynamic';

async function getBanners() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .eq('position', 'home')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

async function getHotProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo)')
    .eq('is_active', true)
    .order('sales_count', { ascending: false })
    .limit(8);
  
  if (error) throw error;
  return data || [];
}

async function getNewProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);
  
  if (error) throw error;
  return data || [];
}

async function getCarouselBrands() {
  // 获取首页轮播展示的品牌（is_featured = true）
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    // 如果 is_featured 字段不存在，返回空数组
    console.error('Failed to fetch carousel brands:', error);
    return [];
  }
  
  return data || [];
}

export default async function HomePage() {
  const [banners, hotProducts, newProducts, carouselBrands] = await Promise.all([
    getBanners(),
    getHotProducts(),
    getNewProducts(),
    getCarouselBrands(),
  ]);

  return (
    <Layout>
      <HeroBanner banners={banners} />
      {carouselBrands.length > 0 && <BrandCarouselSection brands={carouselBrands} />}
      <ProductSection title="热销爆款" products={hotProducts} />
      <ProductSection title="新品上市" products={newProducts} />
    </Layout>
  );
}
