'use client';

import { useState } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  Settings as SettingsIcon,
  Globe,
  Languages,
  DollarSign,
  Bell,
  Mail,
  Database,
  Shield,
  Key,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react';

const t = adminTranslations.common;

// 语言配置
const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', enabled: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', enabled: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', enabled: true },
  { code: 'my', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', enabled: true },
];

// 货币配置
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, enabled: true },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.5, enabled: true },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500, enabled: true },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15800, enabled: true },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.7, enabled: true },
];

// 支付方式
const paymentMethodsDefault = [
  { id: 'cod', name: '货到付款 (COD)', enabled: true, icon: '💵', desc: '支持泰国、越南、印尼等地区' },
  { id: 'bank_transfer', name: '银行转账', enabled: true, icon: '🏦', desc: '支持本地银行转账' },
  { id: 'lianlian', name: '连连国际 (LianLian)', enabled: false, icon: '🔗', desc: '东南亚主流支付，支持多币种' },
  { id: 'ksher', name: 'KSHER', enabled: false, icon: '💠', desc: '聚合支付，支持微信/支付宝/本地钱包' },
  { id: 'paypal', name: 'PayPal', enabled: false, icon: '🅿️', desc: '国际支付' },
  { id: 'stripe', name: 'Stripe', enabled: false, icon: '💳', desc: '国际支付，支持信用卡' },
];

// 物流方式
const shippingMethods = [
  { id: 'standard', name: '标准配送 (5-7天)', price: 5, enabled: true },
  { id: 'express', name: '快速配送 (2-3天)', price: 15, enabled: true },
  { id: 'overnight', name: '次日达', price: 25, enabled: false },
];

type SettingsTab = 'general' | 'language' | 'currency' | 'payment' | 'shipping' | 'notification' | 'security';

export default function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [paymentMethods, setPaymentMethods] = useState(paymentMethodsDefault);
  const [siteName, setSiteName] = useState('Aristo Beauty');
  const [siteEmail, setSiteEmail] = useState('support@aristo-beauty.com');
  const [sitePhone, setSitePhone] = useState('+66 2 123 4567');
  const [siteAddress, setSiteAddress] = useState('123 Rama IV Road, Bangkok, Thailand');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { id: 'general' as const, name: '基本信息', icon: SettingsIcon },
    { id: 'language' as const, name: '语言设置', icon: Languages },
    { id: 'currency' as const, name: '货币设置', icon: DollarSign },
    { id: 'payment' as const, name: '支付方式', icon: CreditCard },
    { id: 'shipping' as const, name: '物流设置', icon: Truck },
    { id: 'notification' as const, name: '通知设置', icon: Bell },
    { id: 'security' as const, name: '安全设置', icon: Shield },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleToggleLanguage = (code: string) => {
    // Toggle language enabled state - simplified for demo
  };

  const handleToggleCurrency = (code: string) => {
    // Toggle currency enabled state - simplified for demo
  };

  const handleTogglePayment = (id: string) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const handleToggleShipping = (id: string) => {
    // Toggle shipping method - simplified for demo
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{adminTranslations.admin.settings}</h1>
          <p className="text-gray-500 mt-1">配置网站基本设置和功能参数</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              保存中...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              保存成功
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存设置
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100%-80px)]">
        {/* Sidebar */}
        <div className="w-56 bg-white rounded-xl border border-gray-200 p-4 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 overflow-y-auto">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                基本信息设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站名称
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    客服邮箱
                  </label>
                  <input
                    type="email"
                    value={siteEmail}
                    onChange={(e) => setSiteEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={sitePhone}
                    onChange={(e) => setSitePhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    默认语言
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="en">English</option>
                    <option value="th">ไทย</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="my">Bahasa Melayu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司地址
                  </label>
                  <textarea
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Language Settings */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Languages className="h-5 w-5" />
                多语言设置
              </h3>
              <p className="text-sm text-gray-500">启用或禁用网站支持的语言。禁用后将不在前台显示。</p>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <p className="font-medium">{lang.name}</p>
                        <p className="text-sm text-gray-500">{lang.nativeName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleLanguage(lang.code)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        lang.enabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          lang.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Currency Settings */}
          {activeTab === 'currency' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                多货币设置
              </h3>
              <p className="text-sm text-gray-500">配置网站支持的货币和汇率。汇率基于美元计算。</p>
              <div className="space-y-3">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-12">{currency.symbol}</span>
                      <div>
                        <p className="font-medium">{currency.name}</p>
                        <p className="text-sm text-gray-500">汇率: 1 USD = {currency.rate} {currency.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleCurrency(currency.code)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          currency.enabled ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            currency.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                支付方式设置
              </h3>
              <p className="text-sm text-gray-500">启用或禁用网站支持的支付方式。</p>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTogglePayment(method.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          method.enabled ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            method.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* 连连国际和KSHER配置 */}
                    {(method.id === 'lianlian' || method.id === 'ksher') && method.enabled && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {method.id === 'lianlian' ? 'Merchant ID' : 'App ID'}
                            </label>
                            <input
                              type="text"
                              placeholder={method.id === 'lianlian' ? '连连商户号' : 'KSHER App ID'}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {method.id === 'lianlian' ? 'API Key' : 'API Key'}
                            </label>
                            <input
                              type="password"
                              placeholder="API密钥"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        {method.id === 'ksher' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              商户号 (Merchant No)
                            </label>
                            <input
                              type="text"
                              placeholder="KSHER商户号"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            启用测试环境
                          </label>
                          <span className="text-xs text-gray-400">沙盒测试</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 支付提示 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">支付方式说明</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>货到付款 (COD)</strong>：顾客收货时付款，适合东南亚市场</li>
                  <li>• <strong>连连国际</strong>：支持泰国、越南、印尼、新加坡、马来西亚等，支持多币种结算</li>
                  <li>• <strong>KSHER</strong>：聚合支付专家，支持微信支付、支付宝、本地钱包（TrueMoney、Line Pay等）</li>
                  <li>• 请联系对应服务商获取 API 凭证</li>
                </ul>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5" />
                物流方式设置
              </h3>
              <p className="text-sm text-gray-500">配置网站支持的物流方式和配送费用。</p>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">运费: ${method.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleShipping(method.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          method.enabled ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            method.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notification' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知设置
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'order_email', name: '订单确认邮件', desc: '客户下单后发送确认邮件', enabled: true },
                  { id: 'order_sms', name: '订单状态短信', desc: '订单状态变更时发送短信通知', enabled: false },
                  { id: 'stock_alert', name: '库存预警', desc: '商品库存低于阈值时通知管理员', enabled: true },
                  { id: 'new_user', name: '新用户注册', desc: '有新用户注册时通知管理员', enabled: true },
                  { id: 'newsletter', name: ' newsletters', desc: '允许发送营销 newsletters', enabled: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.enabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          item.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">修改密码</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                      更新密码
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">两步验证</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">启用两步验证以增强账户安全。</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">状态: 未启用</span>
                    <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5">
                      启用
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">登录日志</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { time: '2024-01-15 14:30', ip: '192.168.1.1', device: 'Chrome / Windows' },
                    { time: '2024-01-15 10:15', ip: '192.168.1.1', device: 'Safari / macOS' },
                    { time: '2024-01-14 18:45', ip: '192.168.1.1', device: 'Chrome / Android' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{log.time}</p>
                        <p className="text-xs text-gray-500">{log.ip} • {log.device}</p>
                      </div>
                      <span className="text-xs text-green-600">成功</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import missing icon
function CreditCard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function Truck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16,8 20,8 23,11 23,16 16,16 16,8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
