import Link from 'next/link'
import { Search, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { HEADER_ACTIONS } from '@/lib/constants/navigation'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function Topbar() {
  const user = await getUser()
  
  if (!user) {
    redirect('/signin')
  }

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
                placeholder="Search prompts..."
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
            {HEADER_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href!}
                className="flex h-8 w-8 items-center justify-center rounded-md notion-hover"
              >
                <action.icon className="h-4 w-4 text-neutral-600" />
              </Link>
            ))}
          </div>

          {/* User avatar */}
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

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
    </header>
  )
} 