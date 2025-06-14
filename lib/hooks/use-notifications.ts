'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { 
  Notification, 
  NotificationLoadingState, 
  NotificationType,
  UseNotificationsResult 
} from '@/lib/types/notifications'
import { NOTIFICATION_TYPE_MAP } from '@/lib/types/notifications'

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingState, setLoadingState] = useState<NotificationLoadingState>({
    markingAsRead: new Set(),
    deleting: new Set(),
    bulkAction: false,
    fetching: false
  })

  // Memoized computed values
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  )

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount])

  // Transform database notification types to component types
  const getNotificationTypeFromDB = useCallback((dbType: string): NotificationType => {
    return NOTIFICATION_TYPE_MAP[dbType] || 'system'
  }, [])

  // Optimized fetch with better error handling and performance
  const fetchNotifications = useCallback(async () => {
    // Evitar múltiples fetches simultáneos
    if (loadingState.fetching) {
      return Promise.resolve()
    }

    try {
      setLoadingState(prev => ({ ...prev, fetching: true }))
      
      const { getNotificationsAction } = await import('@/lib/actions/notifications')
      const result = await getNotificationsAction({ limit: 20 })
      
      if (!result.success) {
        console.error('Failed to fetch notifications:', result.error)
        // No mostrar toast de error para no interrumpir UX
        return
      }
      
      // Transform Server Action data to component format
      const transformedNotifications: Notification[] = result.data!.notifications.map((notif: any) => ({
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
      // Solo mostrar error si es crítico
    } finally {
      setLoadingState(prev => ({ ...prev, fetching: false }))
    }
  }, [getNotificationTypeFromDB, loadingState.fetching])

  const markAsRead = useCallback(async (notificationId: string) => {
    if (loadingState.markingAsRead.has(notificationId)) return

    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )

    setLoadingState(prev => ({
      ...prev,
      markingAsRead: new Set([...prev.markingAsRead, notificationId])
    }))

    try {
      const { markNotificationAsReadAction } = await import('@/lib/actions/notifications')
      const result = await markNotificationAsReadAction(notificationId)

      if (!result.success) {
        // Revert optimistic update
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
        )
        toast.error('Failed to mark as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Revert optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
      )
      toast.error('Failed to mark as read')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        markingAsRead: new Set([...prev.markingAsRead].filter(id => id !== notificationId))
      }))
    }
  }, [loadingState.markingAsRead])

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (loadingState.deleting.has(notificationId)) return

    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== notificationId))

    setLoadingState(prev => ({
      ...prev,
      deleting: new Set([...prev.deleting, notificationId])
    }))

    try {
      // TODO: Implement individual delete in server actions
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      // Revert optimistic update - refetch to get current state
      fetchNotifications()
      toast.error('Failed to delete notification')
    } finally {
      setLoadingState(prev => ({
        ...prev,
        deleting: new Set([...prev.deleting].filter(id => id !== notificationId))
      }))
    }
  }, [loadingState.deleting, fetchNotifications])

  const markAllAsRead = useCallback(async () => {
    if (loadingState.bulkAction || !hasUnread) return

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setLoadingState(prev => ({ ...prev, bulkAction: true }))

    try {
      const { markAllNotificationsAsReadAction } = await import('@/lib/actions/notifications')
      const result = await markAllNotificationsAsReadAction()

      if (!result.success) {
        // Revert optimistic update
        fetchNotifications()
        toast.error('Failed to mark all as read')
      } else {
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      fetchNotifications()
      toast.error('Failed to mark all as read')
    } finally {
      setLoadingState(prev => ({ ...prev, bulkAction: false }))
    }
  }, [loadingState.bulkAction, hasUnread, fetchNotifications])

  const clearAll = useCallback(async () => {
    if (loadingState.bulkAction || notifications.length === 0) return

    // Optimistic update
    setNotifications([])
    setLoadingState(prev => ({ ...prev, bulkAction: true }))

    try {
      const { deleteAllNotificationsAction } = await import('@/lib/actions/notifications')
      const result = await deleteAllNotificationsAction()

      if (!result.success) {
        // Revert optimistic update
        fetchNotifications()
        toast.error('Failed to clear all notifications')
      } else {
        toast.success('All notifications cleared')
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error)
      fetchNotifications()
      toast.error('Failed to clear all notifications')
    } finally {
      setLoadingState(prev => ({ ...prev, bulkAction: false }))
    }
  }, [loadingState.bulkAction, notifications.length, fetchNotifications])

  return {
    notifications,
    loadingState,
    unreadCount,
    hasUnread,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAll,
  }
} 