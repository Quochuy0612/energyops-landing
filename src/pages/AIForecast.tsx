import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import {
  Bot,
  Cloud,
  BarChart3,
  AlertTriangle,
  Users,
  Clock,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const weatherData = [
  { hour: '06:00', value: 40 },
  { hour: '08:00', value: 55 },
  { hour: '10:00', value: 65 },
  { hour: '12:00', value: 80 },
  { hour: '14:00', value: 95, isAlert: true },
  { hour: '16:00', value: 70 },
  { hour: '18:00', value: 50 },
]

const workloadData = [
  { level: 'High', value: 85 },
  { level: 'Med', value: 60 },
  { level: 'Low', value: 30 },
]

const legendItems = [
  { color: 'bg-success', label: 'An toàn & Tối ưu' },
  { color: 'bg-warning', label: 'Rủi ro trung bình' },
  { color: 'bg-error', label: 'Dừng thao tác' },
]

const riskDrivers = [
  { label: 'Driver: Mưa giông', change: '+42%', isPositive: false },
  { label: 'Driver: Thiết bị phức tạp', change: '+15%', isPositive: false },
]

export function AIForecast() {
  const [riskScore] = useState(72)
  const aiSuggestion = 'Dời lịch bảo trì sang 08:30 sáng nay.'

  const getRiskColor = (score: number) => {
    if (score <= 40) return 'text-success'
    if (score <= 70) return 'text-warning'
    return 'text-error'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dự báo & Cảnh báo vận hành AI"
        subtitle="Hệ thống phân tích rủi ro và tối ưu hóa lịch trình thời gian thực dựa trên mô hình học máy."
        actions={
          <Badge variant="info" size="md" className="gap-2">
            <Bot className="w-4 h-4" />
            AI POWERED SYSTEM
          </Badge>
        }
      />

      <div className="p-6 space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Weather & Disaster Forecast */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Thời tiết & Thiên tai</h3>
                <p className="text-sm text-gray-500">Dự báo 24h tiếp theo</p>
              </div>
              <Cloud className="w-6 h-6 text-warning" />
            </div>

            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weatherData} barCategoryGap="20%">
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {weatherData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isAlert ? '#EF4444' : '#BFDBFE'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Alert Badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <span className="px-2 py-1 bg-warning text-white text-xs font-medium rounded">
                  GIÔNG SÉT 14:00
                </span>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="mt-4 p-3 bg-primary-50 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-primary-600 text-lg">💡</span>
                <div>
                  <p className="text-sm font-medium text-primary-800">Gợi ý từ AI</p>
                  <p className="text-sm text-primary-700">
                    Cảnh báo Giông sét lúc 14:00.<br />
                    Đề xuất: Dời lịch sang 08:00 sáng.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Workload (SO) */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Mật độ công việc (SO)</h3>
                <p className="text-sm text-gray-500">Tải lưới và nhân sự</p>
              </div>
              <BarChart3 className="w-6 h-6 text-primary-500" />
            </div>

            <div className="space-y-4">
              {workloadData.map((item) => (
                <div key={item.level} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-gray-500">{item.level}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        item.level === 'High' ? 'bg-success' : item.level === 'Med' ? 'bg-warning' : 'bg-primary-400'
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Low Load Window */}
            <div className="mt-4 p-3 bg-success-light rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-success-dark">Cửa sổ tải thấp</p>
                  <p className="text-sm text-success-dark">
                    Thời điểm 09:00 có mật độ tải thấp nhất. Tối ưu cho các thao tác lưới phức tạp.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Chỉ số rủi ro (AI Score)</h3>
                <p className="text-sm text-gray-500">Đánh giá tổng hợp rủi ro</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${riskScore * 2.64} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-4xl font-bold', getRiskColor(riskScore))}>
                    {riskScore}
                  </span>
                  <span className="text-xs text-warning font-medium uppercase">TRUNG BÌNH</span>
                </div>
              </div>
            </div>

            {/* Risk Drivers */}
            <div className="space-y-2 mb-4">
              {riskDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{driver.label}</span>
                  <span className={driver.isPositive ? 'text-success font-medium' : 'text-error font-medium'}>
                    {driver.change}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="secondary" className="w-full gap-2">
              <Users className="w-4 h-4" />
              Thêm người giám sát
            </Button>
          </Card>
        </div>

        {/* Timeline Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-900">Cửa sổ thao tác khuyến nghị</h3>
          </div>

          {/* Timeline */}
          <div className="relative pt-8 pb-4">
            {/* Time labels */}
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              {['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((time) => (
                <span key={time}>{time}</span>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="flex h-10 rounded-lg overflow-hidden">
              <div className="flex-1 bg-success flex items-center justify-center">
                <span className="text-xs font-medium text-white">ỔN ĐỊNH</span>
              </div>
              <div className="flex-[2] bg-success flex items-center justify-center">
                <span className="text-xs font-medium text-white">KHUYẾN NGHỊ (08:00 - 11:00)</span>
              </div>
              <div className="flex-1 bg-warning flex items-center justify-center">
                <span className="text-xs font-medium text-white">CẦN TRỌNG</span>
              </div>
              <div className="flex-[2] bg-error flex items-center justify-center">
                <span className="text-xs font-medium text-white flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  NGUY HIỂM (13:00 - 17:00)
                </span>
              </div>
              <div className="flex-1 bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">NGOÀI GIỜ</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={cn('w-3 h-3 rounded-full', item.color)} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Update time */}
            <p className="text-xs text-gray-400 text-right mt-2">
              *Dữ liệu cập nhật lúc 07:15 sáng nay
            </p>
          </div>
        </Card>

        {/* AI Suggestion Footer */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">AI</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">SO</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Phương án đề xuất:</span>
              <span className="text-sm text-gray-900">{aiSuggestion}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2">
              Hủy bỏ
            </Button>
            <Button variant="primary" className="gap-2">
              <Save className="w-4 h-4" />
              Lưu phương án vận hành
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add missing imports
import { CheckCircle } from 'lucide-react'
