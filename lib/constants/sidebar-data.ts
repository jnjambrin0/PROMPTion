import { Calendar } from 'lucide-react'
import { UpcomingItem, TopicItem, StatItem } from '@/lib/types/navigation'

export const UPCOMING_ITEMS: UpcomingItem[] = [
  {
    id: 'weekly-review',
    title: 'Weekly prompt review',
    description: 'Tomorrow at 2:00 PM',
    date: '2024-01-15T14:00:00Z',
    icon: Calendar
  }
]

export const POPULAR_TOPICS: TopicItem[] = [
  {
    id: 'content-writing',
    name: 'Content writing',
    count: 24,
    trend: 'up'
  },
  {
    id: 'code-generation',
    name: 'Code generation',
    count: 18,
    trend: 'up'
  },
  {
    id: 'data-analysis',
    name: 'Data analysis',
    count: 12,
    trend: 'neutral'
  },
  {
    id: 'creative-writing',
    name: 'Creative writing',
    count: 9,
    trend: 'down'
  }
]

export const QUICK_STATS: StatItem[] = [
  {
    id: 'total-prompts',
    label: 'Total prompts',
    value: 0,
    trend: 'neutral'
  },
  {
    id: 'collections',
    label: 'Collections',
    value: 0,
    trend: 'neutral'
  },
  {
    id: 'this-week',
    label: 'This week',
    value: 0,
    trend: 'up'
  }
]

export const TIPS = [
  {
    id: 'tags-tip',
    title: 'Pro tip:',
    content: 'Use tags to organize your prompts by category or project.',
    description: 'Tags make it easy to find exactly what you\'re looking for later.',
    emoji: '💡'
  },
  {
    id: 'templates-tip',
    title: 'Templates:',
    content: 'Create prompt templates for common use cases.',
    description: 'Save time by reusing proven prompt structures.',
    emoji: '📝'
  },
  {
    id: 'collections-tip',
    title: 'Collections:',
    content: 'Group related prompts together in collections.',
    description: 'Perfect for organizing prompts by project or client.',
    emoji: '📂'
  }
] 