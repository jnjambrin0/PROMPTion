import { getCurrentUser } from '@/lib/dal'
import { SettingsClient } from './settings-client'
import { getUserSettingsAction } from '@/lib/actions/user-settings'

// Force dynamic rendering - this page requires user-specific server data
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  // Use new DAL for secure authentication - this handles all security checks
  const user = await getCurrentUser()

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