import { Card, CardHeader, CardTitle } from '@/components/ui'
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Activity {
  id: string
  type: 'ticket_created' | 'ticket_approved' | 'ticket_completed' | 'alert'
  title: string
  description: string
  time: string
  user?: string
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'ticket_approved',
    title: 'Phiếu PTT-2024-0156 đã được duyệt',
    description: 'Cắt điện bảo trì MBA T1 110kV',
    time: '5 phút trước',
    user: 'Trưởng điều độ',
  },
  {
    id: '2',
    type: 'ticket_created',
    title: 'Phiếu mới PTT-2024-0157',
    description: 'Thí nghiệm định kỳ MC 171-E1',
    time: '15 phút trước',
    user: 'Nguyễn Văn A',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Cảnh báo nhiệt độ',
    description: 'MBA T2 - Nhiệt độ dầu đạt 85°C',
    time: '30 phút trước',
  },
  {
    id: '4',
    type: 'ticket_completed',
    title: 'Hoàn thành PTT-2024-0155',
    description: 'Đã đóng điện lại sau bảo trì',
    time: '1 giờ trước',
    user: 'Đội thao tác',
  },
  {
    id: '5',
    type: 'ticket_created',
    title: 'Yêu cầu mới REQ-2024-0089',
    description: 'Sửa chữa khẩn cấp DCL 171-1',
    time: '2 giờ trước',
    user: 'Đội QLTS',
  },
]

const activityConfig = {
  ticket_created: {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  ticket_approved: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  ticket_completed: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  alert: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
}

export function RecentActivity() {
  return (
    <Card padding="none">
      <CardHeader className="px-4 pt-4">
        <CardTitle>Hoạt động gần đây</CardTitle>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
          Xem tất cả
        </button>
      </CardHeader>
      <div className="px-4 pb-4 space-y-3">
        {activities.map((activity) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className={cn('p-2 rounded-lg', config.bg)}>
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{activity.time}</span>
                  {activity.user && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
