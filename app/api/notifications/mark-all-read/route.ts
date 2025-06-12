import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { markAllNotificationsAsRead, getUnreadNotificationCount } from '@/lib/db/notifications'

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

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateUser()
    if (auth.error) return auth.error

    const { user } = auth

    // Obtener el conteo de no leídas antes de marcar como leídas
    const unreadCountBefore = await getUnreadNotificationCount(user.id)
    
    if (unreadCountBefore === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unread notifications to mark',
        markedCount: 0
      })
    }

    // Marcar todas las notificaciones como leídas
    const result = await markAllNotificationsAsRead(user.id)

    const response = NextResponse.json({
      success: true,
      message: `${result.count} notifications marked as read`,
      markedCount: result.count
    })
    
    // Headers de seguridad
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    return response

  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 