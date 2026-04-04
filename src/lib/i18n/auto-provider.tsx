'use client';

import { useState, useEffect, ReactNode } from 'react';
import { I18nProvider } from './index';
import { useIpLanguageDetection } from '@/lib/use-ip-language-detection';

interface AutoI18nProviderProps {
  children: ReactNode;
}

/**
 * Auto Language Detection Provider
 * Automatically detects user's preferred language based on IP on first visit
 * Priority: User saved preference > IP detected > Default (English)
 */
export function AutoI18nProvider({ children }: AutoI18nProviderProps) {
  const { language: detectedLanguage, loading } = useIpLanguageDetection();
  const [initialLocale, setInitialLocale] = useState<string>('en');

  useEffect(() => {
    if (!loading && detectedLanguage) {
      setInitialLocale(detectedLanguage);
    }
  }, [loading, detectedLanguage]);

  // Show loading state while detecting language
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fafafa'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTopColor: '#000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <I18nProvider defaultLocale={initialLocale}>
      {children}
    </I18nProvider>
  );
}
