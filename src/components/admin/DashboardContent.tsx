'use client';

import { useState, useMemo } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar, TrendingUp, Eye, Users, DollarSign, ShoppingCart, Package } from 'lucide-react';

interface DashboardContentProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
}

// 生成过去6个月的数据
function generateMonthData() {
  const months = ['8月', '9月', '10月', '11月', '12月', '1月'];
  return months.map((month, index) => {
    const baseProductViews = 8000 + Math.random() * 4000;
    const baseTraffic = 15000 + Math.random() * 8000;
    return {
      month,
      productViews: Math.round(baseProductViews + (index * 800)),
      traffic: Math.round(baseTraffic + (index * 1500)),
      uniqueVisitors: Math.round(baseTraffic * 0.6 + (index * 800)),
    };
  });
}

// 生成每日数据（过去30天）
function generateDailyData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    data.push({
      day: dayName,
      productViews: Math.round(200 + Math.random() * 300),
      traffic: Math.round(400 + Math.random() * 500),
      uniqueVisitors: Math.round(250 + Math.random() * 300),
    });
  }
  return data;
}

// 生成周数据（过去12周）
function generateWeeklyData() {
  const data = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const weekDate = new Date(today);
    weekDate.setDate(weekDate.getDate() - (i * 7));
    data.push({
      week: `第${12 - i}周`,
      productViews: Math.round(3000 + Math.random() * 2000),
      traffic: Math.round(6000 + Math.random() * 4000),
      uniqueVisitors: Math.round(3500 + Math.random() * 2500),
    });
  }
  return data;
}

type TimeRange = '7d' | '30d' | '12w' | '6m';

export function DashboardContent({ stats }: DashboardContentProps) {
  const t = adminTranslations;
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const chartData = useMemo(() => {
    switch (timeRange) {
      case '7d':
      case '30d':
        return generateDailyData();
      case '12w':
        return generateWeeklyData();
      case '6m':
        return generateMonthData();
      default:
        return generateDailyData();
    }
  }, [timeRange]);

  const getXAxisKey = () => {
    switch (timeRange) {
      case '7d':
      case '30d':
        return 'day';
      case '12w':
        return 'week';
      case '6m':
        return 'month';
      default:
        return 'day';
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: '最近7天' },
    { value: '30d', label: '最近30天' },
    { value: '12w', label: '最近12周' },
    { value: '6m', label: '最近6个月' },
  ];

  const summaryStats = useMemo(() => {
    const total = chartData.reduce((acc, item) => ({
      productViews: acc.productViews + item.productViews,
      traffic: acc.traffic + item.traffic,
      uniqueVisitors: acc.uniqueVisitors + item.uniqueVisitors,
    }), { productViews: 0, traffic: 0, uniqueVisitors: 0 });

    return {
      totalProductViews: total.productViews,
      totalTraffic: total.traffic,
      avgProductViews: Math.round(total.productViews / chartData.length),
      avgTraffic: Math.round(total.traffic / chartData.length),
    };
  }, [chartData]);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t.admin.dashboard}</h1>
          <p className="text-gray-600 mt-1">平台数据概览和统计分析</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as TimeRange)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 交易统计 - 第一排 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.admin.totalRevenue}</p>
              <p className="text-xl font-bold">${stats.totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.admin.totalOrders}</p>
              <p className="text-xl font-bold">{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.admin.totalProducts}</p>
              <p className="text-xl font-bold">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.admin.totalUsers}</p>
              <p className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 流量统计 - 第二排 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">商品总浏览量</p>
              <p className="text-xl font-bold">{summaryStats.totalProductViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总访问量</p>
              <p className="text-xl font-bold">{summaryStats.totalTraffic.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">日均商品浏览</p>
              <p className="text-xl font-bold">{summaryStats.avgProductViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">日均访问量</p>
              <p className="text-xl font-bold">{summaryStats.avgTraffic.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Views Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">商品浏览量趋势</h3>
              <p className="text-sm text-gray-500 mt-1">统计用户浏览商品详情页的次数</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                商品浏览
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={getXAxisKey()}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), '浏览量']}
                />
                <Line
                  type="monotone"
                  dataKey="productViews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">网站访问趋势</h3>
              <p className="text-sm text-gray-500 mt-1">统计所有前台页面的访问流量（含未登录用户）</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                总访问量
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                独立访客
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={getXAxisKey()}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    name === 'traffic' ? '总访问量' : '独立访客'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#22c55e' }}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Source Explanation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-medium mb-2">数据说明</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>商品浏览量</strong>：用户进入商品详情页的次数，同一用户反复刷新页面会重复计数</li>
          <li>• <strong>总访问量</strong>：网站所有页面的访问总次数，包括已登录和未登录用户</li>
          <li>• <strong>独立访客</strong>：根据浏览器 Cookie 识别的唯一访客数，同一访客多次访问只计一次</li>
          <li>• <strong>数据范围</strong>：支持查询最近7天、30天、12周（3个月）、6个月的数据</li>
        </ul>
      </div>
    </div>
  );
}
