'use client';

import { useState } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  Users,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Shield,
  ChevronDown,
  Check,
  X,
  UserPlus,
} from 'lucide-react';

const t = adminTranslations.common;

// 用户数据
const mockUsers = [
  {
    id: '1',
    name: 'Siti Rahman',
    email: 'siti.rahman@email.com',
    phone: '+62 812 3456 7890',
    country: 'Indonesia',
    avatar: null,
    orders: 12,
    spent: 1250.00,
    joinedAt: '2023-06-15',
    lastLogin: '2024-01-15 14:30',
    status: 'active',
    isVIP: true,
  },
  {
    id: '2',
    name: 'Minh Nguyen',
    email: 'minh.nguyen@email.com',
    phone: '+84 91 234 5678',
    country: 'Vietnam',
    avatar: null,
    orders: 8,
    spent: 890.50,
    joinedAt: '2023-08-22',
    lastLogin: '2024-01-15 10:15',
    status: 'active',
    isVIP: false,
  },
  {
    id: '3',
    name: 'Piyapat Chen',
    email: 'piyapat.c@email.com',
    phone: '+66 89 123 4567',
    country: 'Thailand',
    avatar: null,
    orders: 25,
    spent: 3500.00,
    joinedAt: '2023-03-10',
    lastLogin: '2024-01-14 18:45',
    status: 'active',
    isVIP: true,
  },
  {
    id: '4',
    name: 'Ahmad Faizal',
    email: 'ahmad.f@email.com',
    phone: '+60 12 345 6789',
    country: 'Malaysia',
    avatar: null,
    orders: 5,
    spent: 420.00,
    joinedAt: '2023-11-05',
    lastLogin: '2024-01-10 09:20',
    status: 'inactive',
    isVIP: false,
  },
  {
    id: '5',
    name: 'Lisa Tan',
    email: 'lisa.tan@email.com',
    phone: '+65 9123 4567',
    country: 'Singapore',
    avatar: null,
    orders: 18,
    spent: 2100.00,
    joinedAt: '2023-05-20',
    lastLogin: '2024-01-15 16:00',
    status: 'active',
    isVIP: true,
  },
];

// 国家列表
const countries = [
  { code: 'all', name: '全部国家' },
  { code: 'Indonesia', name: 'Indonesia' },
  { code: 'Vietnam', name: 'Vietnam' },
  { code: 'Thailand', name: 'Thailand' },
  { code: 'Malaysia', name: 'Malaysia' },
  { code: 'Singapore', name: 'Singapore' },
];

// VIP 等级
const vipLevels = [
  { id: 'none', name: '普通会员', color: 'gray' },
  { id: 'bronze', name: '青铜会员', color: 'amber-700' },
  { id: 'silver', name: '白银会员', color: 'gray-400' },
  { id: 'gold', name: '黄金会员', color: 'yellow-500' },
  { id: 'platinum', name: '铂金会员', color: 'purple-500' },
];

export default function UsersPageContent() {
  const [users] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || user.country === selectedCountry;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  // 分页
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 统计
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    vip: users.filter(u => u.isVIP).length,
    newThisMonth: users.filter(u => u.joinedAt.startsWith('2024-01')).length,
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'Indonesia': '🇮🇩',
      'Vietnam': '🇻🇳',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{adminTranslations.admin.users}</h1>
          <p className="text-gray-500 mt-1">管理平台用户账户和信息</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          添加用户
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '总用户数', value: stats.total, icon: Users, color: 'primary' },
          { label: '活跃用户', value: stats.active, icon: Check, color: 'green' },
          { label: 'VIP 会员', value: stats.vip, icon: Shield, color: 'purple' },
          { label: '本月新增', value: stats.newThisMonth, icon: UserPlus, color: 'blue' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <Icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户姓名或邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">未活跃</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-medium text-gray-600">用户</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">国家</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">订单数</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">消费金额</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">会员等级</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">状态</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">注册时间</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-2">
                      <span>{getCountryFlag(user.country)}</span>
                      <span className="text-sm">{user.country}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1 text-sm">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      {user.orders}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium">${user.spent.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    {user.isVIP ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        <Shield className="h-3 w-3" />
                        VIP
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        普通
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.status === 'active' ? '活跃' : '未活跃'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p>{user.joinedAt}</p>
                      <p className="text-xs text-gray-400">最近: {user.lastLogin}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="查看详情"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="编辑">
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="删除">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} / {filteredUsers.length} 条
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">用户详情</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {/* User Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedUser.isVIP && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        VIP 会员
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      selectedUser.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {selectedUser.status === 'active' ? '活跃' : '未活跃'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">国家/地区</p>
                  <p className="font-medium flex items-center gap-2">
                    {getCountryFlag(selectedUser.country)} {selectedUser.country}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">联系电话</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedUser.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">注册时间</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {selectedUser.joinedAt}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">最近登录</p>
                  <p className="font-medium">{selectedUser.lastLogin}</p>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{selectedUser.orders}</p>
                  <p className="text-sm text-gray-500">订单数</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">${selectedUser.spent.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">消费金额</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    ${(selectedUser.spent / selectedUser.orders).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">平均订单</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  编辑信息
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  发送消息
                </button>
                <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                  禁用账户
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
