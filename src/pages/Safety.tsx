import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge, Input } from '@/components/ui'
import {
  Shield,
  AlertTriangle,
  FileText,
  GraduationCap,
  Bell,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  Search,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  Flame,
  Zap,
  HardHat,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Filter,
  Settings,
  Users,
  Award,
  BookOpen,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
} from 'recharts'

type TabType = 'overview' | 'procedures' | 'incidents' | 'training' | 'alerts'

// Mock data
const kpiCards = [
  {
    id: 'safe_days',
    label: 'Ngày không sự cố',
    value: 127,
    unit: 'ngày',
    icon: Shield,
    color: 'text-success',
    bgColor: 'bg-success-light',
  },
  {
    id: 'incidents_month',
    label: 'Sự cố tháng này',
    value: 2,
    target: 3,
    trend: -33,
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning-light',
  },
  {
    id: 'training_compliance',
    label: 'Tuân thủ đào tạo',
    value: 94,
    unit: '%',
    icon: GraduationCap,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    id: 'open_alerts',
    label: 'Cảnh báo đang mở',
    value: 3,
    isCritical: true,
    icon: Bell,
    color: 'text-error',
    bgColor: 'bg-error-light',
  },
]

const incidentTrend = [
  { month: 'T1', value: 3 },
  { month: 'T2', value: 2 },
  { month: 'T3', value: 4 },
  { month: 'T4', value: 1 },
  { month: 'T5', value: 2 },
  { month: 'T6', value: 3 },
  { month: 'T7', value: 2 },
  { month: 'T8', value: 1 },
  { month: 'T9', value: 2 },
  { month: 'T10', value: 3 },
  { month: 'T11', value: 1 },
  { month: 'T12', value: 2 },
]

const incidentByType = [
  { name: 'Điện giật', value: 35, color: '#EF4444' },
  { name: 'Té ngã', value: 25, color: '#F59E0B' },
  { name: 'Cháy nổ', value: 20, color: '#F97316' },
  { name: 'Khác', value: 20, color: '#6B7280' },
]

const complianceByDept = [
  { dept: 'Điều độ MN', value: 98 },
  { dept: 'Điều độ MT', value: 92 },
  { dept: 'Điều độ MB', value: 95 },
  { dept: 'Bảo trì', value: 88 },
  { dept: 'Quản lý', value: 100 },
]

const procedureCategories = [
  { id: 'general', name: 'Quy trình chung', count: 12, icon: FileText },
  { id: 'electrical', name: 'An toàn điện', count: 24, icon: Zap },
  { id: 'height', name: 'Làm việc trên cao', count: 8, icon: TrendingUp },
  { id: 'confined', name: 'Không gian kín', count: 6, icon: Shield },
  { id: 'fire', name: 'Phòng cháy chữa cháy', count: 15, icon: Flame },
  { id: 'first_aid', name: 'Sơ cứu khẩn cấp', count: 10, icon: Plus },
  { id: 'ppe', name: 'Bảo hộ lao động', count: 18, icon: HardHat },
]

const procedures = [
  {
    id: '1',
    title: 'Quy trình cắt điện và tiếp địa',
    category: 'electrical',
    version: '3.2',
    updatedAt: new Date('2026-01-15'),
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    title: 'Lockout/Tagout (LOTO) cho thiết bị cao áp',
    category: 'electrical',
    version: '2.1',
    updatedAt: new Date('2025-12-20'),
    fileType: 'PDF',
    fileSize: '3.1 MB',
  },
  {
    id: '3',
    title: 'Hướng dẫn sử dụng dây an toàn',
    category: 'height',
    version: '1.5',
    updatedAt: new Date('2025-11-10'),
    fileType: 'PDF',
    fileSize: '1.8 MB',
  },
  {
    id: '4',
    title: 'Quy trình kiểm tra PPE định kỳ',
    category: 'ppe',
    version: '2.0',
    updatedAt: new Date('2026-01-05'),
    fileType: 'PDF',
    fileSize: '1.2 MB',
  },
]

const incidents = [
  {
    id: 'SC-2026-001',
    date: new Date('2026-01-28'),
    type: 'electric_shock',
    location: 'TBA 220kV Tân Định',
    severity: 'minor' as const,
    status: 'investigating' as const,
    reporter: 'Nguyễn Văn An',
    description: 'Nhân viên bị điện giật nhẹ khi kiểm tra tủ điện do thiếu kiểm tra tiếp địa.',
  },
  {
    id: 'SC-2026-002',
    date: new Date('2026-01-15'),
    type: 'fall',
    location: 'TBA 110kV Thủ Đức',
    severity: 'medium' as const,
    status: 'closed' as const,
    reporter: 'Trần Thị Bình',
    description: 'Té ngã từ thang khi bảo trì thiết bị. Đã khắc phục bằng thang mới có khóa.',
  },
  {
    id: 'SC-2025-089',
    date: new Date('2025-12-20'),
    type: 'near_miss',
    location: 'TBA 500kV Pleiku',
    severity: 'near_miss' as const,
    status: 'closed' as const,
    reporter: 'Lê Hoàng Cường',
    description: 'Suýt chạm vào thiết bị đang mang điện do thiếu biển báo.',
  },
]

const certifications = [
  {
    id: '1',
    employee: 'Nguyễn Văn An',
    certType: 'An toàn điện bậc 5',
    issuedDate: new Date('2024-03-15'),
    expiryDate: new Date('2027-03-15'),
    status: 'valid' as const,
  },
  {
    id: '2',
    employee: 'Trần Thị Bình',
    certType: 'Làm việc trên cao',
    issuedDate: new Date('2025-06-20'),
    expiryDate: new Date('2026-06-20'),
    status: 'expiring' as const,
  },
  {
    id: '3',
    employee: 'Lê Hoàng Cường',
    certType: 'Phòng cháy chữa cháy',
    issuedDate: new Date('2023-01-10'),
    expiryDate: new Date('2026-01-10'),
    status: 'expired' as const,
  },
  {
    id: '4',
    employee: 'Phạm Minh Đức',
    certType: 'Sơ cấp cứu',
    issuedDate: new Date('2025-08-01'),
    expiryDate: new Date('2026-08-01'),
    status: 'valid' as const,
  },
]

const trainingCourses = [
  {
    id: '1',
    name: 'An toàn điện cơ bản',
    enrolled: 45,
    completed: 42,
    dueDate: new Date('2026-02-15'),
  },
  {
    id: '2',
    name: 'Phòng cháy chữa cháy 2026',
    enrolled: 60,
    completed: 35,
    dueDate: new Date('2026-03-01'),
  },
  {
    id: '3',
    name: 'Cập nhật quy trình LOTO',
    enrolled: 30,
    completed: 30,
    dueDate: new Date('2026-01-31'),
  },
]

const alerts = [
  {
    id: '1',
    type: 'critical',
    message: 'Nhiệt độ MBA-T1 vượt ngưỡng 85°C',
    location: 'TBA 220kV Tân Định',
    timestamp: new Date('2026-01-30T08:15:00'),
    acknowledged: false,
  },
  {
    id: '2',
    type: 'warning',
    message: 'Dầu cách điện MBA-T2 thấp hơn mức quy định',
    location: 'TBA 110kV Thủ Đức',
    timestamp: new Date('2026-01-30T07:45:00'),
    acknowledged: true,
  },
  {
    id: '3',
    type: 'info',
    message: 'Bảo trì định kỳ MC-110-01 sắp đến hạn',
    location: 'TBA 110kV Gò Vấp',
    timestamp: new Date('2026-01-30T06:00:00'),
    acknowledged: true,
  },
]

const alertRules = [
  { id: '1', condition: 'Nhiệt độ MBA > 80°C', severity: 'critical', notifications: 'Email, SMS', active: true },
  { id: '2', condition: 'Mức dầu < 90%', severity: 'warning', notifications: 'Email', active: true },
  { id: '3', condition: 'Bảo trì quá hạn > 7 ngày', severity: 'warning', notifications: 'In-app', active: true },
  { id: '4', condition: 'Sự cố an toàn mới', severity: 'critical', notifications: 'Email, SMS, In-app', active: true },
]

export function Safety() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [incidentSubTab, setIncidentSubTab] = useState<'all' | 'investigating' | 'closed'>('all')
  const [trainingSubTab, setTrainingSubTab] = useState<'certs' | 'courses' | 'history'>('certs')
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null)

  const tabs = [
    { id: 'overview' as TabType, label: 'Tổng quan', icon: Shield },
    { id: 'procedures' as TabType, label: 'Quy trình', icon: FileText },
    { id: 'incidents' as TabType, label: 'Sự cố', icon: AlertTriangle },
    { id: 'training' as TabType, label: 'Đào tạo', icon: GraduationCap },
    { id: 'alerts' as TabType, label: 'Cảnh báo', icon: Bell },
  ]

  const getSeverityBadge = (severity: 'critical' | 'medium' | 'minor' | 'near_miss') => {
    const styles = {
      critical: 'bg-error text-white',
      medium: 'bg-warning text-white',
      minor: 'bg-primary-500 text-white',
      near_miss: 'bg-gray-400 text-white',
    }
    const labels = {
      critical: 'Nghiêm trọng',
      medium: 'Trung bình',
      minor: 'Nhẹ',
      near_miss: 'Suýt xảy ra',
    }
    return (
      <span className={cn('px-2 py-0.5 text-xs font-medium rounded', styles[severity])}>
        {labels[severity]}
      </span>
    )
  }

  const getIncidentStatusBadge = (status: 'open' | 'investigating' | 'closed') => {
    const styles = {
      open: 'bg-error-light text-error border-error/20',
      investigating: 'bg-warning-light text-warning border-warning/20',
      closed: 'bg-success-light text-success border-success/20',
    }
    const labels = {
      open: 'Mở',
      investigating: 'Đang điều tra',
      closed: 'Đã đóng',
    }
    return (
      <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const getCertStatusBadge = (status: 'valid' | 'expiring' | 'expired') => {
    const styles = {
      valid: 'bg-success-light text-success border-success/20',
      expiring: 'bg-warning-light text-warning border-warning/20',
      expired: 'bg-error-light text-error border-error/20',
    }
    const labels = {
      valid: 'Còn hạn',
      expiring: 'Sắp hết hạn',
      expired: 'Hết hạn',
    }
    return (
      <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'electric_shock':
        return <Zap className="w-4 h-4 text-error" />
      case 'fall':
        return <TrendingDown className="w-4 h-4 text-warning" />
      case 'fire':
        return <Flame className="w-4 h-4 text-orange-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (incidentSubTab === 'all') return true
    return inc.status === incidentSubTab
  })

  const filteredProcedures = selectedCategory
    ? procedures.filter((p) => p.category === selectedCategory)
    : procedures

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Trung tâm An toàn"
        subtitle="Quản lý quy trình, sự cố, đào tạo và cảnh báo an toàn"
        actions={
          <div className="flex items-center gap-3">
            <Badge
              variant="success"
              size="md"
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              96/100 điểm
            </Badge>
            {alerts.some((a) => !a.acknowledged && a.type === 'critical') && (
              <Badge variant="error" size="md" className="gap-2 animate-pulse">
                <Bell className="w-4 h-4" />
                Cảnh báo khẩn
              </Badge>
            )}
            <Button variant="secondary" className="gap-2">
              <Settings className="w-4 h-4" />
              Cài đặt cảnh báo
            </Button>
            <Button variant="secondary" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Kiểm tra an toàn
            </Button>
            <Button variant="primary" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Báo cáo sự cố
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {kpiCards.map((kpi) => (
            <Card key={kpi.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={cn('text-3xl font-bold', kpi.color)}>{kpi.value}</span>
                    {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
                  </div>
                  {kpi.target && (
                    <p className="text-xs text-gray-500 mt-1">
                      Mục tiêu: ≤{kpi.target}
                      {kpi.trend && (
                        <span className={kpi.trend < 0 ? 'text-success ml-2' : 'text-error ml-2'}>
                          {kpi.trend > 0 ? '+' : ''}
                          {kpi.trend}%
                        </span>
                      )}
                    </p>
                  )}
                  {kpi.isCritical && kpi.value > 0 && (
                    <p className="text-xs text-error mt-1">Cần xử lý ngay!</p>
                  )}
                </div>
                <div className={cn('p-3 rounded-lg', kpi.bgColor)}>
                  <kpi.icon className={cn('w-6 h-6', kpi.color)} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Incident Trend Chart */}
            <Card className="col-span-6 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Xu hướng sự cố (12 tháng)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={incidentTrend}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Incident by Type */}
            <Card className="col-span-3 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Phân loại sự cố</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incidentByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {incidentByType.map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compliance by Department */}
            <Card className="col-span-3 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Tuân thủ theo phòng ban</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceByDept} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="dept" tick={{ fontSize: 10 }} width={80} />
                    <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Incidents */}
            <Card className="col-span-6 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sự cố gần đây</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('incidents')}>
                  Xem tất cả
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {incidents.slice(0, 3).map((inc) => (
                  <div
                    key={inc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getIncidentTypeIcon(inc.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inc.id}</p>
                        <p className="text-xs text-gray-500">{inc.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(inc.severity)}
                      {getIncidentStatusBadge(inc.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Safety Activities */}
            <Card className="col-span-6 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Lịch an toàn sắp tới</h3>
                <Button variant="ghost" size="sm">
                  Xem lịch
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Diễn tập PCCC Q1/2026</p>
                    <p className="text-xs text-gray-500">02/02/2026 - Toàn bộ trạm</p>
                  </div>
                  <Badge variant="info" size="sm">
                    Sắp tới
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-3 bg-warning-light rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-warning/20 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Đào tạo An toàn điện (8 người còn lại)
                    </p>
                    <p className="text-xs text-gray-500">Hạn: 15/02/2026</p>
                  </div>
                  <Badge variant="warning" size="sm">
                    Cần hoàn thành
                  </Badge>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Kiểm tra PPE định kỳ</p>
                    <p className="text-xs text-gray-500">05/02/2026 - TBA 220kV Tân Định</p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    Đã lên lịch
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab: Procedures */}
        {activeTab === 'procedures' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Category Sidebar */}
            <div className="col-span-3">
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Danh mục quy trình</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                      !selectedCategory
                        ? 'bg-primary-50 border-l-2 border-primary-500'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-700">Tất cả</span>
                    </div>
                    <Badge variant="neutral" size="sm">
                      {procedures.length}
                    </Badge>
                  </button>
                  {procedureCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                        selectedCategory === cat.id
                          ? 'bg-primary-50 border-l-2 border-primary-500'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon
                          className={cn(
                            'w-5 h-5',
                            selectedCategory === cat.id ? 'text-primary-500' : 'text-gray-400'
                          )}
                        />
                        <span
                          className={cn(
                            'font-medium',
                            selectedCategory === cat.id ? 'text-primary-700' : 'text-gray-700'
                          )}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {cat.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Procedure List */}
            <div className="col-span-9 space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Tìm kiếm quy trình..." className="pl-10" />
                  </div>
                  <Button variant="primary" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Tải lên quy trình mới
                  </Button>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                {filteredProcedures.map((proc) => (
                  <Card key={proc.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-error-light rounded-lg">
                        <FileText className="w-6 h-6 text-error" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{proc.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="neutral" size="sm">
                            v{proc.version}
                          </Badge>
                          <span className="text-xs text-gray-500">{proc.fileSize}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Cập nhật: {formatDate(proc.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Tải xuống
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Incidents */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            {/* Sub-tabs and Filters */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'investigating', label: 'Đang điều tra' },
                    { id: 'closed', label: 'Đã đóng' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setIncidentSubTab(tab.id as 'all' | 'investigating' | 'closed')}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-md transition-all',
                        incidentSubTab === tab.id
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Tất cả loại</option>
                    <option value="electric_shock">Điện giật</option>
                    <option value="fall">Té ngã</option>
                    <option value="fire">Cháy nổ</option>
                    <option value="other">Khác</option>
                  </select>
                  <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Tất cả mức độ</option>
                    <option value="critical">Nghiêm trọng</option>
                    <option value="medium">Trung bình</option>
                    <option value="minor">Nhẹ</option>
                    <option value="near_miss">Suýt xảy ra</option>
                  </select>
                  <Button variant="primary" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Báo cáo sự cố
                  </Button>
                </div>
              </div>
            </Card>

            {/* Incident Table */}
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8" />
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mã sự cố
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Loại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vị trí
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mức độ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Người báo cáo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIncidents.map((inc) => (
                    <>
                      <tr
                        key={inc.id}
                        className={cn(
                          'hover:bg-gray-50 cursor-pointer',
                          expandedIncident === inc.id && 'bg-gray-50'
                        )}
                        onClick={() =>
                          setExpandedIncident(expandedIncident === inc.id ? null : inc.id)
                        }
                      >
                        <td className="px-4 py-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            {expandedIncident === inc.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{inc.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(inc.date)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getIncidentTypeIcon(inc.type)}
                            <span className="text-sm text-gray-700">
                              {inc.type === 'electric_shock'
                                ? 'Điện giật'
                                : inc.type === 'fall'
                                  ? 'Té ngã'
                                  : inc.type === 'fire'
                                    ? 'Cháy nổ'
                                    : inc.type === 'near_miss'
                                      ? 'Suýt xảy ra'
                                      : 'Khác'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{inc.location}</td>
                        <td className="px-4 py-3">{getSeverityBadge(inc.severity)}</td>
                        <td className="px-4 py-3">{getIncidentStatusBadge(inc.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{inc.reporter}</td>
                      </tr>
                      {expandedIncident === inc.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="ml-8 p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Mô tả sự cố</h4>
                              <p className="text-sm text-gray-600">{inc.description}</p>
                              <div className="flex items-center gap-4 mt-4">
                                <Button variant="primary" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Xem chi tiết
                                </Button>
                                <Button variant="secondary" size="sm">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Báo cáo điều tra
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* Tab: Training */}
        {activeTab === 'training' && (
          <div className="space-y-4">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Nhân viên đã đào tạo</p>
                    <p className="text-2xl font-bold text-gray-900">
                      142<span className="text-lg text-gray-500">/156</span>
                    </p>
                  </div>
                  <div className="p-3 bg-success-light rounded-lg">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Chứng chỉ hết hạn tháng này</p>
                    <p className="text-2xl font-bold text-warning">8</p>
                  </div>
                  <div className="p-3 bg-warning-light rounded-lg">
                    <Award className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Khóa học đang mở</p>
                    <p className="text-2xl font-bold text-primary-500">3</p>
                  </div>
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sub-tabs */}
            <Card className="p-4">
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                {[
                  { id: 'certs', label: 'Chứng chỉ' },
                  { id: 'courses', label: 'Khóa học' },
                  { id: 'history', label: 'Lịch sử' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTrainingSubTab(tab.id as 'certs' | 'courses' | 'history')}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-md transition-all',
                      trainingSubTab === tab.id
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            {trainingSubTab === 'certs' && (
              <Card className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nhân viên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Loại chứng chỉ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngày cấp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngày hết hạn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {certifications.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {cert.employee}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cert.certType}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(cert.issuedDate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(cert.expiryDate)}
                        </td>
                        <td className="px-4 py-3">{getCertStatusBadge(cert.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* Training Courses */}
            {trainingSubTab === 'courses' && (
              <div className="grid grid-cols-3 gap-4">
                {trainingCourses.map((course) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-primary-500" />
                      </div>
                      <Badge
                        variant={course.completed === course.enrolled ? 'success' : 'warning'}
                        size="sm"
                      >
                        {course.completed}/{course.enrolled}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Hạn: {formatDate(course.dueDate)}</p>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((course.completed / course.enrolled) * 100)}% hoàn thành
                      </p>
                    </div>
                    <Button variant="secondary" className="w-full mt-4" size="sm">
                      Xem chi tiết
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {/* History placeholder */}
            {trainingSubTab === 'history' && (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">Lịch sử đào tạo</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Xem lịch sử tham gia các khóa đào tạo và chứng chỉ đã đạt được.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Tab: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Active Alerts */}
            <Card>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <h3 className="font-semibold text-gray-900">Cảnh báo đang hoạt động</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-4 flex items-start gap-4',
                      !alert.acknowledged && alert.type === 'critical' && 'bg-error-light'
                    )}
                  >
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        alert.type === 'critical'
                          ? 'bg-error text-white'
                          : alert.type === 'warning'
                            ? 'bg-warning text-white'
                            : 'bg-primary-500 text-white'
                      )}
                    >
                      {alert.type === 'critical' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(alert.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.acknowledged ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã xác nhận
                        </Badge>
                      ) : (
                        <>
                          <Button variant="primary" size="sm">
                            Xác nhận
                          </Button>
                          <Button variant="secondary" size="sm">
                            Xử lý
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alert Configuration */}
            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Quy tắc cảnh báo</h3>
                <Button variant="primary" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm quy tắc
                </Button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Điều kiện
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mức độ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thông báo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alertRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{rule.condition}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={rule.severity === 'critical' ? 'error' : 'warning'}
                          size="sm"
                        >
                          {rule.severity === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rule.notifications}</td>
                      <td className="px-4 py-3">
                        <button
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            rule.active ? 'bg-primary-500' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              rule.active ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Alert History */}
            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Lịch sử cảnh báo</h3>
                <div className="flex items-center gap-2">
                  <Input type="date" className="w-36" />
                  <span className="text-gray-400">-</span>
                  <Input type="date" className="w-36" />
                  <Button variant="secondary" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 text-center text-gray-500">
                <Volume2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chọn khoảng thời gian để xem lịch sử cảnh báo</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
