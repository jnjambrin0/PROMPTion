'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Plus,
  Edit3,
  Trash2,
  Users,
  FileText,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { getMemberActivityAction } from '@/lib/actions/members'
import type { MemberActivity } from '@/lib/types/members'

interface MemberActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: {
    id: string
    user: {
      id: string
      fullName: string | null
      username: string | null
      avatarUrl: string | null
    }
  }
  workspaceSlug: string
}

function ActivityIcon({ type }: { type: string }) {
  const icons = {
    'PROMPT_CREATED': Plus,
    'PROMPT_UPDATED': Edit3,
    'PROMPT_DELETED': Trash2,
    'MEMBER_INVITED': Users,
    'MEMBER_REMOVED': Users,
    'PROMPT_SHARED': FileText,
    default: Activity
  }
  
  const Icon = icons[type as keyof typeof icons] || icons.default
  return <Icon className="h-4 w-4" />
}

function ActivityTypeColor(type: string): string {
  switch (type) {
    case 'PROMPT_CREATED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'PROMPT_UPDATED':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PROMPT_DELETED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'MEMBER_INVITED':
    case 'MEMBER_REMOVED':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'PROMPT_SHARED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function ActivityItem({ activity }: { activity: MemberActivity }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-neutral-100 bg-neutral-25">
      <div className="mt-1">
        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
          <ActivityIcon type={activity.type} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge 
            variant="outline" 
            className={`text-xs ${ActivityTypeColor(activity.type)}`}
          >
            {activity.type.replace('_', ' ').toLowerCase()}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
          </div>
        </div>
        
        <p className="text-sm text-neutral-900 font-medium mb-1">
          {activity.description}
        </p>
        
        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
          <div className="text-xs text-neutral-600">
            {activity.metadata.promptTitle && (
              <span>Prompt: {activity.metadata.promptTitle}</span>
            )}
            {activity.metadata.workspaceName && (
              <span>Workspace: {activity.metadata.workspaceName}</span>
            )}
          </div>
        )}
      </div>
      
      {activity.metadata?.actionUrl && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => window.open(activity.metadata.actionUrl, '_blank')}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

export function MemberActivityModal({
  open,
  onOpenChange,
  member,
  workspaceSlug
}: MemberActivityModalProps) {
  const [activities, setActivities] = useState<MemberActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const memberName = member.user.fullName || member.user.username || 'Unknown User'

  const loadActivities = async (pageNum: number = 1, reset: boolean = false) => {
    if (loading) return
    
    setLoading(true)
    setError(null)

    try {
      // BLINDADO: Pasar user.id para busqueda por userId, no member.id
      const result = await getMemberActivityAction(workspaceSlug, member.user.id, pageNum, 10)
      
      if (result.success && result.activities) {
        if (reset) {
          setActivities(result.activities)
        } else {
          setActivities(prev => [...prev, ...result.activities!])
        }
        
        const hasMoreData = result.pagination 
          ? pageNum < result.pagination.totalPages 
          : false
        setHasMore(hasMoreData)
        setPage(pageNum)
      } else {
        setError(result.error || 'Failed to load activity')
        setActivities([])
        setHasMore(false)
      }
    } catch (err) {
      console.error('Error loading activities:', err)
      setError('Failed to load activity')
      setActivities([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Load activities when modal opens
  useEffect(() => {
    if (open) {
      loadActivities(1, true)
    } else {
      // Reset state when modal closes
      setActivities([])
      setPage(1)
      setHasMore(true)
      setError(null)
    }
  }, [open, member.user.id, workspaceSlug, loadActivities]) // Cambio: usar member.user.id para consistencia

  const loadMore = () => {
    if (hasMore && !loading) {
      loadActivities(page + 1, false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            Activity for {memberName}
          </DialogTitle>
          <DialogDescription>
            Recent activity and contributions in this workspace
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6 pb-6">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">⚠️ {error}</div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadActivities(1, true)}
              >
                Try Again
              </Button>
            </div>
          ) : activities.length === 0 && !loading ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-neutral-900 mb-1">
                No activity found
              </h3>
              <p className="text-sm text-neutral-500">
                {memberName} hasn&apos;t performed any actions in this workspace yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
                
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                    <span className="ml-2 text-sm text-neutral-500">Loading...</span>
                  </div>
                )}
                
                {hasMore && !loading && activities.length > 0 && (
                  <div className="text-center py-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadMore}
                    >
                      Load More Activity
                    </Button>
                  </div>
                )}
                
                {!hasMore && activities.length > 0 && (
                  <div className="text-center py-4 text-xs text-neutral-500">
                    No more activity to show
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 