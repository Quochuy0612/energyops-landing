import { useState } from 'react'
import { Search, Bell, MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')

  const quickActions = [
    'Tóm tắt phiếu hiện tại',
    'Kiểm tra trạng thái thiết bị',
    'Tra cứu quy trình thao tác',
    'Gợi ý các bước an toàn',
  ]

  const notifications = [
    {
      id: '1',
      title: 'Phiếu thao tác mới cần duyệt',
      message: 'PTT-2024-0156 đang chờ phê duyệt',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: '2',
      title: 'Yêu cầu công tác đã được duyệt',
      message: 'REQ-2024-0089 đã được phê duyệt bởi Trưởng điều độ',
      time: '15 phút trước',
      unread: true,
    },
    {
      id: '3',
      title: 'Cảnh báo thiết bị',
      message: 'MBA T1 110kV - Nhiệt độ vượt ngưỡng cảnh báo',
      time: '1 giờ trước',
      unread: false,
    },
  ]

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* AI Assistant */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowAIChat(!showAIChat)}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trợ lý AI</span>
          </Button>

          {showAIChat && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 animate-in overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trợ lý AI</h3>
                    <p className="text-xs text-white/80">Hỗ trợ vận hành và tra cứu</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                {/* AI Message */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                    Chào bạn, tôi là trợ lý AI sẵn sàng hỗ trợ. Bạn có thể hỏi tôi về phiếu thao tác, thiết bị, quy trình vận hành hoặc các vấn đề an toàn.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">09:00</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-sm text-gray-700">{action}</span>
                      <Sparkles className="w-4 h-4 text-primary-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Được hỗ trợ bởi AI
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50 animate-in">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0',
                      notif.unread && 'bg-primary-50/50'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <span className="mt-1.5 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                      )}
                      <div className={cn(!notif.unread && 'ml-4')}>
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-1 cursor-pointer">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Actions */}
        {actions}
      </div>
    </header>
  )
}
