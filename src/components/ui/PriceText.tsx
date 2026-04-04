'use client';

import { useCurrency } from '@/lib/currency-context';

interface PriceTextProps {
  price: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOriginal?: boolean;
  originalPrice?: string | number;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
};

export function PriceText({ price, className = '', size = 'md', showOriginal = false, originalPrice }: PriceTextProps) {
  const { format } = useCurrency();
  
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  const formattedPrice = format(priceNum);

  if (showOriginal && originalPrice) {
    const originalNum = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
    return (
      <div className={`flex items-baseline gap-2 ${className}`}>
        <span className={`font-bold text-primary ${sizeClasses[size]}`}>
          {formattedPrice}
        </span>
        <span className="text-sm text-neutral-400 line-through">
          {format(originalNum)}
        </span>
      </div>
    );
  }

  return (
    <span className={`font-bold text-primary ${sizeClasses[size]} ${className}`}>
      {formattedPrice}
    </span>
  );
}
