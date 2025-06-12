import Link from 'next/link'
import { Search, LogOut, Bell, Settings } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { getUserByAuthId } from '@/lib/db/users'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null
    
    const user = await getUserByAuthId(authUser.id)
    return { authUser, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function Topbar() {
  const userData = await getUser()
  
  if (!userData?.authUser) {
    redirect('/signin')
  }

  const { authUser, user } = userData

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-12 items-center justify-between px-4">
        {/* Left section - Mobile nav + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Navigation */}
          <MobileNav />
          
          {/* Brand - Mobile only */}
          <div className="md:hidden">
            <Link href="/home">
              <h1 className="text-lg font-semibold text-neutral-900">Promption</h1>
            </Link>
          </div>
          
          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search prompts, templates..."
                className="w-full rounded-md border border-neutral-200 bg-neutral-50/50 py-1.5 pl-9 pr-3 text-sm placeholder:text-neutral-500 focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Search icon - Mobile only */}
          <Link
            href="/search"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md notion-hover"
          >
            <Search className="h-4 w-4 text-neutral-600" />
          </Link>

          {/* Header actions - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard/notifications"
              className="flex h-8 w-8 items-center justify-center rounded-md notion-hover relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-neutral-600" />
              {/* Notification dot - could be dynamic based on unread count */}
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full opacity-0"></span>
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex h-8 w-8 items-center justify-center rounded-md notion-hover"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-neutral-600" />
            </Link>
          </div>

          {/* User info */}
          <div className="flex items-center gap-2">
            {/* User avatar */}
            <Link href="/dashboard/profile" className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {user?.fullName?.charAt(0)?.toUpperCase() || authUser.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Sign out */}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-md notion-hover"
                title="Sign out"
              >
                <LogOut className="h-4 w-4 text-neutral-600" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
} 