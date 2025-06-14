import { getUserByAuthId } from '@/lib/db/users'
import { getUserWorkspaces } from '@/lib/db/workspaces'
import { getWorkspacePrompts } from '@/lib/db/prompts'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, formatDate } from '@/lib/utils'
import { Search, Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { PromptsSectionClient } from '@/components/dashboard/prompts-section-client'

async function getDashboardData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    const user = await getUserByAuthId(authUser.id)
    if (!user) return null

    const workspaces = await getUserWorkspaces(user.id)
    
    // Get all prompts from all workspaces
    const allPrompts = []
    for (const workspace of workspaces) {
      try {
        const { prompts } = await getWorkspacePrompts(workspace.id, user.id, {
          page: 1,
          limit: 50 // Get more prompts for the dashboard
        })
        allPrompts.push(...prompts.map(prompt => ({
          ...prompt,
          workspace: workspace
        })))
      } catch (error) {
        console.error(`Error fetching prompts for workspace ${workspace.id}:`, error)
      }
    }

    // Sort by updated date
    allPrompts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return { 
      user, 
      workspaces, 
      prompts: allPrompts,
      stats: {
        totalWorkspaces: workspaces.length,
        totalPrompts: allPrompts.length,
        totalTemplates: allPrompts.filter(p => p.isTemplate).length,
        totalPublic: allPrompts.filter(p => p.isPublic).length
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

interface DashboardPageProps {
  searchParams: Promise<{
    view?: string
    search?: string
    workspace?: string
    type?: string
    sort?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const data = await getDashboardData()
  
  if (!data) {
    redirect('/signin')
  }

  const { user, workspaces, prompts, stats } = data
  const params = await searchParams

  return (
    <div className="flex justify-center w-full min-h-full">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600">
              Manage your prompts and workspaces
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search prompts..."
                className="w-64 rounded-md border border-neutral-200 bg-neutral-50/50 py-2 pl-9 pr-3 text-sm placeholder:text-neutral-500 focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-200"
              />
            </div>
            
            <Link
              href="/prompts/new"
              className="flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New prompt
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalPrompts}</div>
            <div className="text-sm text-neutral-600">Total prompts</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalWorkspaces}</div>
            <div className="text-sm text-neutral-600">Workspaces</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalTemplates}</div>
            <div className="text-sm text-neutral-600">Templates</div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="text-2xl font-semibold text-neutral-900">{stats.totalPublic}</div>
            <div className="text-sm text-neutral-600">Public</div>
          </div>
        </div>

        {/* Workspaces Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Workspaces</h2>
            <Link
              href="/workspaces/new"
              className="text-sm text-neutral-600 hover:text-neutral-900 underline"
            >
              Create workspace
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/${workspace.slug}`}
                className="block bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-neutral-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-neutral-700">
                      {workspace.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 truncate">
                      {workspace.name}
                    </h3>
                    <p className="text-sm text-neutral-600 truncate">
                      {workspace.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                      <span>{workspace._count?.prompts || 0} prompts</span>
                      <span>{workspace._count?.members || 0} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Enhanced Prompts Section */}
        <PromptsSectionClient prompts={prompts} initialSearchParams={params} />
      </div>
    </div>
  )
} 