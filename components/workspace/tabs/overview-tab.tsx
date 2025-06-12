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
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { WorkspaceTabProps } from '@/lib/types/workspace'

export function OverviewTabSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent prompts skeleton */}
        <div className="lg:col-span-2 space-y-1">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Categories skeleton */}
        <div className="space-y-1">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 px-2">
              <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OverviewTab({ workspaceSlug, workspaceData }: WorkspaceTabProps) {
  const { workspace, categories, members, prompts, stats } = workspaceData

  // Process recent prompts - no unnecessary transformations
  const recentPrompts = useMemo(() => {
    if (!prompts || prompts.length === 0) return []
    
    return prompts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [prompts])

  // Process top categories with real prompt counts
  const topCategories = useMemo(() => {
    if (!categories || categories.length === 0) return []
    
    return categories
      .filter(cat => cat._count.prompts > 0)
      .sort((a, b) => b._count.prompts - a._count.prompts)
      .slice(0, 6)
  }, [categories])

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrompts}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{stats.thisWeekPrompts} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-gray-600">
              Organized collections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-gray-600">
              Active collaborators
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-gray-600">
              Recent updates
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Prompts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Prompts</CardTitle>
                  <CardDescription>
                    Latest prompts in this workspace
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/${workspaceSlug}?tab=prompts`}>
                  View all
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-4">No prompts yet</p>
                  <Button size="sm" asChild>
                    <Link href={`/${workspaceSlug}/prompts/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first prompt
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPrompts.map((prompt) => (
                    <Link
                      key={prompt.id}
                      href={`/${workspaceSlug}/${prompt.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                              {prompt.title}
                          </p>
                          {prompt.category && (
                              <Badge variant="outline" className="text-xs">
                              {prompt.category.name}
                              </Badge>
                            )}
                          </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{prompt._count.blocks} blocks</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Categories & Quick Stats */}
        <div className="space-y-6">
          {/* Top Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Top Categories</CardTitle>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/${workspaceSlug}?tab=categories`}>
                  Manage
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {topCategories.length === 0 ? (
                <div className="text-center py-4">
                  <FolderOpen className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">No categories yet</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/${workspaceSlug}?tab=categories`}>
                      <Plus className="h-3 w-3 mr-1" />
                      Create category
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {topCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm">{category.icon || '📋'}</div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {category._count.prompts}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/${workspaceSlug}/prompts/new`}>
                <Plus className="h-4 w-4 mr-2" />
                  New Prompt
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/${workspaceSlug}?tab=categories`}>
                <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Categories
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href={`/${workspaceSlug}?tab=members`}>
                <Users className="h-4 w-4 mr-2" />
                  Invite Members
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Templates</span>
                <span className="text-sm font-medium">{stats.templatesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Public prompts</span>
                <span className="text-sm font-medium">{stats.publicPromptsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total views</span>
                <span className="text-sm font-medium">{stats.totalViews}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
  } 