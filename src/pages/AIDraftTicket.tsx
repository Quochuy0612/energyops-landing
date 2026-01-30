import { useState } from 'react'
import { Header } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import {
  Sparkles,
  Mic,
  Zap,
  MapPin,
  Cpu,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OperationStep {
  step: number
  action: string
  equipment: string
  safetyNote?: {
    type: 'warning' | 'info' | 'success' | 'danger'
    label: string
  }
}

interface SystemData {
  icon: 'location' | 'equipment' | 'diagram'
  label: string
  value: string
}

const systemData: SystemData[] = [
  { icon: 'location', label: 'Trạm', value: '220kV Hòa Khánh' },
  { icon: 'equipment', label: 'Thiết bị', value: 'MBA T1' },
  { icon: 'diagram', label: 'Sơ đồ', value: 'Ver 2.1' },
]

const operationSteps: OperationStep[] = [
  {
    step: 1,
    action: 'Kiểm tra phụ tải MBA T1 và điều chỉnh nắc phân áp phù hợp trước khi tách',
    equipment: 'T1-Control',
    safetyNote: { type: 'warning', label: 'Quy trình A.2' },
  },
  {
    step: 2,
    action: 'Mở máy cắt (MC) 231 phía 220kV của MBA T1',
    equipment: 'MC 231',
    safetyNote: { type: 'info', label: 'Thao tác tại chỗ/Từ xa' },
  },
  {
    step: 3,
    action: 'Kiểm tra trạng thái MC 231 đã mở hoàn toàn 3 pha',
    equipment: 'MC 231',
    safetyNote: { type: 'success', label: 'Kiểm tra trực quan' },
  },
  {
    step: 4,
    action: 'Mở máy cắt (MC) 131 phía 110kV của MBA T1',
    equipment: 'MC 131',
  },
  {
    step: 5,
    action: 'Mở dao cách ly (DCL) 231-1 và 231-3 để tạo khoảng cách an toàn',
    equipment: 'DCL 231-1, 231-3',
    safetyNote: { type: 'danger', label: 'Khóa liên động' },
  },
]

const explanations = [
  'Trình tự tuân thủ theo Quy chuẩn kỹ thuật quốc gia về an toàn điện (QCVN 01:2020/BCT).',
  'Tự động tích hợp khóa liên động cơ khí giữa MC 231 và DCL 231-1 dựa trên sơ đồ trạm Hòa Khánh.',
  'Đề xuất bổ sung kiểm tra phụ tải T2 để tránh quá tải sau khi tách T1 (AI phân tích dòng điện hiện tại 145A).',
]

export function AIDraftTicket() {
  const [description, setDescription] = useState('')
  const [detailLevel, setDetailLevel] = useState(50)
  const [prioritizeSafety, setPrioritizeSafety] = useState(true)
  const confidenceScore = 92

  const getSystemIcon = (icon: SystemData['icon']) => {
    switch (icon) {
      case 'location': return MapPin
      case 'equipment': return Cpu
      case 'diagram': return GitBranch
    }
  }

  const getSafetyNoteStyle = (type: OperationStep['safetyNote']): string => {
    if (!type) return ''
    switch (type.type) {
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'info': return 'bg-gray-50 text-gray-600 border-gray-200'
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'danger': return 'bg-red-50 text-red-700 border-red-200'
    }
  }

  const getSafetyNoteIcon = (type: OperationStep['safetyNote']) => {
    if (!type) return null
    switch (type.type) {
      case 'warning': return AlertTriangle
      case 'info': return Info
      case 'success': return CheckCircle
      case 'danger': return ShieldCheck
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="AI Tạo nháp phiếu"
        subtitle="AI Digital Assistant for Drafting Switching Orders"
      />

      <div className="p-6">
        <div className="grid grid-cols-5 gap-6">
          {/* Left Panel - Input */}
          <div className="col-span-2 space-y-6">
            {/* Description Input */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="text-base font-semibold text-gray-900">Mô tả mục đích công tác</h3>
              </div>

              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả mục đích công tác tại đây (ví dụ: Tách MBA T1 để bảo dưỡng định kỳ)..."
                  className="w-full h-32 px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
                <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                  Tối đa 2000 ký tự
                </span>
              </div>
            </Card>

            {/* System Data (Auto-filled) */}
            <Card>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                DỮ LIỆU HỆ THỐNG (AUTO-FILLED)
              </h3>
              <div className="flex flex-wrap gap-2">
                {systemData.map((data, index) => {
                  const Icon = getSystemIcon(data.icon)
                  return (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-full"
                    >
                      <Icon className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-primary-700">
                        {data.label}: <span className="font-medium">{data.value}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Settings */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-gray-900">Ưu tiên an toàn</span>
                </div>
                <button
                  onClick={() => setPrioritizeSafety(!prioritizeSafety)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors cursor-pointer relative',
                    prioritizeSafety ? 'bg-primary-500' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow',
                      prioritizeSafety ? 'translate-x-7' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Độ chi tiết</span>
                  <span className="text-sm font-medium text-primary-600">Nâng cao</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </Card>

            {/* Generate Button */}
            <Button variant="primary" size="lg" className="w-full gap-2">
              <Sparkles className="w-5 h-5" />
              Sinh phiếu nháp
            </Button>

            {/* Location Card */}
            <Card className="bg-dark-900 text-white">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">VỊ TRÍ TRẠM</p>
                  <p className="text-base font-semibold">220kV Hòa Khánh</p>
                  <p className="text-sm text-gray-400">Phường Hòa Khánh Bắc, Liên Chiểu</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Generated Steps */}
          <div className="col-span-3">
            <Card padding="none">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Trình tự thao tác đề xuất</h3>
                <Badge variant="success" size="md" className="gap-1">
                  MỨC TIN CẬY: <span className="font-bold">{confidenceScore}% High</span>
                </Badge>
              </div>

              {/* Steps Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                        BƯỚC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        NỘI DUNG THAO TÁC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                        THIẾT BỊ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                        GHI CHÚ AN TOÀN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {operationSteps.map((step) => {
                      const SafetyIcon = step.safetyNote ? getSafetyNoteIcon(step.safetyNote) : null
                      return (
                        <tr key={step.step} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="text-base font-semibold text-gray-400">
                              {String(step.step).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{step.action}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-700">{step.equipment}</span>
                          </td>
                          <td className="px-6 py-4">
                            {step.safetyNote ? (
                              <span className={cn(
                                'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border',
                                getSafetyNoteStyle(step.safetyNote)
                              )}>
                                {SafetyIcon && <SafetyIcon className="w-3 h-3" />}
                                {step.safetyNote.label}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Explanations */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start gap-2 mb-3">
                  <Info className="w-4 h-4 text-primary-500 mt-0.5" />
                  <span className="text-sm font-semibold text-gray-700">Giải thích & Cơ sở dữ liệu</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {explanations.map((exp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="secondary" className="gap-2">
                  <FileText className="w-4 h-4" />
                  So sánh phiên bản
                </Button>
                <Button variant="primary" className="gap-2">
                  <Check className="w-4 h-4" />
                  Áp dụng vào phiếu
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add missing import
import { Paperclip } from 'lucide-react'
