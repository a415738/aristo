'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock, User, Loader2 } from 'lucide-react';

// 管理员默认账户
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456',
};

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // 检查是否已登录
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (loggedIn) {
      router.push('/admin');
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 简单验证
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 保存登录状态到 localStorage
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_username', username);
      localStorage.setItem('admin_login_time', new Date().toISOString());
      
      // 跳转到后台首页
      router.push('/admin');
    } else {
      setError('用户名或密码错误');
      setLoading(false);
    }
  };

  // 检查登录状态时显示加载
  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900">管理后台登录</CardTitle>
          <CardDescription className="text-neutral-500">
            请输入管理员账户和密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-neutral-700">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-neutral-200 focus:border-neutral-900"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-700">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-neutral-200 focus:border-neutral-900"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              默认账户：admin<br />
              默认密码：123456
            </p>
          </div>

          {/* 返回网站链接 */}
          <div className="mt-4 text-center">
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              返回网站首页
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
