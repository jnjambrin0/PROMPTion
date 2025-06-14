export type NotificationType = 'invite' | 'comment' | 'mention' | 'system' | 'activity'

export interface NotificationActor {
  name: string
  avatar?: string
}

export interface NotificationWorkspace {
  name: string
  slug: string
}

export interface NotificationPrompt {
  title: string
  slug: string
}

export interface Notification {
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

export interface NotificationLoadingState {
  markingAsRead: Set<string>
  deleting: Set<string>
  bulkAction: boolean
  fetching: boolean
}

export interface UseNotificationsResult {
  notifications: Notification[]
  loadingState: NotificationLoadingState
  unreadCount: number
  hasUnread: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearAll: () => Promise<void>
}

// Database type mappings
export const NOTIFICATION_TYPE_MAP: Record<string, NotificationType> = {
  'WORKSPACE_INVITE': 'invite',
  'COMMENT_CREATED': 'comment',
  'COMMENT_REPLY': 'comment',
  'MENTION': 'mention',
  'PROMPT_SHARED': 'activity',
  'PROMPT_UPDATED': 'activity',
  'SYSTEM_UPDATE': 'system',
  'WEEKLY_SUMMARY': 'activity'
} 