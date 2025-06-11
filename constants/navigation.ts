import { 
  FileText, 
  Folder, 
  Clock, 
  Plus, 
  Search,
  TrendingUp,
  type LucideIcon 
} from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  description?: string
}

export interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

// Quick Actions (top of sidebar)
export const quickActions: NavigationItem[] = [
  {
    label: 'New prompt',
    href: '/prompts/new',
    icon: Plus,
    description: 'Create a new prompt'
  },
  {
    label: 'Search',
    href: '/search',
    icon: Search,
    description: 'Search all prompts'
  }
]

// Main Navigation Sections
export const navigationSections: NavigationSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        label: 'All prompts',
        href: '/prompts',
        icon: FileText,
        description: 'View all your prompts'
      },
      {
        label: 'Collections',
        href: '/collections',
        icon: Folder,
        description: 'Organize prompts in collections'
      },
      {
        label: 'Recent',
        href: '/recent',
        icon: Clock,
        description: 'Recently viewed prompts'
      }
    ]
  }
]

// Quick Actions Grid (center content)
export const quickActionsGrid: NavigationItem[] = [
  {
    label: 'New prompt',
    href: '/prompts/new',
    icon: Plus,
    description: 'Create a new prompt'
  },
  {
    label: 'Collection',
    href: '/collections/new',
    icon: Folder,
    description: 'Create a new collection'
  },
  {
    label: 'Template',
    href: '/templates',
    icon: FileText,
    description: 'Browse templates'
  },
  {
    label: 'Import',
    href: '/import',
    icon: TrendingUp,
    description: 'Import prompts'
  }
] 