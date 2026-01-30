import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Badge, Input, Select, Card } from '@/components/ui'
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { WorkRequest } from '@/types'

// Mock data
const mockRequests: WorkRequest[] = [
  {
    id: '1',
    code: 'REQ-2024-001',
    title: 'Bảo dưỡng máy biến áp T1 110kV',
    type: 'maintenance',
    status: 'pending',
    priority: 'high',
    requestor: 'Đội QLTS',
    department: 'Đội Truyền tải 1',
    equipment: 'Máy biến áp T1 110kV',
    location: 'TBA 110kV Thủ Đức',
    scheduledDate: '2024-02-15',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    code: 'REQ-2024-002',
    title: 'Thay thế sứ cách điện đường dây 110kV',
    type: 'repair',
    status: 'approved',
    priority: 'critical',
    requestor: 'Phòng Kỹ thuật',
    department: 'Đội Truyền tải 2',
    equipment: 'Đường dây 110kV Thủ Đức - Bình Dương',
    location: 'Đường dây 171',
    scheduledDate: '2024-02-10',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    code: 'REQ-2024-003',
    title: 'Thí nghiệm định kỳ máy cắt 171-E1',
    type: 'testing',
    status: 'in_progress',
    priority: 'medium',
    requestor: 'Đội Thí nghiệm',
    department: 'Đội Thí nghiệm',
    equipment: 'Máy cắt 171-E1',
    location: 'TBA 110kV Thủ Đức',
    scheduledDate: '2024-02-05',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    code: 'REQ-2024-004',
    title: 'Kiểm định rơ le bảo vệ ngăn lộ 171',
    type: 'testing',
    status: 'completed',
    priority: 'low',
    requestor: 'Đội Thí nghiệm',
    department: 'Phòng Rơ le',
    equipment: 'Hệ thống rơ le bảo vệ',
    location: 'TBA 110kV Thủ Đức',
    scheduledDate: '2024-01-25',
    createdAt: '2024-01-10',
  },
  {
    id: '5',
    code: 'REQ-2024-005',
    title: 'Xử lý sự cố rò điện TU 171',
    type: 'emergency',
    status: 'approved',
    priority: 'critical',
    requestor: 'Điều độ viên',
    department: 'Đội QLTS',
    equipment: 'TU 171',
    location: 'TBA 110kV Thủ Đức',
    scheduledDate: '2024-01-22',
    createdAt: '2024-01-21',
  },
]

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  pending: { label: 'Chờ duyệt', variant: 'warning' },
  approved: { label: 'Đã duyệt', variant: 'success' },
  rejected: { label: 'Từ chối', variant: 'error' },
  in_progress: { label: 'Đang xử lý', variant: 'info' },
  completed: { label: 'Hoàn thành', variant: 'success' },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Thấp', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'Trung bình', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'Cao', color: 'bg-amber-100 text-amber-700' },
  critical: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-700' },
}

const typeConfig: Record<string, string> = {
  maintenance: 'Bảo trì',
  repair: 'Sửa chữa',
  testing: 'Thí nghiệm',
  emergency: 'Sự cố',
}

export function Requests() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRequests = mockRequests.filter((req) => {
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus
    const matchesSearch =
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <Header
        title="Quản lý yêu cầu"
        subtitle="Danh sách các yêu cầu công tác"
        actions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo yêu cầu
          </Button>
        }
      />

      <div className="p-6">
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
            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ duyệt' },
                { value: 'approved', label: 'Đã duyệt' },
                { value: 'in_progress', label: 'Đang xử lý' },
                { value: 'completed', label: 'Hoàn thành' },
                { value: 'rejected', label: 'Từ chối' },
              ]}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-48"
            />
            <Button variant="secondary" className="gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc
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
                    Mã yêu cầu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Ưu tiên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Đơn vị yêu cầu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Ngày dự kiến
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
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary-600 font-semibold">
                        {request.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{request.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{request.equipment}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {typeConfig[request.type]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          priorityConfig[request.priority].color
                        )}
                      >
                        {priorityConfig[request.priority].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{request.requestor}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(request.scheduledDate)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig[request.status].variant}>
                        {statusConfig[request.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Hiển thị <span className="font-medium">1-5</span> trong tổng số{' '}
              <span className="font-medium">{filteredRequests.length}</span> yêu cầu
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled>
                Trước
              </Button>
              <Button variant="secondary" size="sm" className="bg-primary-50 text-primary-600">
                1
              </Button>
              <Button variant="secondary" size="sm">
                2
              </Button>
              <Button variant="secondary" size="sm">
                3
              </Button>
              <Button variant="secondary" size="sm">
                Sau
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
