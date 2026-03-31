'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Gift, Star, Crown, Heart } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (!agreed) {
      alert('请同意服务条款和隐私政策');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/account');
    }, 1000);
  };

  const benefits = [
    { icon: Gift, text: '新用户专享优惠券', highlight: '$10 OFF' },
    { icon: Star, text: '会员积分兑换好礼', highlight: '双倍积分' },
    { icon: Crown, text: '新品抢先体验', highlight: 'VIP特权' },
    { icon: Heart, text: '专属客服服务', highlight: '一对一' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰区域 - 仅桌面端显示 */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#F8F0F5]">
        {/* 背景图案 */}
        <div className="absolute inset-0">
          {/* 渐变叠加 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F0F5] via-[#F5EBF0] to-[#F0E5EB]" />
          
          {/* 装饰圆环 */}
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] border border-[#D8B8C8]/30 rounded-full" />
          <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] border border-[#D8B8C8]/40 rounded-full" />
          <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] border border-[#D8B8C8]/20 rounded-full" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] border border-[#D8B8C8]/30 rounded-full" />
          
          {/* 装饰点 */}
          <div className="absolute top-32 left-20 w-2 h-2 bg-[#B890A0] rounded-full opacity-60" />
          <div className="absolute top-48 left-40 w-1.5 h-1.5 bg-[#B890A0] rounded-full opacity-40" />
          <div className="absolute top-24 right-32 w-1.5 h-1.5 bg-[#B890A0] rounded-full opacity-50" />
          <div className="absolute bottom-40 right-24 w-2 h-2 bg-[#B890A0] rounded-full opacity-40" />
          <div className="absolute bottom-32 left-32 w-1 h-1 bg-[#B890A0] rounded-full opacity-60" />
          
          {/* 大型装饰花 */}
          <svg className="absolute bottom-20 right-20 w-64 h-64 text-[#D8B8C8]/30" viewBox="0 0 200 200">
            <path fill="currentColor" d="M100,20 Q120,60 100,100 Q80,60 100,20" />
            <path fill="currentColor" d="M180,100 Q140,120 100,100 Q140,80 180,100" />
            <path fill="currentColor" d="M100,180 Q80,140 100,100 Q120,140 100,180" />
            <path fill="currentColor" d="M20,100 Q60,80 100,100 Q60,120 20,100" />
            <path fill="currentColor" d="M156,44 Q126,74 100,100 Q126,74 156,44" opacity="0.7" />
            <path fill="currentColor" d="M156,156 Q126,126 100,100 Q126,126 156,156" opacity="0.7" />
            <path fill="currentColor" d="M44,156 Q74,126 100,100 Q74,126 44,156" opacity="0.7" />
            <path fill="currentColor" d="M44,44 Q74,74 100,100 Q74,74 44,44" opacity="0.7" />
          </svg>
        </div>
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-light tracking-[0.3em] text-[#8B6B7B]">
                ARISTO
              </h1>
              <p className="text-xs tracking-[0.5em] text-[#A88B9B] mt-1">BEAUTY</p>
            </Link>
          </div>
          
          {/* 主标题 */}
          <div className="mb-12">
            <h2 className="text-3xl font-light text-[#5D4E57] leading-relaxed mb-4">
              开启您的
              <br />
              <span className="font-normal">美丽旅程</span>
            </h2>
            <p className="text-[#9B8B93] leading-relaxed max-w-md">
              注册成为会员，享受专属优惠和个性化服务，
              开启专属于您的美妆之旅。
            </p>
          </div>
          
          {/* 会员权益 */}
          <div className="grid grid-cols-2 gap-5 max-w-lg">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#E8D5DE] group hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#F5E5EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B890A0] group-hover:text-white transition-colors duration-300">
                  <benefit.icon className="h-5 w-5 text-[#8B6B7B] group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5D4E57]">{benefit.text}</p>
                  <p className="text-sm font-semibold text-[#B890A0]">{benefit.highlight}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 底部装饰线 */}
          <div className="absolute bottom-16 left-16 xl:left-24 flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[#B890A0]" />
            <span className="text-xs tracking-wider text-[#A88B9B]">JOIN THE BEAUTY CLUB</span>
          </div>
        </div>
      </div>

      {/* 右侧注册表单 */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* 移动端返回按钮 */}
          <Link 
            href="/" 
            className="lg:hidden inline-flex items-center gap-1 text-sm text-[#9B8B93] hover:text-[#5D4E57] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          {/* 移动端 Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-light tracking-[0.3em] text-[#8B6B7B]">ARISTO</h1>
            <p className="text-xs tracking-[0.4em] text-[#A88B9B] mt-1">BEAUTY</p>
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-[#5D4E57] mb-2">创建账户</h2>
            <p className="text-sm text-[#9B8B93]">填写以下信息，开始您的美丽之旅</p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 姓名 */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#5D4E57]">
                姓名
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B890A0]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入您的姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-[#E8D5DE] bg-[#FAF5F8]/50 focus:border-[#B890A0] focus:ring-[#B890A0] placeholder:text-[#B890A0]/60"
                  required
                />
              </div>
            </div>

            {/* 邮箱 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#5D4E57]">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B890A0]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-[#E8D5DE] bg-[#FAF5F8]/50 focus:border-[#B890A0] focus:ring-[#B890A0] placeholder:text-[#B890A0]/60"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#5D4E57]">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B890A0]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="至少6位字符"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 h-12 rounded-xl border-[#E8D5DE] bg-[#FAF5F8]/50 focus:border-[#B890A0] focus:ring-[#B890A0] placeholder:text-[#B890A0]/60"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B890A0] hover:text-[#8B6B7B] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#5D4E57]">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B890A0]" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-12 h-12 rounded-xl border-[#E8D5DE] bg-[#FAF5F8]/50 focus:border-[#B890A0] focus:ring-[#B890A0] placeholder:text-[#B890A0]/60"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* 同意条款 */}
            <div className="flex items-start gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border border-[#B890A0] rounded peer-checked:bg-[#B890A0] peer-checked:border-[#B890A0] transition-colors" />
                  <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#9B8B93] leading-relaxed group-hover:text-[#5D4E57] transition-colors">
                  我已阅读并同意{' '}
                  <Link href="/terms" className="text-[#8B6B7B] hover:text-[#5D4E57] transition-colors">
                    服务条款
                  </Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="text-[#8B6B7B] hover:text-[#5D4E57] transition-colors">
                    隐私政策
                  </Link>
                </span>
              </label>
            </div>

            {/* 注册按钮 */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-[#8B6B7B] hover:bg-[#7A5A6B] text-white text-sm font-medium tracking-wide transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  注册中...
                </span>
              ) : '注 册'}
            </Button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8D5DE]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-[#A88B9B]">或使用以下方式注册</span>
            </div>
          </div>

          {/* 社交注册 */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-[#E8D5DE] hover:border-[#B890A0] hover:bg-[#FAF5F8] transition-all duration-300" 
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm text-[#5D4E57]">Google</span>
            </button>

            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-[#E8D5DE] hover:border-[#B890A0] hover:bg-[#FAF5F8] transition-all duration-300" 
            >
              <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm text-[#5D4E57]">Facebook</span>
            </button>
          </div>

          {/* 登录链接 */}
          <p className="text-center text-sm text-[#9B8B93] mt-8">
            已有账户？{' '}
            <Link href="/login" className="text-[#8B6B7B] font-medium hover:text-[#5D4E57] transition-colors">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
