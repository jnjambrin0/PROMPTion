'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getUserNotifications, getUnreadNotificationCount, deleteNotification, deleteAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/db/notifications'
import { z } from 'zod'

// ==================== INTERFACES ====================

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

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

interface NotificationResponse {
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

interface PaginatedNotificationsResponse {
  notifications: NotificationResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  unreadCount: number
}

// ==================== VALIDATION SCHEMAS ====================

const notificationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  type: z.string().optional(),
  status: z.enum(['UNREAD', 'READ']).optional(),
  search: z.string().max(255).optional()
})

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: any; error?: never }
  | { user?: never; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { error: 'User not found' }
    }

    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

// ==================== NOTIFICATION ACTIONS ====================

export async function getNotificationsAction(input: {
  page?: number
  limit?: number
  type?: string
  status?: 'UNREAD' | 'READ'
  search?: string
}): Promise<ActionResult<PaginatedNotificationsResponse>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    // Validar parámetros de entrada
    const validation = notificationQuerySchema.safeParse(input)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: `Invalid parameter: ${firstError.path.join('.')} - ${firstError.message}`
      }
    }

    const validatedParams = validation.data

    // Obtener notificaciones y conteo no leídas en paralelo
    const [notificationsResult, unreadCount] = await Promise.all([
      getUserNotifications(user.id, {
        page: validatedParams.page,
        limit: validatedParams.limit,
        type: validatedParams.type as any,
        status: validatedParams.status as any,
        search: validatedParams.search
      }),
      getUnreadNotificationCount(user.id)
    ])

    // Mapear a la interfaz de respuesta
    const notifications: NotificationResponse[] = notificationsResult.notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      actionUrl: notification.actionUrl,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      actor: notification.actor ? {
        id: notification.actor.id,
        username: notification.actor.username,
        fullName: notification.actor.fullName,
        avatarUrl: notification.actor.avatarUrl
      } : null,
      workspace: notification.workspace ? {
        id: notification.workspace.id,
        name: notification.workspace.name,
        slug: notification.workspace.slug
      } : null
    }))

    const responseData: PaginatedNotificationsResponse = {
      notifications,
      pagination: notificationsResult.pagination,
      unreadCount
    }

    return {
      success: true,
      data: responseData
    }

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return {
      success: false,
      error: 'Failed to fetch notifications'
    }
  }
}

export async function deleteNotificationAction(notificationId: string): Promise<ActionResult<void>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    if (!notificationId || typeof notificationId !== 'string') {
      return {
        success: false,
        error: 'Invalid notification ID'
      }
    }

    await deleteNotification(notificationId, user.id)

    // Revalidar paths relevantes
    revalidatePath('/notifications')
    revalidatePath('/dashboard')

    return { success: true }

  } catch (error) {
    console.error('Delete notification error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: 'Notification not found'
        }
      }
      
      if (error.message.includes('Access denied')) {
        return {
          success: false,
          error: 'Access denied'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to delete notification'
    }
  }
}

export async function deleteAllNotificationsAction(): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    // Eliminar todas las notificaciones del usuario
    const result = await deleteAllNotifications(user.id)

    // Revalidar paths relevantes
    revalidatePath('/notifications')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: { deletedCount: result.count }
    }

  } catch (error) {
    console.error('Delete all notifications error:', error)
    return {
      success: false,
      error: 'Failed to delete notifications'
    }
  }
}

export async function markNotificationAsReadAction(notificationId: string): Promise<ActionResult<void>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    // Validar ID de notificación
    if (!notificationId || typeof notificationId !== 'string') {
      return { success: false, error: 'Invalid notification ID' }
    }

    await markNotificationAsRead(notificationId, user.id)

    // Revalidar paths relevantes
    revalidatePath('/notifications')
    revalidatePath('/dashboard')

    return { success: true }

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return {
      success: false,
      error: 'Failed to mark notification as read'
    }
  }
}

export async function markAllNotificationsAsReadAction(): Promise<ActionResult<{ updatedCount: number }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const result = await markAllNotificationsAsRead(user.id)

    // Revalidar paths relevantes
    revalidatePath('/notifications')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: { updatedCount: result.count }
    }

  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    return {
      success: false,
      error: 'Failed to mark all notifications as read'
    }
  }
}

export async function getUnreadNotificationCountAction(): Promise<ActionResult<{ count: number }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    const count = await getUnreadNotificationCount(user.id)

    return {
      success: true,
      data: { count }
    }

  } catch (error) {
    console.error('Get unread notification count error:', error)
    return {
      success: false,
      error: 'Failed to get unread notification count'
    }
  }
} 