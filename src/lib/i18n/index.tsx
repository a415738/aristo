'use client';

// i18n - Internationalization system
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, Translations } from './en';
import { zh } from './zh';
import { th } from './th';
import { vi } from './vi';
import { id } from './id';
import { ms } from './ms';

// Language definitions
export const languages = [
  { code: 'zh', name: '简体中文', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
];

// Translation maps
const translations: Record<string, Translations> = {
  zh,
  en,
  th,
  vi,
  id,
  ms,
};

// Context
interface I18nContextType {
  locale: string;
  t: Translations;
  setLocale: (locale: string) => void;
  languages: typeof languages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: string;
}

export function I18nProvider({ children, defaultLocale = 'zh' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState(defaultLocale);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale');
      if (saved && translations[saved]) {
        setLocaleState(saved);
      }
    }
  }, []);

  const setLocale = (newLocale: string) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
      }
    }
  };

  const t = translations[locale] || translations['en'];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      locale: 'zh',
      t: translations['zh'],
      setLocale: () => {},
      languages,
    };
  }
  return context;
}
