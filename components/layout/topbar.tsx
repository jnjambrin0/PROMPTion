import Link from 'next/link'
import { Search, Settings } from 'lucide-react'
import { MobileNav } from '@/components/layout/mobile-nav'
import { NotificationPanel } from '@/components/ui/notifications'
import { UserMenu } from '@/components/ui/user-menu'
import { getUserByAuthId } from '@/lib/db/users'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { TopbarSearch } from './topbar-search'

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
    redirect('/sign-in')
  }

  const { authUser, user } = userData

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-12 items-center justify-between px-4">
        {/* Left section - Mobile nav + Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Navigation */}
          <MobileNav />

        </div>

        {/* Center section - Main Search (Teams style) */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
          <TopbarSearch />
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
            <NotificationPanel />
            
            <Link
              href="/settings"
              className="flex h-8 w-8 items-center justify-center rounded-md notion-hover"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-neutral-600" />
            </Link>
          </div>

          {/* User Menu */}
          <UserMenu user={user} authUser={authUser} />
        </div>
      </div>
    </header>
  )
} 