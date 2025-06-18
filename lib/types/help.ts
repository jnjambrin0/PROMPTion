import { LucideIcon } from 'lucide-react'

export interface HelpArticle {
  title: string
  slug: string
  description: string
  content?: string
  lastUpdated?: string
}

export interface HelpCategory {
  title: string
  description: string
  slug: string
  icon: LucideIcon
  articles: HelpArticle[]
}

export interface HelpSearchResult {
  type: 'category' | 'article'
  title: string
  description: string
  href: string
  category?: string
  categoryTitle?: string
  slug?: string
  relevanceScore?: number
}

export interface HelpSearchFilters {
  category?: string
  type?: 'all' | 'category' | 'article'
}

export interface HelpSearchState {
  query: string
  results: HelpSearchResult[]
  isSearching: boolean
  hasSearched: boolean
  filters: HelpSearchFilters
  selectedIndex: number
}

export interface ExtendedArticle extends HelpArticle {
  categoryTitle: string
  categorySlug: string
  href: string
} 