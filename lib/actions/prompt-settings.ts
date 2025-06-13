'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getPromptById } from '@/lib/db/prompts'
import { getWorkspaceCategories } from '@/lib/db/categories'
import prisma from '@/lib/prisma'

// ==================== TYPES ====================

export interface PromptSettingsData {
  // Basic Information
  title: string
  description: string | null
  categoryId: string | null
  
  // Visibility & Access
  isPublic: boolean
  isTemplate: boolean
  isPinned: boolean
  
  // AI Configuration
  aiModel: string | null
  modelConfig: {
    temperature?: number
    maxTokens?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }
  
  // Advanced Settings
  apiAccess: boolean
  webhookUrl: string | null
}

export interface CollaboratorData {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  permission: 'VIEW' | 'COMMENT' | 'EDIT'
  createdAt: Date
}

export interface PromptSettingsResult {
  success: boolean
  error?: string
  data?: {
    prompt: PromptSettingsData & {
      id: string
      slug: string
      userId: string
      workspaceId: string
      createdAt: Date
      updatedAt: Date
    }
    workspace: {
      id: string
      name: string
      slug: string
    }
    collaborators: CollaboratorData[]
    categories: Array<{
      id: string
      name: string
      color: string | null
      icon: string | null
    }>
    isOwner: boolean
    canEdit: boolean
  }
}

// ==================== FETCH SETTINGS ====================

/**
 * Get complete prompt settings data with authorization
 */
export async function getPromptSettingsAction(
  workspaceSlug: string,
  promptSlug: string
): Promise<PromptSettingsResult> {
  try {
    // 1. Authentication
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // 2. Get workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        isActive: true,
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: { userId: user.id }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        members: {
          where: { userId: user.id },
          select: { role: true }
        }
      }
    })

    if (!workspace) {
      return { success: false, error: 'Workspace not found or access denied' }
    }

    // 3. Get prompt with settings
    const prompt = await prisma.prompt.findFirst({
      where: {
        slug: promptSlug,
        workspaceId: workspace.id,
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        categoryId: true,
        isPublic: true,
        isTemplate: true,
        isPinned: true,
        aiModel: true,
        modelConfig: true,
        userId: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found' }
    }

    // 4. Check permissions
    const isOwner = prompt.userId === user.id || workspace.ownerId === user.id
    const memberRole = workspace.members[0]?.role
    const canEdit = isOwner || ['ADMIN', 'EDITOR'].includes(memberRole || '')

    if (!canEdit && !prompt.isPublic) {
      return { success: false, error: 'Access denied' }
    }

    // 5. Get collaborators
    const collaborators = await prisma.collaboration.findMany({
      where: { promptId: prompt.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    })

    // 6. Get workspace categories
    const categories = await getWorkspaceCategories(workspace.id, user.id)

    // 7. Build response
    const settingsData: PromptSettingsData = {
      title: prompt.title,
      description: prompt.description,
      categoryId: prompt.categoryId,
      isPublic: prompt.isPublic,
      isTemplate: prompt.isTemplate,
      isPinned: prompt.isPinned,
      aiModel: prompt.aiModel,
      modelConfig: (prompt.modelConfig as any) || {},
      apiAccess: false, // TODO: Add to schema if needed
      webhookUrl: null // TODO: Add to schema if needed
    }

    const collaboratorData: CollaboratorData[] = collaborators.map(collab => ({
      id: collab.user.id,
      email: collab.user.email,
      fullName: collab.user.fullName,
      avatarUrl: collab.user.avatarUrl,
      permission: collab.permission,
      createdAt: collab.createdAt
    }))

    return {
      success: true,
      data: {
        prompt: {
          ...settingsData,
          id: prompt.id,
          slug: prompt.slug,
          userId: prompt.userId,
          workspaceId: prompt.workspaceId,
          createdAt: prompt.createdAt,
          updatedAt: prompt.updatedAt
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug
        },
        collaborators: collaboratorData,
        categories: categories || [],
        isOwner,
        canEdit
      }
    }
  } catch (error) {
    console.error('Error fetching prompt settings:', error)
    return { success: false, error: 'Failed to fetch settings' }
  }
}

// ==================== UPDATE SETTINGS ====================

/**
 * Update prompt basic settings
 */
export async function updatePromptSettingsAction(
  promptId: string,
  updates: Partial<PromptSettingsData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authentication
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // 2. Verify permissions
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { userId: user.id },
          {
            workspace: {
              OR: [
                { ownerId: user.id },
                {
                  members: {
                    some: {
                      userId: user.id,
                      role: { in: ['ADMIN', 'EDITOR'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      include: {
        workspace: { select: { slug: true } }
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. Validate category if provided
    if (updates.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: {
          id: updates.categoryId,
          workspaceId: prompt.workspaceId
        }
      })

      if (!categoryExists) {
        return { success: false, error: 'Category not found' }
      }
    }

    // 4. Update prompt
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        title: updates.title,
        description: updates.description,
        categoryId: updates.categoryId,
        isPublic: updates.isPublic,
        isTemplate: updates.isTemplate,
        isPinned: updates.isPinned,
        aiModel: updates.aiModel,
        modelConfig: updates.modelConfig,
        updatedAt: new Date()
      }
    })

    // 5. Create activity log
    await prisma.activity.create({
      data: {
        type: 'PROMPT_UPDATED',
        description: `Updated prompt settings: ${updates.title || prompt.title}`,
        userId: user.id,
        promptId: promptId,
        metadata: { settingsUpdated: updates }
      }
    })

    // 6. Cache invalidation
    revalidatePath(`/${prompt.workspace.slug}/${prompt.slug}`)
    revalidatePath(`/${prompt.workspace.slug}/${prompt.slug}/settings`)
    revalidatePath(`/${prompt.workspace.slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating prompt settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}

// ==================== COLLABORATORS ====================

/**
 * Add collaborator to prompt
 */
export async function addCollaboratorAction(
  promptId: string,
  email: string,
  permission: 'VIEW' | 'COMMENT' | 'EDIT'
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authentication
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // 2. Verify prompt ownership
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { userId: user.id },
          {
            workspace: {
              ownerId: user.id
            }
          }
        ]
      },
      include: {
        workspace: { select: { slug: true } }
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. Find user to invite
    const inviteeUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        isActive: true
      }
    })

    if (!inviteeUser) {
      return { success: false, error: 'User not found with this email' }
    }

    // 4. Check if already collaborator
    const existingCollab = await prisma.collaboration.findFirst({
      where: {
        promptId: promptId,
        userId: inviteeUser.id
      }
    })

    if (existingCollab) {
      return { success: false, error: 'User is already a collaborator' }
    }

    // 5. Add collaboration
    await prisma.collaboration.create({
      data: {
        promptId: promptId,
        userId: inviteeUser.id,
        permission: permission
      }
    })

    // 6. Create notification
    await prisma.notification.create({
      data: {
        type: 'PROMPT_SHARED',
        title: 'You have been added as a collaborator',
        message: `${user.fullName || user.email} shared the prompt "${prompt.title}" with you`,
        recipientId: inviteeUser.id,
        actorId: user.id,
        promptId: promptId,
        actionUrl: `/${prompt.workspace.slug}/${prompt.slug}`
      }
    })

    // 7. Cache invalidation
    revalidatePath(`/${prompt.workspace.slug}/${prompt.slug}/settings`)

    return { success: true }
  } catch (error) {
    console.error('Error adding collaborator:', error)
    return { success: false, error: 'Failed to add collaborator' }
  }
}

/**
 * Remove collaborator from prompt
 */
export async function removeCollaboratorAction(
  promptId: string,
  collaboratorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Authentication
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // 2. Verify permissions
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { userId: user.id },
          {
            workspace: {
              ownerId: user.id
            }
          }
        ]
      },
      include: {
        workspace: { select: { slug: true } }
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. Remove collaboration
    await prisma.collaboration.delete({
      where: {
        promptId_userId: {
          promptId: promptId,
          userId: collaboratorId
        }
      }
    })

    // 4. Cache invalidation
    revalidatePath(`/${prompt.workspace.slug}/${prompt.slug}/settings`)

    return { success: true }
  } catch (error) {
    console.error('Error removing collaborator:', error)
    return { success: false, error: 'Failed to remove collaborator' }
  }
}

// ==================== DELETE PROMPT ====================

/**
 * Delete prompt (soft delete)
 */
export async function deletePromptAction(
  promptId: string
): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
  try {
    // 1. Authentication
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // 2. Verify ownership
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        deletedAt: null,
        OR: [
          { userId: user.id },
          {
            workspace: {
              ownerId: user.id
            }
          }
        ]
      },
      include: {
        workspace: { select: { slug: true } }
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. Soft delete
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        deletedAt: new Date()
      }
    })

    // 4. Create activity log
    await prisma.activity.create({
      data: {
        type: 'PROMPT_DELETED',
        description: `Deleted prompt: ${prompt.title}`,
        userId: user.id,
        promptId: promptId,
        metadata: { deletedAt: new Date().toISOString() }
      }
    })

    // 5. Cache invalidation
    revalidatePath(`/${prompt.workspace.slug}`)
    revalidatePath('/dashboard')

    return { 
      success: true, 
      redirectUrl: `/${prompt.workspace.slug}` 
    }
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return { success: false, error: 'Failed to delete prompt' }
  }
} 