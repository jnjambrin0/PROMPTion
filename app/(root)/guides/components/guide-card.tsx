import Link from 'next/link'
import { ArrowRight, Clock, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface GuideCardProps {
  title: string
  description: string
  time: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  href: string
}

const levelColors = {
  Beginner: 'bg-green-50 text-green-700 border-green-200',
  Intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
  Advanced: 'bg-red-50 text-red-700 border-red-200'
}

export function GuideCard({ title, description, time, level, href }: GuideCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors ml-4 mt-1" />
      </div>
      
      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {time}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Target className="h-3 w-3" />
          <Badge variant="outline" className={`text-xs ${levelColors[level]}`}>
            {level}
          </Badge>
        </div>
      </div>
    </Link>
  )
} 