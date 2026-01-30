import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/layout'
import { Button, Badge, Card } from '@/components/ui'
import {
  ArrowLeft,
  Edit,
  Printer,
  CheckCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  Play,
  Check,
  FileText,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock ticket data
const ticketData = {
  id: '1',
  code: 'PTT-2024-0156',
  title: 'Cắt điện bảo trì MBA T1 110kV',
  type: 'disconnect',
  status: 'approved',
  priority: 'urgent',
  createdBy: 'Nguyễn Văn A',
  approvedBy: 'Trưởng điều độ',
  location: 'TBA 110kV Thủ Đức',
  scheduledStart: '15/02/2024 08:00',
  scheduledEnd: '15/02/2024 17:00',
  createdAt: '20/01/2024 09:30',
  approvedAt: '22/01/2024 14:00',
  description:
    'Cắt điện để thực hiện bảo trì định kỳ máy biến áp T1 110kV. Kiểm tra dầu cách điện, vệ sinh sứ, kiểm tra tiếp điểm.',
  equipment: [
    { code: 'MBA-T1-110', name: 'Máy biến áp T1', voltage: '110kV' },
    { code: 'MC-171-E1', name: 'Máy cắt 171-E1', voltage: '110kV' },
    { code: 'DCL-171-1', name: 'Dao cách ly 171-1', voltage: '110kV' },
    { code: 'DCL-171-2', name: 'Dao cách ly 171-2', voltage: '110kV' },
    { code: 'TD-171', name: 'Dao tiếp địa 171', voltage: '110kV' },
  ],
  steps: [
    { order: 1, action: 'Kiểm tra sơ đồ lưới, xác nhận trạng thái ban đầu', status: 'completed', executedAt: '08:05', executedBy: 'Nguyễn Văn A' },
    { order: 2, action: 'Cắt máy cắt 171-E1', status: 'completed', executedAt: '08:15', executedBy: 'Đội thao tác' },
    { order: 3, action: 'Mở dao cách ly 171-1 (phía nguồn)', status: 'completed', executedAt: '08:25', executedBy: 'Đội thao tác' },
    { order: 4, action: 'Mở dao cách ly 171-2 (phía tải)', status: 'in_progress', executedBy: 'Đội thao tác' },
    { order: 5, action: 'Đóng dao tiếp địa 171-TD', status: 'pending' },
    { order: 6, action: 'Treo biển cảnh báo tại các vị trí', status: 'pending' },
    { order: 7, action: 'Kiểm tra điện áp dư, xác nhận an toàn', status: 'pending' },
    { order: 8, action: 'Bàn giao hiện trường cho đơn vị thi công', status: 'pending' },
  ],
  approvalHistory: [
    { action: 'Tạo phiếu', user: 'Nguyễn Văn A', role: 'Điều độ viên', time: '20/01/2024 09:30', status: 'created' },
    { action: 'Gửi duyệt', user: 'Nguyễn Văn A', role: 'Điều độ viên', time: '20/01/2024 10:00', status: 'submitted' },
    { action: 'Phê duyệt', user: 'Trưởng điều độ', role: 'Trưởng ca', time: '22/01/2024 14:00', status: 'approved' },
  ],
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }> = {
  pending: { label: 'Chờ thực hiện', variant: 'warning' },
  in_progress: { label: 'Đang thực hiện', variant: 'info' },
  completed: { label: 'Hoàn thành', variant: 'success' },
}

export function TicketDetail() {
  const navigate = useNavigate()
  useParams() // For future use with dynamic ticket loading

  return (
    <div className="min-h-screen">
      <Header
        title={`Phiếu số: ${ticketData.code}`}
        subtitle={ticketData.title}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/tickets')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              In phiếu
            </Button>
            <Button variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="success">
              <Play className="w-4 h-4 mr-2" />
              Bắt đầu thực hiện
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Status Banner */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-800">Phiếu đã được phê duyệt</p>
                  <p className="text-sm text-emerald-600">
                    Phê duyệt bởi {ticketData.approvedBy} lúc {ticketData.approvedAt}
                  </p>
                </div>
              </div>
              <Badge variant="success" size="md">
                Đã duyệt
              </Badge>
            </div>

            {/* Operation Steps */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Các bước thao tác</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Tiến độ:</span>
                  <span className="font-medium text-primary-600">3/8 bước</span>
                </div>
              </div>

              <div className="space-y-3">
                {ticketData.steps.map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                      step.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-200'
                        : step.status === 'in_progress'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'in_progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {step.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-semibold">{step.order}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-medium',
                          step.status === 'completed'
                            ? 'text-emerald-800'
                            : step.status === 'in_progress'
                            ? 'text-blue-800'
                            : 'text-gray-700'
                        )}
                      >
                        {step.action}
                      </p>
                      {(step.executedAt || step.executedBy) && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {step.executedAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.executedAt}
                            </span>
                          )}
                          {step.executedBy && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {step.executedBy}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge variant={statusConfig[step.status]?.variant || 'neutral'}>
                      {statusConfig[step.status]?.label || 'Chờ'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Equipment List */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thiết bị liên quan</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                        Mã thiết bị
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                        Tên thiết bị
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                        Điện áp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ticketData.equipment.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-xs text-primary-600">
                          {item.code}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-2 text-gray-600">{item.voltage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phiếu</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Loại phiếu</p>
                    <p className="text-sm font-medium text-gray-900">Cắt điện bảo trì</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Mức độ ưu tiên</p>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      Gấp
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Vị trí</p>
                    <p className="text-sm font-medium text-gray-900">{ticketData.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Thời gian dự kiến</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ticketData.scheduledStart}
                    </p>
                    <p className="text-xs text-gray-500">đến {ticketData.scheduledEnd}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Người lập phiếu</p>
                    <p className="text-sm font-medium text-gray-900">{ticketData.createdBy}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Approval History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử phê duyệt</h3>
              <div className="space-y-4">
                {ticketData.approvalHistory.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          item.status === 'approved'
                            ? 'bg-emerald-500'
                            : item.status === 'submitted'
                            ? 'bg-blue-500'
                            : 'bg-gray-400'
                        )}
                      />
                      {index < ticketData.approvalHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">
                        {item.user} - {item.role}
                      </p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả công việc</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ticketData.description}</p>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tài liệu đính kèm</h3>
              <Button variant="secondary" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Tải phiếu PDF
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
