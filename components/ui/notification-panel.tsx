'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, X, Check, Trash2, Settings, Users, MessageSquare, Star, Zap } from 'lucide-react'
import { Button } from './button'
import { ScrollArea } from './scroll-area'
import { Separator } from './separator'
import { Badge } from './badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

// Demo notification types
type NotificationType = 'invite' | 'comment' | 'mention' | 'system' | 'activity'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: Date
  read: boolean
  actionUrl?: string
  actor?: {
    name: string
    avatar?: string
  }
  workspace?: {
    name: string
    slug: string
  }
  prompt?: {
    title: string
    slug: string
  }
}

// Demo notifications
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'invite',
    title: 'Workspace invitation',
    message: 'You have been invited to join "AI Marketing Team" workspace',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actor: { name: 'Sarah Chen' },
    workspace: { name: 'AI Marketing Team', slug: 'ai-marketing-team' },
    actionUrl: '/workspaces/ai-marketing-team/invite/accept'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on prompt',
    message: 'John added a comment on your "Blog Post Generator" prompt',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actor: { name: 'John Miller' },
    prompt: { title: 'Blog Post Generator', slug: 'blog-post-generator' },
    workspace: { name: 'Content Creation', slug: 'content-creation' },
    actionUrl: '/content-creation/blog-post-generator#comments'
  },
  {
    id: '3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Alex mentioned you in "SEO Optimizer" prompt discussion',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    actor: { name: 'Alex Rodriguez' },
    prompt: { title: 'SEO Optimizer', slug: 'seo-optimizer' },
    workspace: { name: 'Content Creation', slug: 'content-creation' },
    actionUrl: '/content-creation/seo-optimizer#mention-123'
  },
  {
    id: '4',
    type: 'system',
    title: 'Workspace settings updated',
    message: 'Billing settings have been updated for "Content Creation" workspace',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    workspace: { name: 'Content Creation', slug: 'content-creation' },
    actionUrl: '/settings/billing'
  },
  {
    id: '5',
    type: 'activity',
    title: 'Weekly summary',
    message: 'Your prompts generated 847 responses this week. View your analytics.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    actionUrl: '/dashboard/analytics'
  }
]

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'invite':
      return <Users className="h-4 w-4 text-blue-600" />
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-green-600" />
    case 'mention':
      return <Star className="h-4 w-4 text-yellow-600" />
    case 'system':
      return <Settings className="h-4 w-4 text-gray-600" />
    case 'activity':
      return <Zap className="h-4 w-4 text-purple-600" />
    default:
      return <Bell className="h-4 w-4 text-gray-600" />
  }
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`group p-3 hover:bg-gray-25 transition-colors ${
      !notification.read ? 'bg-blue-50/30' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
                {!notification.read && (
                  <span className="ml-2 inline-block h-2 w-2 bg-blue-600 rounded-full"></span>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(notification.time, { addSuffix: true })}
                </span>
                {notification.workspace && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {notification.workspace.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                onClick={() => onDelete(notification.id)}
                title="Delete notification"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
  const [isOpen, setIsOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }
  
  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 p-0"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-gray-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-[20px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 bg-white border border-gray-200 shadow-lg rounded-lg" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-gray-500 hover:text-red-600"
              onClick={handleClearAll}
            >
              Clear all
            </Button>
          </div>
        </div>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <ScrollArea className="max-h-96">
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">
              We'll notify you when something important happens.
            </p>
          </div>
        )}
        
        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-sm"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
} 