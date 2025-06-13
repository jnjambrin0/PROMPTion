import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { notFound, redirect } from 'next/navigation'
import { PromptSettingsClient } from './prompt-settings-client'
import { getPromptSettingsAction } from '@/lib/actions/prompt-settings'

interface PromptSettingsPageProps {
  params: Promise<{ workspace: string; prompt: string }>
}

// ✅ Server Component optimizado - hace fetch inicial
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

  // ✅ Fetch inicial en Server Component para mejor performance
  const settingsResult = await getPromptSettingsAction(workspaceSlug, promptSlug)
  
  if (!settingsResult.success) {
    notFound()
  }

  if (!settingsResult.data) {
    notFound()
  }

  return (
    <PromptSettingsClient 
      workspaceSlug={workspaceSlug}
      promptSlug={promptSlug}
      userId={user.id}
      initialData={settingsResult.data}
    />
  )
} 