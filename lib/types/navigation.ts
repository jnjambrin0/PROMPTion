import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  action?: () => void
  href?: string
}

export interface StatItem {
  id: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
}

export interface TopicItem {
  id: string
  name: string
  count: number
  trend?: 'up' | 'down' | 'neutral'
}

export interface UpcomingItem {
  id: string
  title: string
  description: string
  date: string
  icon: LucideIcon
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
} 