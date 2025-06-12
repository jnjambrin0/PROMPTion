import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { PromptPageClient } from './prompt-page-client';

interface PromptPageProps {
  params: Promise<{ workspace: string; prompt: string }>
}

// Minimal server component - solo authentication
export default async function PromptPage({ params }: PromptPageProps) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    // Redirect to auth will be handled by middleware
    return null
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    return null
  }

  const { workspace: workspaceSlug, prompt: promptSlug } = await params

  return (
    <PromptPageClient 
      workspaceSlug={workspaceSlug}
      promptSlug={promptSlug}
      userId={user.id}
    />
  )
} 