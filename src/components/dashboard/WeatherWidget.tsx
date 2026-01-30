import { Card } from '@/components/ui'
import { Sun, Droplets, Wind, Thermometer } from 'lucide-react'

export function WeatherWidget() {
  return (
    <Card className="bg-gradient-to-br from-sky-500 to-blue-600 text-white border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/80 font-medium">Thời tiết hôm nay</p>
          <p className="text-xs text-white/60 mt-0.5">TP. Hồ Chí Minh</p>
        </div>
        <Sun className="w-10 h-10 text-yellow-300" />
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">34</span>
          <span className="text-xl">°C</span>
        </div>
        <p className="text-sm text-white/80 mt-1">Nắng nóng, ít mây</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Độ ẩm</p>
            <p className="text-sm font-medium">65%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Gió</p>
            <p className="text-sm font-medium">12 km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-white/70" />
          <div>
            <p className="text-xs text-white/60">Cảm giác</p>
            <p className="text-sm font-medium">37°C</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
