import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn, formatNumber } from '@/lib/utils'

export interface KPICardProps {
  title: string
  value: number | string
  unit?: string
  trend?: number
  trendDirection?: 'up' | 'down'
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  className?: string
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    trend: 'text-emerald-600',
  },
  yellow: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    trend: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    trend: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600',
  },
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendDirection = 'up',
  icon,
  color = 'blue',
  className,
}: KPICardProps) {
  const styles = colorStyles[color]
  const displayValue = typeof value === 'number' ? formatNumber(value) : value

  return (
    <Card className={cn('flex items-start gap-4', className)} hover>
      {icon && (
        <div className={cn('p-3 rounded-xl', styles.bg)}>
          <div className={styles.icon}>{icon}</div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-gray-900">{displayValue}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-xs font-medium',
              trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {trendDirection === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend}% so với tháng trước</span>
          </div>
        )}
      </div>
    </Card>
  )
}
