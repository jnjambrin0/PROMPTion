'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getTemplateStats } from '@/lib/db/templates'
import { getUserByAuthId } from '@/lib/db'
import { ActionResult } from '@/lib/types/shared'
import type { AuthenticatedUser } from '@/lib/types/shared'
import type { Template, TemplateListItem, TemplateStats } from '@/lib/types/templates'
import type { User } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'

// ==================== AUTHENTICATION HELPER ====================

async function getAuthenticatedUser(): Promise<
  | { user: AuthenticatedUser; authUser: User; error?: never }
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

    return { user: user as AuthenticatedUser, authUser }
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
    if (auth.error || !auth.user) {
      return { success: false, error: auth.error || 'Authentication failed' }
    }

    // Buscar template
    const template = await prisma.prompt.findFirst({
      where: {
        id: templateId,
        isTemplate: true,
        OR: [
          { isPublic: true },
          { userId: auth.user.id }
        ]
      }
    })

    if (!template) {
      return {
        success: false,
        error: 'Template not found or not accessible'
      }
    }

    // Revalidar paths relevantes
    revalidatePath('/dashboard')
    revalidatePath('/prompts')

    return {
      success: true,
      data: {
        promptId: template.id,
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

export async function getTemplateDetailsAction(templateId: string): Promise<ActionResult<Template>> {
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
      data: template as unknown as Template
    }

  } catch (error) {
    console.error('Error fetching template details:', error)
    return {
      success: false,
      error: 'Failed to fetch template details'
    }
  }
}

// ==================== TEMPLATES LISTING ACTIONS ====================

export async function getPublicTemplatesAction(input: {
  categoryId?: string
  search?: string
  sort?: 'popular' | 'recent' | 'favorites' | 'alphabetical'
  page?: number
  limit?: number
}): Promise<ActionResult<{
  templates: TemplateListItem[]
  totalCount: number
  hasMore: boolean
}>> {
  try {
    const { categoryId, search, sort = 'popular', page = 1, limit = 20 } = input

    // Construir filtros
    const where: {
      isTemplate: boolean
      isPublic: boolean
      deletedAt: null
      categoryId?: string
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
      }>
    } = {
      isTemplate: true,
      isPublic: true,
      deletedAt: null
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Construir ordenación
    let orderBy: Record<string, unknown>

    switch (sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' }
        break
      case 'favorites':
        orderBy = { _count: { favorites: 'desc' } }
        break
      case 'alphabetical':
        orderBy = { title: 'asc' }
        break
      default: // popular
        orderBy = { useCount: 'desc' }
    }

    const [templates, totalCount] = await Promise.all([
      prisma.prompt.findMany({
        where,
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
          _count: {
            select: {
              comments: true,
              favorites: true,
              forks: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.prompt.count({ where })
    ])

    return {
      success: true,
      data: {
        templates: templates as unknown as TemplateListItem[],
        totalCount,
        hasMore: totalCount > page * limit
      }
    }

  } catch (error) {
    console.error('Error fetching public templates:', error)
    return {
      success: false,
      error: 'Failed to fetch templates'
    }
  }
}

export async function getFeaturedTemplatesAction(): Promise<ActionResult<TemplateListItem[]>> {
  try {
    const templates = await prisma.prompt.findMany({
      where: {
        isTemplate: true,
        isPublic: true,
        isPinned: true,
        deletedAt: null
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
        _count: {
          select: {
            comments: true,
            favorites: true,
            forks: true
          }
        }
      },
      orderBy: {
        useCount: 'desc'
      },
      take: 12
    })

    return {
      success: true,
      data: templates as unknown as TemplateListItem[]
    }

  } catch (error) {
    console.error('Error fetching featured templates:', error)
    return {
      success: false,
      error: 'Failed to fetch featured templates'
    }
  }
}

export async function getTemplateByIdAction(templateId: string): Promise<ActionResult<Template>> {
  try {
    if (!templateId) {
      return {
        success: false,
        error: 'Template ID is required'
      }
    }

    const template = await prisma.prompt.findFirst({
      where: {
        id: templateId,
        isTemplate: true,
        deletedAt: null
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
        error: 'Template not found'
      }
    }

    return {
      success: true,
      data: template as unknown as Template
    }

  } catch (error) {
    console.error('Error fetching template by ID:', error)
    return {
      success: false,
      error: 'Failed to fetch template'
    }
  }
}

// ==================== CREATE TEMPLATE ACTION ====================

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

export async function createTemplateAction(input: CreateTemplateInput): Promise<ActionResult<{ templateId: string }>> {
  try {
    // Validación de entrada
    if (!input.title || !input.workspaceId) {
      return {
        success: false,
        error: 'Title and workspace are required'
      }
    }

    // Autenticación
    const auth = await getAuthenticatedUser()
    if (auth.error || !auth.user) {
      return { success: false, error: auth.error || 'Authentication failed' }
    }

    // Verificar acceso al workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: input.workspaceId,
        OR: [
          { ownerId: auth.user.id },
          {
            members: {
              some: {
                userId: auth.user.id,
                role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!workspace) {
      return {
        success: false,
        error: 'Access denied to workspace'
      }
    }

    // Crear template
    const template = await prisma.prompt.create({
      data: {
        title: input.title.trim(),
        slug: input.slug || input.title.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 50),
        description: input.description?.trim(),
        workspaceId: input.workspaceId,
        categoryId: input.categoryId,
        userId: auth.user.id,
        isTemplate: true,
        isPublic: input.isPublic || false,
        icon: input.icon
      }
    })

    // Revalidar paths
    revalidatePath('/templates')
    revalidatePath('/dashboard')

    return {
      success: true,
      data: { templateId: template.id }
    }

  } catch (error) {
    console.error('Error creating template:', error)
    return {
      success: false,
      error: 'Failed to create template'
    }
  }
} 