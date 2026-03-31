import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { QuickLinks } from '@/components/home/QuickLinks';
import { PromotionSection } from '@/components/home/PromotionSection';
import { ProductSection } from '@/components/home/ProductSection';
import { BrandSection } from '@/components/home/BrandSection';
import { WholesaleSection } from '@/components/home/WholesaleSection';

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

async function getBrands() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(12);
  
  if (error) throw error;
  return data || [];
}

async function getWholesaleProducts() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name), brands(name, logo)')
    .eq('is_active', true)
    .eq('is_wholesale', true)
    .limit(4);
  
  if (error) throw error;
  return data || [];
}

export default async function HomePage() {
  const [banners, hotProducts, newProducts, brands, wholesaleProducts] = await Promise.all([
    getBanners(),
    getHotProducts(),
    getNewProducts(),
    getBrands(),
    getWholesaleProducts(),
  ]);

  return (
    <Layout>
      <HeroBanner banners={banners} />
      <QuickLinks />
      <PromotionSection />
      <ProductSection title="热销爆款" products={hotProducts} />
      <ProductSection title="新品上市" products={newProducts} />
      <BrandSection brands={brands} />
      <WholesaleSection products={wholesaleProducts} />
    </Layout>
  );
}
