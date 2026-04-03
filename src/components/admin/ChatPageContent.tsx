'use client';

import { useState, useEffect, useRef } from 'react';
import { adminTranslations } from '@/lib/admin-translations';
import {
  MessageSquare,
  Search,
  User,
  Bot,
  Send,
  MoreVertical,
  Download,
  Languages,
  ChevronDown,
  Loader2,
  Check,
  Copy,
  Globe,
  AlertCircle,
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
  language?: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'ai' | 'admin';
  timestamp: string;
  translated?: string;
  detectedLang?: string;
  translationError?: boolean;
}

// 语言配置
const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Melayu', flag: '🇲🇾' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

// 目标语言（固定为中文）
const TARGET_LANG = 'zh';

// 语言检测（基于字符模式）
function detectLanguage(text: string): string {
  const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const thaiChars = /[ก-๙]/;
  const indonesianWords = /\b(saya|anda|terima|tidak|ada|yang|dan|dari|untuk|dengan|ke|in|di|nya|sudah|bisa|akan|juga|tapi|atau|saya|beli|Order|order|thank|thanks|how|what|where|when|which)\b/i;
  const malayWords = /\b(saya|anda|terima|tidak|ada|yang|dan|dari|untuk|dengan|semua|ke|in|di|nya|sudah|bisa|akan|juga|tapi|atau|okay|ok|yes|no|the|a|an|is|are|was|were|have|has|had|do|does|did|will|would|could|should)\b/i;

  if (thaiChars.test(text)) return 'th';
  if (vietnameseChars.test(text)) return 'vi';
  
  // 检查是否像印尼语
  const lowerText = text.toLowerCase();
  const indonesianCount = (lowerText.match(/\b(saya|anda|terima|tidak|ada|yang|dan|dari|untuk|dengan|ke|in|di|nya|sudah|bisa|akan|juga)\b/g) || []).length;
  if (indonesianCount >= 2) return 'id';
  
  // 检查是否像马来语
  const malayCount = (lowerText.match(/\b(saya|anda|terima|tidak|ada|yang|dan|dari|untuk|dengan|semua)\b/g) || []).length;
  if (malayCount >= 2) return 'ms';
  
  return 'en';
}

// 使用 MyMemory API 翻译
async function translateText(text: string, sourceLang: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${TARGET_LANG}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

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
    language: 'vi',
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
    language: 'en',
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
    language: 'id',
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
    language: 'th',
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
    language: 'en',
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', sessionId: '1', content: 'Chào bạn, tôi muốn biết về sản phẩm kem chống nắng', sender: 'user', timestamp: '14:25' },
    { id: 'm2', sessionId: '1', content: 'Xin chào! Cảm ơn bạn đã liên hệ. Bạn quan tâm đến sản phẩm kem chống nắng nào ạ?', sender: 'ai', timestamp: '14:26' },
    { id: 'm3', sessionId: '1', content: 'Tôi quan tâm đến sản phẩm của Anessa, loại nào phù hợp cho da nhạy cảm?', sender: 'user', timestamp: '14:28' },
    { id: 'm4', sessionId: '1', content: 'Anessa Perfect UV Skincare Milk là sản phẩm rất phù hợp cho da nhạy cảm.', sender: 'ai', timestamp: '14:29' },
    { id: 'm5', sessionId: '1', content: 'Tôi muốn biết về sản phẩm kem chống nắng', sender: 'user', timestamp: '14:30' },
  ],
  '2': [
    { id: 'm6', sessionId: '2', content: 'How long does shipping take to Bangkok?', sender: 'user', timestamp: '14:20' },
    { id: 'm7', sessionId: '2', content: 'Shipping to Bangkok typically takes 3-5 business days for standard delivery.', sender: 'ai', timestamp: '14:21' },
    { id: 'm8', sessionId: '2', content: 'What about express shipping cost?', sender: 'user', timestamp: '14:24' },
    { id: 'm9', sessionId: '2', content: 'Express shipping costs approximately $15 for orders under 1kg.', sender: 'ai', timestamp: '14:25' },
  ],
  '3': [
    { id: 'm10', sessionId: '3', content: 'Terima kasih atas bantuannya!', sender: 'user', timestamp: '12:55' },
    { id: 'm11', sessionId: '3', content: 'Sama-sama! Jika ada pertanyaan lain, jangan ragu untuk bertanya.', sender: 'ai', timestamp: '12:56' },
    { id: 'm12', sessionId: '3', content: 'Saya akan merekomendasikan ke teman-teman saya', sender: 'user', timestamp: '12:58' },
  ],
  '4': [
    { id: 'm13', sessionId: '4', content: 'มีสีอะไรให้เลือกบ้าง', sender: 'user', timestamp: '12:40' },
    { id: 'm14', sessionId: '4', content: 'สินค้านี้มี 5 สีให้เลือกค่ะ: ชมพู, แดง, ส้ม, น้ำตาล และ สีกลาง', sender: 'ai', timestamp: '12:42' },
    { id: 'm15', sessionId: '4', content: 'สีชมพูยังมีอยู่ไหม', sender: 'user', timestamp: '12:44' },
    { id: 'm16', sessionId: '4', content: 'มีค่ะ สีชมพูยังมีสินค้าใน stock อยู่ค่ะ', sender: 'ai', timestamp: '12:45' },
  ],
  '5': [
    { id: 'm17', sessionId: '5', content: 'Okay, I will place the order now', sender: 'user', timestamp: '11:25' },
    { id: 'm18', sessionId: '5', content: 'Great! Your order will be processed within 24 hours.', sender: 'ai', timestamp: '11:26' },
    { id: 'm19', sessionId: '5', content: 'Thank you for shopping with us!', sender: 'ai', timestamp: '11:27' },
  ],
};

export default function ChatPageContent() {
  const [sessions] = useState<ChatSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [translatingMessageId, setTranslatingMessageId] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true); // 自动翻译开关
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [translationCount, setTranslationCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSession) {
      const sessionMessages = mockMessages[selectedSession.id] || [];
      setMessages(sessionMessages);
      
      // 自动检测语言并翻译非英文消息
      const processMessages = async () => {
        const messagesWithLang: ChatMessage[] = [];
        
        for (const msg of sessionMessages) {
          const detectedLang = msg.sender === 'user' ? detectLanguage(msg.content) : undefined;
          const message: ChatMessage = {
            ...msg,
            detectedLang,
          };
          
          // 如果是用户消息且不是英文，自动翻译
          if (msg.sender === 'user' && autoTranslate && detectedLang && detectedLang !== 'en' && detectedLang !== 'zh') {
            try {
              setTranslatingMessageId(msg.id);
              const translated = await translateText(msg.content, detectedLang);
              message.translated = translated;
              setTranslationCount(prev => prev + 1);
            } catch (error) {
              message.translationError = true;
              console.error('Auto-translate failed for:', msg.content);
            }
            setTranslatingMessageId(null);
          }
          
          messagesWithLang.push(message);
        }
        
        setDisplayMessages(messagesWithLang);
      };
      
      processMessages();
    }
  }, [selectedSession, autoTranslate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

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
    setDisplayMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 手动翻译单条消息
  const handleTranslate = async (messageId: string) => {
    const msg = displayMessages.find(m => m.id === messageId);
    if (!msg || msg.sender === 'admin') return;

    setTranslatingMessageId(messageId);

    try {
      const sourceLang = msg.detectedLang || detectLanguage(msg.content);
      const translated = await translateText(msg.content, sourceLang);

      setDisplayMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, translated, detectedLang: sourceLang, translationError: false } : m
      ));
      setTranslationCount(prev => prev + 1);
    } catch (error) {
      setDisplayMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, translationError: true } : m
      ));
    }

    setTranslatingMessageId(null);
  };

  // 翻译全部用户消息
  const handleTranslateAll = async () => {
    if (!selectedSession) return;

    setTranslatingMessageId('all');

    const userMessages = displayMessages.filter(m => m.sender === 'user' && !m.translated && !m.translationError);
    
    for (const msg of userMessages) {
      const sourceLang = msg.detectedLang || detectLanguage(msg.content);
      
      if (sourceLang !== 'en' && sourceLang !== 'zh') {
        try {
          const translated = await translateText(msg.content, sourceLang);
          setDisplayMessages(prev => prev.map(m =>
            m.id === msg.id ? { ...m, translated, detectedLang: sourceLang } : m
          ));
          setTranslationCount(prev => prev + 1);
        } catch (error) {
          setDisplayMessages(prev => prev.map(m =>
            m.id === msg.id ? { ...m, translationError: true } : m
          ));
        }
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setTranslatingMessageId(null);
  };

  const handleCopyOriginal = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
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
            AI 设置
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Download className="h-4 w-4" />
            导出
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">自动翻译</p>
                <p className="text-sm text-gray-500">自动将用户消息翻译为中文</p>
              </div>
              <button
                onClick={() => setAutoTranslate(!autoTranslate)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoTranslate ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoTranslate ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
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
              <p className="font-medium mb-2">翻译次数</p>
              <p className="text-2xl font-bold text-blue-600">{translationCount}</p>
              <p className="text-sm text-gray-500">已翻译消息</p>
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
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.userName}</p>
                        {session.language && (
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {languages.find(l => l.code === session.language)?.flag}
                          </span>
                        )}
                      </div>
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{selectedSession.userName}</p>
                      {selectedSession.language && (
                        <span className="text-sm text-gray-500">
                          {getLanguageName(selectedSession.language)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedSession.isOnline ? '在线' : '离线'} • {selectedSession.messageCount} 条消息
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTranslateAll}
                    disabled={translatingMessageId === 'all'}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                  >
                    {translatingMessageId === 'all' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Languages className="h-4 w-4" />
                    )}
                    翻译全部
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl ${
                        msg.sender === 'admin'
                          ? 'bg-primary text-white rounded-br-md'
                          : msg.sender === 'ai'
                          ? 'bg-purple-100 text-gray-800 rounded-bl-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                        {msg.sender === 'ai' && <Bot className="h-3 w-3" />}
                        {msg.sender === 'user' && <User className="h-3 w-3" />}
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                        {msg.detectedLang && msg.sender === 'user' && (
                          <span className="text-xs bg-black/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {getLanguageName(msg.detectedLang)}
                          </span>
                        )}
                      </div>
                      
                      {/* Original Message */}
                      <div className="px-4 pb-2">
                        <p className="text-sm">{msg.content}</p>
                      </div>

                      {/* Translated Message */}
                      {msg.translated && msg.sender === 'user' && (
                        <div className="mx-3 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-1 mb-2">
                            <Languages className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">中文翻译</span>
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{msg.translated}</p>
                        </div>
                      )}

                      {/* Translation Error */}
                      {msg.translationError && msg.sender === 'user' && (
                        <div className="mx-3 mb-3 p-2 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-600">翻译失败</span>
                          <button
                            onClick={() => handleTranslate(msg.id)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            重试
                          </button>
                        </div>
                      )}

                      {/* Translate Button (for messages without translation) */}
                      {!msg.translated && !msg.translationError && msg.sender === 'user' && msg.detectedLang && msg.detectedLang !== 'en' && msg.detectedLang !== 'zh' && (
                        <div className="px-4 pb-3">
                          <button
                            onClick={() => handleTranslate(msg.id)}
                            disabled={translatingMessageId !== null}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                          >
                            {translatingMessageId === msg.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                翻译中...
                              </>
                            ) : (
                              <>
                                <Languages className="h-3 w-3" />
                                翻译为中文
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {msg.sender === 'user' && (
                        <div className="flex items-center gap-1 px-4 pb-2">
                          <button
                            onClick={() => handleCopyOriginal(msg.content)}
                            className="flex items-center gap-1 text-xs opacity-50 hover:opacity-100 transition-opacity"
                            title="复制原文"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
