import { 
  FileText, 
  Folder, 
  Clock, 
  Plus, 
  Search, 
  TrendingUp,
  Calendar,
  Settings,
  Bell,
  Archive,
  Star,
  Users
} from 'lucide-react'
import { NavigationItem, QuickAction } from '@/lib/types/navigation'

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-prompt',
    label: 'New prompt',
    icon: Plus,
    href: '/prompts/new'
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    href: '/search'
  }
]

export const WORKSPACE_NAVIGATION: NavigationItem[] = [
  {
    id: 'all-prompts',
    label: 'All prompts',
    href: '/prompts',
    icon: FileText
  },
  {
    id: 'collections',
    label: 'Collections',
    href: '/collections',
    icon: Folder
  },
  {
    id: 'recent',
    label: 'Recent',
    href: '/recent',
    icon: Clock
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: '/favorites',
    icon: Star
  },
  {
    id: 'shared',
    label: 'Shared with me',
    href: '/shared',
    icon: Users
  },
  {
    id: 'archive',
    label: 'Archive',
    href: '/archive',
    icon: Archive
  }
]

export const MAIN_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-prompt',
    label: 'New prompt',
    icon: Plus,
    href: '/prompts/new'
  },
  {
    id: 'new-collection',
    label: 'Collection',
    icon: Folder,
    href: '/collections/new'
  },
  {
    id: 'new-template',
    label: 'Template',
    icon: FileText,
    href: '/templates/new'
  },
  {
    id: 'import',
    label: 'Import',
    icon: TrendingUp,
    href: '/import'
  }
]

export const HEADER_ACTIONS: QuickAction[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '/notifications'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
] 