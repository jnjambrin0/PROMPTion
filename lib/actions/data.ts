'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getTemplateCategories } from '@/lib/db/templates'
import prisma from '@/lib/prisma'

// ==================== INTERFACES ====================

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface Workspace {
  id: string
  name: string
  slug: string
}

interface TemplateCategory {
  id: string
  name: string
  count: number
  icon: string | null
}

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: any; authUser: any; error?: never }
  | { user?: never; authUser?: never; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return { error: 'Authentication required' }
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return { error: 'User not found in database' }
    }

    return { user, authUser }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

// ==================== WORKSPACE ACTIONS ====================

export async function getWorkspacesAction(): Promise<ActionResult<Workspace[]>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: auth.user.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: workspaces
    }

  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return {
      success: false,
      error: 'Failed to fetch workspaces'
    }
  }
}

// ==================== TEMPLATE CATEGORY ACTIONS ====================

export async function getTemplateCategoriesAction(): Promise<ActionResult<TemplateCategory[]>> {
  try {
    const rawCategories = await getTemplateCategories()
    
    // Map categories to match expected interface
    const categories: TemplateCategory[] = rawCategories.map(category => ({
      id: category.id,
      name: category.name,
      count: category._count.prompts,
      icon: category.icon || null
    }))

    return {
      success: true,
      data: categories
    }

  } catch (error) {
    console.error('Error fetching template categories:', error)
    return {
      success: false,
      error: 'Failed to fetch categories'
    }
  }
}

// ==================== WORKSPACE CATEGORIES ====================

export async function getWorkspaceCategoriesAction(workspaceId: string): Promise<ActionResult<any[]>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    // Verify user has access to workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: auth.user.id
          }
        }
      }
    })

    if (!workspace) {
      return { success: false, error: 'Workspace not found or access denied' }
    }

    const categories = await prisma.category.findMany({
      where: {
        workspaceId: workspaceId
      },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        _count: {
          select: {
            prompts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: categories
    }

  } catch (error) {
    console.error('Error fetching workspace categories:', error)
    return {
      success: false,
      error: 'Failed to fetch categories'
    }
  }
}

// ==================== PROFILE ACTIONS ====================

interface ProfileData {
  id: string
  email: string
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getProfileAction(): Promise<ActionResult<ProfileData>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const profileData: ProfileData = {
      id: auth.user.id,
      email: auth.user.email,
      username: auth.user.username,
      fullName: auth.user.fullName,
      bio: auth.user.bio,
      avatarUrl: auth.user.avatarUrl,
      createdAt: auth.user.createdAt,
      updatedAt: auth.user.updatedAt
    }

    return {
      success: true,
      data: profileData
    }

  } catch (error) {
    console.error('Profile fetch error:', error)
    return {
      success: false,
      error: 'Failed to fetch profile'
    }
  }
}

interface UpdateProfileInput {
  fullName?: string | null
  username?: string | null
  bio?: string | null
}

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResult<ProfileData>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    // Basic validation
    if (input.fullName && (input.fullName.length < 2 || input.fullName.length > 100)) {
      return { success: false, error: 'Full name must be between 2 and 100 characters' }
    }

    if (input.username && (input.username.length < 3 || input.username.length > 30)) {
      return { success: false, error: 'Username must be between 3 and 30 characters' }
    }

    if (input.username && !/^[a-zA-Z0-9_-]+$/.test(input.username)) {
      return { success: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' }
    }

    if (input.bio && input.bio.length > 500) {
      return { success: false, error: 'Bio must be less than 500 characters' }
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        fullName: input.fullName ?? undefined,
        username: input.username ?? undefined,
        bio: input.bio ?? undefined
      }
    })

    const profileData: ProfileData = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      fullName: updatedUser.fullName,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    return {
      success: true,
      data: profileData
    }

  } catch (error) {
    console.error('Profile update error:', error)
    
    // Handle unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: 'Username already exists'
      }
    }
    
    return {
      success: false,
      error: 'Failed to update profile'
    }
  }
}

// ==================== TEMPLATE USE ACTION ====================

export async function useTemplateAction(templateId: string): Promise<ActionResult<{ promptId: string }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    // Get template
    const template = await prisma.prompt.findUnique({
      where: { 
        id: templateId,
        isTemplate: true
      },
      include: {
        blocks: true,
        workspace: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    })

    if (!template) {
      return { success: false, error: 'Template not found' }
    }

    // Check if template is public or user has access
    if (!template.isPublic) {
      const hasAccess = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: template.workspaceId,
          userId: auth.user.id
        }
      })

      if (!hasAccess) {
        return { success: false, error: 'Access denied to this template' }
      }
    }

    // Generate unique slug for the copy
    const baseSlug = template.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40)
    
    let uniqueSlug = `${baseSlug}-copy`
    let counter = 1
    
    // Ensure slug is unique in workspace
    while (await prisma.prompt.findFirst({
      where: { slug: uniqueSlug, workspaceId: template.workspaceId }
    })) {
      uniqueSlug = `${baseSlug}-copy-${counter}`
      counter++
    }

    // Create new prompt from template
    const newPrompt = await prisma.prompt.create({
      data: {
        title: `${template.title} (Copy)`,
        slug: uniqueSlug,
        description: template.description,
        workspaceId: template.workspaceId,
        userId: auth.user.id,
        isTemplate: false,
        isPublic: false,
        blocks: {
          create: template.blocks.map((block: any) => ({
            type: block.type,
            content: block.content,
            position: block.position,
            userId: auth.user.id
          }))
        }
      }
    })

    return {
      success: true,
      data: { promptId: newPrompt.id }
    }

  } catch (error) {
    console.error('Error using template:', error)
    return {
      success: false,
      error: 'Failed to use template'
    }
  }
}

// ==================== TEMPLATE CREATION ACTION ====================

interface CreateTemplateInput {
  title: string
  slug?: string
  description?: string
  workspaceId: string
  categoryId?: string
  isPublic: boolean
  icon?: string
  templateType: 'prompt' | 'workflow' | 'agent'
}

export async function createTemplateAction(input: CreateTemplateInput): Promise<ActionResult<{ templateId: string; workspaceSlug?: string }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    // Validation
    if (!input.title || input.title.length < 3 || input.title.length > 100) {
      return { success: false, error: 'Title must be between 3 and 100 characters' }
    }

    if (!input.workspaceId) {
      return { success: false, error: 'Workspace is required' }
    }

    if (input.description && input.description.length > 500) {
      return { success: false, error: 'Description must be less than 500 characters' }
    }

    // Verify user has access to workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: input.workspaceId,
        members: {
          some: {
            userId: auth.user.id
          }
        }
      },
      select: {
        id: true,
        slug: true
      }
    })

    if (!workspace) {
      return { success: false, error: 'Workspace not found or access denied' }
    }

    // Generate slug if not provided
    let finalSlug = input.slug
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50)
    }

    // Ensure slug is unique
    let uniqueSlug = finalSlug
    let counter = 1
    while (await prisma.prompt.findFirst({
      where: { slug: uniqueSlug, workspaceId: input.workspaceId }
    })) {
      uniqueSlug = `${finalSlug}-${counter}`
      counter++
    }

    // Clean categoryId
    const cleanCategoryId = input.categoryId && 
                           input.categoryId !== 'none' && 
                           input.categoryId !== '' 
                           ? input.categoryId 
                           : undefined

    // Create template
    const template = await prisma.prompt.create({
      data: {
        title: input.title.trim(),
        slug: uniqueSlug,
        description: input.description?.trim() || undefined,
        workspaceId: input.workspaceId,
        categoryId: cleanCategoryId,
        userId: auth.user.id,
        isTemplate: true,
        isPublic: input.isPublic,
        icon: input.icon
      }
    })

    return {
      success: true,
      data: {
        templateId: template.id,
        workspaceSlug: workspace.slug
      }
    }

  } catch (error) {
    console.error('Error creating template:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'A template with this slug already exists' }
      }
    }
    
    return {
      success: false,
      error: 'Failed to create template'
    }
  }
} 