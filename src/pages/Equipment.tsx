import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge, Input } from '@/components/ui'
import {
  Plus,
  Download,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Zap,
  Circle,
  Settings,
  Wrench,
  AlertTriangle,
  Activity,
  Thermometer,
  Gauge,
  FileText,
  Calendar,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewTab = 'station' | 'type' | 'voltage' | 'scada'
type EquipmentStatus = 'operating' | 'maintenance' | 'fault' | 'stopped'

interface Equipment {
  id: string
  code: string
  name: string
  type: string
  station: string
  voltageLevel: number
  status: EquipmentStatus
  manufacturer: string
  year: number
}

// Mock data
const equipmentData: Equipment[] = [
  { id: '1', code: 'MBA-T1-220', name: 'Máy biến áp T1', type: 'MBA', station: 'TBA 220kV Tân Định', voltageLevel: 220, status: 'operating', manufacturer: 'ABB', year: 2018 },
  { id: '2', code: 'MC-231', name: 'Máy cắt 231', type: 'MC', station: 'TBA 220kV Tân Định', voltageLevel: 220, status: 'operating', manufacturer: 'Siemens', year: 2019 },
  { id: '3', code: 'DCL-231-1', name: 'Dao cách ly 231-1', type: 'DCL', station: 'TBA 220kV Tân Định', voltageLevel: 220, status: 'maintenance', manufacturer: 'ABB', year: 2018 },
  { id: '4', code: 'MBA-T1-110', name: 'Máy biến áp T1', type: 'MBA', station: 'TBA 110kV Thủ Đức', voltageLevel: 110, status: 'operating', manufacturer: 'Hyundai', year: 2020 },
  { id: '5', code: 'MC-171', name: 'Máy cắt 171', type: 'MC', station: 'TBA 110kV Thủ Đức', voltageLevel: 110, status: 'fault', manufacturer: 'ABB', year: 2017 },
  { id: '6', code: 'DCL-171-1', name: 'Dao cách ly 171-1', type: 'DCL', station: 'TBA 110kV Thủ Đức', voltageLevel: 110, status: 'operating', manufacturer: 'Siemens', year: 2019 },
]

const stationTree = [
  {
    region: 'Miền Nam',
    provinces: [
      {
        name: 'TP. Hồ Chí Minh',
        stations: [
          { name: 'TBA 220kV Tân Định', voltage: '220kV', count: 45, status: 'normal' },
          { name: 'TBA 110kV Thủ Đức', voltage: '110kV', count: 32, status: 'warning' },
          { name: 'TBA 110kV Bình Thạnh', voltage: '110kV', count: 28, status: 'normal' },
        ],
      },
      {
        name: 'Bình Dương',
        stations: [
          { name: 'TBA 220kV Bình Dương', voltage: '220kV', count: 38, status: 'normal' },
          { name: 'TBA 110kV Thủ Dầu Một', voltage: '110kV', count: 25, status: 'normal' },
        ],
      },
    ],
  },
  {
    region: 'Miền Trung',
    provinces: [
      {
        name: 'Đà Nẵng',
        stations: [
          { name: 'TBA 220kV Hòa Khánh', voltage: '220kV', count: 42, status: 'normal' },
        ],
      },
    ],
  },
]

const equipmentTypes = [
  { type: 'MBA', name: 'Máy biến áp', count: 234, icon: Zap, color: 'blue' },
  { type: 'MC', name: 'Máy cắt', count: 567, icon: Circle, color: 'green' },
  { type: 'DCL', name: 'Dao cách ly', count: 892, icon: Settings, color: 'purple' },
  { type: 'DTD', name: 'Dao tiếp địa', count: 445, icon: Wrench, color: 'orange' },
  { type: 'TU', name: 'Tụ bù', count: 123, icon: Activity, color: 'cyan' },
  { type: 'KHANG', name: 'Kháng điện', count: 89, icon: Gauge, color: 'pink' },
  { type: 'CS', name: 'Chống sét', count: 334, icon: Zap, color: 'yellow' },
]

const voltageLevels = [
  { level: 500, color: 'red', count: 156, health: 98 },
  { level: 220, color: 'orange', count: 423, health: 95 },
  { level: 110, color: 'blue', count: 1245, health: 92 },
  { level: 22, color: 'green', count: 1023, health: 89 },
]

const statusConfig: Record<EquipmentStatus, { label: string; color: string; bgColor: string }> = {
  operating: { label: 'Vận hành', color: 'text-success', bgColor: 'bg-success-light' },
  maintenance: { label: 'Bảo trì', color: 'text-warning', bgColor: 'bg-warning-light' },
  fault: { label: 'Sự cố', color: 'text-error', bgColor: 'bg-error-light' },
  stopped: { label: 'Ngừng', color: 'text-gray-500', bgColor: 'bg-gray-100' },
}

export function Equipment() {
  const [activeTab, setActiveTab] = useState<ViewTab>('station')
  const [showFilters, setShowFilters] = useState(true)
  const [expandedRegions, setExpandedRegions] = useState<string[]>(['Miền Nam'])
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>(['TP. Hồ Chí Minh'])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedStation, setSelectedStation] = useState<string>('TBA 220kV Tân Định')

  const tabs = [
    { id: 'station' as ViewTab, label: 'Theo Trạm' },
    { id: 'type' as ViewTab, label: 'Theo Loại' },
    { id: 'voltage' as ViewTab, label: 'Theo Cấp điện áp' },
    { id: 'scada' as ViewTab, label: 'Sơ đồ SCADA' },
  ]

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  const toggleProvince = (province: string) => {
    setExpandedProvinces(prev =>
      prev.includes(province) ? prev.filter(p => p !== province) : [...prev, province]
    )
  }

  const renderStationView = () => (
    <div className="space-y-2">
      {stationTree.map(region => (
        <div key={region.region} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleRegion(region.region)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {expandedRegions.includes(region.region) ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-semibold text-gray-900">{region.region}</span>
            </div>
            <Badge variant="neutral">{region.provinces.reduce((acc, p) => acc + p.stations.length, 0)} trạm</Badge>
          </button>

          {expandedRegions.includes(region.region) && (
            <div className="border-t border-gray-200">
              {region.provinces.map(province => (
                <div key={province.name}>
                  <button
                    onClick={() => toggleProvince(province.name)}
                    className="w-full flex items-center justify-between p-3 pl-8 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {expandedProvinces.includes(province.name) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-700">{province.name}</span>
                    </div>
                    <Badge variant="neutral">{province.stations.length} trạm</Badge>
                  </button>

                  {expandedProvinces.includes(province.name) && (
                    <div className="border-t border-gray-100">
                      {province.stations.map(station => (
                        <button
                          key={station.name}
                          onClick={() => setSelectedStation(station.name)}
                          className={cn(
                            'w-full flex items-center justify-between p-3 pl-14 hover:bg-blue-50 transition-colors cursor-pointer',
                            selectedStation === station.name && 'bg-blue-50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              station.status === 'normal' ? 'bg-success' : 'bg-warning'
                            )} />
                            <span className="text-sm text-gray-700">{station.name}</span>
                            <Badge variant="info" size="sm">{station.voltage}</Badge>
                          </div>
                          <span className="text-sm text-gray-500">{station.count} TB</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderTypeView = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {equipmentTypes.map(type => {
        const IconComponent = type.icon
        return (
          <Card
            key={type.type}
            className="hover:shadow-card-hover hover:border-primary-300 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                'p-3 rounded-lg',
                type.color === 'blue' && 'bg-blue-100',
                type.color === 'green' && 'bg-emerald-100',
                type.color === 'purple' && 'bg-purple-100',
                type.color === 'orange' && 'bg-orange-100',
                type.color === 'cyan' && 'bg-cyan-100',
                type.color === 'pink' && 'bg-pink-100',
                type.color === 'yellow' && 'bg-yellow-100',
              )}>
                <IconComponent className={cn(
                  'w-6 h-6',
                  type.color === 'blue' && 'text-blue-600',
                  type.color === 'green' && 'text-emerald-600',
                  type.color === 'purple' && 'text-purple-600',
                  type.color === 'orange' && 'text-orange-600',
                  type.color === 'cyan' && 'text-cyan-600',
                  type.color === 'pink' && 'text-pink-600',
                  type.color === 'yellow' && 'text-yellow-600',
                )} />
              </div>
              <Badge variant="neutral">{type.type}</Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
            <p className="text-2xl font-bold text-primary-600">{type.count}</p>
            <p className="text-sm text-gray-500">thiết bị</p>
          </Card>
        )
      })}
    </div>
  )

  const renderVoltageView = () => (
    <div className="space-y-4">
      {voltageLevels.map(voltage => (
        <Card key={voltage.level} className="overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-8 rounded-full',
                voltage.color === 'red' && 'bg-red-500',
                voltage.color === 'orange' && 'bg-orange-500',
                voltage.color === 'blue' && 'bg-blue-500',
                voltage.color === 'green' && 'bg-green-500',
              )} />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{voltage.level}kV</h3>
                <p className="text-sm text-gray-500">{voltage.count} thiết bị</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Sức khỏe hệ thống</p>
                <p className={cn(
                  'text-lg font-bold',
                  voltage.health >= 95 ? 'text-success' : voltage.health >= 90 ? 'text-warning' : 'text-error'
                )}>{voltage.health}%</p>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    voltage.health >= 95 ? 'bg-success' : voltage.health >= 90 ? 'bg-warning' : 'bg-error'
                  )}
                  style={{ width: `${voltage.health}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Vận hành: <span className="font-medium text-success">{Math.floor(voltage.count * 0.9)}</span></span>
            <span className="text-gray-500">Bảo trì: <span className="font-medium text-warning">{Math.floor(voltage.count * 0.07)}</span></span>
            <span className="text-gray-500">Sự cố: <span className="font-medium text-error">{Math.floor(voltage.count * 0.03)}</span></span>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderSCADAView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-gray-700">Chọn trạm:</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option>TBA 220kV Tân Định</option>
          <option>TBA 110kV Thủ Đức</option>
          <option>TBA 220kV Hòa Khánh</option>
        </select>
        <Button variant="secondary" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <Card className="p-8 bg-dark-900 min-h-[500px]">
        {/* Simplified SCADA Diagram */}
        <div className="relative">
          {/* Bus bars */}
          <div className="flex flex-col gap-20">
            {/* 220kV Bus */}
            <div>
              <div className="text-xs text-gray-400 mb-2">220kV Bus</div>
              <div className="h-2 bg-red-500 rounded-full relative">
                {/* Equipment connections */}
                <div className="absolute -bottom-16 left-1/4 flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-red-400" />
                  <button
                    onClick={() => setSelectedEquipment(equipmentData[0])}
                    className="w-12 h-12 bg-green-500 rounded border-2 border-green-300 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
                  >
                    MC
                  </button>
                  <div className="w-0.5 h-4 bg-red-400" />
                  <div className="text-xs text-gray-400 mt-1">MC-231</div>
                </div>
                <div className="absolute -bottom-16 left-1/2 flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-red-400" />
                  <button
                    onClick={() => setSelectedEquipment(equipmentData[2])}
                    className="w-12 h-12 bg-yellow-500 rounded border-2 border-yellow-300 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
                  >
                    DCL
                  </button>
                  <div className="w-0.5 h-4 bg-red-400" />
                  <div className="text-xs text-gray-400 mt-1">DCL-231-1</div>
                </div>
                <div className="absolute -bottom-24 left-3/4 flex flex-col items-center">
                  <div className="w-0.5 h-16 bg-red-400" />
                  <div className="w-16 h-20 border-2 border-blue-400 rounded flex items-center justify-center">
                    <button
                      onClick={() => setSelectedEquipment(equipmentData[0])}
                      className="text-blue-400 text-xs font-bold hover:text-blue-300 cursor-pointer"
                    >
                      MBA<br/>T1
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 110kV Bus */}
            <div className="mt-20">
              <div className="text-xs text-gray-400 mb-2">110kV Bus</div>
              <div className="h-2 bg-blue-500 rounded-full relative">
                <div className="absolute -top-16 left-1/4 flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-1">MC-171</div>
                  <button
                    onClick={() => setSelectedEquipment(equipmentData[4])}
                    className="w-12 h-12 bg-red-500 rounded border-2 border-red-300 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
                  >
                    MC
                  </button>
                  <div className="w-0.5 h-8 bg-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-0 right-0 bg-dark-800 p-3 rounded-lg text-xs">
            <div className="text-gray-400 mb-2 font-semibold">Chú thích</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-gray-300">Đóng/Bình thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-gray-300">Mở/Sự cố</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span className="text-gray-300">Cảnh báo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded" />
                <span className="text-gray-300">Offline</span>
              </div>
            </div>
          </div>

          {/* Live measurements */}
          <div className="absolute bottom-0 left-0 bg-dark-800 p-3 rounded-lg text-xs">
            <div className="text-gray-400 mb-2 font-semibold">Thông số real-time</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-gray-400">U (220kV):</span>
              <span className="text-green-400 font-mono">225.3 kV</span>
              <span className="text-gray-400">I (MBA T1):</span>
              <span className="text-green-400 font-mono">145.2 A</span>
              <span className="text-gray-400">P:</span>
              <span className="text-green-400 font-mono">52.8 MW</span>
              <span className="text-gray-400">T (dầu):</span>
              <span className="text-yellow-400 font-mono">68.5 °C</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderEquipmentTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mã TB</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên thiết bị</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Loại</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hãng SX</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Năm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {equipmentData.filter(e => e.station === selectedStation).map(equipment => (
            <tr
              key={equipment.id}
              onClick={() => setSelectedEquipment(equipment)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 font-mono text-primary-600">{equipment.code}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{equipment.name}</td>
              <td className="px-4 py-3">
                <Badge variant="neutral">{equipment.type}</Badge>
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  statusConfig[equipment.status].bgColor,
                  statusConfig[equipment.status].color
                )}>
                  {statusConfig[equipment.status].label}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{equipment.manufacturer}</td>
              <td className="px-4 py-3 text-gray-600">{equipment.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header
        title="Quản lý Thiết bị"
        subtitle="Quản lý và giám sát thiết bị hệ thống điện"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="info" size="md">2,847 thiết bị</Badge>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Đồng bộ SCADA
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm thiết bị
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tìm kiếm</label>
                    <Input placeholder="Mã hoặc tên TB..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Trạng thái</label>
                    <div className="space-y-2">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="text-sm text-gray-600">{config.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cấp điện áp</label>
                    <div className="space-y-2">
                      {[500, 220, 110, 22].map(v => (
                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="text-sm text-gray-600">{v}kV</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Loại thiết bị</label>
                    <div className="space-y-2">
                      {equipmentTypes.slice(0, 4).map(t => (
                        <label key={t.type} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="text-sm text-gray-600">{t.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
                      activeTab === tab.id
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {!showFilters && (
                <Button variant="secondary" size="sm" onClick={() => setShowFilters(true)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
              )}
            </div>

            {/* Maintenance Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-error-light border-error/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-error/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-error">12</p>
                    <p className="text-sm text-error-dark">Bảo trì đến hạn</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-warning-light border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-warning-dark" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning-dark">8</p>
                    <p className="text-sm text-warning-dark">Bảo trì tuần này</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-info-light border-info/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Wrench className="w-5 h-5 text-info-dark" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-info-dark">5</p>
                    <p className="text-sm text-info-dark">Đang bảo trì</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tab Content */}
            <Card>
              {activeTab === 'station' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Cây thư mục trạm</h3>
                    {renderStationView()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Thiết bị tại: <span className="text-primary-600">{selectedStation}</span>
                    </h3>
                    {renderEquipmentTable()}
                  </div>
                </div>
              )}
              {activeTab === 'type' && renderTypeView()}
              {activeTab === 'voltage' && renderVoltageView()}
              {activeTab === 'scada' && renderSCADAView()}
            </Card>
          </div>
        </div>
      </div>

      {/* Equipment Detail Slide-out Panel */}
      {selectedEquipment && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-mono">{selectedEquipment.code}</p>
                <h2 className="text-lg font-bold text-gray-900">{selectedEquipment.name}</h2>
              </div>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={selectedEquipment.status === 'operating' ? 'success' : selectedEquipment.status === 'maintenance' ? 'warning' : 'error'}>
                {statusConfig[selectedEquipment.status].label}
              </Badge>
              <Badge variant="neutral">{selectedEquipment.type}</Badge>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Specifications */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Thông số kỹ thuật
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Trạm</span>
                  <span className="font-medium">{selectedEquipment.station}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Cấp điện áp</span>
                  <span className="font-medium">{selectedEquipment.voltageLevel}kV</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Hãng sản xuất</span>
                  <span className="font-medium">{selectedEquipment.manufacturer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Năm lắp đặt</span>
                  <span className="font-medium">{selectedEquipment.year}</span>
                </div>
              </div>
            </div>

            {/* Real-time Measurements */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Đo lường real-time
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Gauge className="w-3 h-3" />
                    Điện áp
                  </div>
                  <p className="text-lg font-bold text-gray-900">225.3 <span className="text-sm font-normal">kV</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Zap className="w-3 h-3" />
                    Dòng điện
                  </div>
                  <p className="text-lg font-bold text-gray-900">145.2 <span className="text-sm font-normal">A</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Thermometer className="w-3 h-3" />
                    Nhiệt độ
                  </div>
                  <p className="text-lg font-bold text-warning">68.5 <span className="text-sm font-normal">°C</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Activity className="w-3 h-3" />
                    Công suất
                  </div>
                  <p className="text-lg font-bold text-gray-900">52.8 <span className="text-sm font-normal">MW</span></p>
                </div>
              </div>
            </div>

            {/* Maintenance Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Thông tin bảo trì
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Bảo trì gần nhất</span>
                  <span className="font-medium">15/12/2025</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Bảo trì tiếp theo</span>
                  <span className="font-medium text-warning">15/03/2026</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Xem lịch sử
              </Button>
              <Button className="flex-1">
                <Wrench className="w-4 h-4 mr-2" />
                Tạo phiếu bảo trì
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
