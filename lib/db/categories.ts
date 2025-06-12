import prisma from '../prisma'
import type { Category } from '../generated/prisma'

/**
 * Obtiene categorías de un workspace
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario
 * @returns Lista de categorías del workspace
 */
export async function getWorkspaceCategories(workspaceId: string, userId: string) {
  if (!workspaceId || !userId || typeof workspaceId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid workspace or user ID')
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

    const categories = await prisma.category.findMany({
      where: { workspaceId },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        },
        _count: {
          select: {
            prompts: true,
            children: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    })

    return categories
  } catch (error) {
    console.error('Error fetching workspace categories:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error
    }
    
    throw new Error('Failed to fetch categories')
  }
}

/**
 * Crea una nueva categoría
 * @param data - Datos de la categoría
 * @param userId - ID del usuario creador
 * @returns Categoría creada
 */
export async function createCategory(
  data: {
    name: string
    slug: string
    description?: string
    workspaceId: string
    parentId?: string
    icon?: string
    color?: string
  },
  userId: string
) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  // Validaciones
  if (!data.name || data.name.length < 2 || data.name.length > 50) {
    throw new Error('Category name must be between 2 and 50 characters')
  }

  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug) || data.slug.length < 2) {
    throw new Error('Invalid slug format')
  }

  if (data.description && data.description.length > 200) {
    throw new Error('Description must be less than 200 characters')
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

    // Verificar que el slug no existe en el workspace
    const existing = await prisma.category.findFirst({
      where: {
        slug: data.slug,
        workspaceId: data.workspaceId
      },
      select: { id: true }
    })

    if (existing) {
      throw new Error('Category slug already exists in workspace')
    }

    // Si se especifica parentId, verificar que existe y pertenece al workspace
    if (data.parentId) {
      const parent = await prisma.category.findFirst({
        where: {
          id: data.parentId,
          workspaceId: data.workspaceId
        },
        select: { id: true }
      })

      if (!parent) {
        throw new Error('Parent category not found in workspace')
      }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        workspaceId: data.workspaceId,
        parentId: data.parentId,
        icon: data.icon,
        color: data.color
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        _count: {
          select: {
            prompts: true,
            children: true
          }
        }
      }
    })

    return category
  } catch (error) {
    console.error('Error creating category:', error)
    
    if (error instanceof Error && (
      error.message.includes('Access denied') ||
      error.message.includes('already exists') ||
      error.message.includes('not found')
    )) {
      throw error
    }
    
    throw new Error('Failed to create category')
  }
}

/**
 * Obtiene una categoría por ID con verificación de acceso
 * @param id - ID de la categoría
 * @param userId - ID del usuario
 * @returns Categoría si tiene acceso
 */
export async function getCategoryById(id: string, userId: string) {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid category or user ID')
  }

  try {
    const category = await prisma.category.findFirst({
      where: {
        id,
        workspace: {
          isActive: true,
          OR: [
            { ownerId: userId },
            {
              members: {
                some: { userId }
              }
            }
          ]
        }
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        parent: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        children: {
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
          }
        },
        _count: {
          select: {
            prompts: true,
            children: true
          }
        }
      }
    })

    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('Failed to fetch category')
  }
}

/**
 * Verifica si un slug de categoría está disponible en un workspace
 * @param slug - Slug a verificar
 * @param workspaceId - ID del workspace
 * @param excludeId - ID de categoría a excluir (para edición)
 * @returns true si está disponible
 */
export async function isCategorySlugAvailable(
  slug: string,
  workspaceId: string,
  excludeId?: string
): Promise<boolean> {
  if (!slug || !workspaceId || typeof slug !== 'string' || typeof workspaceId !== 'string') {
    return false
  }

  try {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        workspaceId,
        ...(excludeId && { id: { not: excludeId } })
      },
      select: { id: true }
    })

    return !existing
  } catch (error) {
    console.error('Error checking category slug availability:', error)
    return false
  }
} 