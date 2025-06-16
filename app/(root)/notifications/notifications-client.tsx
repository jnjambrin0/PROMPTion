'use client'

import { useState, useTransition, useCallback, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Search, Check, Trash2, Settings, Users, MessageSquare, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'

// Types based on the database schema
interface NotificationActor {
  id: string
  username?: string | null
  fullName?: string | null
  avatarUrl?: string | null
}

interface NotificationWorkspace {
  id: string
  name: string
  slug: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  status: 'UNREAD' | 'READ'
  actionUrl?: string | null
  createdAt: Date
  readAt?: Date | null
  actor?: NotificationActor | null
  workspace?: NotificationWorkspace | null
}

interface NotificationsClientProps {
  initialNotifications: Notification[]
  initialPagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  userId: string
  stats: {
    total: number
    unread: number
    thisWeek: number
  }
}

// Loading states interface
interface LoadingState {
  markingAsRead: Set<string>
  deleting: Set<string>
  bulkAction: boolean
}

const getNotificationIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    WORKSPACE_INVITE: <Users className="h-4 w-4 text-blue-600" />,
    COMMENT_CREATED: <MessageSquare className="h-4 w-4 text-green-600" />,
    COMMENT_REPLY: <MessageSquare className="h-4 w-4 text-green-600" />,
    MENTION: <Star className="h-4 w-4 text-yellow-600" />,
    PROMPT_SHARED: <Settings className="h-4 w-4 text-purple-600" />,
    PROMPT_UPDATED: <Settings className="h-4 w-4 text-blue-600" />,
    SYSTEM_UPDATE: <Settings className="h-4 w-4 text-neutral-600" />,
    WEEKLY_SUMMARY: <Zap className="h-4 w-4 text-purple-600" />,
  }
  return iconMap[type] || <Settings className="h-4 w-4 text-neutral-600" />
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    WORKSPACE_INVITE: 'invite',
    COMMENT_CREATED: 'comment',
    COMMENT_REPLY: 'reply',
    MENTION: 'mention',
    PROMPT_SHARED: 'shared',
    PROMPT_UPDATED: 'updated',
    SYSTEM_UPDATE: 'system',
    WEEKLY_SUMMARY: 'summary',
  }
  return labelMap[type] || type.toLowerCase()
}

export function NotificationsClient({ 
  initialNotifications, 
  initialPagination, 
  stats 
}: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [pagination] = useState(initialPagination)
  const [, startTransition] = useTransition()
  const [loadingState, setLoadingState] = useState<LoadingState>({
    markingAsRead: new Set(),
    deleting: new Set(),
    bulkAction: false
  })
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Memoized filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesType = typeFilter === 'all' || getTypeLabel(notification.type) === typeFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'unread' && notification.status === 'UNREAD') ||
        (statusFilter === 'read' && notification.status === 'READ')
      const matchesSearch = !debouncedSearchQuery || 
        notification.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      
      return matchesType && matchesStatus && matchesSearch
    })
  }, [notifications, typeFilter, statusFilter, debouncedSearchQuery])

  // Memoized stats
  const computedStats = useMemo(() => ({
    unreadCount: notifications.filter(n => n.status === 'UNREAD').length,
    totalCount: notifications.length
  }), [notifications])

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    if (loadingState.markingAsRead.has(notificationId)) return

    setLoadingState(prev => ({
      ...prev,
      markingAsRead: new Set([...prev.markingAsRead, notificationId])
    }))

    try {
      const { markNotificationAsReadAction } = await import('@/lib/actions/notifications')
      const result = await markNotificationAsReadAction(notificationId)

      if (!result.success) {
        throw new Error(result.error || 'Failed to mark notification as read')
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'READ' as const, readAt: new Date() } : n)
      )
      toast.success('Marked as read')
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark as read')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        markingAsRead: new Set([...prev.markingAsRead].filter(id => id !== notificationId))
      }))
    }
  }, [loadingState.markingAsRead])

  const handleDelete = useCallback(async (notificationId: string) => {
    if (loadingState.deleting.has(notificationId)) return

    setLoadingState(prev => ({
      ...prev,
      deleting: new Set([...prev.deleting, notificationId])
    }))

    try {
      const { deleteNotificationAction } = await import('@/lib/actions/notifications')
      const result = await deleteNotificationAction(notificationId)

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete notification')
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        deleting: new Set([...prev.deleting].filter(id => id !== notificationId))
      }))
    }
  }, [loadingState.deleting])

  const handleMarkAllAsRead = useCallback(() => {
    if (loadingState.bulkAction) return

    startTransition(async () => {
      setLoadingState(prev => ({ ...prev, bulkAction: true }))

      try {
        const { markAllNotificationsAsReadAction } = await import('@/lib/actions/notifications')
        const result = await markAllNotificationsAsReadAction()

        if (!result.success) {
          throw new Error(result.error || 'Failed to mark all notifications as read')
        }

        setNotifications(prev => 
          prev.map(n => ({ ...n, status: 'READ' as const, readAt: new Date() }))
        )
        toast.success('All notifications marked as read')
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
        toast.error('Failed to mark all as read')
      } finally {
        setLoadingState(prev => ({ ...prev, bulkAction: false }))
      }
    })
  }, [loadingState.bulkAction])

  const handleClearAll = useCallback(() => {
    if (loadingState.bulkAction) return

    startTransition(async () => {
      setLoadingState(prev => ({ ...prev, bulkAction: true }))

      try {
        const { deleteAllNotificationsAction } = await import('@/lib/actions/notifications')
        const result = await deleteAllNotificationsAction()

        if (!result.success) {
          throw new Error(result.error || 'Failed to clear all notifications')
        }

        setNotifications([])
        toast.success('All notifications cleared')
      } catch (error) {
        console.error('Error clearing all notifications:', error)
        toast.error('Failed to clear all notifications')
      } finally {
        setLoadingState(prev => ({ ...prev, bulkAction: false }))
      }
    })
  }, [loadingState.bulkAction])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="invite">Invitations</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="reply">Replies</SelectItem>
                  <SelectItem value="mention">Mentions</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="summary">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All notifications</SelectItem>
                  <SelectItem value="unread">Unread only</SelectItem>
                  <SelectItem value="read">Read only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">Actions</label>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleMarkAllAsRead}
                  disabled={loadingState.bulkAction || computedStats.unreadCount === 0}
                >
                  {loadingState.bulkAction ? (
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Mark all read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleClearAll}
                  disabled={loadingState.bulkAction || computedStats.totalCount === 0}
                >
                  {loadingState.bulkAction ? (
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear all
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">Summary</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Total</span>
                  <Badge variant="secondary">{computedStats.totalCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Unread</span>
                  <Badge variant="destructive" className="bg-blue-600">{computedStats.unreadCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">This week</span>
                  <Badge variant="secondary">{stats.thisWeek}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const isMarkingAsRead = loadingState.markingAsRead.has(notification.id)
                const isDeleting = loadingState.deleting.has(notification.id)
                
                return (
                  <Card key={notification.id} className={`transition-all hover:shadow-md ${
                    notification.status === 'UNREAD' ? 'border-l-4 border-l-blue-500 bg-blue-50/20' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-neutral-900">
                                {notification.title}
                              </h3>
                              {notification.status === 'UNREAD' && (
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                              {notification.workspace && (
                                <>
                                  <span>•</span>
                                  <span>{notification.workspace.name}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {notification.status === 'UNREAD' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={isMarkingAsRead}
                            >
                              {isMarkingAsRead ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600" />
                              ) : (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-100"
                            onClick={() => handleDelete(notification.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-sm font-medium text-neutral-900 mb-2">
                  No notifications found
                </h3>
                <p className="text-sm text-neutral-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}

            {/* Load More */}
            {pagination.pages > 1 && (
              <div className="mt-8 text-center">
                <Button variant="outline">
                  Load more notifications
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 