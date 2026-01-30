import { Header } from '@/components/layout'
import { Button } from '@/components/ui'
import { KPICard, ChartCard, EquipmentTable, RecentActivity, WeatherWidget } from '@/components/dashboard'
import { Plus, FileText, ClipboardList, CheckCircle, AlertTriangle, Zap, Activity } from 'lucide-react'

// Mock data for charts
const ticketTrendData = [
  { name: 'T1', value: 45 },
  { name: 'T2', value: 52 },
  { name: 'T3', value: 48 },
  { name: 'T4', value: 61 },
  { name: 'T5', value: 55 },
  { name: 'T6', value: 67 },
  { name: 'T7', value: 72 },
  { name: 'T8', value: 68 },
  { name: 'T9', value: 75 },
  { name: 'T10', value: 82 },
  { name: 'T11', value: 78 },
  { name: 'T12', value: 85 },
]

const ticketStatusData = [
  { name: 'Hoàn thành', value: 156 },
  { name: 'Đang xử lý', value: 23 },
  { name: 'Chờ duyệt', value: 12 },
  { name: 'Từ chối', value: 5 },
]

const loadData = [
  { name: '00:00', value: 850 },
  { name: '04:00', value: 720 },
  { name: '08:00', value: 1100 },
  { name: '12:00', value: 1350 },
  { name: '16:00', value: 1420 },
  { name: '20:00', value: 1180 },
  { name: '24:00', value: 920 },
]

export function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Tổng quan hoạt động điều độ"
        actions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo phiếu mới
          </Button>
        }
      />

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Tổng số phiếu"
            value={1284}
            unit="phiếu"
            trend={12}
            trendDirection="up"
            icon={<FileText className="w-5 h-5" />}
            color="blue"
          />
          <KPICard
            title="Đang chờ duyệt"
            value={45}
            unit="phiếu"
            trend={5}
            trendDirection="down"
            icon={<ClipboardList className="w-5 h-5" />}
            color="yellow"
          />
          <KPICard
            title="Hoàn thành tháng này"
            value={212}
            unit="phiếu"
            trend={18}
            trendDirection="up"
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
          />
          <KPICard
            title="Sự cố tháng này"
            value={8}
            unit="sự cố"
            trend={25}
            trendDirection="down"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard
            title="Xu hướng phiếu thao tác"
            subtitle="12 tháng gần nhất"
            type="area"
            data={ticketTrendData}
            dataKey="value"
            className="lg:col-span-2"
            height={280}
          />
          <ChartCard
            title="Trạng thái phiếu"
            subtitle="Tháng hiện tại"
            type="pie"
            data={ticketStatusData}
            dataKey="value"
            colors={['#22C55E', '#3B82F6', '#F59E0B', '#EF4444']}
            height={280}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <EquipmentTable />
          </div>
          <div className="space-y-6">
            <WeatherWidget />
            <ChartCard
              title="Phụ tải hệ thống"
              subtitle="Hôm nay"
              type="line"
              data={loadData}
              dataKey="value"
              height={180}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Tạo yêu cầu</p>
                    <p className="text-xs text-gray-500">Yêu cầu công tác mới</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Tạo phiếu</p>
                    <p className="text-xs text-gray-500">Phiếu thao tác mới</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Sơ đồ lưới</p>
                    <p className="text-xs text-gray-500">Xem sơ đồ hiện trạng</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Giám sát</p>
                    <p className="text-xs text-gray-500">SCADA real-time</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
