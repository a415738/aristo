'use client';

import { useState, useEffect } from 'react';

interface IpLanguageResult {
  language: string;
  country: string | null;
  detected: boolean;
}

const DETECTION_KEY = 'aristo_ip_language_detected';

/**
 * Hook to detect user's preferred language based on IP
 * Only runs once on first visit
 */
export function useIpLanguageDetection() {
  const [result, setResult] = useState<IpLanguageResult>({
    language: 'en',
    country: null,
    detected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectLanguage() {
      // Skip if already detected or user has manually selected a language
      if (localStorage.getItem('locale')) {
        setLoading(false);
        return;
      }

      // Skip if already attempted detection
      if (localStorage.getItem(DETECTION_KEY)) {
        const detectedLang = localStorage.getItem(DETECTION_KEY);
        if (detectedLang) {
          setResult({
            language: detectedLang,
            country: null,
            detected: true,
          });
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/ip-language');
        if (response.ok) {
          const data = await response.json();
          const detectedLang = data.language || 'en';

          // Save detection result to prevent re-detection
          localStorage.setItem(DETECTION_KEY, detectedLang);

          setResult({
            language: detectedLang,
            country: data.country,
            detected: true,
          });
        }
      } catch (error) {
        console.error('IP language detection failed:', error);
        // Fallback to English
        localStorage.setItem(DETECTION_KEY, 'en');
      }

      setLoading(false);
    }

    detectLanguage();
  }, []);

  return { ...result, loading };
}
