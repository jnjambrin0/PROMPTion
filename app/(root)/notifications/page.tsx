import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getUserNotifications } from '@/lib/db/notifications'
import { redirect } from 'next/navigation'
import { NotificationsClient } from './notifications-client'

// Force dynamic rendering - this page requires user-specific server data
export const dynamic = 'force-dynamic'

async function getNotificationsData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null
    
    const user = await getUserByAuthId(authUser.id)
    if (!user) return null

    // Fetch notifications for the user
    const notificationsResult = await getUserNotifications(user.id, {
      page: 1,
      limit: 50
    })

    return {
      user,
      authUser,
      notifications: notificationsResult.notifications,
      pagination: notificationsResult.pagination
    }
  } catch (error) {
    console.error('Error fetching notifications data:', error)
    return null
  }
}

export default async function NotificationsPage() {
  const data = await getNotificationsData()
  
  if (!data) {
    redirect('/sign-in')
  }

  const { user, notifications, pagination } = data

  // Calculate summary stats
  const totalNotifications = pagination.total
  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length
  const thisWeekCount = notifications.filter((n) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return n.createdAt >= weekAgo
  }).length

  return (
    <div className="min-h-screen bg-neutral-25">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/home"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
                <p className="text-neutral-600">
                  Manage all your notifications and alerts
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <span>Total:</span>
                  <Badge variant="secondary">{totalNotifications}</Badge>
                </div>
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>Unread:</span>
                    <Badge variant="destructive" className="bg-blue-600">{unreadCount}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>This week:</span>
                  <Badge variant="secondary">{thisWeekCount}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <NotificationsClient 
        initialNotifications={notifications}
        initialPagination={pagination}
        userId={user.id}
        stats={{
          total: totalNotifications,
          unread: unreadCount,
          thisWeek: thisWeekCount
        }}
      />
    </div>
  )
} 