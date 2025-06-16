'use server'

import { revalidatePath } from 'next/cache'
import { withAuth } from '@/lib/actions/auth/auth-helpers'
import { createPrompt } from '@/lib/db'
import { generateUniquePromptSlug, cleanCategoryId } from '@/lib/utils/prompt-utils'
import prisma from '@/lib/prisma'
import type { CreatePromptData } from '@/lib/types/forms'
import type { AuthenticatedUser, JsonValue } from '@/lib/types/shared'
import type { BlockType } from '@/lib/generated/prisma'
import type { InputJsonValue } from '@prisma/client/runtime/library'

interface UpdateBlock {
  id: string
  type: BlockType
  content: JsonValue
  position: number
}

interface CreatePromptResult {
  success: boolean
  error?: string
  promptSlug?: string
  workspaceSlug?: string
}

interface UpdatePromptResult {
  success: boolean
  error?: string
  data?: unknown
}

/**
 * Create a new prompt
 */
export const createPromptAction = withAuth(async (
  user: AuthenticatedUser,
  data: CreatePromptData
): Promise<CreatePromptResult> => {
  try {
    // Validate input
    if (!data.title || data.title.length < 3 || data.title.length > 100) {
      return { success: false, error: 'Title must be between 3 and 100 characters' }
    }

    if (!data.workspaceId) {
      return { success: false, error: 'Workspace is required' }
    }

    if (data.description && data.description.length > 500) {
      return { success: false, error: 'Description must be less than 500 characters' }
    }

    // Generate unique slug
    const finalSlug = data.slug && data.slug.trim() 
      ? await generateUniquePromptSlug(data.slug, data.workspaceId)
      : await generateUniquePromptSlug(data.title, data.workspaceId)

    // Create prompt
    const prompt = await createPrompt(
      {
        title: data.title.trim(),
        slug: finalSlug,
        description: data.description?.trim() || undefined,
        workspaceId: data.workspaceId,
        categoryId: cleanCategoryId(data.categoryId),
        isTemplate: data.isTemplate || false,
        isPublic: data.isPublic || false
      },
      user.id
    )

    // Get workspace slug for redirect
    const workspace = await prisma.workspace.findUnique({
      where: { id: data.workspaceId },
      select: { slug: true }
    })

    // Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath(`/${workspace?.slug}`)
    revalidatePath('/prompts')

    return { 
      success: true, 
      promptSlug: prompt.slug,
      workspaceSlug: workspace?.slug
    }
  } catch (error) {
    console.error('Error creating prompt:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return { success: false, error: 'A prompt with this URL already exists in the workspace' }
      }
      if (error.message.includes('Access denied')) {
        return { success: false, error: 'You do not have permission to create prompts in this workspace' }
      }
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to create prompt. Please try again.' }
  }
})

/**
 * Update an existing prompt
 */
export const updatePromptAction = withAuth(async (
  user: AuthenticatedUser,
  promptId: string,
  updates: {
    title: string
    description: string
    blocks: UpdateBlock[]
    isPublic: boolean
    isTemplate: boolean
  }
): Promise<UpdatePromptResult> => {
  try {
    // Validate prompt exists and user has permission
    const existingPrompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user.id }
            }
          }
        }
      }
    })

    if (!existingPrompt) {
      return { success: false, error: 'Prompt not found' }
    }

    // Check permissions
    const membership = existingPrompt.workspace.members[0]
    if (existingPrompt.userId !== user.id && (!membership || !['ADMIN', 'EDITOR'].includes(membership.role))) {
      return { success: false, error: 'Permission denied' }
    }

    // Update the prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: promptId },
      data: {
        title: updates.title,
        description: updates.description || null,
        isPublic: updates.isPublic,
        isTemplate: updates.isTemplate,
        updatedAt: new Date()
      },
      include: {
        workspace: true,
        user: true,
        _count: {
          select: {
            favorites: true,
            forks: true,
            comments: true,
            blocks: true
          }
        }
      }
    })

    // Update blocks
    await prisma.block.deleteMany({
      where: { promptId: promptId }
    })

    if (updates.blocks.length > 0) {
      await prisma.block.createMany({
        data: updates.blocks.map(block => ({
          id: block.id,
          type: block.type,
          content: block.content as InputJsonValue,
          position: block.position,
          promptId: promptId,
          userId: user.id
        }))
      })
    }

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'PROMPT_UPDATED',
        description: `Updated prompt "${updates.title}"`,
        userId: user.id,
        promptId: promptId,
        metadata: {
          changes: {
            title: updates.title !== existingPrompt.title ? { from: existingPrompt.title, to: updates.title } : undefined,
            description: updates.description !== existingPrompt.description ? { from: existingPrompt.description, to: updates.description } : undefined,
            isPublic: updates.isPublic !== existingPrompt.isPublic ? { from: existingPrompt.isPublic, to: updates.isPublic } : undefined,
            isTemplate: updates.isTemplate !== existingPrompt.isTemplate ? { from: existingPrompt.isTemplate, to: updates.isTemplate } : undefined,
            blocksCount: updates.blocks.length
          }
        }
      }
    })

    // Revalidate paths
    revalidatePath(`/${existingPrompt.workspace.slug}/${existingPrompt.slug}`)
    revalidatePath('/dashboard')

    return { 
      success: true, 
      data: updatedPrompt 
    }
  } catch (error) {
    console.error('Error updating prompt:', error)
    return { 
      success: false, 
      error: 'Failed to update prompt' 
    }
  }
}) 