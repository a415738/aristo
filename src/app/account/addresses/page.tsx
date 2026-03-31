'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Check, ChevronRight, X } from 'lucide-react';

// 模拟地址数据
const mockAddresses = [
  {
    id: '1',
    name: '张三',
    phone: '+86 138 1234 5678',
    country: '中国',
    province: '广东省',
    city: '深圳市',
    address: '南山区科技园南区科技路123号',
    postal_code: '518000',
    is_default: true,
  },
  {
    id: '2',
    name: '张三',
    phone: '+66 987 654 321',
    country: '泰国',
    province: '曼谷',
    city: '曼谷市',
    address: 'Sukhumvit Road, Soi 23',
    postal_code: '10110',
    is_default: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    address: '',
    postal_code: '',
  });

  const setDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      is_default: addr.id === id,
    })));
  };

  const deleteAddress = (id: string) => {
    if (confirm('确定要删除这个地址吗？')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId) {
      // 编辑模式
      setAddresses(addresses.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId, is_default: addr.is_default } : addr
      ));
      setEditingId(null);
    } else {
      // 新增模式
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
        is_default: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      setIsAdding(false);
    }
    setFormData({
      name: '',
      phone: '',
      country: '',
      province: '',
      city: '',
      address: '',
      postal_code: '',
    });
  };

  const startEdit = (addr: typeof mockAddresses[0]) => {
    setEditingId(addr.id);
    setFormData({
      name: addr.name,
      phone: addr.phone,
      country: addr.country,
      province: addr.province,
      city: addr.city,
      address: addr.address,
      postal_code: addr.postal_code,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      phone: '',
      country: '',
      province: '',
      city: '',
      address: '',
      postal_code: '',
    });
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
            <h1 className="text-xl font-bold">收货地址</h1>
          </div>

          {/* 添加按钮 */}
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)} className="mb-4">
              <Plus className="h-4 w-4 mr-2" />
              添加新地址
            </Button>
          )}

          {/* 添加/编辑表单 */}
          {(isAdding || editingId) && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{editingId ? '编辑地址' : '添加新地址'}</h3>
                  <Button variant="ghost" size="icon" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">收货人</Label>
                    <Input 
                      id="name" 
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">手机号码</Label>
                    <Input 
                      id="phone" 
                      placeholder="请输入手机号"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">国家/地区</Label>
                    <Input 
                      id="country" 
                      placeholder="请输入国家"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">省/州</Label>
                    <Input 
                      id="province" 
                      placeholder="请输入省/州"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">城市</Label>
                    <Input 
                      id="city" 
                      placeholder="请输入城市"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal">邮政编码</Label>
                    <Input 
                      id="postal" 
                      placeholder="请输入邮政编码"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">详细地址</Label>
                    <Input 
                      id="address" 
                      placeholder="请输入详细地址"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSave}>
                    {editingId ? '保存修改' : '保存地址'}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 地址列表 */}
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card 
                key={address.id} 
                className={`overflow-hidden ${address.is_default ? 'border-primary' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{address.name}</span>
                      {address.is_default && (
                        <Badge className="bg-primary text-xs">默认</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!address.is_default && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDefault(address.id)}
                          title="设为默认"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => startEdit(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}, {address.city}, {address.province}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.country} {address.postal_code}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {addresses.length === 0 && !isAdding && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">暂无收货地址</p>
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加地址
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
