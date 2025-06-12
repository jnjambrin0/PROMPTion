import prisma from '../prisma'
import type { Prompt, BlockType } from '../generated/prisma'

/**
 * Obtiene un prompt por ID con verificación de acceso
 * @param id - ID del prompt
 * @param userId - ID del usuario solicitante
 * @returns Prompt si tiene acceso
 */
export async function getPromptById(id: string, userId: string) {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt or user ID')
  }

  try {
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { isPublic: true },
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: { userId }
                  }
                }
              ]
            }
          }
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
            color: true
          }
        },
        blocks: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            type: true,
            content: true,
            position: true,
            indentLevel: true,
            createdAt: true
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

    return prompt
  } catch (error) {
    console.error('Error fetching prompt:', error)
    throw new Error('Failed to fetch prompt')
  }
}

/**
 * Obtiene un prompt por slug dentro de un workspace con verificación de acceso
 * @param slug - Slug del prompt
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario solicitante
 * @returns Prompt si tiene acceso
 */
export async function getPromptBySlug(slug: string, workspaceId: string, userId: string) {
  if (!slug || !workspaceId || !userId || 
      typeof slug !== 'string' || typeof workspaceId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt slug, workspace ID, or user ID')
  }

  try {
    // Verificar primero acceso al workspace
    const hasWorkspaceAccess = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId }
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!hasWorkspaceAccess) {
      throw new Error('Access denied to workspace')
    }

    // Buscar prompt por slug en el workspace
    const prompt = await prisma.prompt.findFirst({
      where: {
        slug,
        workspaceId,
        deletedAt: null,
        OR: [
          { isPublic: true },
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: { userId }
                  }
                }
              ]
            }
          }
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
            color: true,
            icon: true
          }
        },
        blocks: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            type: true,
            content: true,
            position: true,
            indentLevel: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            comments: true,
            favorites: true,
            forks: true,
            blocks: true
          }
        }
      }
    })

    return prompt
  } catch (error) {
    console.error('Error fetching prompt by slug:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error
    }
    
    throw new Error('Failed to fetch prompt')
  }
}

/**
 * Obtiene prompts de un workspace con paginación
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario
 * @param options - Opciones de filtrado y paginación
 */
export async function getWorkspacePrompts(
  workspaceId: string,
  userId: string,
  options: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    isTemplate?: boolean
  } = {}
) {
  if (!workspaceId || !userId || typeof workspaceId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid workspace or user ID')
  }

  const { page = 1, limit = 20, search, categoryId, isTemplate } = options

  // Validar paginación
  if (page < 1 || limit < 1 || limit > 100) {
    throw new Error('Invalid pagination parameters')
  }

  try {
    // Verificar acceso al workspace
    const hasAccess = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId }
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!hasAccess) {
      throw new Error('Access denied to workspace')
    }

    const where: any = {
      workspaceId,
      deletedAt: null
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (typeof isTemplate === 'boolean') {
      where.isTemplate = isTemplate
    }

    const [prompts, total] = await Promise.all([
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
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          _count: {
            select: {
              blocks: true,
              comments: true,
              favorites: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { isPinned: 'desc' },
          { updatedAt: 'desc' }
        ]
      }),
      prisma.prompt.count({ where })
    ])

    return {
      prompts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching workspace prompts:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error
    }
    
    throw new Error('Failed to fetch prompts')
  }
}

/**
 * Crea un nuevo prompt
 * @param data - Datos del prompt
 * @param userId - ID del usuario creador
 * @returns Prompt creado
 */
export async function createPrompt(
  data: {
    title: string
    slug: string
    description?: string
    workspaceId: string
    categoryId?: string
    isTemplate?: boolean
    isPublic?: boolean
  },
  userId: string
) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  // Validaciones
  if (!data.title || data.title.length < 3 || data.title.length > 100) {
    throw new Error('Title must be between 3 and 100 characters')
  }

  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug) || data.slug.length < 3) {
    throw new Error('Invalid slug format')
  }

  if (data.description && data.description.length > 500) {
    throw new Error('Description must be less than 500 characters')
  }

  try {
    // Verificar acceso al workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: data.workspaceId,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
                role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
              }
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!workspace) {
      throw new Error('Access denied to workspace')
    }

    // Validar categoryId si se proporciona
    if (data.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          workspaceId: data.workspaceId
        },
        select: { id: true }
      })

      if (!categoryExists) {
        throw new Error('Category not found in workspace')
      }
    }

    // Verificar que el slug no existe en el workspace
    const existing = await prisma.prompt.findFirst({
      where: {
        slug: data.slug,
        workspaceId: data.workspaceId,
        deletedAt: null
      },
      select: { id: true }
    })

    if (existing) {
      throw new Error('Prompt slug already exists in workspace')
    }

    // Crear prompt en transacción
    const prompt = await prisma.$transaction(async (tx) => {
      const newPrompt = await tx.prompt.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          workspaceId: data.workspaceId,
          userId,
          categoryId: data.categoryId || null,
          isTemplate: data.isTemplate || false,
          isPublic: data.isPublic || false,
          modelConfig: {},
          variables: []
        }
      })

      // Crear versión inicial
      await tx.promptVersion.create({
        data: {
          promptId: newPrompt.id,
          userId,
          version: 1,
          title: data.title,
          content: { blocks: [] },
          modelConfig: {},
          variables: []
        }
      })

      return newPrompt
    })

    return prompt
  } catch (error) {
    console.error('Error creating prompt:', error)
    
    if (error instanceof Error && (
      error.message.includes('Access denied') ||
      error.message.includes('already exists')
    )) {
      throw error
    }
    
    throw new Error('Failed to create prompt')
  }
}

/**
 * Actualiza un prompt con verificación de permisos
 * @param id - ID del prompt
 * @param data - Datos a actualizar
 * @param userId - ID del usuario
 * @returns Prompt actualizado
 */
export async function updatePrompt(
  id: string,
  data: {
    title?: string
    description?: string
    categoryId?: string
    isTemplate?: boolean
    isPublic?: boolean
    isPinned?: boolean
  },
  userId: string
) {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt or user ID')
  }

  // Validaciones
  if (data.title && (data.title.length < 3 || data.title.length > 100)) {
    throw new Error('Title must be between 3 and 100 characters')
  }

  if (data.description && data.description.length > 500) {
    throw new Error('Description must be less than 500 characters')
  }

  try {
    // Verificar permisos
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { userId },
          {
            workspace: {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId,
                      role: { in: ['OWNER', 'ADMIN', 'EDITOR'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      select: { id: true, userId: true }
    })

    if (!prompt) {
      throw new Error('Prompt not found or access denied')
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isTemplate: true,
        isPublic: true,
        isPinned: true,
        updatedAt: true
      }
    })

    return updatedPrompt
  } catch (error) {
    console.error('Error updating prompt:', error)
    
    if (error instanceof Error && error.message.includes('access denied')) {
      throw error
    }
    
    throw new Error('Failed to update prompt')
  }
}

/**
 * Elimina un prompt (soft delete) con verificación de permisos
 * @param id - ID del prompt
 * @param userId - ID del usuario
 */
export async function deletePrompt(id: string, userId: string): Promise<void> {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid prompt or user ID')
  }

  try {
    // Verificar permisos (solo owner del prompt o workspace)
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { userId },
          {
            workspace: {
              ownerId: userId
            }
          }
        ]
      },
      select: { id: true }
    })

    if (!prompt) {
      throw new Error('Prompt not found or access denied')
    }

    await prisma.prompt.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    
    if (error instanceof Error && error.message.includes('access denied')) {
      throw error
    }
    
    throw new Error('Failed to delete prompt')
  }
} 