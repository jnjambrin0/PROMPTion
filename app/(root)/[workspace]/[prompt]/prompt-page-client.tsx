'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, Edit2, Copy, Share2, Star, MessageSquare, GitBranch, Settings, AlertCircle, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { PromptViewer } from '@/components/prompt/prompt-viewer'
import { getPromptPageDataAction } from '@/lib/actions/prompt'

interface PromptData {
  id: string
  slug: string
  title: string
  description?: string | null
  icon?: string | null
  isTemplate: boolean
  isPublic: boolean
  isPinned: boolean
  blocks?: any[]
  variables?: any[]
  modelConfig?: any
  userId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string | null
    fullName: string | null
    avatarUrl: string | null
  }
  category?: {
    id: string
    name: string
    color: string | null
    icon: string | null
  } | null
  workspace: {
    id: string
    name: string
    slug: string
    _count?: {
      prompts: number
    }
  }
  _count?: {
    comments: number
    favorites: number
    forks: number
    blocks: number
  }
}

interface PromptPageClientProps {
  workspaceSlug: string
  promptSlug: string
  userId: string
}

interface LoadingState {
  initial: boolean
  action: boolean
}

// Loading Skeleton Components
function PromptHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-96" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

function PromptContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-5 w-5 mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Error Component
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-red-200">
        <CardContent className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't load this prompt. Please try again.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={onRetry} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="ghost">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Not Found Component
function NotFoundState({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Prompt not found
          </h3>
          <p className="text-gray-600 mb-6">
            This prompt doesn't exist or you don't have access to it.
          </p>
          <div className="flex justify-center gap-3">
            <Link href={`/${workspaceSlug}`}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to workspace
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PromptPageClient({ workspaceSlug, promptSlug, userId }: PromptPageClientProps) {
  const router = useRouter()
  const [promptData, setPromptData] = useState<PromptData | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    action: false
  })
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Fetch prompt data
  const fetchPromptData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }))
      setError(null)
      setNotFound(false)

      // Use Server Action to fetch data safely
      const result = await getPromptPageDataAction(workspaceSlug, promptSlug, userId)
      
      if (!result.success) {
        if (result.notFound) {
          setNotFound(true)
        } else {
          setError(result.error || 'Failed to load prompt')
        }
        return
      }

      // Set the data with proper transformation
      if (result.data) {
        const transformedData: PromptData = {
          ...result.data,
          createdAt: new Date(result.data.createdAt).toISOString(),
          updatedAt: new Date(result.data.updatedAt).toISOString(),
          variables: Array.isArray(result.data.variables) ? result.data.variables : [],
          blocks: Array.isArray(result.data.blocks) ? result.data.blocks : []
        }
        setPromptData(transformedData)
      }
    } catch (err) {
      console.error('Error fetching prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to load prompt')
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }, [workspaceSlug, promptSlug, userId])

  // Initial load
  useEffect(() => {
    fetchPromptData()
  }, [fetchPromptData])

  // Action handlers with loading states
  const handleAction = useCallback(async (action: () => Promise<void>) => {
    try {
      setLoading(prev => ({ ...prev, action: true }))
      await action()
    } catch (err) {
      console.error('Action failed:', err)
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(prev => ({ ...prev, action: false }))
    }
  }, [])

  // Memoized computed values
  const isOwner = useMemo(() => {
    return promptData ? promptData.userId === userId : false
  }, [promptData, userId])

  const breadcrumbData = useMemo(() => {
    if (!promptData) return null
    return {
      workspaceName: promptData.workspace.name,
      workspaceSlug: promptData.workspace.slug
    }
  }, [promptData])

  // Action functions (placeholder - will implement later)
  const actions = useMemo(() => ({
    duplicate: async () => {
      // TODO: Implement duplicate logic
      console.log('Duplicate prompt')
    },
    fork: async () => {
      // TODO: Implement fork logic
      console.log('Fork prompt')
    },
    share: async () => {
      // TODO: Implement share logic
      console.log('Share prompt')
    },
    favorite: async () => {
      // TODO: Implement favorite logic
      console.log('Favorite prompt')
    },
    settings: async () => {
      router.push(`/${workspaceSlug}/${promptSlug}/settings`)
    }
  }), [workspaceSlug, promptSlug, router])

  // Render loading state
  if (loading.initial) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Header Skeleton */}
        <PromptHeaderSkeleton />
        
        <Separator />

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <PromptContentSkeleton />
          </div>
          <div>
            <SidebarSkeleton />
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchPromptData} />
  }

  // Render not found state
  if (notFound || !promptData) {
    return <NotFoundState workspaceSlug={workspaceSlug} />
  }

  // Main render
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {breadcrumbData && (
            <Link
              href={`/${breadcrumbData.workspaceSlug}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {breadcrumbData.workspaceName}
            </Link>
          )}
        </div>
        
        {/* Actions Dropdown */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
              <Button variant="outline" size="sm" disabled={loading.action}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Prompt Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{promptData.icon || '📝'}</span>
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {promptData.title}
              </h1>
              <div className="flex items-center gap-2">
                {promptData.isTemplate && (
                  <Badge variant="secondary">Template</Badge>
                )}
                {promptData.isPublic && (
                  <Badge variant="outline">Public</Badge>
                )}
                {promptData.isPinned && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Pinned
                  </Badge>
                )}
              </div>
            </div>
            
            {promptData.description && (
              <p className="text-gray-600 mb-4">
                {promptData.description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img
                  src={promptData.user.avatarUrl || `https://avatar.vercel.sh/${promptData.user.username}`}
                  alt={promptData.user.fullName || promptData.user.username || 'User'}
                  className="h-5 w-5 rounded-full"
                />
                <span>
                  {promptData.user.fullName || promptData.user.username}
                </span>
              </div>
              
              {promptData.category && (
                <div className="flex items-center gap-1">
                  <span>{promptData.category.icon}</span>
                  <span>{promptData.category.name}</span>
                </div>
              )}
              
              <span>
                Updated {formatDistanceToNow(new Date(promptData.updatedAt), { addSuffix: true })}
              </span>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {promptData._count?.comments || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {promptData._count?.favorites || 0}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  {promptData._count?.forks || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Prompt Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prompt Content</CardTitle>
                {isOwner && (
                  <Link href={`/${workspaceSlug}/${promptSlug}/edit`}>
                    <Button variant="outline" size="sm" disabled={loading.action}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <PromptViewer prompt={{
                id: promptData.id,
                title: promptData.title,
                description: promptData.description,
                blocks: promptData.blocks || [],
                variables: Array.isArray(promptData.variables) ? promptData.variables as any[] : [],
                modelConfig: promptData.modelConfig
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Variables */}
          {Array.isArray(promptData.variables) && promptData.variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Variables</CardTitle>
                <CardDescription>
                  Input variables for this prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(promptData.variables as any[]).map((variable: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {variable.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </div>
                      {variable.description && (
                        <p className="text-xs text-gray-600">
                          {variable.description}
                        </p>
                      )}
                      {variable.defaultValue && (
                        <p className="text-xs text-gray-500 mt-1">
                          Default: {variable.defaultValue}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Configuration */}
          {promptData.modelConfig && Object.keys(promptData.modelConfig).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(promptData.modelConfig as any).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.duplicate)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.fork)}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                Fork
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.share)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled={loading.action}
                onClick={() => handleAction(actions.favorite)}
              >
                <Star className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              {isOwner && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading.action}
                  onClick={() => handleAction(actions.settings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Workspace Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${promptData.workspace.slug}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {promptData.workspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {promptData.workspace.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {promptData.workspace._count?.prompts || 0} prompts
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 