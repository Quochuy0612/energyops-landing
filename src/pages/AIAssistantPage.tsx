import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import {
  Bot,
  Send,
  FileText,
  BookOpen,
  Shield,
  CheckCircle,
  ExternalLink,
  Paperclip,
  Download,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KnowledgeSource {
  id: string
  name: string
  description: string
  icon: 'file' | 'book' | 'shield'
  enabled: boolean
}

interface Citation {
  id: string
  number: number
  title: string
  description: string
  link: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  userName?: string
  userAvatar?: string
  citations?: number[]
  isLoading?: boolean
}

const knowledgeSources: KnowledgeSource[] = [
  { id: '1', name: 'Quy trình nội bộ', description: 'EVN/SOP-2024', icon: 'file', enabled: true },
  { id: '2', name: 'Mẫu lệnh SO', description: 'Tiêu chuẩn vận hành', icon: 'book', enabled: false },
  { id: '3', name: 'An toàn điện', description: 'TCVN & Quy định Bộ', icon: 'shield', enabled: true },
]

const citations: Citation[] = [
  {
    id: '1',
    number: 1,
    title: 'Quy trình Vận hành Trạm',
    description: 'Mục 4.2: Khoảng cách an toàn tối thiểu cho thiết bị 220kV đang mang điện...',
    link: '#',
  },
  {
    id: '2',
    number: 2,
    title: 'TCVN 1234:2023',
    description: 'Chương II: Quy định về trang bị bảo hộ lao động và khoảng cách an toàn...',
    link: '#',
  },
]

const quickActions = [
  { icon: FileText, label: 'Tóm tắt phiếu hôm nay' },
  { icon: Shield, label: 'Kiểm tra rủi ro vận hành' },
  { icon: BookOpen, label: 'Tra cứu quy trình an toàn' },
]

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Chào bạn, tôi đã sẵn sàng hỗ trợ. Dưới đây là tóm tắt các phiếu công tác có rủi ro cao trong ngày hôm nay:

**! Phiếu 102/QT:** Công tác tại trạm biến áp 220kV. Cần đặc biệt chú trọng khoảng cách an toàn lưới điện [1].

**! Lệnh SO #882:** Thao tác đóng cắt máy cắt 171. Kiểm tra kỹ trạng thái liên động [2].`,
    timestamp: '10:24 AM',
    citations: [1, 2],
  },
  {
    id: '2',
    role: 'user',
    content: 'Vui lòng kiểm tra lại quy trình an toàn cho việc sửa chữa máy biến áp T1 theo TCVN mới nhất.',
    timestamp: '10:25 AM',
    userName: 'Kỹ sư Trực ban',
    userAvatar: '/avatars/user.jpg',
  },
  {
    id: '3',
    role: 'assistant',
    content: '',
    timestamp: '',
    isLoading: true,
  },
]

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sources, setSources] = useState<KnowledgeSource[]>(knowledgeSources)
  const knowledgeCapacity = 85

  const toggleSource = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      userName: 'Kỹ sư Trực ban',
    }

    setMessages(prev => prev.filter(m => !m.isLoading).concat(newMessage))
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Đã kiểm tra quy trình an toàn theo TCVN 1234:2023. Các yêu cầu chính bao gồm: khoảng cách an toàn tối thiểu 2.5m, sử dụng thiết bị bảo hộ đầy đủ, và cần có ít nhất 2 người giám sát.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        citations: [2],
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const getSourceIcon = (icon: KnowledgeSource['icon']) => {
    switch (icon) {
      case 'file': return FileText
      case 'book': return BookOpen
      case 'shield': return Shield
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Trợ lý AI"
        subtitle="Hỗ trợ vận hành và tra cứu quy trình hệ thống điện Quốc gia"
        actions={
          <Badge variant="success" size="md" className="gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            SẴN SÀNG
          </Badge>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="col-span-2">
            <Card className="flex flex-col h-[calc(100vh-200px)]" padding="none">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-600" />
                      </div>
                    )}

                    <div className={cn('max-w-[70%]', message.role === 'user' && 'text-right')}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                          <span className="text-xs text-gray-400">{message.timestamp}</span>
                        </div>
                      )}

                      {message.isLoading ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-none px-4 py-3">
                          <div className="flex items-center gap-2 text-primary-600">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm">Đang truy xuất cơ sở dữ liệu quy trình an toàn...</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3',
                            message.role === 'user'
                              ? 'bg-gray-100 rounded-tr-none'
                              : 'bg-blue-50 border border-blue-100 rounded-tl-none'
                          )}
                        >
                          <div
                            className={cn(
                              'text-sm leading-relaxed whitespace-pre-wrap',
                              message.role === 'user' ? 'text-gray-800' : 'text-gray-700'
                            )}
                            dangerouslySetInnerHTML={{
                              __html: message.content
                                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                                .replace(/\[(\d+)\]/g, '<sup class="text-primary-600 font-medium">[$1]</sup>')
                            }}
                          />
                        </div>
                      )}

                      {message.role === 'user' && (
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className="text-xs text-gray-400">{message.timestamp}</span>
                          <span className="text-sm font-medium text-gray-700">{message.userName}</span>
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">KS</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <action.icon className="w-4 h-4 text-gray-500" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập câu hỏi hoặc yêu cầu tại đây..."
                    className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button onClick={handleSend} className="rounded-full w-12 h-12 p-0">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-amber-600 mt-2 text-center">
                  AI có thể nhầm lẫn. Vui lòng kiểm tra lại với Quy trình vận hành chính thức.
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Knowledge Scope */}
            <Card>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                PHẠM VI KIẾN THỨC
              </h3>
              <div className="space-y-3">
                {sources.map((source) => {
                  const Icon = getSourceIcon(source.icon)
                  return (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          source.enabled ? 'bg-primary-100' : 'bg-gray-200'
                        )}>
                          <Icon className={cn('w-4 h-4', source.enabled ? 'text-primary-600' : 'text-gray-400')} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{source.name}</p>
                          <p className="text-xs text-gray-500">{source.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSource(source.id)}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer',
                          source.enabled
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white border-gray-300'
                        )}
                      >
                        {source.enabled && <CheckCircle className="w-3 h-3 text-white" />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Citations */}
            <Card>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                TRÍCH DẪN (CITATIONS)
              </h3>
              <div className="space-y-3">
                {citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        [{citation.number}]
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{citation.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{citation.description}</p>
                        <a
                          href={citation.link}
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-2 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Xem tài liệu gốc
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Knowledge Capacity */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  KNOWLEDGE CAPACITY
                </span>
                <span className="text-sm font-semibold text-primary-600">{knowledgeCapacity}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${knowledgeCapacity}%` }}
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="primary" className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                Tạo phiếu từ Chat
              </Button>
              <Button variant="secondary" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Xuất báo cáo AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
