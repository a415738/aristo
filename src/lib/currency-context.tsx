'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currencies, formatPrice, CurrencyConfig } from './currency';

interface CurrencyContextType {
  currentCurrency: CurrencyConfig;
  setCurrentCurrency: (code: string) => void;
  format: (priceInUSD: number) => string;
  currencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'aristo_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyConfig>(currencies[0]);

  // 从localStorage恢复货币选择
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const config = currencies.find(c => c.code === saved);
        if (config) {
          setCurrentCurrencyState(config);
        }
      }
    }
  }, []);

  const setCurrentCurrency = (code: string) => {
    const config = currencies.find(c => c.code === code);
    if (config) {
      setCurrentCurrencyState(config);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, code);
      }
    }
  };

  const format = (priceInUSD: number): string => {
    return formatPrice(priceInUSD, currentCurrency.code);
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currentCurrency, 
        setCurrentCurrency, 
        format,
        currencies: currencies.filter(c => c.enabled)
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
