'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NotificationTriggerProps {
  unreadCount: number
  hasUnread: boolean
  onClick: () => void
}

export function NotificationTrigger({
  unreadCount,
  hasUnread,
  onClick
}: NotificationTriggerProps) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative h-8 w-8 p-0 hover:bg-neutral-100 rounded-md"
      onClick={onClick}
    >
      <Bell className="h-4 w-4" />
      {hasUnread && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-[20px] bg-red-600 text-white border-0 shadow-md"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
} 