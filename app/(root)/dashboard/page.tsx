import { getDashboardData } from '@/lib/db/dashboard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { PromptsSectionClient } from '@/components/dashboard/prompts-section-client'

// Force dynamic rendering - this page requires user-specific server data
export const dynamic = 'force-dynamic'

async function getOptimizedDashboardData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    // Use the optimized parallel fetching function
    return await getDashboardData(authUser.id)
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
  const data = await getOptimizedDashboardData()
  
  if (!data) {
    redirect('/signin')
  }

  const { workspaces, prompts, stats } = data
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