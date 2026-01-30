import { useState } from 'react'
import { Bot, Send, Sparkles, ChevronRight, X } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Chào bạn, tôi là sẵn sàng hỗ trợ. Danh sách đây là tóm tắt các phiếu công tác với đề xuất ưu tiên nhóm nhóm tiềm năng.',
    timestamp: '09:00',
    suggestions: [
      'Tóm tắt phiếu hiện tại',
      'Kiểm tra trạng thái các phiếu',
      'Tra cứu quy trình thao tác',
      'Gợi ý các bước an toàn',
    ],
  },
]

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Đang phân tích yêu cầu của bạn... Dựa trên các phiếu thao tác hiện tại, tôi đề xuất ưu tiên xử lý PTT-2024-0156 trước vì có thời gian thực hiện sớm nhất.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Xem chi tiết PTT-2024-0156', 'Tạo phiếu mới', 'Báo cáo tổng hợp'],
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer z-50"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  return (
    <Card className="w-80 flex flex-col h-[500px]" padding="none">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Trợ lý AI</h3>
            <p className="text-xs text-white/80">Hỗ trợ vận hành và tra cứu</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2',
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={cn(
                  'text-xs mt-1',
                  message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                )}
              >
                {message.timestamp}
              </p>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs bg-white rounded border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-gray-700">{suggestion}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button size="sm" onClick={handleSend} className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Được hỗ trợ bởi AI
        </p>
      </div>
    </Card>
  )
}
