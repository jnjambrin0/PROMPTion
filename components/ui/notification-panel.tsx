'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, Trash2, Users, MessageSquare, Star, Settings, Zap } from 'lucide-react'
import { Button } from './button'
import { Badge } from './badge'
import { Separator } from './separator'
import { ScrollArea } from './scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'
import Link from 'next/link'
import { toast } from 'sonner'

// Enhanced notification types based on database schema
type NotificationType = 'invite' | 'comment' | 'mention' | 'system' | 'activity'

interface NotificationActor {
  name: string
  avatar?: string
}

interface NotificationWorkspace {
  name: string
  slug: string
}

interface NotificationPrompt {
  title: string
  slug: string
}

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: Date
  read: boolean
  actor?: NotificationActor
  workspace?: NotificationWorkspace
  prompt?: NotificationPrompt
  actionUrl?: string
}

// Loading states interface
interface LoadingState {
  markingAsRead: Set<string>
  deleting: Set<string>
  bulkAction: boolean
  fetching: boolean
}

const getNotificationIcon = (type: NotificationType) => {
  const iconMap = {
    invite: <Users className="h-4 w-4 text-blue-600" />,
    comment: <MessageSquare className="h-4 w-4 text-green-600" />,
    mention: <Star className="h-4 w-4 text-yellow-600" />,
    system: <Settings className="h-4 w-4 text-neutral-600" />,
    activity: <Zap className="h-4 w-4 text-purple-600" />,
  }
  return iconMap[type] || <Bell className="h-4 w-4 text-neutral-600" />
}

// Memoized notification item component
interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  isMarkingAsRead: boolean
  isDeleting: boolean
}

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  isMarkingAsRead, 
  isDeleting 
}: NotificationItemProps) => {
  return (
    <div className={`group relative transition-all duration-200 ${
      !notification.read 
        ? 'bg-blue-50/30 border-l-2 border-l-blue-500' 
        : 'hover:bg-neutral-25'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="h-9 w-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
              {getNotificationIcon(notification.type)}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="inline-block h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                  <span>
                    {formatDistanceToNow(notification.time, { addSuffix: true })}
                  </span>
                  {notification.workspace && (
                    <>
                      <span>•</span>
                      <span className="truncate">
                        {notification.workspace.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-blue-100"
                    onClick={() => onMarkAsRead(notification.id)}
                    disabled={isMarkingAsRead}
                    title="Mark as read"
                  >
                    {isMarkingAsRead ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600" />
                    ) : (
                      <Check className="h-3 w-3 text-blue-600" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-red-100"
                  onClick={() => onDelete(notification.id)}
                  disabled={isDeleting}
                  title="Delete notification"
                >
                  {isDeleting ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
                  ) : (
                    <Trash2 className="h-3 w-3 text-red-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>({
    markingAsRead: new Set(),
    deleting: new Set(),
    bulkAction: false,
    fetching: true
  })

  // Memoized computed values
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  )

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount])

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingState(prev => ({ ...prev, fetching: true }))
      
      const response = await fetch('/api/notifications?limit=20')
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const result = await response.json()
      
      // Transform API data to component format
      const transformedNotifications: Notification[] = result.data.notifications.map((notif: any) => ({
        id: notif.id,
        type: getNotificationTypeFromDB(notif.type),
        title: notif.title,
        message: notif.message,
        time: new Date(notif.createdAt),
        read: notif.status === 'READ',
        actor: notif.actor ? { name: notif.actor.fullName || notif.actor.username } : undefined,
        workspace: notif.workspace ? { name: notif.workspace.name, slug: notif.workspace.slug } : undefined,
        actionUrl: notif.actionUrl
      }))
      
      setNotifications(transformedNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoadingState(prev => ({ ...prev, fetching: false }))
    }
  }, [])

  // Transform database notification types to component types
  const getNotificationTypeFromDB = (dbType: string): NotificationType => {
    const typeMap: Record<string, NotificationType> = {
      'WORKSPACE_INVITE': 'invite',
      'COMMENT_CREATED': 'comment',
      'COMMENT_REPLY': 'comment',
      'MENTION': 'mention',
      'PROMPT_SHARED': 'activity',
      'PROMPT_UPDATED': 'activity',
      'SYSTEM_UPDATE': 'system',
      'WEEKLY_SUMMARY': 'activity'
    }
    return typeMap[dbType] || 'system'
  }

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    if (loadingState.markingAsRead.has(notificationId)) return

    setLoadingState(prev => ({
      ...prev,
      markingAsRead: new Set([...prev.markingAsRead, notificationId])
    }))

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
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
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
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

  const handleMarkAllAsRead = useCallback(async () => {
    if (loadingState.bulkAction || !hasUnread) return

    setLoadingState(prev => ({ ...prev, bulkAction: true }))

    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all as read')
    } finally {
      setLoadingState(prev => ({ ...prev, bulkAction: false }))
    }
  }, [loadingState.bulkAction, hasUnread])

  const handleClearAll = useCallback(async () => {
    if (loadingState.bulkAction || notifications.length === 0) return

    setLoadingState(prev => ({ ...prev, bulkAction: true }))

    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to clear all notifications')
      }

      setNotifications([])
      toast.success('All notifications cleared')
    } catch (error) {
      console.error('Error clearing all notifications:', error)
      toast.error('Failed to clear all notifications')
    } finally {
      setLoadingState(prev => ({ ...prev, bulkAction: false }))
    }
  }, [loadingState.bulkAction, notifications.length])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 p-0 hover:bg-neutral-100 rounded-md"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-[20px] bg-red-600 text-white border-0 shadow-md"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 max-w-[calc(100vw-2rem)] p-0 bg-white border border-neutral-200 shadow-xl rounded-xl z-[1100] overflow-hidden" 
        align="end"
        alignOffset={0}
        sideOffset={12}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-neutral-900">Notifications</h3>
            {hasUnread && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                onClick={handleMarkAllAsRead}
                disabled={loadingState.bulkAction}
              >
                {loadingState.bulkAction ? (
                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-neutral-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleClearAll}
              disabled={loadingState.bulkAction || notifications.length === 0}
            >
              {loadingState.bulkAction ? (
                <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
              ) : (
                <Trash2 className="h-3 w-3 mr-1" />
              )}
              Clear all
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {!loadingState.fetching && notifications.length > 0 ? (
          <ScrollArea className="max-h-[70vh] min-h-[300px]">
            <div className="divide-y divide-neutral-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  isMarkingAsRead={loadingState.markingAsRead.has(notification.id)}
                  isDeleting={loadingState.deleting.has(notification.id)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : loadingState.fetching ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 mb-4" />
            <p className="text-sm text-neutral-500">Loading notifications...</p>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-sm font-medium text-neutral-900 mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              No new notifications at the moment.<br />
              We'll notify you when something important happens.
            </p>
          </div>
        )}

        {/* Footer */}
        {!loadingState.fetching && notifications.length > 0 && (
          <div className="border-t border-neutral-100 p-3 bg-neutral-25">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-sm text-neutral-600 hover:text-neutral-900 hover:bg-white h-8"
              asChild
            >
              <Link href="/notifications">
                View all notifications
              </Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
} 