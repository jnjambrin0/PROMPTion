import React, { useMemo } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  FolderOpen, 
  Users, 
  Activity,
  Plus,
  Clock,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Calendar,
  Edit
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { WorkspaceTabProps } from '@/lib/types/workspace'

interface ActivityData {
  id?: string
  type: string
  description: string
  createdAt: Date | string
  href?: string
  user?: {
    name: string
    id: string
  } | null
}

// Insight Card - Server Component for better performance
function InsightCard({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  trend,
  action
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  description: string
  trend?: { value: string; positive: boolean }
  action?: React.ReactNode
}) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-3 w-3 ${trend.positive ? '' : 'rotate-180'}`} />
              {trend.value}
            </div>
          )}
        </div>
        <div className="mb-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action && action}
      </CardContent>
    </Card>
  )
}

// Activity Item - More detailed than simple prompt item
function ActivityItem({ activity }: { activity: ActivityData }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prompt_created': return Plus
      case 'prompt_updated': return Edit
      case 'member_joined': return Users
      default: return Activity
    }
  }

  const Icon = getActivityIcon(activity.type)

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">
          {activity.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(activity.createdAt, { addSuffix: true })}</span>
          {activity.user && (
            <>
              <span>•</span>
              <span>by {activity.user.name}</span>
            </>
          )}
        </div>
      </div>
      {activity.href && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 px-2"
          asChild
        >
          <Link href={activity.href}>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      )}
    </div>
  )
}

// Compact list items for sidebar
function CompactListItem({
  icon,
  label,
  value,
  trend,
  onClick,
}: {
  icon: string
  label: string
  value: string | number
  trend?: string
  onClick?: () => void
}) {
  const commonClasses =
    'w-full flex items-center gap-3 py-1.5 px-2 rounded-md transition-colors text-left'
  const interactiveClasses = 'hover:bg-muted/80 cursor-pointer'
  const nonInteractiveClasses = 'cursor-default'

  const content = (
    <>
      <span className="text-sm">{icon}</span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-green-600">+{trend}</span>
        )}
      </div>
    </>
  )

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${commonClasses} ${
        onClick ? interactiveClasses : nonInteractiveClasses
      }`}
    >
      {content}
    </button>
  )
}

export function OverviewTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Insights skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-8 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-12 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Activity skeleton */}
        <div className="lg:col-span-3">
          <div className="border rounded-lg p-4 space-y-4">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-7 w-7 bg-muted rounded-md animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-8 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OverviewTab({ workspaceSlug, workspaceData, navigation }: WorkspaceTabProps) {
  const { categories, members, prompts, stats } = workspaceData

  // Strategic insights with actionable data
  const insights = useMemo(() => {
    // Calculate weekly prompt creation rate
    const recentPromptsCount = prompts 
      ? prompts.filter(p => {
          const createdDate = new Date(p.createdAt)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return createdDate >= weekAgo
        }).length
      : 0

    // Count active members (those with recent activity)
    const activeMembers = members 
      ? members.filter(() => {
          // For now, count all members as active
          // TODO: Implement actual activity tracking
          return true
        }).length
      : 0

    // Find most popular category
    const popularCategory = categories && categories.length > 0 
      ? categories.reduce((prev, current) => 
          (prev._count?.prompts || 0) > (current._count?.prompts || 0) ? prev : current
        )
      : null

    return [
      {
        icon: Zap,
        title: "Weekly Activity",
        value: recentPromptsCount,
        description: "prompts created or updated this week",
        trend: { value: "+12%", positive: true },
        action: (
          <Button 
            size="sm" 
            variant="outline"
            {...navigation.createNavigationButton('prompts')}
          >
            View all prompts
          </Button>
        )
      },
      {
        icon: Target,
        title: "Team Collaboration",
        value: activeMembers,
        description: "active contributors in workspace",
        trend: { value: "+2", positive: true },
        action: (
          <Button 
            size="sm" 
            variant="outline"
            {...navigation.createNavigationButton('members')}
          >
            Manage team
          </Button>
        )
      },
      {
        icon: FolderOpen,
        title: "Top Category",
        value: popularCategory?.name || "None",
        description: `${popularCategory?._count?.prompts || 0} prompts organized`,
        action: (
          <Button 
            size="sm" 
            variant="outline"
            {...navigation.createNavigationButton('categories')}
          >
            Organize prompts
          </Button>
        )
      }
    ]
  }, [prompts, members, categories, navigation])

  // Recent workspace activity (mix of prompts, members, etc.)
  const recentActivity = useMemo(() => {
    const activities = []
    
    // Add recent prompts
    if (prompts && prompts.length > 0) {
      prompts
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4)
        .forEach(prompt => {
          activities.push({
            type: 'prompt_updated',
            description: `Updated "${prompt.title}"`,
            createdAt: prompt.updatedAt,
            user: { name: prompt.user?.fullName || 'Someone' },
            href: `/${workspaceSlug}/${prompt.slug}`,
            onClick: null // External link, keep href
          })
        })
    }

    // Add recent members (mock for now)
    if (members && members.length > 0) {
      activities.push({
        type: 'member_joined',
        description: `${members[0].user.fullName || 'New member'} joined the workspace`,
        createdAt: new Date().toISOString(),
        user: null,
        onClick: () => navigation.navigateToMembers()
      })
    }

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }, [prompts, members, navigation, workspaceSlug])

  // Workspace summary for sidebar
  const workspaceSummary = useMemo(() => {
    const totalPrompts = stats.totalPrompts
    const templatesCount = stats.templatesCount  
    const publicCount = stats.publicPromptsCount
    const categoriesCount = stats.totalCategories

    return [
      { 
        icon: '📝', 
        label: 'Total Prompts', 
        value: totalPrompts, 
        onClick: () => navigation.navigateToPrompts() 
      },
      { icon: '📋', label: 'Templates', value: templatesCount, trend: '2' },
      { icon: '🌐', label: 'Public', value: publicCount },
      { 
        icon: '📁', 
        label: 'Categories', 
        value: categoriesCount, 
        onClick: () => navigation.navigateToCategories() 
      },
      { 
        icon: '👥', 
        label: 'Members', 
        value: stats.totalMembers, 
        onClick: () => navigation.navigateToMembers() 
      }
    ]
  }, [stats, navigation])

  return (
    <div className="space-y-6">
      {/* Key Insights - prioritized over basic stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Recent Activity - takes priority in main area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates and changes in your workspace
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View timeline
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">No recent activity</p>
                  <Button size="sm" asChild>
                    <Link href={`/${workspaceSlug}/prompts/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first prompt
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      activity={activity}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Compact Summary Sidebar */}
        <div className="space-y-4">
          {/* Workspace Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Workspace Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {workspaceSummary.map((item, index) => (
                  <CompactListItem key={index} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - contextual and useful */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Button size="sm" className="w-full justify-start h-8" asChild>
                <Link href={`/${workspaceSlug}/prompts/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prompt
                </Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start h-8"
                onClick={() => navigation.navigateToMembers()}
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start h-8"
                onClick={() => navigation.navigateToCategories()}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Organize
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 