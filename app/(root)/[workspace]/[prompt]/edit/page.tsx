import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getPromptBySlug } from '@/lib/db/prompts'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { notFound, redirect } from 'next/navigation'
import { PromptEditClient } from './prompt-edit-client'

interface PromptEditPageProps {
  params: Promise<{ workspace: string; prompt: string }>
}

// Server component - handles authentication and data validation
export default async function PromptEditPage({ params }: PromptEditPageProps) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/sign-in')
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    redirect('/sign-in')
  }

  const { workspace: workspaceSlug, prompt: promptSlug } = await params

  try {
    // Fetch workspace and verify access
    const workspace = await getWorkspaceBySlug(workspaceSlug, user.id)
    if (!workspace) {
      notFound()
    }

    // Fetch prompt and verify access
    const prompt = await getPromptBySlug(promptSlug, workspace.id, user.id)
    if (!prompt) {
      notFound()
    }

    // Add validation that user has edit permissions for this prompt
    // Check if user is the owner or has edit access through workspace
    const hasEditAccess = 
      prompt.userId === user.id || // User owns the prompt
      workspace.ownerId === user.id // User owns the workspace
      // TODO: Add check for workspace member with edit permissions

    if (!hasEditAccess) {
      redirect(`/${workspaceSlug}/${promptSlug}`) // Redirect to view instead of edit
    }

    return (
      <PromptEditClient 
        workspaceSlug={workspaceSlug}
        promptSlug={promptSlug}
        userId={user.id}
        initialPrompt={prompt}
        initialWorkspace={workspace}
      />
    )
  } catch (error) {
    console.error('Error fetching prompt edit data:', error)
    notFound()
  }
} 