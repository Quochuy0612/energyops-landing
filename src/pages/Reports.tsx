import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge, Input } from '@/components/ui'
import {
  Plus,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Download,
  Mail,
  Trash2,
  Eye,
  Clock,
  Play,
  Pause,
  Search,
  Filter,
  CheckCircle,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ReportTab = 'templates' | 'custom' | 'scheduled' | 'history'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'operational' | 'compliance' | 'performance' | 'incident'
  frequency: string
  icon: 'bar' | 'pie' | 'trend' | 'alert'
}

interface ScheduledReport {
  id: string
  name: string
  frequency: string
  recipients: string[]
  nextRun: string
  status: 'active' | 'paused'
}

interface ReportHistory {
  id: string
  name: string
  type: 'template' | 'custom' | 'auto'
  createdAt: string
  createdBy: string
  size: string
}

const reportTemplates: ReportTemplate[] = [
  { id: '1', name: 'Báo cáo vận hành ngày', description: 'Tổng hợp hoạt động vận hành 24h qua', category: 'operational', frequency: 'Ngày', icon: 'bar' },
  { id: '2', name: 'Báo cáo sự cố tháng', description: 'Thống kê sự cố và nguyên nhân trong tháng', category: 'incident', frequency: 'Tháng', icon: 'alert' },
  { id: '3', name: 'Thống kê phiếu thao tác', description: 'Số lượng và trạng thái phiếu thao tác', category: 'operational', frequency: 'Tuần', icon: 'pie' },
  { id: '4', name: 'Báo cáo bảo trì thiết bị', description: 'Tình trạng bảo trì và thiết bị cần chú ý', category: 'performance', frequency: 'Tháng', icon: 'trend' },
  { id: '5', name: 'Báo cáo tuân thủ EVN', description: 'Đánh giá tuân thủ quy định EVN', category: 'compliance', frequency: 'Quý', icon: 'bar' },
  { id: '6', name: 'Hiệu suất hệ thống', description: 'Phân tích hiệu suất và KPI vận hành', category: 'performance', frequency: 'Tháng', icon: 'trend' },
]

const scheduledReports: ScheduledReport[] = [
  { id: '1', name: 'Báo cáo vận hành ngày', frequency: 'Hàng ngày 07:00', recipients: ['dieudo@evn.vn', 'truongca@evn.vn'], nextRun: '31/01/2026 07:00', status: 'active' },
  { id: '2', name: 'Thống kê phiếu tuần', frequency: 'Thứ 2 hàng tuần', recipients: ['quanly@evn.vn'], nextRun: '03/02/2026 08:00', status: 'active' },
  { id: '3', name: 'Báo cáo bảo trì', frequency: 'Ngày 1 hàng tháng', recipients: ['baotri@evn.vn', 'kythuat@evn.vn'], nextRun: '01/02/2026 09:00', status: 'paused' },
]

const reportHistory: ReportHistory[] = [
  { id: '1', name: 'Báo cáo vận hành ngày - 30/01/2026', type: 'auto', createdAt: '30/01/2026 07:05', createdBy: 'Hệ thống', size: '2.4 MB' },
  { id: '2', name: 'Thống kê phiếu thao tác - Tuần 4', type: 'template', createdAt: '29/01/2026 14:30', createdBy: 'Nguyễn Văn A', size: '1.8 MB' },
  { id: '3', name: 'Báo cáo sự cố T1/2026', type: 'template', createdAt: '28/01/2026 10:15', createdBy: 'Trần Thị B', size: '3.2 MB' },
  { id: '4', name: 'Phân tích hiệu suất Q4/2025', type: 'custom', createdAt: '25/01/2026 16:45', createdBy: 'Lê Văn C', size: '5.1 MB' },
  { id: '5', name: 'Báo cáo vận hành ngày - 29/01/2026', type: 'auto', createdAt: '29/01/2026 07:03', createdBy: 'Hệ thống', size: '2.3 MB' },
]

const categoryConfig = {
  operational: { label: 'Vận hành', color: 'bg-blue-100 text-blue-700' },
  compliance: { label: 'Tuân thủ', color: 'bg-purple-100 text-purple-700' },
  performance: { label: 'Hiệu suất', color: 'bg-green-100 text-green-700' },
  incident: { label: 'Sự cố', color: 'bg-red-100 text-red-700' },
}

const typeConfig = {
  template: { label: 'Mẫu', color: 'bg-blue-100 text-blue-700' },
  custom: { label: 'Tùy chỉnh', color: 'bg-purple-100 text-purple-700' },
  auto: { label: 'Tự động', color: 'bg-green-100 text-green-700' },
}

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('templates')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)

  const tabs = [
    { id: 'templates' as ReportTab, label: 'Mẫu báo cáo', count: reportTemplates.length },
    { id: 'custom' as ReportTab, label: 'Báo cáo tùy chỉnh' },
    { id: 'scheduled' as ReportTab, label: 'Đã lên lịch', count: scheduledReports.filter(r => r.status === 'active').length },
    { id: 'history' as ReportTab, label: 'Lịch sử', count: reportHistory.length },
  ]

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'operational', label: 'Vận hành' },
    { id: 'compliance', label: 'Tuân thủ' },
    { id: 'performance', label: 'Hiệu suất' },
    { id: 'incident', label: 'Sự cố' },
  ]

  const getIcon = (icon: ReportTemplate['icon']) => {
    switch (icon) {
      case 'bar': return BarChart3
      case 'pie': return PieChart
      case 'trend': return TrendingUp
      case 'alert': return AlertTriangle
    }
  }

  const filteredTemplates = selectedCategory === 'all'
    ? reportTemplates
    : reportTemplates.filter(t => t.category === selectedCategory)

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setShowGenerateModal(true)
  }

  const renderTemplatesView = () => (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const IconComponent = getIcon(template.icon)
          return (
            <Card
              key={template.id}
              className="hover:shadow-card-hover hover:border-primary-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'p-3 rounded-lg',
                  template.icon === 'bar' && 'bg-blue-100',
                  template.icon === 'pie' && 'bg-purple-100',
                  template.icon === 'trend' && 'bg-green-100',
                  template.icon === 'alert' && 'bg-red-100',
                )}>
                  <IconComponent className={cn(
                    'w-6 h-6',
                    template.icon === 'bar' && 'text-blue-600',
                    template.icon === 'pie' && 'text-purple-600',
                    template.icon === 'trend' && 'text-green-600',
                    template.icon === 'alert' && 'text-red-600',
                  )} />
                </div>
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded',
                  categoryConfig[template.category].color
                )}>
                  {categoryConfig[template.category].label}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="neutral" size="sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {template.frequency}
                </Badge>
                <Button size="sm" onClick={() => handleGenerateReport(template)}>
                  Tạo báo cáo
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderCustomBuilder = () => (
    <div className="grid grid-cols-4 gap-6 min-h-[600px]">
      {/* Left Panel - Data Sources */}
      <Card className="col-span-1">
        <h3 className="font-semibold text-gray-900 mb-4">Nguồn dữ liệu</h3>
        <div className="space-y-3">
          {['Phiếu thao tác', 'Thiết bị', 'Sự cố', 'Người dùng', 'Thời gian'].map(source => (
            <div
              key={source}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-move"
            >
              <p className="text-sm font-medium text-gray-700">{source}</p>
              <p className="text-xs text-gray-500">Kéo thả vào canvas</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Biểu đồ</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: BarChart3, label: 'Cột' },
              { icon: PieChart, label: 'Tròn' },
              { icon: TrendingUp, label: 'Đường' },
              { icon: FileText, label: 'Bảng' },
            ].map(chart => (
              <div
                key={chart.label}
                className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors cursor-move flex flex-col items-center gap-1"
              >
                <chart.icon className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-600">{chart.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Center Panel - Canvas */}
      <Card className="col-span-2 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Canvas báo cáo</h3>
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 hover:border-primary-400 hover:bg-white transition-colors">
            <p className="text-sm">Kéo thả Tiêu đề vào đây</p>
          </div>
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 hover:border-primary-400 hover:bg-white transition-colors">
            <p className="text-sm">Kéo thả Bộ lọc vào đây</p>
          </div>
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 hover:border-primary-400 hover:bg-white transition-colors">
            <p className="text-sm">Kéo thả Dữ liệu hoặc Biểu đồ vào đây</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 hover:border-primary-400 hover:bg-white transition-colors">
              <p className="text-sm">Nhóm theo</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 hover:border-primary-400 hover:bg-white transition-colors">
              <p className="text-sm">Sắp xếp</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Panel - Properties */}
      <Card className="col-span-1">
        <h3 className="font-semibold text-gray-900 mb-4">Thuộc tính</h3>
        <p className="text-sm text-gray-500 mb-4">Chọn một thành phần trên canvas để chỉnh sửa thuộc tính</p>

        <div className="space-y-4 opacity-50">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Tên trường</label>
            <Input disabled placeholder="Chưa chọn" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Định dạng</label>
            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
              <option>Văn bản</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Tổng hợp</label>
            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
              <option>Không</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button className="w-full" disabled>
            Xem trước báo cáo
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderScheduledView = () => (
    <div>
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm lịch mới
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên báo cáo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tần suất</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Người nhận</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lần chạy tiếp</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {scheduledReports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{report.name}</td>
                <td className="px-4 py-3 text-gray-600">{report.frequency}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {report.recipients.map((r, i) => (
                      <span key={i} className="text-xs text-gray-500">{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{report.nextRun}</td>
                <td className="px-4 py-3">
                  <Badge variant={report.status === 'active' ? 'success' : 'neutral'}>
                    {report.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      {report.status === 'active' ? (
                        <Pause className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      <Settings className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderHistoryView = () => (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <Input placeholder="Tìm kiếm báo cáo..." icon={<Search className="w-4 h-4" />} />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên báo cáo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Loại</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Người tạo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kích thước</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reportHistory.map(report => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{report.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded',
                    typeConfig[report.type].color
                  )}>
                    {typeConfig[report.type].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{report.createdAt}</td>
                <td className="px-4 py-3 text-gray-600">{report.createdBy}</td>
                <td className="px-4 py-3 text-gray-600">{report.size}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer" title="Xem">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer" title="Tải xuống">
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer" title="Gửi email">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded cursor-pointer" title="Xóa">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Đã chọn 0 báo cáo</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Tải tất cả
          </Button>
          <Button variant="danger" size="sm" disabled>
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đã chọn
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header
        title="Trung tâm Báo cáo"
        subtitle="Quản lý và xuất báo cáo vận hành"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Lịch báo cáo
            </Button>
            <Button variant="secondary">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo báo cáo mới
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer flex items-center gap-2',
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <Card>
          {activeTab === 'templates' && renderTemplatesView()}
          {activeTab === 'custom' && renderCustomBuilder()}
          {activeTab === 'scheduled' && renderScheduledView()}
          {activeTab === 'history' && renderHistoryView()}
        </Card>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Tạo báo cáo</h2>
              <p className="text-sm text-gray-500">{selectedTemplate.name}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Step 1: Date Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Phạm vi thời gian</label>
                <div className="flex gap-2">
                  {['Hôm nay', '7 ngày', 'Tháng này', 'Tùy chỉnh'].map(preset => (
                    <button
                      key={preset}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Trạm/Khu vực</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Tất cả trạm</option>
                  <option>TBA 220kV Tân Định</option>
                  <option>TBA 110kV Thủ Đức</option>
                </select>
              </div>

              {/* Step 3: Format */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Định dạng xuất</label>
                <div className="flex gap-2">
                  {['PDF', 'Excel', 'Word'].map(format => (
                    <button
                      key={format}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-600">Gửi email ngay sau khi tạo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
                  <span className="text-sm text-gray-600">Lưu vào lịch sử</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowGenerateModal(false)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Tạo báo cáo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
