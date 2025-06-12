import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { QUICK_ACTIONS } from '@/lib/constants/navigation'
import { getUserByAuthId } from '@/lib/db/users'
import { getUserWorkspaces } from '@/lib/db/workspaces'
import { createClient } from '@/utils/supabase/server'
import { Home, Plus, Settings, Users } from 'lucide-react'

async function getUserData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    const user = await getUserByAuthId(authUser.id)
    if (!user) return null

    const workspaces = await getUserWorkspaces(user.id)
    
    return { user, workspaces }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export async function Sidebar() {
  const userData = await getUserData()
  
  return (
    <aside className="w-64 h-screen border-r border-neutral-200 bg-neutral-50/30 p-4 flex flex-col overflow-y-hidden">
      {/* Brand */}
      <div className="mb-6">
        <Link href="/home" className="block">
          <h1 className="text-lg font-semibold text-neutral-900">Promption</h1>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="space-y-1">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.id}
              href={action.href!}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Workspaces */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3 px-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Workspaces
          </h3>
          <Link 
            href="/workspaces/new"
            className="p-1 rounded-md hover:bg-neutral-200 transition-colors"
            title="Create workspace"
          >
            <Plus className="h-3 w-3 text-neutral-500" />
          </Link>
        </div>
        
        <div className="space-y-1 mb-6">
          {userData?.workspaces?.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${workspace.slug}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover group"
            >
              <div className="h-4 w-4 rounded bg-neutral-300 flex items-center justify-center">
                <span className="text-xs font-medium text-neutral-600">
                  {workspace.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="flex-1 truncate">{workspace.name}</span>
              {workspace._count && (
                <span className="text-xs text-neutral-500">
                  {workspace._count.prompts}
                </span>
              )}
            </Link>
          )) || (
            <div className="px-3 py-2 text-sm text-neutral-500">
              No workspaces yet
            </div>
          )}
        </div>

        <Separator className="mb-4" />

        {/* Navigation */}
        <div>
          <h3 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
            Navigation
          </h3>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/templates"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <Users className="h-4 w-4" />
              Templates
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-700 notion-hover"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* User info at bottom */}
      {userData?.user && (
        <div className="mt-auto pt-4 border-t border-neutral-200">
          <div className="px-3 py-2 text-sm text-neutral-600">
            <div className="font-medium truncate">
              {userData.user.fullName || userData.user.email}
            </div>
            <div className="text-xs text-neutral-500 truncate">
              {userData.user.email}
            </div>
          </div>
        </div>
      )}
    </aside>
  )
} 