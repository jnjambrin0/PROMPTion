'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createPrompt, getUserByAuthId, getWorkspaceCategories, getUserWorkspaces } from '@/lib/db'
import { getWorkspaceBySlug } from '@/lib/db/workspaces'
import { getPromptBySlug, getPromptById } from '@/lib/db/prompts'
import { generateUniqueSlug } from '@/lib/db/utils'
import prisma from '@/lib/prisma'
import type { CreatePromptData } from '@/lib/types/forms'

interface CreatePromptResult {
  success: boolean
  error?: string
  promptSlug?: string
  workspaceSlug?: string
}

export async function createPromptAction(
  data: CreatePromptData
): Promise<CreatePromptResult> {
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

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { success: false, error: 'You must be logged in to create a prompt' }
    }

    // Get user from database
    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Generate slug if not provided
    let finalSlug = data.slug
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = generateSlugFromTitle(data.title)
    }

    // Clean and validate categoryId
    const cleanCategoryId = data.categoryId && 
                           data.categoryId !== 'none' && 
                           data.categoryId !== '' && 
                           data.categoryId.trim() !== '' 
                           ? data.categoryId.trim() 
                           : undefined

    // Create prompt
    const prompt = await createPrompt(
      {
        title: data.title.trim(),
        slug: finalSlug.toLowerCase().trim(),
        description: data.description?.trim() || undefined,
        workspaceId: data.workspaceId,
        categoryId: cleanCategoryId,
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
    revalidatePath(`/dashboard/${workspace?.slug}`)
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
}

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

export async function validatePromptSlug(slug: string, workspaceId: string): Promise<boolean> {
  try {
    // Basic validation
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
      return false
    }

    if (!workspaceId || workspaceId.trim() === '') {
      return false
    }

    // Check if slug is available in workspace
    const existing = await prisma.prompt.findFirst({
      where: {
        slug: slug,
        workspaceId: workspaceId,
        deletedAt: null
      },
      select: { id: true }
    })

    return !existing
  } catch (error) {
    console.error('Error validating prompt slug:', error)
    return false
  }
}

export async function getUserWorkspacesData() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { workspaces: [] }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { workspaces: [] }
    }

    const workspaces = await getUserWorkspaces(user.id)
    return { workspaces }
  } catch (error) {
    console.error('Error fetching user workspaces:', error)
    return { workspaces: [] }
  }
}

export async function getWorkspaceData(workspaceId: string) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { categories: [] }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { categories: [] }
    }

    // Verify user has access to workspace
    const workspaces = await getUserWorkspaces(user.id)
    const hasAccess = workspaces.some(w => w.id === workspaceId)
    
    if (!hasAccess) {
      return { categories: [] }
    }

    const categories = await getWorkspaceCategories(workspaceId, user.id)
    return { categories }
  } catch (error) {
    console.error('Error fetching workspace data:', error)
    return { categories: [] }
  }
} 

/**
 * Server Action para obtener datos completos del prompt page
 * Usado desde Client Components de forma segura
 */
export async function getPromptPageDataAction(
  workspaceSlug: string,
  promptSlug: string,
  userId: string
) {
  try {
    // Validar parámetros
    if (!workspaceSlug || !promptSlug || !userId) {
      return {
        success: false,
        error: 'Missing required parameters',
        data: null
      }
    }

    // Obtener workspace primero
    const workspace = await getWorkspaceBySlug(workspaceSlug, userId)
    if (!workspace) {
      return {
        success: false,
        error: 'Workspace not found or access denied',
        data: null,
        notFound: true
      }
    }

    // Obtener prompt
    const prompt = await getPromptBySlug(promptSlug, workspace.id, userId)
    if (!prompt) {
      return {
        success: false,
        error: 'Prompt not found or access denied',
        data: null,
        notFound: true
      }
    }

    // Combinar datos
    const promptData = {
      ...prompt,
      workspace: {
        ...workspace,
        _count: workspace._count
      }
    }

    return {
      success: true,
      error: null,
      data: promptData,
      notFound: false
    }
  } catch (error) {
    console.error('Error in getPromptPageDataAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch prompt data',
      data: null,
      notFound: false
    }
  }
}

/**
 * Server Action para duplicar un prompt
 * Crea una copia del prompt en el mismo workspace con validación completa
 */
export async function duplicatePromptAction(
  promptId: string,
  workspaceSlug: string
): Promise<CreatePromptResult> {
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
    const workspace = await getWorkspaceBySlug(workspaceSlug, user.id)
    if (!workspace) {
      return { success: false, error: 'Workspace not found or access denied' }
    }

    // 3. Get original prompt with authorization check
    const originalPrompt = await getPromptById(promptId, user.id)
    if (!originalPrompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 4. Generate unique slug for duplicate
    const baseSlug = `${originalPrompt.slug}-copy`
    const uniqueSlug = await generateUniqueSlug(baseSlug)

    // 5. Create duplicate prompt
    const duplicatePrompt = await createPrompt(
      {
        title: `${originalPrompt.title} (Copy)`,
        slug: uniqueSlug,
        description: originalPrompt.description || undefined,
        workspaceId: workspace.id,
        categoryId: originalPrompt.category?.id || undefined,
        isTemplate: false, // Duplicates are not templates by default
        isPublic: false   // Duplicates are private by default
      },
      user.id
    )

    // 6. If original has blocks, copy them
    if (originalPrompt.blocks && originalPrompt.blocks.length > 0) {
      await prisma.block.createMany({
        data: originalPrompt.blocks.map((block, index) => ({
          promptId: duplicatePrompt.id,
          type: block.type,
          content: block.content as any, // Json type compatibility
          position: index,
          indentLevel: block.indentLevel || 0,
          userId: user.id
        }))
      })
    }

    // 7. Cache invalidation
    revalidatePath(`/${workspaceSlug}`)
    revalidatePath(`/${workspaceSlug}?tab=prompts`)
    revalidatePath('/dashboard')

    return {
      success: true,
      promptSlug: duplicatePrompt.slug,
      workspaceSlug: workspace.slug
    }
  } catch (error) {
    console.error('Error duplicating prompt:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to duplicate prompt' }
  }
}

/**
 * Server Action para agregar/remover prompt de favoritos
 */
export async function toggleFavoritePromptAction(
  promptId: string
): Promise<{ success: boolean; error?: string; isFavorited?: boolean }> {
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

    // 2. Verify prompt access
    const prompt = await getPromptById(promptId, user.id)
    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId
        }
      }
    })

    let isFavorited: boolean

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_promptId: {
            userId: user.id,
            promptId: promptId
          }
        }
      })
      isFavorited = false
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId: user.id,
          promptId: promptId
        }
      })
      isFavorited = true
    }

    // 4. Cache invalidation
    revalidatePath('/favorites')
    revalidatePath('/dashboard')

    return {
      success: true,
      isFavorited
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to update favorites' }
  }
}

/**
 * Server Action para generar link de compartir
 */
export async function generateShareLinkAction(
  promptId: string
): Promise<{ success: boolean; error?: string; shareUrl?: string; isPublic?: boolean }> {
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

    // 2. Get prompt with authorization
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
                    some: { userId: user.id }
                  }
                }
              ]
            }
          }
        ]
      },
      include: {
        workspace: {
          select: {
            slug: true
          }
        }
      }
    })

    if (!prompt) {
      return { success: false, error: 'Prompt not found or access denied' }
    }

    // 3. If prompt is not public, user must be owner to share
    if (!prompt.isPublic && prompt.userId !== user.id) {
      return { success: false, error: 'Only the prompt owner can share private prompts' }
    }

    // 4. Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/${prompt.workspace.slug}/${prompt.slug}`

    return {
      success: true,
      shareUrl,
      isPublic: prompt.isPublic
    }
  } catch (error) {
    console.error('Error generating share link:', error)
    return { success: false, error: 'Failed to generate share link' }
  }
}

