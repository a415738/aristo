'use client';

import { useTranslation } from '@/lib/i18n';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrandCarouselSection } from '@/components/home/BrandCarouselSection';
import { ProductSection } from '@/components/home/ProductSection';

interface HomeContentProps {
  banners: any[];
  hotProducts: any[];
  newProducts: any[];
  carouselBrands: any[];
}

export function HomeContent({ banners, hotProducts, newProducts, carouselBrands }: HomeContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <HeroBanner banners={banners} />
      {carouselBrands.length > 0 && <BrandCarouselSection brands={carouselBrands} />}
      <ProductSection title={t.home.hotProducts} products={hotProducts} />
      <ProductSection title={t.home.newArrivals} products={newProducts} />
    </>
  );
}
