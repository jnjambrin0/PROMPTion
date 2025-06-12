import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'

interface WorkspaceLayoutProps {
  children: React.ReactNode
  params: Promise<{ workspace: string }>
}

async function getWorkspaceData(workspaceSlug: string) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) return null

    const user = await getUserByAuthId(authUser.id)
    if (!user) return null

    const workspace = await getWorkspaceBySlug(workspaceSlug, user.id)
    if (!workspace) return null

    return { user, workspace }
  } catch (error) {
    console.error('Error fetching workspace data:', error)
    return null
  }
}

export default async function WorkspaceLayout({ 
  children, 
  params 
}: WorkspaceLayoutProps) {
  const { workspace: workspaceSlug } = await params
  const data = await getWorkspaceData(workspaceSlug)
  
  if (!data) {
    notFound()
  }

  const { workspace } = data

  return (
    <div className="h-full bg-gray-25">
      {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-700">
                {workspace.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {workspace.name}
              </h1>
              {workspace.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children (the page with tabs) */}
      {children}
    </div>
  )
} 