import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { markNotificationAsRead, deleteNotification } from '@/lib/db/notifications'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface NotificationParams {
  params: {
    id: string
  }
}

// Esquema de validación para ID
const notificationIdSchema = z.string().uuid('Invalid notification ID format')

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

export async function PATCH(
  request: NextRequest,
  { params }: NotificationParams
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Validar ID de notificación
    const validation = notificationIdSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      )
    }

    const notificationId = validation.data

    // Marcar notificación como leída
    try {
      await markNotificationAsRead(notificationId, user.id)
      
      const response = NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      })
      
      // Headers de seguridad
      response.headers.set('X-Content-Type-Options', 'nosniff')
      
      return response
      
    } catch (dbError: any) {
      // Manejar errores específicos de la base de datos
      if (dbError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Notification not found or access denied' },
          { status: 404 }
        )
      }
      throw dbError
    }

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: NotificationParams
) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Validar ID de notificación
    const validation = notificationIdSchema.safeParse(params.id)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      )
    }

    const notificationId = validation.data

    // Eliminar notificación
    try {
      await deleteNotification(notificationId, user.id)
      
      const response = NextResponse.json({
        success: true,
        message: 'Notification deleted successfully'
      })
      
      // Headers de seguridad
      response.headers.set('X-Content-Type-Options', 'nosniff')
      
      return response
      
    } catch (dbError: any) {
      // Manejar errores específicos de la base de datos
      if (dbError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Notification not found or access denied' },
          { status: 404 }
        )
      }
      throw dbError
    }

  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 