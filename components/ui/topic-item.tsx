import { TopicItem as TopicItemType } from '@/lib/types/navigation'
import { Badge } from '@/components/ui/badge'

interface TopicItemProps {
  topic: TopicItemType
  className?: string
}

export function TopicItem({ topic, className = '' }: TopicItemProps) {
  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <span className="text-sm text-neutral-700">{topic.name}</span>
      <Badge variant="outline" className="text-xs">
        {topic.count}
      </Badge>
    </div>
  )
} 