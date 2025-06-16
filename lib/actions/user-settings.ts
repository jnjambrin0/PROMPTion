'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getUserByAuthId } from '@/lib/db/users'
import { createClient } from '@/utils/supabase/server'

// ==================== TYPES ====================

export interface UserProfileData {
  id: string
  username: string | null
  fullName: string | null
  bio: string | null
  avatarUrl: string | null
  email: string
}

export interface NotificationPreferences {
  comments: boolean
  mentions: boolean
  weeklyDigest: boolean
  pushNotifications: boolean
  emailWorkspaceInvites: boolean
  emailPromptShared: boolean
  emailSystemUpdates: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'workspace_only' | 'private'
  showEmail: boolean
  showActivity: boolean
  allowDiscovery: boolean
}

export interface UserSettingsData {
  profile: UserProfileData
  notifications: NotificationPreferences
  privacy: PrivacySettings
  workspaces: Array<{
    id: string
    name: string
    slug: string
    role: string
    plan: string
  }>
}

export interface UserSettingsResult {
  success: boolean
  data?: UserSettingsData
  error?: string
}

// ==================== PROFILE ACTIONS ====================

export async function getUserSettingsAction(): Promise<UserSettingsResult> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Get user with workspaces
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        email: true,
        workspaceMembers: {
          select: {
            role: true,
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
                plan: true
              }
            }
          }
        }
      }
    })

    if (!userData) {
      return { success: false, error: 'User data not found' }
    }

    // Default notification preferences (would be stored in user table in production)
    const defaultNotifications: NotificationPreferences = {
      comments: true,
      mentions: true,
      weeklyDigest: true,
      pushNotifications: true,
      emailWorkspaceInvites: true,
      emailPromptShared: false,
      emailSystemUpdates: true
    }

    // Default privacy settings
    const defaultPrivacy: PrivacySettings = {
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true,
      allowDiscovery: true
    }

    const settingsData: UserSettingsData = {
      profile: {
        id: userData.id,
        username: userData.username,
        fullName: userData.fullName,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        email: userData.email
      },
      notifications: defaultNotifications,
      privacy: defaultPrivacy,
      workspaces: userData.workspaceMembers.map(member => ({
        id: member.workspace.id,
        name: member.workspace.name,
        slug: member.workspace.slug,
        role: member.role,
        plan: member.workspace.plan
      }))
    }

    return { success: true, data: settingsData }

  } catch (error) {
    console.error('Error fetching user settings:', error)
    return { success: false, error: 'Failed to fetch user settings' }
  }
}

export async function updateUserProfileAction(updates: {
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Validate username uniqueness if provided
    if (updates.username && updates.username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: updates.username }
      })
      
      if (existingUser) {
        return { success: false, error: 'Username already taken' }
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })

    revalidatePath('/settings')
    return { success: true }

  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

// ==================== NOTIFICATION ACTIONS ====================

export async function updateNotificationPreferencesAction(
  preferences: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // In a production app, this would be stored in a user_preferences table
    // For now, we'll simulate success
    console.log('Notification preferences updated:', preferences)

    revalidatePath('/settings')
    return { success: true }

  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return { success: false, error: 'Failed to update notification preferences' }
  }
}

// ==================== PRIVACY ACTIONS ====================

export async function updatePrivacySettingsAction(
  privacy: PrivacySettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // In a production app, this would be stored in a user_preferences table
    // For now, we'll simulate success
    console.log('Privacy settings updated:', privacy)

    revalidatePath('/settings')
    return { success: true }

  } catch (error) {
    console.error('Error updating privacy settings:', error)
    return { success: false, error: 'Failed to update privacy settings' }
  }
}

// ==================== WORKSPACE ACTIONS ====================

export async function leaveWorkspaceAction(
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check if user is the owner
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true, name: true }
    })

    if (!workspace) {
      return { success: false, error: 'Workspace not found' }
    }

    if (workspace.ownerId === user.id) {
      return { success: false, error: 'Cannot leave workspace you own. Transfer ownership first.' }
    }

    // Remove user from workspace
    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId
        }
      }
    })

    revalidatePath('/settings')
    return { success: true }

  } catch (error) {
    console.error('Error leaving workspace:', error)
    return { success: false, error: 'Failed to leave workspace' }
  }
}

// ==================== ACCOUNT ACTIONS ====================

export async function deleteAccountAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check if user owns any workspaces
    const ownedWorkspaces = await prisma.workspace.count({
      where: { ownerId: user.id }
    })

    if (ownedWorkspaces > 0) {
      return { 
        success: false, 
        error: 'Cannot delete account while owning workspaces. Transfer ownership first.' 
      }
    }

    // Soft delete user (set isActive to false)
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    })

    // Delete from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(authUser.id)
    if (error) {
      throw error
    }

    return { success: true }

  } catch (error) {
    console.error('Error deleting account:', error)
    return { success: false, error: 'Failed to delete account' }
  }
} 