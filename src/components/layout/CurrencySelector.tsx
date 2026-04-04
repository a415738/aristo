'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/lib/currency-context';
import { currencyFlags } from '@/lib/currency';
import { ChevronDown, Check } from 'lucide-react';

export function CurrencySelector() {
  const { currentCurrency, setCurrentCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-sm font-medium"
      >
        <span>{currencyFlags[currentCurrency.code]}</span>
        <span>{currentCurrency.code}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setCurrentCurrency(currency.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                currentCurrency.code === currency.code ? 'bg-primary/5 text-primary' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{currencyFlags[currency.code]}</span>
                <span className="font-medium">{currency.code}</span>
                <span className="text-neutral-400 text-xs">{currency.symbol}</span>
              </div>
              {currentCurrency.code === currency.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
