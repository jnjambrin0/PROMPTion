import prisma from '../prisma'

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
    isDefault?: boolean
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

    // Si se está marcando como default, remover el default de otras categorías
    if (data.isDefault) {
      await prisma.category.updateMany({
        where: {
          workspaceId: data.workspaceId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        workspaceId: data.workspaceId,
        parentId: data.parentId,
        icon: data.icon,
        color: data.color,
        isDefault: data.isDefault || false
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

/**
 * Obtiene categorías de un workspace por slug
 * @param workspaceSlug - Slug del workspace
 * @returns Lista de categorías del workspace
 */
export async function getCategoriesByWorkspace(workspaceSlug: string) {
  if (!workspaceSlug || typeof workspaceSlug !== 'string') {
    throw new Error('Invalid workspace slug')
  }

  try {
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        isActive: true
      },
      select: { id: true }
    })

    if (!workspace) {
      return null
    }

    const categories = await prisma.category.findMany({
      where: { workspaceId: workspace.id },
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
    throw new Error('Failed to fetch categories')
  }
}

/**
 * Actualiza una categoría
 * @param id - ID de la categoría
 * @param data - Datos a actualizar
 * @returns Categoría actualizada
 */
export async function updateCategory(
  id: string,
  data: {
    name?: string
    description?: string
    icon?: string
    color?: string
    parentId?: string
    isDefault?: boolean
  }
) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid category ID')
  }

  try {
    // Si se está marcando como default, obtener el workspaceId primero
    let workspaceId = null
    if (data.isDefault) {
      const currentCategory = await prisma.category.findUnique({
        where: { id },
        select: { workspaceId: true }
      })
      
      if (currentCategory) {
        workspaceId = currentCategory.workspaceId
        
        // Remover el default de otras categorías en el mismo workspace
        await prisma.category.updateMany({
          where: {
            workspaceId: workspaceId,
            isDefault: true,
            id: { not: id }
          },
          data: {
            isDefault: false
          }
        })
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.icon && { icon: data.icon }),
        ...(data.color && { color: data.color }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault })
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
    console.error('Error updating category:', error)
    throw new Error('Failed to update category')
  }
}

/**
 * Elimina una categoría y mueve sus prompts a "Sin categoría"
 * @param id - ID de la categoría
 * @returns true si se eliminó correctamente
 */
export async function deleteCategory(id: string) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid category ID')
  }

  try {
    // Verificar que la categoría existe y no es default
    const category = await prisma.category.findFirst({
      where: { id },
      select: { id: true, workspaceId: true, isDefault: true }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (category.isDefault) {
      throw new Error('Cannot delete default category')
    }

    // Usar transacción para mover prompts y eliminar categoría
    await prisma.$transaction(async (tx) => {
      // Mover todos los prompts de esta categoría a null (sin categoría)
      await tx.prompt.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
      })

      // Eliminar la categoría
      await tx.category.delete({
        where: { id }
      })
    })

    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    if (error instanceof Error && error.message.includes('Cannot delete default')) {
      throw error
    }
    throw new Error('Failed to delete category')
  }
} 