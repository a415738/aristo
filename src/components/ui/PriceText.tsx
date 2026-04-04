'use client';

import { useCurrency } from '@/lib/currency-context';
import { getCurrencyConfig } from '@/lib/currency';

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
  const { format, currentCurrency } = useCurrency();
  
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  const config = getCurrencyConfig(currentCurrency.code);
  const convertedPrice = priceNum * (config?.rate || 1);

  const formatNumber = (num: number) => {
    if (currentCurrency.code === 'VND' || currentCurrency.code === 'IDR') {
      return Math.round(num).toLocaleString();
    }
    return num.toFixed(2);
  };

  if (showOriginal && originalPrice) {
    const originalNum = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
    const originalConverted = originalNum * (config?.rate || 1);
    return (
      <div className={`flex items-baseline gap-2 ${className}`}>
        <div className="flex items-baseline">
          <span className={`font-bold text-primary ${sizeClasses[size]}`}>
            {config?.symbol || '$'}{formatNumber(convertedPrice)}
          </span>
          <span className="text-xs text-neutral-400 ml-1">{currentCurrency.code}</span>
        </div>
        <span className="text-sm text-neutral-400 line-through flex items-baseline">
          {config?.symbol || '$'}{formatNumber(originalConverted)}
          <span className="text-xs ml-1">{currentCurrency.code}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className={`font-bold text-primary ${sizeClasses[size]}`}>
        {config?.symbol || '$'}{formatNumber(convertedPrice)}
      </span>
      <span className="text-xs text-neutral-400 ml-1">{currentCurrency.code}</span>
    </div>
  );
}
