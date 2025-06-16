'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { getTemplateStats, useTemplate, getPublicTemplates, getFeaturedTemplates, createTemplate } from '@/lib/db/templates'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// ==================== INTERFACES ====================

interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface TemplateStats {
  totalTemplates: number
  totalAuthors: number
  totalUsage: number
  featuredCount: number
}

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: Record<string, unknown>; authUser: Record<string, unknown>; error?: never }
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
      return { error: 'User not found' }
    }

    return { user, authUser }
  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed' }
  }
}

// ==================== TEMPLATE STATS ACTION ====================

export async function getTemplateStatsAction(): Promise<ActionResult<TemplateStats>> {
  try {
    // No requiere autenticación para stats públicas
    const stats = await getTemplateStats()

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    console.error('Error fetching template stats:', error)
    return {
      success: false,
      error: 'Failed to fetch stats',
      data: {
        totalTemplates: 0,
        totalAuthors: 0,
        totalUsage: 0,
        featuredCount: 0
      }
    }
  }
}

// ==================== USE TEMPLATE ACTION ====================

export async function useTemplateAction(templateId: string): Promise<ActionResult<{ promptId: string; message: string }>> {
  try {
    // Validación de entrada
    if (!templateId || typeof templateId !== 'string') {
      return {
        success: false,
        error: 'Invalid template ID format'
      }
    }

    // Autenticación
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    // Lógica de negocio
    const result = await getTemplateById(templateId, auth.user.id)

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to use template'
      }
    }

    // Revalidar paths relevantes
    revalidatePath('/dashboard')
    revalidatePath('/prompts')

    return {
      success: true,
      data: {
        promptId: result.promptId!,
        message: 'Template used successfully'
      }
    }

  } catch (error) {
    console.error('Template use error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Template not found')) {
        return {
          success: false,
          error: 'Template not found or not accessible'
        }
      }
      
      if (error.message.includes('Access denied')) {
        return {
          success: false,
          error: 'Access denied'
        }
      }
    }
    
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

// ==================== GET TEMPLATE DETAILS ACTION ====================

export async function getTemplateDetailsAction(templateId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    if (!templateId || typeof templateId !== 'string') {
      return {
        success: false,
        error: 'Invalid template ID'
      }
    }

    // Buscar template público o verificar acceso privado
    const template = await prisma.prompt.findFirst({
      where: {
        id: templateId,
        isTemplate: true,
        OR: [
          { isPublic: true },
          // Si está autenticado, puede ver sus propios templates
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        },
        blocks: {
          orderBy: {
            position: 'asc'
          }
                 }
      }
    })

    if (!template) {
      return {
        success: false,
        error: 'Template not found or not accessible'
      }
    }

    return {
      success: true,
      data: template
    }

  } catch (error) {
    console.error('Error fetching template details:', error)
    return {
      success: false,
      error: 'Failed to fetch template details'
    }
  }
}

// ==================== NEW TEMPLATES LISTING ACTIONS ====================

export async function getPublicTemplatesAction(input: {
  categoryId?: string
  search?: string
  sort?: 'popular' | 'recent' | 'favorites' | 'alphabetical'
  page?: number
  limit?: number
}): Promise<ActionResult<{
  templates: Record<string, unknown>[]
  totalCount: number
  hasMore: boolean
}>> {
  try {
    const filters = {
      categoryId: input.categoryId,
      search: input.search,
      sort: input.sort || 'popular',
      page: input.page || 1,
      limit: input.limit || 12
    }

    const result = await getPublicTemplates(filters)

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Get public templates error:', error)
    return {
      success: false,
      error: 'Failed to fetch templates'
    }
  }
}

export async function getFeaturedTemplatesAction(): Promise<ActionResult<Record<string, unknown>[]>> {
  try {
    const templates = await getFeaturedTemplates()

    return {
      success: true,
      data: templates
    }

  } catch (error) {
    console.error('Get featured templates error:', error)
    return {
      success: false,
      error: 'Failed to fetch featured templates'
    }
  }
}

// ==================== TEMPLATE DETAIL ACTION ====================

export async function getTemplateByIdAction(templateId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    if (!templateId || typeof templateId !== 'string') {
      return {
        success: false,
        error: 'Invalid template ID'
      }
    }

    // Buscar template público o verificar acceso privado
    const template = await prisma.prompt.findFirst({
      where: {
        id: templateId,
        isTemplate: true,
        OR: [
          { isPublic: true },
          // Si está autenticado, puede ver sus propios templates
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        blocks: {
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: {
            comments: true,
            favorites: true,
            forks: true
          }
        }
      }
    })

    if (!template) {
      return {
        success: false,
        error: 'Template not found or not accessible'
      }
    }

    return {
      success: true,
      data: template
    }

  } catch (error) {
    console.error('Get template by ID error:', error)
    return {
      success: false,
      error: 'Failed to fetch template details'
    }
  }
}

// ==================== TEMPLATE CREATION ACTION ====================

interface CreateTemplateInput {
  title: string
  slug?: string
  description: string
  workspaceId: string
  categoryId?: string
  isPublic?: boolean
  icon?: string
  templateType?: 'prompt' | 'workflow' | 'agent'
}

const createTemplateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(50, 'Slug too long').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  workspaceId: z.string().uuid('Invalid workspace ID'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  isPublic: z.boolean().default(true),
  icon: z.string().optional(),
  templateType: z.enum(['prompt', 'workflow', 'agent']).default('prompt')
})

export async function createTemplateAction(input: CreateTemplateInput): Promise<ActionResult<{ templateId: string }>> {
  try {
    const auth = await getAuthenticatedUser()
    if (auth.error) {
      return { success: false, error: auth.error }
    }

    const { user } = auth

    // Validar datos de entrada
    const validation = createTemplateSchema.safeParse(input)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: firstError.message
      }
    }

    const validatedData = validation.data

    // Crear template
    const template = await createTemplate({
      title: validatedData.title,
      slug: validatedData.slug || '',
      description: validatedData.description,
      workspaceId: validatedData.workspaceId,
      categoryId: validatedData.categoryId,
      isPublic: validatedData.isPublic,
      icon: validatedData.icon,
      templateType: validatedData.templateType,
      isTemplate: true
    }, user.id)

    // Revalidar paths relevantes
    revalidatePath('/templates')
    revalidatePath('/dashboard')
    revalidatePath('/workspaces')

    return {
      success: true,
      data: { templateId: template.id }
    }

  } catch (error) {
    console.error('Create template error:', error)
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return {
          success: false,
          error: 'A template with this slug already exists'
        }
      }
      
      if (error.message.includes('Access denied')) {
        return {
          success: false,
          error: 'Access denied to workspace'
        }
      }
      
      if (error.message.includes('not found')) {
        return {
          success: false,
          error: 'Workspace or category not found'
        }
      }
    }
    
    return {
      success: false,
      error: 'Failed to create template'
    }
  }
} 