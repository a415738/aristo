import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { QuickLinks } from '@/components/home/QuickLinks';
import { FeaturedBrandsSection } from '@/components/home/FeaturedBrandsSection';
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

async function getFeaturedBrands() {
  // 首页品牌专区展示的品牌
  const featuredNames = [
    'Chanel',
    'Guerlain',
    "L'Oréal",
    'Lancôme',
    'SK-II',
    'Clarins',
    'Natural 堂',
    'Yves Saint Laurent',
    'Bulgari',
    'Gucci',
  ];
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .in('name', featuredNames);
  
  if (error) throw error;
  
  // 按指定顺序排序
  const sorted = (data || []).sort((a, b) => {
    const indexA = featuredNames.indexOf(a.name);
    const indexB = featuredNames.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });
  
  return sorted;
}

export default async function HomePage() {
  const [banners, hotProducts, newProducts, featuredBrands] = await Promise.all([
    getBanners(),
    getHotProducts(),
    getNewProducts(),
    getFeaturedBrands(),
  ]);

  return (
    <Layout>
      <HeroBanner banners={banners} />
      <QuickLinks />
      <FeaturedBrandsSection brands={featuredBrands} />
      <ProductSection title="热销爆款" products={hotProducts} />
      <ProductSection title="新品上市" products={newProducts} />
    </Layout>
  );
}
