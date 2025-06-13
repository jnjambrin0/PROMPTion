import { prisma } from '@/lib/db'
import { ActivityType } from '@/lib/generated/prisma'

interface UserStats {
  totalPrompts: number
  totalCategories: number
  totalFavorites: number
  weeklyPrompts: number
  monthlyPrompts: number
  lastActiveAt: Date | null
}

interface RecentActivity {
  id: string
  type: ActivityType
  description: string
  createdAt: Date
  promptTitle?: string
  promptId?: string
}

interface QuickStats {
  label: string
  value: string
  trend?: string
  trendUp?: boolean | null
}

export async function getUserStats(userId: string, workspaceId: string): Promise<UserStats> {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalPrompts,
    totalCategories,
    totalFavorites,
    weeklyPrompts,
    monthlyPrompts,
    user
  ] = await Promise.all([
    // Total prompts del usuario en el workspace
    prisma.prompt.count({
      where: {
        userId,
        workspaceId,
        deletedAt: null
      }
    }),
    
    // Total categorías en el workspace
    prisma.category.count({
      where: {
        workspaceId
      }
    }),
    
    // Total favoritos del usuario
    prisma.favorite.count({
      where: {
        userId,
        prompt: {
          workspaceId,
          deletedAt: null
        }
      }
    }),
    
    // Prompts creados esta semana
    prisma.prompt.count({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
        createdAt: {
          gte: oneWeekAgo
        }
      }
    }),
    
    // Prompts creados este mes
    prisma.prompt.count({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
        createdAt: {
          gte: oneMonthAgo
        }
      }
    }),
    
    // Información del usuario
    prisma.user.findUnique({
      where: { id: userId },
      select: { lastActiveAt: true }
    })
  ])

  return {
    totalPrompts,
    totalCategories,
    totalFavorites,
    weeklyPrompts,
    monthlyPrompts,
    lastActiveAt: user?.lastActiveAt || null
  }
}

export async function getRecentActivity(userId: string, workspaceId: string, limit = 5): Promise<RecentActivity[]> {
  const activities = await prisma.activity.findMany({
    where: {
      userId,
      prompt: {
        workspaceId
      }
    },
    include: {
      prompt: {
        select: {
          title: true,
          id: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return activities.map(activity => ({
    id: activity.id,
    type: activity.type,
    description: activity.description,
    createdAt: activity.createdAt,
    promptTitle: activity.prompt?.title,
    promptId: activity.prompt?.id
  }))
}

export async function getQuickStatsFormatted(userId: string, workspaceId: string): Promise<QuickStats[]> {
  const stats = await getUserStats(userId, workspaceId)
  
  // Calcular tendencias comparando con periodos anteriores
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const previousWeekPrompts = await prisma.prompt.count({
    where: {
      userId,
      workspaceId,
      deletedAt: null,
      createdAt: {
        gte: twoWeeksAgo,
        lt: oneWeekAgo
      }
    }
  })

  const weeklyTrend = stats.weeklyPrompts - previousWeekPrompts
  const weeklyTrendText = weeklyTrend > 0 ? `+${weeklyTrend} this week` : weeklyTrend < 0 ? `${weeklyTrend} this week` : 'No change'

  return [
    {
      label: "Total Prompts",
      value: stats.totalPrompts.toString(),
      trend: weeklyTrendText,
      trendUp: weeklyTrend > 0 ? true : weeklyTrend < 0 ? false : null
    },
    {
      label: "Categories",
      value: stats.totalCategories.toString(),
      trend: `${stats.totalFavorites} favorites`,
      trendUp: null
    },
    {
      label: "This Month",
      value: stats.monthlyPrompts.toString(),
      trend: "prompts created",
      trendUp: null
    }
  ]
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case ActivityType.PROMPT_CREATED:
      return '📝'
    case ActivityType.PROMPT_UPDATED:
      return '✏️'
    case ActivityType.PROMPT_SHARED:
      return '🔗'
    case ActivityType.PROMPT_FORKED:
      return '🍴'
    case ActivityType.PROMPT_EVALUATED:
      return '📊'
    case ActivityType.RULE_CREATED:
      return '⚙️'
    case ActivityType.RULE_UPDATED:
      return '🔧'
    case ActivityType.AGENT_CONFIGURED:
      return '🤖'
    default:
      return '📋'
  }
}

export function getActivityDescription(type: ActivityType, promptTitle?: string): string {
  switch (type) {
    case ActivityType.PROMPT_CREATED:
      return `Created "${promptTitle}"`
    case ActivityType.PROMPT_UPDATED:
      return `Updated "${promptTitle}"`
    case ActivityType.PROMPT_SHARED:
      return `Shared "${promptTitle}"`
    case ActivityType.PROMPT_FORKED:
      return `Forked "${promptTitle}"`
    case ActivityType.PROMPT_EVALUATED:
      return `Evaluated "${promptTitle}"`
    case ActivityType.RULE_CREATED:
      return 'Created new rule'
    case ActivityType.RULE_UPDATED:
      return 'Updated rule'
    case ActivityType.AGENT_CONFIGURED:
      return 'Configured AI agent'
    default:
      return 'Activity recorded'
  }
} 