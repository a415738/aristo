'use client';

import { useState, useEffect } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  MessageSquare,
  Search,
  Filter,
  User,
  Bot,
  Clock,
  Send,
  ChevronDown,
  MoreVertical,
  Trash2,
  Download,
} from 'lucide-react';

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  status: 'active' | 'closed';
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'ai' | 'admin';
  timestamp: string;
}

const t = adminTranslations.common;
const tNav = adminTranslations.nav;

// 模拟聊天会话数据
const mockSessions: ChatSession[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Siti Rahman',
    userEmail: 'siti@email.com',
    status: 'active',
    lastMessage: 'Tôi muốn biết về sản phẩm kem chống nắng',
    lastMessageTime: '2024-01-15 14:30',
    messageCount: 12,
    isOnline: true,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Minh Nguyen',
    userEmail: 'minh.nguyen@email.com',
    status: 'active',
    lastMessage: 'How long does shipping take to Bangkok?',
    lastMessageTime: '2024-01-15 14:25',
    messageCount: 8,
    isOnline: true,
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Wati Indonesia',
    status: 'closed',
    lastMessage: 'Terima kasih atas bantuannya!',
    lastMessageTime: '2024-01-15 13:00',
    messageCount: 15,
    isOnline: false,
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Piyapat Thailand',
    userEmail: 'piyapat@email.com',
    status: 'active',
    lastMessage: 'มีสีอะไรให้เลือกบ้าง',
    lastMessageTime: '2024-01-15 12:45',
    messageCount: 6,
    isOnline: false,
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Ahmad Malaysia',
    status: 'closed',
    lastMessage: 'Okay, I will place the order now',
    lastMessageTime: '2024-01-15 11:30',
    messageCount: 20,
    isOnline: false,
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', sessionId: '1', content: 'Chào bạn, tôi muốn biết về sản phẩm kem chống nắng', sender: 'user', timestamp: '14:25' },
    { id: 'm2', sessionId: '1', content: 'Xin chào! Cảm ơn bạn đã liên hệ. Bạn quan tâm đến sản phẩm kem chống nắng nào ạ? Chúng tôi có nhiều loại từ các thương hiệu nổi tiếng như Anessa, Biore, Murada.', sender: 'ai', timestamp: '14:26' },
    { id: 'm3', sessionId: '1', content: 'Tôi quan tâm đến sản phẩm của Anessa, loại nào phù hợp cho da nhạy cảm?', sender: 'user', timestamp: '14:28' },
    { id: 'm4', sessionId: '1', content: 'Anessa Perfect UV Skincare Milk là sản phẩm rất phù hợp cho da nhạy cảm. Sản phẩm này không chứa cồn, không gây kích ứng và có chỉ số SPF50+ PA++++. Bạn có muốn tôi thêm vào giỏ hàng không?', sender: 'ai', timestamp: '14:29' },
    { id: 'm5', sessionId: '1', content: 'Tôi muốn biết về sản phẩm kem chống nắng', sender: 'user', timestamp: '14:30' },
  ],
  '2': [
    { id: 'm6', sessionId: '2', content: 'How long does shipping take to Bangkok?', sender: 'user', timestamp: '14:20' },
    { id: 'm7', sessionId: '2', content: 'Hello! Shipping to Bangkok typically takes 3-5 business days for standard delivery and 1-2 business days for express delivery.', sender: 'ai', timestamp: '14:21' },
    { id: 'm8', sessionId: '2', content: 'What about express shipping cost?', sender: 'user', timestamp: '14:24' },
    { id: 'm9', sessionId: '2', content: 'Express shipping costs vary by weight. For orders under 1kg, it\'s approximately $15. Would you like me to check the exact cost for your order?', sender: 'ai', timestamp: '14:25' },
  ],
};

export default function ChatPageContent() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (selectedSession) {
      setMessages(mockMessages[selectedSession.id] || []);
    }
  }, [selectedSession]);

  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesSearch = session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.userEmail && session.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sessionId: selectedSession.id,
      content: newMessage,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{adminTranslations.admin.chat}</h1>
          <p className="text-gray-500 mt-1">管理客户聊天记录和 AI 客服配置</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Bot className="h-4 w-4" />
            AI 客服设置
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Download className="h-4 w-4" />
            导出记录
          </button>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI 客服配置
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">自动回复</p>
                <p className="text-sm text-gray-500">AI 自动回复客户消息</p>
              </div>
              <button
                onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoReplyEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoReplyEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">今日对话数</p>
              <p className="text-2xl font-bold text-primary">127</p>
              <p className="text-sm text-gray-500">AI 处理 89%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">平均响应时间</p>
              <p className="text-2xl font-bold text-primary">2.3s</p>
              <p className="text-sm text-gray-500">客户满意度 94%</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-white rounded-xl border border-gray-200 h-[calc(100%-180px)] flex overflow-hidden">
        {/* Sessions List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '全部' : status === 'active' ? '进行中' : '已结束'}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="flex-1 overflow-y-auto">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSession?.id === session.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      {session.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{session.userName}</p>
                      <p className="text-xs text-gray-500">{session.userEmail || '游客'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    session.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {session.status === 'active' ? '进行中' : '已结束'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{session.lastMessage}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{session.lastMessageTime}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {session.messageCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedSession.userName}</p>
                    <p className="text-xs text-gray-500">
                      {selectedSession.isOnline ? '在线' : '离线'} • {selectedSession.messageCount} 条消息
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'admin'
                          ? 'bg-primary text-white rounded-br-md'
                          : msg.sender === 'ai'
                          ? 'bg-purple-100 text-gray-800 rounded-bl-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === 'ai' && <Bot className="h-3 w-3" />}
                        {msg.sender === 'user' && <User className="h-3 w-3" />}
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="输入回复内容..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      rows={1}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>选择一个会话开始聊天</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
