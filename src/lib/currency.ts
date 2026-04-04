// 货币配置
export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rate: number; // 对美元的汇率
  enabled: boolean;
}

export const currencies: CurrencyConfig[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, enabled: true },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.5, enabled: true },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500, enabled: true },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15800, enabled: true },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.7, enabled: true },
];

// 获取货币配置
export function getCurrencyConfig(code: string): CurrencyConfig | undefined {
  return currencies.find(c => c.code === code);
}

// 格式化价格（本地货币）
export function formatPrice(priceInUSD: number, currencyCode: string): string {
  const config = getCurrencyConfig(currencyCode);
  if (!config) {
    return `$${priceInUSD.toFixed(2)} USD`;
  }
  
  const convertedPrice = priceInUSD * config.rate;
  
  // 根据货币类型格式化
  if (currencyCode === 'VND' || currencyCode === 'IDR') {
    // 大额货币去掉小数
    return `${config.symbol}${Math.round(convertedPrice).toLocaleString()} ${currencyCode}`;
  }
  
  return `${config.symbol}${convertedPrice.toFixed(2)} ${currencyCode}`;
}

// 货币代码对应的国家/地区
export const currencyCountries: Record<string, string> = {
  'USD': '美国',
  'THB': '泰国',
  'VND': '越南',
  'IDR': '印度尼西亚',
  'MYR': '马来西亚',
};

// 获取货币图标
export const currencyFlags: Record<string, string> = {
  'USD': '🇺🇸',
  'THB': '🇹🇭',
  'VND': '🇻🇳',
  'IDR': '🇮🇩',
  'MYR': '🇲🇾',
};
