import { getSupabaseClient } from '@/storage/database/supabase-client';
import { Layout } from '@/components/layout/Layout';
import { HomeContent } from '@/components/home/HomeContent';

export const dynamic = 'force-dynamic';

async function getBanners() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('banners')
    .select('*')
    .eq('is_active', true)
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
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
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
      <HomeContent 
        banners={banners} 
        hotProducts={hotProducts} 
        newProducts={newProducts} 
        carouselBrands={carouselBrands} 
      />
    </Layout>
  );
}
