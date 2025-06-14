import React, { useMemo } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  MessageSquare, 
  FolderOpen, 
  Users, 
  Activity,
  Plus,
  Clock,
  Eye,
  TrendingUp,
  Hash,
  Crown,
  ArrowRight,
  BarChart3,
  Zap,
  Target,
  Calendar,
  Edit
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { WorkspaceTabProps } from '@/lib/types/workspace'

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
function ActivityItem({ activity, workspaceSlug }: { activity: any; workspaceSlug: string }) {
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
  href 
}: {
  icon: string
  label: string
  value: string | number
  trend?: string
  href?: string
}) {
  const content = (
    <div className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">{value}</span>
        {trend && (
          <span className="text-xs text-muted-foreground">+{trend}</span>
        )}
      </div>
    </div>
  )

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : content
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

export default function OverviewTab({ workspaceSlug, workspaceData }: WorkspaceTabProps) {
  const { workspace, categories, members, prompts, stats } = workspaceData

  // Generate meaningful insights instead of basic stats
  const insights = useMemo(() => {
    const recentPromptsCount = prompts?.filter(p => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(p.updatedAt) > weekAgo
    }).length || 0

    const activeMembers = members?.filter(m => m.role !== 'VIEWER').length || 0
    const popularCategory = categories?.length > 0 
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
          <Button size="sm" variant="outline" asChild>
            <Link href={`/${workspaceSlug}?tab=prompts`}>
              View all prompts
            </Link>
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
          <Button size="sm" variant="outline" asChild>
            <Link href={`/${workspaceSlug}?tab=members`}>
              Manage team
            </Link>
          </Button>
        )
      },
      {
        icon: FolderOpen,
        title: "Top Category",
        value: popularCategory?.name || "None",
        description: `${popularCategory?._count?.prompts || 0} prompts organized`,
        action: (
          <Button size="sm" variant="outline" asChild>
            <Link href={`/${workspaceSlug}?tab=categories`}>
              Organize prompts
            </Link>
          </Button>
        )
      }
    ]
  }, [prompts, members, categories, workspaceSlug])

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
            href: `/${workspaceSlug}/${prompt.slug}`
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
        href: `/${workspaceSlug}?tab=members`
      })
    }

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }, [prompts, members, workspaceSlug])

  // Workspace summary for sidebar
  const workspaceSummary = useMemo(() => {
    const totalPrompts = stats.totalPrompts
    const templatesCount = stats.templatesCount  
    const publicCount = stats.publicPromptsCount
    const categoriesCount = stats.totalCategories

    return [
      { icon: '📝', label: 'Total Prompts', value: totalPrompts, href: `/${workspaceSlug}?tab=prompts` },
      { icon: '📋', label: 'Templates', value: templatesCount, trend: '2' },
      { icon: '🌐', label: 'Public', value: publicCount },
      { icon: '📁', label: 'Categories', value: categoriesCount, href: `/${workspaceSlug}?tab=categories` },
      { icon: '👥', label: 'Members', value: stats.totalMembers, href: `/${workspaceSlug}?tab=members` }
    ]
  }, [stats, workspaceSlug])

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
                      workspaceSlug={workspaceSlug}
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
              <Button size="sm" variant="outline" className="w-full justify-start h-8" asChild>
                <Link href={`/${workspaceSlug}?tab=members`}>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start h-8" asChild>
                <Link href={`/${workspaceSlug}?tab=categories`}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Organize
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 