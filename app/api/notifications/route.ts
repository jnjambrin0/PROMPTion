import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getUserNotifications, getUnreadNotificationCount, deleteAllNotifications } from '@/lib/db/notifications'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

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
  success: boolean
  data: {
    notifications: NotificationResponse[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
  unreadCount: number
}

// Esquema de validación para query parameters
const queryParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  type: z.string().optional(),
  status: z.enum(['UNREAD', 'READ']).optional(),
  search: z.string().max(255).optional()
})

// ==================== UTILIDADES ====================

async function authenticateUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) }
  }

  return { user, authUser, error: undefined }
}

// ==================== HANDLERS ====================

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Parse y validar query parameters
    const { searchParams } = new URL(request.url)
    
    // Convertir parámetros string a números, con valores por defecto
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const type = searchParams.get('type') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    
    const queryValidation = queryParamsSchema.safeParse({
      page,
      limit,
      type,
      status,
      search
    })

    if (!queryValidation.success) {
      const firstError = queryValidation.error.errors[0]
      return NextResponse.json(
        { error: `Invalid query parameter: ${firstError.path.join('.')} - ${firstError.message}` },
        { status: 400 }
      )
    }

    const validatedParams = queryValidation.data

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

    const response: PaginatedNotificationsResponse = {
      success: true,
      data: {
        notifications,
        pagination: notificationsResult.pagination
      },
      unreadCount
    }

    // Headers de seguridad y cache
    const nextResponse = NextResponse.json(response)
    nextResponse.headers.set('X-Content-Type-Options', 'nosniff')
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return nextResponse

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Eliminar todas las notificaciones del usuario
    const result = await deleteAllNotifications(user.id)

    const response = NextResponse.json({
      success: true,
      message: `${result.count} notifications deleted`,
      deletedCount: result.count
    })
    
    // Headers de seguridad
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response

  } catch (error) {
    console.error('Delete all notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 