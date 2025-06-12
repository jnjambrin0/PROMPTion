import { StatItem } from '@/lib/types/navigation'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  stat: StatItem
  className?: string
}

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'neutral' }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-neutral-600" />
    case 'down':
      return <TrendingDown className="h-3 w-3 text-neutral-600" />
    default:
      return <Minus className="h-3 w-3 text-neutral-600" />
  }
}

export function StatCard({ stat, className = '' }: StatCardProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm text-neutral-700">{stat.label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-neutral-900">{stat.value}</span>
        <TrendIcon trend={stat.trend} />
      </div>
    </div>
  )
} 