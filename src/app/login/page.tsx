'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/account');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰区域 - 仅桌面端显示 */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] border border-white/5 rounded-full" />
          <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] border border-white/10 rounded-full" />
          <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-white/10 rounded-full" />
        </div>
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          {/* Logo */}
          <div className="mb-16">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-light tracking-[0.4em] text-white">
                ARISTO
              </h1>
              <div className="w-12 h-[1px] bg-white/30 mt-3" />
            </Link>
          </div>
          
          {/* 主标题 */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-white leading-relaxed mb-4">
              发现你的
              <br />
              <span className="font-normal">专属美丽</span>
            </h2>
            <p className="text-white/50 leading-relaxed max-w-sm text-sm">
              东南亚领先的美妆购物平台，汇聚全球知名品牌，为您提供高品质的美妆体验。
            </p>
          </div>
          
          {/* 特点列表 */}
          <div className="space-y-5">
            {['100% 正品保障', '全场满 $49 包邮', '7天无忧退换'].map((text, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <span className="text-sm text-white/70">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-sm">
          {/* 移动端返回按钮 */}
          <Link 
            href="/" 
            className="lg:hidden inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          {/* 移动端 Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-light tracking-[0.4em] text-neutral-900">ARISTO</h1>
            <div className="w-8 h-[1px] bg-neutral-300 mx-auto mt-3" />
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-neutral-900 mb-2">登录</h2>
            <p className="text-sm text-neutral-500">登录您的账户继续购物</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 邮箱 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 h-11 rounded-lg border-neutral-200 bg-neutral-50 focus:border-neutral-900 focus:ring-neutral-900 placeholder:text-neutral-400"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  密码
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  忘记密码？
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 h-11 rounded-lg border-neutral-200 bg-neutral-50 focus:border-neutral-900 focus:ring-neutral-900 placeholder:text-neutral-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 记住我 */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">记住我</span>
              </label>
            </div>

            {/* 登录按钮 */}
            <Button 
              type="submit" 
              className="w-full h-11 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : '登录'}
            </Button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-neutral-400">或</span>
            </div>
          </div>

          {/* 社交登录 */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all" 
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm text-neutral-700">Google</span>
            </button>

            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all" 
            >
              <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm text-neutral-700">Facebook</span>
            </button>
          </div>

          {/* 注册链接 */}
          <p className="text-center text-sm text-neutral-500 mt-8">
            还没有账户？{' '}
            <Link href="/register" className="text-neutral-900 font-medium hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
