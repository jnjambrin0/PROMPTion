import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { SettingsClient } from './settings-client'
import { getUserSettingsAction } from '@/lib/actions/user-settings'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/sign-in')
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    redirect('/sign-in')
  }

  // Fetch initial settings data
  const settingsResult = await getUserSettingsAction()
  
  if (!settingsResult.success || !settingsResult.data) {
    // Fallback to basic user data if settings fetch fails
    const fallbackData = {
      profile: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        email: user.email
      },
      notifications: {
        comments: true,
        mentions: true,
        weeklyDigest: true,
        pushNotifications: true,
        emailWorkspaceInvites: true,
        emailPromptShared: false,
        emailSystemUpdates: true
      },
      privacy: {
        profileVisibility: 'public' as const,
        showEmail: false,
        showActivity: true,
        allowDiscovery: true
      },
      workspaces: []
    }
    
    return (
      <SettingsClient
        initialData={fallbackData}
        userId={user.id}
      />
    )
  }

  return (
    <SettingsClient
      initialData={settingsResult.data}
      userId={user.id}
    />
  )
} 