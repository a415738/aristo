/**
 * IP to Language Mapping Utility
 * Maps country codes to supported languages
 */

// Country code to language code mapping
export const countryToLanguage: Record<string, string> = {
  // Southeast Asia
  TH: 'th', // Thailand
  VN: 'vi', // Vietnam
  ID: 'id', // Indonesia
  MY: 'ms', // Malaysia
  SG: 'en', // Singapore (English)
  PH: 'en', // Philippines (English)
  BN: 'ms', // Brunei
  MM: 'en', // Myanmar (English)
  KH: 'en', // Cambodia (English)
  LA: 'en', // Laos (English)

  // China and Taiwan
  CN: 'zh', // China
  TW: 'zh', // Taiwan
  HK: 'zh', // Hong Kong

  // Asia Pacific
  JP: 'en', // Japan (default to English for beauty content)
  KR: 'en', // South Korea
  AU: 'en', // Australia
  NZ: 'en', // New Zealand
  IN: 'en', // India (English)

  // Americas
  US: 'en', // United States
  CA: 'en', // Canada
  MX: 'en', // Mexico
  BR: 'en', // Brazil (English for international)

  // Europe
  GB: 'en', // United Kingdom
  DE: 'en', // Germany
  FR: 'en', // France
  IT: 'en', // Italy
  ES: 'en', // Spain
  NL: 'en', // Netherlands
  RU: 'en', // Russia

  // Middle East
  AE: 'en', // UAE
  SA: 'en', // Saudi Arabia
  IL: 'en', // Israel

  // Africa
  ZA: 'en', // South Africa
  NG: 'en', // Nigeria
  EG: 'en', // Egypt
};

/**
 * Get language code from country code
 * Falls back to English if country not found
 */
export function getLanguageFromCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return 'en';

  const code = countryCode.toUpperCase();
  return countryToLanguage[code] || 'en';
}

/**
 * Supported language codes
 */
export const supportedLanguages = ['zh', 'en', 'th', 'vi', 'id', 'ms'];

/**
 * Validate if a language code is supported
 */
export function isSupportedLanguage(code: string): boolean {
  return supportedLanguages.includes(code);
}
