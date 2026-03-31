'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight, Camera, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86 138 1234 5678',
    avatar: null,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    // TODO: 保存个人资料
    setTimeout(() => {
      setSaving(false);
      alert('保存成功');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('两次输入的新密码不一致');
      return;
    }
    if (passwords.new.length < 6) {
      alert('密码长度至少6位');
      return;
    }
    setSaving(true);
    // TODO: 修改密码
    setTimeout(() => {
      setSaving(false);
      alert('密码修改成功');
      setPasswords({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* 页面标题 */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/account" className="text-gray-500 hover:text-gray-700">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Link>
            <h1 className="text-xl font-bold">个人资料</h1>
          </div>

          {/* 头像 */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || ''} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-pink-400 to-purple-400 text-white">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500">点击更换头像</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 基本信息 */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">手机号码</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? '保存中...' : '保存修改'}
              </Button>
            </CardContent>
          </Card>

          {/* 修改密码 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">修改密码</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">当前密码</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="请输入当前密码"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">新密码</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="请输入新密码（至少6位）"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="请再次输入新密码"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleChangePassword} 
                disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
              >
                {saving ? '修改中...' : '修改密码'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
