import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getWorkspaceDataAction } from '@/lib/actions/workspace'
import { WorkspacePageClient } from './workspace-page-client'

interface WorkspacePageProps {
  params: Promise<{ workspace: string }>
  searchParams: Promise<{ tab?: string }>
}

// Force dynamic rendering - requires user-specific server data
export const dynamic = 'force-dynamic'

export default async function WorkspacePage({ params, searchParams }: WorkspacePageProps) {
  // Server-side auth check
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/sign-in')
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    redirect('/sign-in')
  }

  // Get workspace slug and tab from params
  const { workspace: workspaceSlug } = await params
  const { tab } = await searchParams

  // Server-side data fetching for better performance
  const result = await getWorkspaceDataAction(workspaceSlug)
  
  if (!result.success || !result.data) {
    redirect('/dashboard')
  }

  return (
    <WorkspacePageClient 
      workspaceSlug={workspaceSlug}
      initialData={result.data}
      initialTab={tab}
      userId={user.id}
    />
  )
} 