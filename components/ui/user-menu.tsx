'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  Building, 
  Bell, 
  HelpCircle, 
  LogOut,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './dropdown-menu'

interface UserMenuProps {
  user: {
    fullName?: string | null
    username?: string | null
    email?: string
    avatarUrl?: string | null
  } | null
  authUser: {
    id: string
    email?: string
  }
}

export function UserMenu({ user, authUser }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const displayName = user?.fullName || user?.username || authUser.email?.split('@')[0] || 'User'
  const initials = user?.fullName?.charAt(0)?.toUpperCase() || 
                  user?.username?.charAt(0)?.toUpperCase() || 
                  authUser.email?.charAt(0)?.toUpperCase() || 
                  'U'

  const handleSignOut = async () => {
    // Create a form and submit it for sign out
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 hover:bg-neutral-100"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="text-xs bg-neutral-100 text-neutral-700 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-72 p-0 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden" 
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="p-4 bg-neutral-25">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-lg bg-neutral-200 text-neutral-700 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-neutral-600 truncate">
                {authUser.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* Profile Section */}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <User className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Profile</p>
                <p className="text-xs text-neutral-500">View and edit profile</p>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <Settings className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Settings</p>
                <p className="text-xs text-neutral-500">Preferences and privacy</p>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Workspaces */}
          <DropdownMenuItem asChild>
            <Link href="/workspaces" className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <Building className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Workspaces</p>
                <p className="text-xs text-neutral-500">Manage your teams</p>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Notifications */}
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <Bell className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Notifications</p>
                <p className="text-xs text-neutral-500">View all notifications</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Theme Selector */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2">
              <Monitor className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Appearance</p>
                <p className="text-xs text-neutral-500">Customize your experience</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                <Sun className="h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                <Moon className="h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                <Monitor className="h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Support */}
          <DropdownMenuItem asChild>
            <Link href="/help" className="flex items-center gap-3 px-3 py-2 cursor-pointer">
              <HelpCircle className="h-4 w-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Help & Support</p>
                <p className="text-xs text-neutral-500">Get help and contact us</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Sign Out */}
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-red-500">Sign out of your account</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 