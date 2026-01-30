import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  Zap,
  Shield,
  HelpCircle,
  ChevronDown,
  Bot,
  Sparkles,
  CloudLightning,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path?: string
  badge?: number
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/',
  },
  {
    id: 'requests',
    label: 'Quản lý yêu cầu',
    icon: <FileText className="w-5 h-5" />,
    path: '/requests',
    badge: 5,
  },
  {
    id: 'tickets',
    label: 'Phiếu thao tác',
    icon: <ClipboardList className="w-5 h-5" />,
    path: '/tickets',
    badge: 3,
  },
  {
    id: 'equipment',
    label: 'Thiết bị',
    icon: <Zap className="w-5 h-5" />,
    path: '/equipment',
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/reports',
  },
  {
    id: 'users',
    label: 'Người dùng',
    icon: <Users className="w-5 h-5" />,
    path: '/users',
  },
  {
    id: 'safety',
    label: 'An toàn',
    icon: <Shield className="w-5 h-5" />,
    path: '/safety',
  },
  {
    id: 'ai',
    label: 'AI Features',
    icon: <Bot className="w-5 h-5" />,
    children: [
      {
        id: 'ai-assistant',
        label: 'Trợ lý AI',
        icon: <MessageSquare className="w-4 h-4" />,
        path: '/ai/assistant',
      },
      {
        id: 'ai-draft',
        label: 'AI Tạo phiếu',
        icon: <Sparkles className="w-4 h-4" />,
        path: '/ai/draft-ticket',
      },
      {
        id: 'ai-forecast',
        label: 'Dự báo AI',
        icon: <CloudLightning className="w-4 h-4" />,
        path: '/ai/forecast',
      },
    ],
  },
]

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings',
  },
  {
    id: 'help',
    label: 'Trợ giúp',
    icon: <HelpCircle className="w-5 h-5" />,
    path: '/help',
  },
]

export function Sidebar() {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = item.path === location.pathname
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
              isActive ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children?.map((child) => renderNavItem(child))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        key={item.id}
        to={item.path || '#'}
        className={cn(
          'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
          isActive ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-semibold rounded-full',
              isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'
            )}
          >
            {item.badge}
          </span>
        )}
      </NavLink>
    )
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">EnergyOPS</h1>
          <p className="text-xs text-gray-500">Điều độ điện</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        {bottomNavItems.map((item) => renderNavItem(item))}
      </div>

      {/* User Info */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700">NV</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500 truncate">Điều độ viên</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
