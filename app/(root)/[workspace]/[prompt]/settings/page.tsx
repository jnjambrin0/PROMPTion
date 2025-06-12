import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'

import { notFound, redirect } from 'next/navigation'
import { PromptSettingsClient } from './prompt-settings-client';

interface PromptSettingsPageProps {
  params: Promise<{ workspace: string; prompt: string }>
}

// Server component - handles authentication and data validation
export default async function PromptSettingsPage({ params }: PromptSettingsPageProps) {
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

  // TODO: Add validation that user has settings permissions for this prompt
  // For now, we'll pass the validation to the client component
  // In a production app, you'd want to validate ownership/permissions here

  return (
    <PromptSettingsClient 
      workspaceSlug={workspaceSlug}
      promptSlug={promptSlug}
      userId={user.id}
    />
  )
} 