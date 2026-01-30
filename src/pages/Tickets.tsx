import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout'
import { Button, Badge, Input, Card } from '@/components/ui'
import { AIAssistant } from '@/components/tickets'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
} from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import type { OperationTicket } from '@/types'

// Mock data
const mockTickets: OperationTicket[] = [
  {
    id: '1',
    code: 'PTT-2024-0156',
    title: 'Cắt điện bảo trì MBA T1 110kV',
    type: 'disconnect',
    status: 'approved',
    priority: 'urgent',
    createdBy: 'Nguyễn Văn A',
    approvedBy: 'Trưởng điều độ',
    equipment: [],
    steps: [],
    scheduledStart: '2024-02-15T08:00:00',
    scheduledEnd: '2024-02-15T17:00:00',
    createdAt: '2024-01-20T09:30:00',
    updatedAt: '2024-01-22T14:00:00',
  },
  {
    id: '2',
    code: 'PTT-2024-0157',
    title: 'Thí nghiệm định kỳ MC 171-E1',
    type: 'testing',
    status: 'pending',
    priority: 'normal',
    createdBy: 'Trần Văn B',
    equipment: [],
    steps: [],
    scheduledStart: '2024-02-18T08:00:00',
    scheduledEnd: '2024-02-18T12:00:00',
    createdAt: '2024-01-21T10:00:00',
    updatedAt: '2024-01-21T10:00:00',
  },
  {
    id: '3',
    code: 'PTT-2024-0155',
    title: 'Đóng điện lại sau bảo trì DCL 171-1',
    type: 'reconnect',
    status: 'completed',
    priority: 'normal',
    createdBy: 'Nguyễn Văn A',
    approvedBy: 'Trưởng điều độ',
    executedBy: 'Đội thao tác',
    equipment: [],
    steps: [],
    scheduledStart: '2024-01-25T14:00:00',
    scheduledEnd: '2024-01-25T16:00:00',
    actualStart: '2024-01-25T14:15:00',
    actualEnd: '2024-01-25T15:45:00',
    createdAt: '2024-01-20T08:00:00',
    updatedAt: '2024-01-25T15:45:00',
  },
  {
    id: '4',
    code: 'PTT-2024-0158',
    title: 'Sửa chữa khẩn cấp TU 171',
    type: 'maintenance',
    status: 'in_progress',
    priority: 'critical',
    createdBy: 'Lê Văn C',
    approvedBy: 'Trưởng điều độ',
    executedBy: 'Đội thao tác',
    equipment: [],
    steps: [],
    scheduledStart: '2024-01-22T10:00:00',
    scheduledEnd: '2024-01-22T18:00:00',
    actualStart: '2024-01-22T10:30:00',
    createdAt: '2024-01-21T16:00:00',
    updatedAt: '2024-01-22T10:30:00',
  },
  {
    id: '5',
    code: 'PTT-2024-0154',
    title: 'Kiểm tra định kỳ hệ thống rơ le',
    type: 'testing',
    status: 'draft',
    priority: 'normal',
    createdBy: 'Phạm Văn D',
    equipment: [],
    steps: [],
    scheduledStart: '2024-02-20T08:00:00',
    scheduledEnd: '2024-02-20T17:00:00',
    createdAt: '2024-01-19T11:00:00',
    updatedAt: '2024-01-19T11:00:00',
  },
]

const statusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'; icon: typeof CheckCircle }
> = {
  draft: { label: 'Nháp', variant: 'neutral', icon: Edit },
  pending: { label: 'Chờ duyệt', variant: 'warning', icon: Clock },
  approved: { label: 'Đã duyệt', variant: 'success', icon: CheckCircle },
  in_progress: { label: 'Đang thực hiện', variant: 'info', icon: Play },
  completed: { label: 'Hoàn thành', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', variant: 'error', icon: AlertCircle },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  normal: { label: 'Bình thường', color: 'bg-gray-100 text-gray-700' },
  urgent: { label: 'Gấp', color: 'bg-amber-100 text-amber-700' },
  critical: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-700' },
}

const typeConfig: Record<string, string> = {
  disconnect: 'Cắt điện',
  reconnect: 'Đóng điện',
  maintenance: 'Bảo trì',
  testing: 'Thí nghiệm',
}

export function Tickets() {
  const navigate = useNavigate()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAIAssistant, setShowAIAssistant] = useState(true)

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesSearch =
      ticket.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <Header
        title="Quản lý phiếu thao tác"
        subtitle="Danh sách các phiếu công tác, bảo trì, thí nghiệm"
        actions={
          <Button className="gap-2" onClick={() => navigate('/tickets/create')}>
            <Plus className="w-4 h-4" />
            Tạo phiếu thao tác
          </Button>
        }
      />

      <div className="p-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'draft', label: 'Nháp' },
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'approved', label: 'Đã duyệt' },
              { value: 'in_progress', label: 'Đang thực hiện' },
              { value: 'completed', label: 'Hoàn thành' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer',
                  selectedStatus === tab.value
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]">
                <Input
                  placeholder="Tìm kiếm theo mã hoặc tiêu đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <Button variant="secondary" className="gap-2">
                <Filter className="w-4 h-4" />
                Bộ lọc nâng cao
              </Button>
              <Button variant="secondary" className="gap-2">
                <Download className="w-4 h-4" />
                Xuất Excel
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Mã phiếu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Tiêu đề
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Loại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Mức độ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Người tạo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Thời gian dự kiến
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => {
                    const StatusIcon = statusConfig[ticket.status].icon
                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-primary-600 font-semibold">
                            {ticket.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{ticket.title}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{typeConfig[ticket.type]}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              priorityConfig[ticket.priority].color
                            )}
                          >
                            {priorityConfig[ticket.priority].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{ticket.createdBy}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="text-xs">
                            <p>{formatDateTime(ticket.scheduledStart)}</p>
                            <p className="text-gray-400">- {formatDateTime(ticket.scheduledEnd)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusConfig[ticket.status].variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[ticket.status].label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-medium">1-5</span> trong tổng số{' '}
                <span className="font-medium">{filteredTickets.length}</span> phiếu
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="secondary" size="sm" className="bg-primary-50 text-primary-600">
                  1
                </Button>
                <Button variant="secondary" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Assistant Sidebar */}
        {showAIAssistant && <AIAssistant />}
      </div>
    </div>
  )
}
