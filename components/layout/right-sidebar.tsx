import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/ui/stat-card'
import { TopicItem } from '@/components/ui/topic-item'
import { 
  UPCOMING_ITEMS, 
  POPULAR_TOPICS, 
  QUICK_STATS, 
  TIPS 
} from '@/lib/constants/sidebar-data'

export function RightSidebar() {
  return (
    <aside className="w-72 border-l border-neutral-200 bg-neutral-50/30 p-4">
      {/* Coming up */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-neutral-900">Coming up</h3>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          {UPCOMING_ITEMS.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-neutral-100 p-1.5">
                <item.icon className="h-3 w-3 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                <p className="text-xs text-neutral-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular topics */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-neutral-900">Popular topics</h3>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="space-y-1">
            {POPULAR_TOPICS.map((topic) => (
              <TopicItem key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-neutral-900">Quick stats</h3>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="space-y-3">
            {QUICK_STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-neutral-900">Tips</h3>
        <div className="space-y-3">
          {TIPS.map((tip) => (
            <div key={tip.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">{tip.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{tip.title}</p>
                  <p className="text-sm text-neutral-700 mb-1">{tip.content}</p>
                  <p className="text-xs text-neutral-600">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
} 