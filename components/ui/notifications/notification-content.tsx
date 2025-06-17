'use client'

import { useEffect, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NotificationItem } from './notification-item'
import { useNotifications } from '@/lib/hooks/use-notifications'
import Image from 'next/image'

export function NotificationContent() {
  const [hasInitialized, setHasInitialized] = useState(false)
  const {
    notifications,
    loadingState,
    unreadCount,
    hasUnread,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
  } = useNotifications()

  // Fetch solo una vez cuando se monta el componente
  useEffect(() => {
    if (!hasInitialized) {
      fetchNotifications().finally(() => {
        setHasInitialized(true)
      })
    }
  }, [fetchNotifications, hasInitialized])

  // Mostrar loading solo la primera vez o si está fetching y no hay datos
  const isLoading = loadingState.fetching && !hasInitialized

  if (isLoading) {
    return (
      <div className="p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
        <div className="h-6 w-6 mx-auto animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 mb-3" />
        <p className="text-sm text-neutral-500">Loading notifications...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto h-24 w-24 mb-4">
          <Image 
            src="/waiting.svg" 
            alt="No notifications" 
            className="w-full h-full object-contain opacity-60"
            width={96}
            height={96}
          />
        </div>
        <h3 className="text-sm font-medium text-neutral-900 mb-1">
          All caught up!
        </h3>
        <p className="text-sm text-neutral-500">
          No new notifications to show
        </p>
      </div>
    )
  }

  return (
    <>
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
              onClick={markAllAsRead}
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
            onClick={clearAll}
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
      <ScrollArea className="max-h-[70vh] min-h-[200px]">
        <div className="divide-y divide-neutral-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              isMarkingAsRead={loadingState.markingAsRead.has(notification.id)}
              isDeleting={loadingState.deleting.has(notification.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  )
} 