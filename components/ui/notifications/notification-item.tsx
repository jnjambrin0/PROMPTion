import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Star, Settings, Zap, Users, Globe, Clock, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Notification, NotificationType } from '@/lib/types/notifications'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  isMarkingAsRead: boolean
  isDeleting: boolean
}

const getNotificationIcon = (type: NotificationType) => {
  const iconMap = {
    invite: <Users className="h-4 w-4 text-blue-600" />,
    comment: <MessageSquare className="h-4 w-4 text-green-600" />,
    mention: <Star className="h-4 w-4 text-yellow-600" />,
    system: <Settings className="h-4 w-4 text-neutral-600" />,
    activity: <Zap className="h-4 w-4 text-purple-600" />,
  }
  return iconMap[type] || <Settings className="h-4 w-4 text-neutral-600" />
}

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  isMarkingAsRead, 
  isDeleting 
}: NotificationItemProps) {
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