import { 
  BookOpen, 
  Users, 
  CreditCard, 
  Settings, 
  Zap, 
  Shield,
  HelpCircle,
  Lightbulb
} from 'lucide-react'
import { HelpCategory, HelpSearchResult, ExtendedArticle } from '@/lib/types/help'

export const helpCategories: HelpCategory[] = [
  {
    title: 'Getting Started',
    description: 'New to Promption? Learn the basics and get up and running quickly.',
    slug: 'getting-started',
    icon: BookOpen,
    articles: [
      {
        title: 'Quick Start Guide',
        slug: 'quick-start',
        description: 'Get started with Promption in under 5 minutes'
      },
      {
        title: 'Creating Your First Workspace',
        slug: 'first-workspace',
        description: 'Learn how to set up your workspace for maximum productivity'
      },
      {
        title: 'Understanding Prompts',
        slug: 'understanding-prompts',
        description: 'Core concepts about prompts and how they work in Promption'
      },
      {
        title: 'Organizing with Collections',
        slug: 'collections-basics',
        description: 'How to use collections to organize your prompts effectively'
      }
    ]
  },
  {
    title: 'Account & Billing',
    description: 'Manage your account settings, billing information, and subscription.',
    slug: 'account-billing',
    icon: CreditCard,
    articles: [
      {
        title: 'Account Settings',
        slug: 'account-settings',
        description: 'How to update your profile and preferences'
      },
      {
        title: 'Billing & Subscription',
        slug: 'billing-subscription',
        description: 'Manage your subscription and billing information'
      },
      {
        title: 'Upgrading Your Plan',
        slug: 'upgrading-plan',
        description: 'Learn about different plans and how to upgrade'
      },
      {
        title: 'Canceling Your Subscription',
        slug: 'canceling-subscription',
        description: 'Steps to cancel your subscription if needed'
      }
    ]
  },
  {
    title: 'Team Collaboration',
    description: 'Work with your team, manage members, and collaborate effectively.',
    slug: 'team-collaboration',
    icon: Users,
    articles: [
      {
        title: 'Inviting Team Members',
        slug: 'inviting-members',
        description: 'How to add team members to your workspace'
      },
      {
        title: 'Managing Permissions',
        slug: 'managing-permissions',
        description: 'Control who can access and edit your prompts'
      },
      {
        title: 'Sharing Prompts',
        slug: 'sharing-prompts',
        description: 'Different ways to share prompts with your team'
      },
      {
        title: 'Team Workflows',
        slug: 'team-workflows',
        description: 'Best practices for team collaboration'
      }
    ]
  },
  {
    title: 'Prompt Engineering',
    description: 'Master the art of prompt creation and optimization.',
    slug: 'prompt-engineering',
    icon: Lightbulb,
    articles: [
      {
        title: 'Writing Effective Prompts',
        slug: 'effective-prompts',
        description: 'Tips and techniques for creating better prompts'
      },
      {
        title: 'Advanced Prompt Techniques',
        slug: 'advanced-techniques',
        description: 'Chain-of-thought, few-shot learning, and more'
      },
      {
        title: 'Prompt Templates',
        slug: 'prompt-templates',
        description: 'Using and creating reusable prompt templates'
      },
      {
        title: 'Testing and Iteration',
        slug: 'testing-iteration',
        description: 'How to test and improve your prompts over time'
      }
    ]
  },
  {
    title: 'Features & Tools',
    description: 'Learn about all the features and tools available in Promption.',
    slug: 'features-tools',
    icon: Zap,
    articles: [
      {
        title: 'Search & Discovery',
        slug: 'search-discovery',
        description: 'Find prompts quickly with our powerful search'
      },
      {
        title: 'Categories & Tags',
        slug: 'categories-tags',
        description: 'Organize your prompts with categories and tags'
      },
      {
        title: 'Favorites & Bookmarks',
        slug: 'favorites-bookmarks',
        description: 'Save and access your most-used prompts'
      },
      {
        title: 'Export & Import',
        slug: 'export-import',
        description: 'Move your prompts between tools and platforms'
      }
    ]
  },
  {
    title: 'Security & Privacy',
    description: 'Learn how we protect your data and maintain privacy.',
    slug: 'security-privacy',
    icon: Shield,
    articles: [
      {
        title: 'Data Security',
        slug: 'data-security',
        description: 'How we protect your prompts and personal data'
      },
      {
        title: 'Privacy Controls',
        slug: 'privacy-controls',
        description: 'Manage your privacy settings and data sharing'
      },
      {
        title: 'Two-Factor Authentication',
        slug: 'two-factor-auth',
        description: 'Secure your account with 2FA'
      },
      {
        title: 'GDPR & Compliance',
        slug: 'gdpr-compliance',
        description: 'Our commitment to data protection regulations'
      }
    ]
  },
  {
    title: 'Settings & Customization',
    description: 'Customize Promption to work the way you want.',
    slug: 'settings-customization',
    icon: Settings,
    articles: [
      {
        title: 'Workspace Settings',
        slug: 'workspace-settings',
        description: 'Configure your workspace preferences'
      },
      {
        title: 'Notification Settings',
        slug: 'notification-settings',
        description: 'Control when and how you receive notifications'
      },
      {
        title: 'Interface Preferences',
        slug: 'interface-preferences',
        description: 'Customize the look and feel of Promption'
      },
      {
        title: 'Keyboard Shortcuts',
        slug: 'keyboard-shortcuts',
        description: 'Work faster with keyboard shortcuts'
      }
    ]
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them.',
    slug: 'troubleshooting',
    icon: HelpCircle,
    articles: [
      {
        title: 'Common Issues',
        slug: 'common-issues',
        description: 'Solutions to frequently encountered problems'
      },
      {
        title: 'Browser Compatibility',
        slug: 'browser-compatibility',
        description: 'Supported browsers and troubleshooting tips'
      },
      {
        title: 'Performance Issues',
        slug: 'performance-issues',
        description: 'Troubleshoot slow loading and performance problems'
      },
      {
        title: 'Error Messages',
        slug: 'error-messages',
        description: 'Understanding and resolving error messages'
      }
    ]
  }
]

// Helper function to get all articles for search
export const getAllArticles = (): ExtendedArticle[] => {
  return helpCategories.flatMap(category => 
    category.articles.map(article => ({
      ...article,
      categoryTitle: category.title,
      categorySlug: category.slug,
      href: `/help/${category.slug}/${article.slug}`
    }))
  )
}

// Search utilities for help system
export const searchHelpers = {
  // Clean and normalize search query
  normalizeQuery: (query: string): string => {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, ' ') // Normalize whitespace
  },

  // Calculate relevance score for search results
  calculateRelevance: (item: ExtendedArticle | { title: string; description: string; categoryTitle?: string }, query: string): number => {
    const normalizedQuery = searchHelpers.normalizeQuery(query)
    const terms = normalizedQuery.split(' ').filter(Boolean)
    
    if (terms.length === 0) return 0

    let score = 0
    const title = item.title.toLowerCase()
    const description = item.description.toLowerCase()
    const categoryTitle = item.categoryTitle?.toLowerCase() || ''

    terms.forEach(term => {
      // Exact title match (highest priority)
      if (title === term) score += 100
      
      // Title starts with term
      else if (title.startsWith(term)) score += 80
      
      // Title contains term
      else if (title.includes(term)) score += 60
      
      // Description starts with term
      else if (description.startsWith(term)) score += 40
      
      // Description contains term
      else if (description.includes(term)) score += 30
      
      // Category match
      else if (categoryTitle.includes(term)) score += 20
      
      // Partial word matches
      else {
        const titleWords = title.split(/\s+/)
        const descWords = description.split(/\s+/)
        
        titleWords.forEach((word: string) => {
          if (word.startsWith(term)) score += 25
          else if (word.includes(term)) score += 15
        })
        
        descWords.forEach((word: string) => {
          if (word.startsWith(term)) score += 10
          else if (word.includes(term)) score += 5
        })
      }
    })

    // Boost shorter titles (assume more relevant)
    const lengthBoost = Math.max(0, 50 - title.length)
    score += lengthBoost

    return score
  },

  // Search articles with fuzzy matching and relevance scoring
  searchArticles: (query: string, filters: { category?: string; type?: 'all' | 'category' | 'article' } = {}): HelpSearchResult[] => {
    const normalizedQuery = searchHelpers.normalizeQuery(query)
    
    if (!normalizedQuery || normalizedQuery.length < 2) {
      return []
    }

    const allArticles = getAllArticles()
    const results: HelpSearchResult[] = []

    // Search articles
    if (filters.type === 'all' || filters.type === 'article' || !filters.type) {
      allArticles.forEach(article => {
        const relevanceScore = searchHelpers.calculateRelevance(article, normalizedQuery)
        
        if (relevanceScore > 0) {
          const result: HelpSearchResult = {
            type: 'article' as const,
            title: article.title,
            description: article.description,
            href: article.href,
            category: article.categorySlug,
            categoryTitle: article.categoryTitle,
            slug: article.slug,
            relevanceScore
          }

          // Apply category filter if specified
          if (!filters.category || filters.category === article.categorySlug) {
            results.push(result)
          }
        }
      })
    }

    // Search categories
    if (filters.type === 'all' || filters.type === 'category' || !filters.type) {
      helpCategories.forEach(category => {
        const categoryItem = {
          title: category.title,
          description: category.description,
          categoryTitle: category.title
        }
        
        const relevanceScore = searchHelpers.calculateRelevance(categoryItem, normalizedQuery)
        
        if (relevanceScore > 0) {
          const result: HelpSearchResult = {
            type: 'category' as const,
            title: category.title,
            description: category.description,
            href: `/help/${category.slug}`,
            category: category.slug,
            categoryTitle: category.title,
            slug: category.slug,
            relevanceScore: relevanceScore * 0.8 // Slightly lower priority for categories
          }

          // Apply category filter if specified
          if (!filters.category || filters.category === category.slug) {
            results.push(result)
          }
        }
      })
    }

    // Sort by relevance score (descending) and limit results
    return results
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 20) // Limit to top 20 results for performance
  },

  // Get search suggestions based on partial query
  getSearchSuggestions: (query: string): string[] => {
    const normalizedQuery = searchHelpers.normalizeQuery(query)
    
    if (!normalizedQuery || normalizedQuery.length < 2) {
      return []
    }

    const suggestions = new Set<string>()
    const allArticles = getAllArticles()

    // Add article titles that start with or contain the query
    allArticles.forEach(article => {
      const title = article.title.toLowerCase()
      if (title.startsWith(normalizedQuery)) {
        suggestions.add(article.title)
      } else if (title.includes(normalizedQuery)) {
        suggestions.add(article.title)
      }
    })

    // Add category titles
    helpCategories.forEach(category => {
      const title = category.title.toLowerCase()
      if (title.startsWith(normalizedQuery)) {
        suggestions.add(category.title)
      } else if (title.includes(normalizedQuery)) {
        suggestions.add(category.title)
      }
    })

    return Array.from(suggestions).slice(0, 5) // Limit suggestions
  },

  // Highlight search terms in text
  highlightSearchTerms: (text: string, query: string): string => {
    const normalizedQuery = searchHelpers.normalizeQuery(query)
    const terms = normalizedQuery.split(' ').filter(Boolean)
    
    if (terms.length === 0) return text

    let highlightedText = text
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
    })

    return highlightedText
  }
}

// Helper function to find category by slug
export const getCategoryBySlug = (slug: string) => {
  return helpCategories.find(category => category.slug === slug)
}

// Helper function to find article by category and article slug
export const getArticleBySlug = (categorySlug: string, articleSlug: string) => {
  const category = getCategoryBySlug(categorySlug)
  return category?.articles.find(article => article.slug === articleSlug)
} 