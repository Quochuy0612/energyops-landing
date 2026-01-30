import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'

interface Equipment {
  id: string
  code: string
  name: string
  type: string
  voltage: string
  status: 'active' | 'maintenance' | 'inactive'
  location: string
  lastCheck: string
}

const mockEquipment: Equipment[] = [
  {
    id: '1',
    code: 'MBA-T1-110',
    name: 'Máy biến áp T1',
    type: 'Máy biến áp',
    voltage: '110kV',
    status: 'active',
    location: 'TBA 110kV Thủ Đức',
    lastCheck: '15/01/2024',
  },
  {
    id: '2',
    code: 'MC-171-E1',
    name: 'Máy cắt 171-E1',
    type: 'Máy cắt',
    voltage: '110kV',
    status: 'active',
    location: 'TBA 110kV Thủ Đức',
    lastCheck: '10/01/2024',
  },
  {
    id: '3',
    code: 'DCL-171-1',
    name: 'Dao cách ly 171-1',
    type: 'Dao cách ly',
    voltage: '110kV',
    status: 'maintenance',
    location: 'TBA 110kV Thủ Đức',
    lastCheck: '05/01/2024',
  },
  {
    id: '4',
    code: 'TU-171',
    name: 'Biến điện áp 171',
    type: 'TU',
    voltage: '110kV',
    status: 'active',
    location: 'TBA 110kV Thủ Đức',
    lastCheck: '12/01/2024',
  },
  {
    id: '5',
    code: 'TI-171',
    name: 'Biến dòng điện 171',
    type: 'TI',
    voltage: '110kV',
    status: 'inactive',
    location: 'TBA 110kV Thủ Đức',
    lastCheck: '08/01/2024',
  },
]

const statusConfig = {
  active: { label: 'Hoạt động', variant: 'success' as const },
  maintenance: { label: 'Bảo trì', variant: 'warning' as const },
  inactive: { label: 'Ngừng', variant: 'error' as const },
}

export function EquipmentTable() {
  return (
    <Card padding="none">
      <CardHeader className="px-4 pt-4">
        <CardTitle>Thiết bị đang giám sát</CardTitle>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
          Xem tất cả
        </button>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Mã thiết bị
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Tên thiết bị
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Loại
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Điện áp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Kiểm tra gần nhất
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockEquipment.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs text-primary-600 font-medium">
                  {item.code}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-gray-600">{item.type}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                    {item.voltage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusConfig[item.status].variant}>
                    {statusConfig[item.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{item.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
