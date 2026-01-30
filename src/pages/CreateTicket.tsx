import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Node, Edge } from '@xyflow/react'
import { Header } from '@/components/layout'
import { Button, Card, Input, Select } from '@/components/ui'
import { DiagramEditor } from '@/components/diagram'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Settings,
  ListChecks,
  Users,
  Network,
  AlertTriangle,
  Save,
  Send,
  Image,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  icon: typeof FileText
  completed: boolean
}

const steps: Step[] = [
  { id: 1, title: 'Thông tin chung', icon: FileText, completed: false },
  { id: 2, title: 'Thiết bị', icon: Settings, completed: false },
  { id: 3, title: 'Các bước thao tác', icon: ListChecks, completed: false },
  { id: 4, title: 'Phân công', icon: Users, completed: false },
  { id: 5, title: 'Sơ đồ lưới', icon: Network, completed: false },
]

export function CreateTicket() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    priority: 'normal',
    location: '',
    scheduledStart: '',
    scheduledEnd: '',
    equipment: [] as string[],
    steps: [] as { action: string; equipment: string }[],
    assignee: '',
    approver: '',
    notes: '',
    // Diagram data
    diagramNodes: [] as Node[],
    diagramEdges: [] as Edge[],
    diagramImage: null as string | null,
  })

  const handleNext = () => {
    // Validate diagram step before submitting
    if (currentStep === 5 && formData.diagramNodes.length > 0 && !formData.diagramImage) {
      if (!window.confirm('Bạn chưa xuất hình ảnh sơ đồ. Tiếp tục mà không có hình ảnh?')) {
        return
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
    navigate('/tickets')
  }

  const handleSubmit = () => {
    // Validate diagram before final submit
    if (formData.diagramNodes.length > 0 && !formData.diagramImage) {
      if (!window.confirm('Bạn chưa xuất hình ảnh sơ đồ. Gửi phê duyệt mà không có hình ảnh?')) {
        return
      }
    }
    console.log('Submitting:', formData)
    navigate('/tickets')
  }

  // Diagram handlers
  const handleDiagramNodesChange = useCallback((nodes: Node[]) => {
    setFormData((prev) => ({ ...prev, diagramNodes: nodes }))
  }, [])

  const handleDiagramEdgesChange = useCallback((edges: Edge[]) => {
    setFormData((prev) => ({ ...prev, diagramEdges: edges }))
  }, [])

  const handleDiagramImageExport = useCallback((imageData: string) => {
    setFormData((prev) => ({ ...prev, diagramImage: imageData }))
  }, [])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Mã phiếu"
                value="PTT-2024-0159"
                disabled
                helperText="Mã phiếu được tự động tạo"
              />
              <Select
                label="Loại phiếu"
                options={[
                  { value: 'disconnect', label: 'Cắt điện' },
                  { value: 'reconnect', label: 'Đóng điện' },
                  { value: 'maintenance', label: 'Bảo trì' },
                  { value: 'testing', label: 'Thí nghiệm' },
                ]}
                placeholder="Chọn loại phiếu"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            <Input
              label="Tiêu đề phiếu"
              placeholder="Nhập tiêu đề phiếu thao tác..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Mức độ ưu tiên"
                options={[
                  { value: 'normal', label: 'Bình thường' },
                  { value: 'urgent', label: 'Gấp' },
                  { value: 'critical', label: 'Khẩn cấp' },
                ]}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
              <Select
                label="Vị trí"
                options={[
                  { value: 'tba-110kv-thu-duc', label: 'TBA 110kV Thủ Đức' },
                  { value: 'tba-110kv-binh-duong', label: 'TBA 110kV Bình Dương' },
                  { value: 'duong-day-171', label: 'Đường dây 171' },
                ]}
                placeholder="Chọn vị trí"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Thời gian bắt đầu dự kiến"
                type="datetime-local"
                value={formData.scheduledStart}
                onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
              />
              <Input
                label="Thời gian kết thúc dự kiến"
                type="datetime-local"
                value={formData.scheduledEnd}
                onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mục đích / Nội dung công tác
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Mô tả chi tiết nội dung công tác, mục đích thực hiện..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Safety Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Lưu ý an toàn</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Đảm bảo kiểm tra đầy đủ các biện pháp an toàn trước khi thực hiện thao tác.
                  Tất cả các bước phải được xác nhận bởi người giám sát an toàn.
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Danh sách thiết bị liên quan</h3>
              <Button variant="secondary" size="sm">
                + Thêm thiết bị
              </Button>
            </div>

            {/* Equipment List */}
            <div className="space-y-3">
              {[
                { code: 'MBA-T1-110', name: 'Máy biến áp T1', voltage: '110kV', status: 'active' },
                { code: 'MC-171-E1', name: 'Máy cắt 171-E1', voltage: '110kV', status: 'active' },
                { code: 'DCL-171-1', name: 'Dao cách ly 171-1', voltage: '110kV', status: 'active' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      defaultChecked
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Mã: {item.code} | Điện áp: {item.voltage}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                    Đang hoạt động
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tìm kiếm thiết bị</h4>
              <div className="flex gap-3">
                <Input placeholder="Nhập mã hoặc tên thiết bị..." className="flex-1" />
                <Button variant="secondary">Tìm kiếm</Button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Các bước thao tác</h3>
              <Button variant="secondary" size="sm">
                + Thêm bước
              </Button>
            </div>

            {/* Operation Steps */}
            <div className="space-y-3">
              {[
                { order: 1, action: 'Cắt máy cắt 171-E1', equipment: 'MC-171-E1', state: 'Mở' },
                { order: 2, action: 'Mở dao cách ly 171-1', equipment: 'DCL-171-1', state: 'Mở' },
                { order: 3, action: 'Mở dao cách ly 171-2', equipment: 'DCL-171-2', state: 'Mở' },
                { order: 4, action: 'Đóng dao tiếp địa 171-TD', equipment: 'TD-171', state: 'Đóng' },
                { order: 5, action: 'Treo biển cảnh báo', equipment: 'N/A', state: 'Hoàn thành' },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.action}</p>
                    <p className="text-xs text-gray-500">
                      Thiết bị: {step.equipment} | Trạng thái yêu cầu: {step.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded cursor-pointer">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Gợi ý từ AI</h4>
              <p className="text-sm text-blue-700">
                Dựa trên thiết bị đã chọn, hệ thống đề xuất thêm bước "Kiểm tra điện áp dư"
                sau khi mở dao cách ly để đảm bảo an toàn.
              </p>
              <Button variant="secondary" size="sm" className="mt-2">
                Áp dụng gợi ý
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Phân công thực hiện</h3>

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Người lập phiếu"
                options={[
                  { value: 'nguyen-van-a', label: 'Nguyễn Văn A - Điều độ viên' },
                ]}
                value="nguyen-van-a"
                disabled
              />
              <Select
                label="Người duyệt phiếu"
                options={[
                  { value: 'truong-dieu-do', label: 'Trưởng điều độ' },
                  { value: 'pho-dieu-do', label: 'Phó điều độ' },
                ]}
                placeholder="Chọn người duyệt"
                value={formData.approver}
                onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Người nhận phiếu"
                options={[
                  { value: 'tran-van-b', label: 'Trần Văn B - Điều độ viên' },
                  { value: 'le-van-c', label: 'Lê Văn C - Điều độ viên' },
                ]}
                placeholder="Chọn người nhận"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              />
              <Select
                label="Đội thao tác"
                options={[
                  { value: 'doi-1', label: 'Đội thao tác 1' },
                  { value: 'doi-2', label: 'Đội thao tác 2' },
                ]}
                placeholder="Chọn đội thao tác"
              />
            </div>

            <Select
              label="Giám sát an toàn"
              options={[
                { value: 'giam-sat-1', label: 'Nguyễn Văn X - GSAT' },
                { value: 'giam-sat-2', label: 'Trần Văn Y - GSAT' },
              ]}
              placeholder="Chọn giám sát an toàn"
            />

            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tóm tắt phiếu thao tác</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mã phiếu:</span>
                  <span className="ml-2 font-medium">PTT-2024-0159</span>
                </div>
                <div>
                  <span className="text-gray-500">Loại:</span>
                  <span className="ml-2 font-medium">{formData.type || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Số thiết bị:</span>
                  <span className="ml-2 font-medium">3</span>
                </div>
                <div>
                  <span className="text-gray-500">Số bước thao tác:</span>
                  <span className="ml-2 font-medium">5</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sơ đồ lưới điện</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Vẽ sơ đồ đơn tuyến mô tả khu vực thao tác
                </p>
              </div>
              {formData.diagramImage && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Image className="w-4 h-4" />
                  <span>Đã xuất hình ảnh</span>
                </div>
              )}
            </div>

            {/* Diagram Editor */}
            <DiagramEditor
              initialNodes={formData.diagramNodes}
              initialEdges={formData.diagramEdges}
              onNodesChange={handleDiagramNodesChange}
              onEdgesChange={handleDiagramEdgesChange}
              onImageExport={handleDiagramImageExport}
            />

            {/* Optional: Show exported image preview */}
            {formData.diagramImage && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Xem trước hình ảnh đã xuất</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <img
                    src={formData.diagramImage}
                    alt="Sơ đồ lưới điện"
                    className="max-h-48 mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Network className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Hướng dẫn</h4>
                <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-0.5">
                  <li>Kéo ký hiệu từ bảng bên trái vào vùng vẽ</li>
                  <li>Nhấp đúp vào ký hiệu để thêm nhãn (ví dụ: MC-171)</li>
                  <li>Nhấn nút "Xuất PNG" để lưu sơ đồ thành hình ảnh</li>
                  <li>Sơ đồ này sẽ được đính kèm vào phiếu thao tác</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Tạo mới phiếu thao tác"
        subtitle="Điền thông tin để tạo phiếu công tác mới"
        actions={
          <Button variant="ghost" onClick={() => navigate('/tickets')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                        isCompleted
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : isCurrent
                          ? 'bg-white border-primary-500 text-primary-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-xs font-medium whitespace-nowrap',
                        isCurrent ? 'text-primary-600' : 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-16 h-0.5 mx-2',
                        isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className={cn(
          'mx-auto',
          currentStep === 5 ? 'max-w-6xl' : 'max-w-4xl'
        )}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Bước {currentStep} / {steps.length}
            </p>
          </div>

          {renderStepContent()}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button variant="ghost" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Lưu nháp
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <Button variant="secondary" onClick={handlePrev}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={handleNext}>
                  Tiếp theo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi phê duyệt
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
