import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge, Input } from '@/components/ui'
import {
  Users as UsersIcon,
  UserPlus,
  Download,
  Upload,
  Search,
  Shield,
  Calendar,
  ClipboardList,
  MoreVertical,
  Eye,
  Edit,
  Lock,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  Info,
  AlertTriangle,
  AlertCircle,
  LogIn,
  FileText,
  Settings,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'directory' | 'permissions' | 'shifts' | 'audit'

// Mock data
const users = [
  {
    id: '1',
    employeeId: 'NV001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@evn.com.vn',
    phone: '0901234567',
    department: 'Điều độ Miền Nam',
    station: 'TBA 220kV Tân Định',
    role: 'Trưởng ca điều độ',
    status: 'active' as const,
    lastLogin: new Date('2026-01-30T07:15:00'),
    avatar: null,
  },
  {
    id: '2',
    employeeId: 'NV002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@evn.com.vn',
    phone: '0902345678',
    department: 'Điều độ Miền Nam',
    station: 'TBA 110kV Thủ Đức',
    role: 'Điều độ viên',
    status: 'active' as const,
    lastLogin: new Date('2026-01-30T06:45:00'),
    avatar: null,
  },
  {
    id: '3',
    employeeId: 'NV003',
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@evn.com.vn',
    phone: '0903456789',
    department: 'Bảo trì',
    station: 'TBA 220kV Phú Lâm',
    role: 'Kỹ sư vận hành',
    status: 'locked' as const,
    lastLogin: new Date('2026-01-25T14:30:00'),
    avatar: null,
  },
  {
    id: '4',
    employeeId: 'NV004',
    name: 'Phạm Minh Đức',
    email: 'duc.pham@evn.com.vn',
    phone: '0904567890',
    department: 'Quản lý',
    station: null,
    role: 'Quản trị viên',
    status: 'active' as const,
    lastLogin: new Date('2026-01-30T08:00:00'),
    avatar: null,
  },
  {
    id: '5',
    employeeId: 'NV005',
    name: 'Hoàng Thị Em',
    email: 'em.hoang@evn.com.vn',
    phone: '0905678901',
    department: 'Điều độ Miền Trung',
    station: 'TBA 500kV Pleiku',
    role: 'Điều độ viên',
    status: 'inactive' as const,
    lastLogin: new Date('2025-12-15T09:00:00'),
    avatar: null,
  },
]

const roles = [
  { id: 'admin', name: 'Quản trị viên', userCount: 3 },
  { id: 'shift_lead', name: 'Trưởng ca điều độ', userCount: 8 },
  { id: 'dispatcher', name: 'Điều độ viên', userCount: 45 },
  { id: 'engineer', name: 'Kỹ sư vận hành', userCount: 62 },
  { id: 'maintenance', name: 'Nhân viên bảo trì', userCount: 28 },
  { id: 'viewer', name: 'Chỉ xem', userCount: 10 },
]

const permissionGroups = [
  {
    name: 'Phiếu thao tác',
    permissions: [
      { id: 'ticket_view', label: 'Xem' },
      { id: 'ticket_create', label: 'Tạo' },
      { id: 'ticket_approve', label: 'Duyệt' },
      { id: 'ticket_delete', label: 'Xóa' },
    ],
  },
  {
    name: 'Thiết bị',
    permissions: [
      { id: 'equipment_view', label: 'Xem' },
      { id: 'equipment_edit', label: 'Sửa' },
      { id: 'equipment_scada', label: 'Điều khiển SCADA' },
    ],
  },
  {
    name: 'Báo cáo',
    permissions: [
      { id: 'report_view', label: 'Xem' },
      { id: 'report_create', label: 'Tạo' },
      { id: 'report_export', label: 'Xuất' },
    ],
  },
  {
    name: 'Người dùng',
    permissions: [
      { id: 'user_view', label: 'Xem' },
      { id: 'user_manage', label: 'Quản lý' },
    ],
  },
  {
    name: 'An toàn',
    permissions: [
      { id: 'safety_view', label: 'Xem' },
      { id: 'safety_report', label: 'Báo cáo sự cố' },
      { id: 'safety_manage', label: 'Quản lý' },
    ],
  },
]

const rolePermissions: Record<string, string[]> = {
  admin: [
    'ticket_view', 'ticket_create', 'ticket_approve', 'ticket_delete',
    'equipment_view', 'equipment_edit', 'equipment_scada',
    'report_view', 'report_create', 'report_export',
    'user_view', 'user_manage',
    'safety_view', 'safety_report', 'safety_manage',
  ],
  shift_lead: [
    'ticket_view', 'ticket_create', 'ticket_approve',
    'equipment_view', 'equipment_edit',
    'report_view', 'report_create', 'report_export',
    'user_view',
    'safety_view', 'safety_report',
  ],
  dispatcher: [
    'ticket_view', 'ticket_create',
    'equipment_view',
    'report_view', 'report_create',
    'safety_view', 'safety_report',
  ],
  engineer: [
    'ticket_view', 'ticket_create',
    'equipment_view', 'equipment_edit',
    'report_view',
    'safety_view', 'safety_report',
  ],
  maintenance: [
    'ticket_view',
    'equipment_view',
    'report_view',
    'safety_view', 'safety_report',
  ],
  viewer: [
    'ticket_view',
    'equipment_view',
    'report_view',
    'safety_view',
  ],
}

const shifts = [
  { id: 'morning', name: 'Ca sáng', time: '6:00 - 14:00', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'afternoon', name: 'Ca chiều', time: '14:00 - 22:00', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'night', name: 'Ca đêm', time: '22:00 - 6:00', color: 'bg-purple-100 text-purple-800 border-purple-300' },
]

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const shiftSchedule: Record<string, Record<string, string>> = {
  'NV001': { T2: 'morning', T3: 'morning', T4: 'afternoon', T5: 'afternoon', T6: 'morning', T7: 'off', CN: 'off' },
  'NV002': { T2: 'afternoon', T3: 'afternoon', T4: 'night', T5: 'night', T6: 'off', T7: 'morning', CN: 'morning' },
  'NV004': { T2: 'morning', T3: 'morning', T4: 'morning', T5: 'morning', T6: 'morning', T7: 'off', CN: 'off' },
}

const auditLogs = [
  {
    id: '1',
    timestamp: new Date('2026-01-30T08:15:23'),
    user: 'Nguyễn Văn An',
    action: 'Đăng nhập',
    target: 'Hệ thống',
    ip: '192.168.1.105',
    result: 'success' as const,
    severity: 'info' as const,
    details: { browser: 'Chrome 120', os: 'Windows 11' },
  },
  {
    id: '2',
    timestamp: new Date('2026-01-30T08:20:45'),
    user: 'Nguyễn Văn An',
    action: 'Tạo phiếu thao tác',
    target: 'Phiếu PT-2026-0130-001',
    ip: '192.168.1.105',
    result: 'success' as const,
    severity: 'info' as const,
    details: { ticketType: 'Bảo trì định kỳ', station: 'TBA 220kV Tân Định' },
  },
  {
    id: '3',
    timestamp: new Date('2026-01-30T07:45:12'),
    user: 'Trần Thị Bình',
    action: 'Điều khiển SCADA',
    target: 'MC-110-TD-01',
    ip: '192.168.1.110',
    result: 'success' as const,
    severity: 'warning' as const,
    details: { command: 'OPEN', reason: 'Bảo trì' },
  },
  {
    id: '4',
    timestamp: new Date('2026-01-30T07:30:00'),
    user: 'Lê Hoàng Cường',
    action: 'Đăng nhập thất bại',
    target: 'Hệ thống',
    ip: '192.168.1.120',
    result: 'failed' as const,
    severity: 'critical' as const,
    details: { reason: 'Sai mật khẩu (lần 3)', accountLocked: true },
  },
  {
    id: '5',
    timestamp: new Date('2026-01-30T06:00:00'),
    user: 'Hệ thống',
    action: 'Bàn giao ca',
    target: 'Ca sáng 30/01/2026',
    ip: '-',
    result: 'success' as const,
    severity: 'info' as const,
    details: { fromShift: 'Ca đêm', toShift: 'Ca sáng', personnel: 5 },
  },
]

const currentOnDuty = [
  { id: '1', name: 'Nguyễn Văn An', role: 'Trưởng ca', station: 'TBA 220kV Tân Định', since: '06:00' },
  { id: '2', name: 'Trần Thị Bình', role: 'Điều độ viên', station: 'TBA 110kV Thủ Đức', since: '06:00' },
  { id: '4', name: 'Phạm Minh Đức', role: 'Quản trị', station: 'Trung tâm', since: '08:00' },
]

export function Users() {
  const [activeTab, setActiveTab] = useState<TabType>('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState('dispatcher')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const tabs = [
    { id: 'directory' as TabType, label: 'Danh sách', icon: UsersIcon },
    { id: 'permissions' as TabType, label: 'Phân quyền', icon: Shield },
    { id: 'shifts' as TabType, label: 'Ca trực', icon: Calendar },
    { id: 'audit' as TabType, label: 'Nhật ký', icon: ClipboardList },
  ]

  const getStatusBadge = (status: 'active' | 'locked' | 'inactive') => {
    const styles = {
      active: 'bg-success-light text-success border-success/20',
      locked: 'bg-warning-light text-warning border-warning/20',
      inactive: 'bg-gray-100 text-gray-500 border-gray-200',
    }
    const labels = {
      active: 'Hoạt động',
      locked: 'Tạm khóa',
      inactive: 'Nghỉ việc',
    }
    return (
      <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', styles[status])}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSeverityIcon = (severity: 'info' | 'warning' | 'critical') => {
    switch (severity) {
      case 'info':
        return <Info className="w-4 h-4 text-primary-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-error" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('Đăng nhập')) return <LogIn className="w-4 h-4" />
    if (action.includes('Phiếu')) return <FileText className="w-4 h-4" />
    if (action.includes('SCADA')) return <Settings className="w-4 h-4" />
    if (action.includes('Bàn giao')) return <Calendar className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !selectedRole || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý Người dùng"
        subtitle="Quản lý tài khoản, phân quyền và ca trực nhân viên"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="default" size="md" className="gap-2">
              <UsersIcon className="w-4 h-4" />
              {users.length} người dùng
            </Badge>
            <Button variant="secondary" className="gap-2">
              <Upload className="w-4 h-4" />
              Nhập từ Excel
            </Button>
            <Button variant="secondary" className="gap-2">
              <Download className="w-4 h-4" />
              Xuất danh sách
            </Button>
            <Button variant="primary" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Thêm người dùng
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
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

        {/* Tab: Directory */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedRole || ''}
                  onChange={(e) => setSelectedRole(e.target.value || null)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Tất cả vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="locked">Tạm khóa</option>
                  <option value="inactive">Nghỉ việc</option>
                </select>
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                  <button
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'p-2 rounded',
                      viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'
                    )}
                  >
                    <ClipboardList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={cn(
                      'p-2 rounded',
                      viewMode === 'card' ? 'bg-white shadow-sm' : 'text-gray-500'
                    )}
                  >
                    <UsersIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>

            {/* User Table */}
            {viewMode === 'table' ? (
              <Card className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Họ tên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Mã NV
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Chức vụ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Phòng/Trạm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vai trò
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Đăng nhập cuối
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.station || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge variant="info" size="sm">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-warning hover:bg-warning-light rounded">
                              <Lock className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-error hover:bg-error-light rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="text-gray-400">Email:</span> {user.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="text-gray-400">Phòng:</span> {user.department}
                      </p>
                      {user.station && (
                        <p className="text-gray-600">
                          <span className="text-gray-400">Trạm:</span> {user.station}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Permissions */}
        {activeTab === 'permissions' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Role List */}
            <div className="col-span-4">
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Danh sách vai trò</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRoleForPermissions(role.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                        selectedRoleForPermissions === role.id
                          ? 'bg-primary-50 border-l-2 border-primary-500'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Shield
                          className={cn(
                            'w-5 h-5',
                            selectedRoleForPermissions === role.id
                              ? 'text-primary-500'
                              : 'text-gray-400'
                          )}
                        />
                        <span
                          className={cn(
                            'font-medium',
                            selectedRoleForPermissions === role.id
                              ? 'text-primary-700'
                              : 'text-gray-700'
                          )}
                        >
                          {role.name}
                        </span>
                      </div>
                      <Badge variant="default" size="sm">
                        {role.userCount} người
                      </Badge>
                    </button>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <Button variant="secondary" className="w-full gap-2">
                    <Shield className="w-4 h-4" />
                    Tạo vai trò mới
                  </Button>
                </div>
              </Card>
            </div>

            {/* Permission Matrix */}
            <div className="col-span-8">
              <Card>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ma trận phân quyền</h3>
                    <p className="text-sm text-gray-500">
                      Vai trò: {roles.find((r) => r.id === selectedRoleForPermissions)?.name}
                    </p>
                  </div>
                  <Button variant="primary" size="sm">
                    Lưu thay đổi
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  {permissionGroups.map((group) => (
                    <div key={group.name} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-medium text-gray-700">{group.name}</h4>
                      </div>
                      <div className="p-4 grid grid-cols-4 gap-4">
                        {group.permissions.map((perm) => {
                          const isChecked = rolePermissions[selectedRoleForPermissions]?.includes(perm.id)
                          return (
                            <label
                              key={perm.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className={cn(
                                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                                  isChecked
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'border-gray-300 hover:border-primary-300'
                                )}
                              >
                                {isChecked && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm text-gray-700">{perm.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Scope Restrictions */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700">Phạm vi áp dụng</h4>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="scope"
                            className="w-4 h-4 text-primary-500"
                            defaultChecked
                          />
                          <span className="text-sm text-gray-700">Toàn hệ thống</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="scope" className="w-4 h-4 text-primary-500" />
                          <span className="text-sm text-gray-700">Theo miền</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="scope" className="w-4 h-4 text-primary-500" />
                          <span className="text-sm text-gray-700">Theo trạm</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab: Shifts */}
        {activeTab === 'shifts' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Shift Calendar */}
            <div className="col-span-8">
              <Card>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Lịch ca trực</h3>
                    <p className="text-sm text-gray-500">Tuần 27/01 - 02/02/2026</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      Tuần trước
                    </Button>
                    <Button variant="secondary" size="sm">
                      Tuần sau
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-4">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="flex items-center gap-2">
                        <div className={cn('w-4 h-4 rounded border', shift.color)} />
                        <span className="text-sm text-gray-600">
                          {shift.name} ({shift.time})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-r border-gray-200">
                            Nhân viên
                          </th>
                          {weekDays.map((day) => (
                            <th
                              key={day}
                              className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200"
                            >
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users
                          .filter((u) => u.status === 'active')
                          .map((user) => (
                            <tr key={user.id}>
                              <td className="px-4 py-3 border-r border-gray-100">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary-700">
                                      {user.name.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name}
                                  </span>
                                </div>
                              </td>
                              {weekDays.map((day) => {
                                const schedule = shiftSchedule[user.employeeId]?.[day]
                                const shift = shifts.find((s) => s.id === schedule)
                                return (
                                  <td key={day} className="px-2 py-2 text-center">
                                    {shift ? (
                                      <span
                                        className={cn(
                                          'inline-block px-2 py-1 text-xs font-medium rounded border',
                                          shift.color
                                        )}
                                      >
                                        {shift.name.replace('Ca ', '')}
                                      </span>
                                    ) : (
                                      <span className="text-gray-300">-</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>

            {/* Current Shift & Handover */}
            <div className="col-span-4 space-y-6">
              {/* Currently On Duty */}
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <h3 className="font-semibold text-gray-900">Đang trực</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Ca sáng - 30/01/2026</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {currentOnDuty.map((person) => (
                    <div key={person.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                            <span className="text-sm font-medium text-success">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-xs text-gray-500">{person.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{person.station}</p>
                          <p className="text-xs text-success">Từ {person.since}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Handover Log */}
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Nhật ký bàn giao</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">06:00 - 30/01/2026</span>
                      <Badge variant="success" size="sm">
                        Hoàn thành
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Bàn giao ca đêm sang ca sáng. Không có sự cố đặc biệt. MBA-T2 đang bảo trì theo
                      kế hoạch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Người bàn giao: Nguyễn Văn An → Trần Thị Bình
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">22:00 - 29/01/2026</span>
                      <Badge variant="success" size="sm">
                        Hoàn thành
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Bàn giao ca chiều sang ca đêm. Cảnh báo quá tải MBA-T1 đã xử lý.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab: Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>
                </div>
                <Input type="date" className="w-40" defaultValue="2026-01-30" />
                <span className="text-gray-400">-</span>
                <Input type="date" className="w-40" defaultValue="2026-01-30" />
                <select className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Tất cả người dùng</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Tất cả hành động</option>
                  <option value="login">Đăng nhập</option>
                  <option value="ticket">Phiếu thao tác</option>
                  <option value="equipment">Thiết bị</option>
                  <option value="settings">Cài đặt</option>
                </select>
                <select className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Tất cả mức độ</option>
                  <option value="info">Thông tin</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="critical">Quan trọng</option>
                </select>
                <Button variant="primary" size="sm">
                  Áp dụng
                </Button>
              </div>
            </Card>

            {/* Audit Log Table */}
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">

                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Người dùng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hành động
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đối tượng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kết quả
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLogs.map((log) => (
                    <>
                      <tr
                        key={log.id}
                        className={cn(
                          'hover:bg-gray-50 cursor-pointer',
                          expandedLog === log.id && 'bg-gray-50'
                        )}
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      >
                        <td className="px-4 py-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            {expandedLog === log.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(log.severity)}
                            <span className="text-sm text-gray-600">{formatDate(log.timestamp)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.user}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="text-sm text-gray-700">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{log.target}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
                        <td className="px-4 py-3">
                          {log.result === 'success' ? (
                            <Badge variant="success" size="sm">
                              <Check className="w-3 h-3 mr-1" />
                              Thành công
                            </Badge>
                          ) : (
                            <Badge variant="error" size="sm">
                              <X className="w-3 h-3 mr-1" />
                              Thất bại
                            </Badge>
                          )}
                        </td>
                      </tr>
                      {expandedLog === log.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="ml-8 p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Chi tiết hành động
                              </h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                {Object.entries(log.details).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-gray-500">{key}:</span>{' '}
                                    <span className="text-gray-900">
                                      {typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value}
                                    </span>
                                  </div>
                                ))}
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

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Hiển thị 1-5 trong tổng số 1,247 bản ghi</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="primary" size="sm">
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
          </div>
        )}
      </div>
    </div>
  )
}
