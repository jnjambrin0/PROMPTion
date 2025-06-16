'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { NotificationContent } from './notification-content'
import { useNotifications } from '@/lib/hooks/use-notifications'

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount, hasUnread } = useNotifications()

  // Optimizado: solo fetch cuando se abre por primera vez
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 p-0 hover:bg-neutral-100 rounded-md transition-colors"
          title="Notifications"
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
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 max-w-[calc(100vw-2rem)] p-0 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden" 
        align="end"
        alignOffset={0}
        sideOffset={12}
      >
        {isOpen && <NotificationContent />}
      </PopoverContent>
    </Popover>
  )
} 