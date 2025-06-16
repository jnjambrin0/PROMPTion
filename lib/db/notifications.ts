import prisma from '../prisma'
import type { NotificationType, NotificationStatus } from '../generated/prisma'
import type { InputJsonValue } from '@prisma/client/runtime/library'

/**
 * Obtiene notificaciones de un usuario con paginación
 * @param userId - ID del usuario
 * @param options - Opciones de filtrado y paginación
 * @returns Lista de notificaciones paginadas
 */
export async function getUserNotifications(
  userId: string,
  options: {
    page?: number
    limit?: number
    type?: NotificationType
    status?: NotificationStatus
    search?: string
  } = {}
) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  const {
    page = 1,
    limit = 50,
    type,
    status,
    search
  } = options

  const skip = (page - 1) * limit

  try {
    const where = {
      recipientId: userId,
      ...(type && { type }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { message: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          },
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching user notifications:', error)
    throw new Error('Failed to fetch notifications')
  }
}

/**
 * Marca una notificación como leída
 * @param notificationId - ID de la notificación
 * @param userId - ID del usuario (para verificar propiedad)
 */
export async function markNotificationAsRead(notificationId: string, userId: string) {
  if (!notificationId || !userId || typeof notificationId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid notification or user ID')
  }

  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: userId // Verificar que el usuario sea el destinatario
      },
      data: {
        status: 'READ',
        readAt: new Date()
      }
    })

    return notification
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw new Error('Failed to mark notification as read')
  }
}

/**
 * Marca todas las notificaciones de un usuario como leídas
 * @param userId - ID del usuario
 */
export async function markAllNotificationsAsRead(userId: string) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  try {
    const result = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        status: 'UNREAD'
      },
      data: {
        status: 'READ',
        readAt: new Date()
      }
    })

    return result
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    throw new Error('Failed to mark all notifications as read')
  }
}

/**
 * Elimina una notificación
 * @param notificationId - ID de la notificación
 * @param userId - ID del usuario (para verificar propiedad)
 */
export async function deleteNotification(notificationId: string, userId: string) {
  if (!notificationId || !userId || typeof notificationId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid notification or user ID')
  }

  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        recipientId: userId // Verificar que el usuario sea el destinatario
      }
    })

    return true
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw new Error('Failed to delete notification')
  }
}

/**
 * Elimina todas las notificaciones de un usuario
 * @param userId - ID del usuario
 */
export async function deleteAllNotifications(userId: string) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  try {
    const result = await prisma.notification.deleteMany({
      where: {
        recipientId: userId
      }
    })

    return result
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    throw new Error('Failed to delete all notifications')
  }
}

/**
 * Crea una nueva notificación
 * @param data - Datos de la notificación
 */
export async function createNotification(data: {
  type: NotificationType
  title: string
  message: string
  recipientId: string
  actorId?: string
  workspaceId?: string
  promptId?: string
  actionUrl?: string
  metadata?: Record<string, unknown>
}) {
  const {
    type,
    title,
    message,
    recipientId,
    actorId,
    workspaceId,
    promptId,
    actionUrl,
    metadata = {}
  } = data

  if (!type || !title || !message || !recipientId) {
    throw new Error('Missing required notification data')
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        recipientId,
        actorId,
        workspaceId,
        promptId,
        actionUrl,
        metadata: metadata as InputJsonValue,
        status: 'UNREAD'
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw new Error('Failed to create notification')
  }
}

/**
 * Obtiene el conteo de notificaciones no leídas
 * @param userId - ID del usuario
 * @returns Número de notificaciones no leídas
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!userId || typeof userId !== 'string') {
    return 0
  }

  try {
    const count = await prisma.notification.count({
      where: {
        recipientId: userId,
        status: 'UNREAD'
      }
    })

    return count
  } catch (error) {
    console.error('Error getting unread notification count:', error)
    return 0
  }
} 