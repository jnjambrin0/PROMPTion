import prisma from '../prisma'
import type { Prisma } from '../generated/prisma'

// Re-export types from separate file to maintain compatibility
export type {
  Template,
  TemplateFilters,
  TemplateStats,
  TemplateCategory
} from '../types/templates'

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug: string, workspaceId: string): Promise<string> {
  if (!baseSlug) {
    baseSlug = 'template'
  }
  
  let slug = baseSlug
  let counter = 1

  while (await prisma.prompt.findFirst({ 
    where: { 
      slug, 
      workspaceId 
    } 
  })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Crear un nuevo template
 */
export async function createTemplate(
  data: {
    title: string
    slug?: string
    description?: string
    workspaceId: string
    categoryId?: string
    isPublic?: boolean
    icon?: string
    templateType?: 'prompt' | 'workflow' | 'agent'
    isTemplate?: boolean
  },
  userId: string
) {
  if (!data.title || !data.workspaceId || !userId) {
    throw new Error('Title, workspace ID, and user ID are required')
  }

  try {
    // Verificar que el workspace existe y el usuario tiene acceso
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: data.workspaceId,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: {
                userId,
                role: { in: ['ADMIN', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!workspace) {
      throw new Error('Access denied to workspace')
    }

    // Verificar categoría si se proporciona
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          workspaceId: data.workspaceId
        }
      })

      if (!category) {
        throw new Error('Category not found in workspace')
      }
    }

    // Generar slug único
    const baseSlug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)

    const uniqueSlug = await generateUniqueSlug(baseSlug, data.workspaceId)

    // Crear template en transacción
    const template = await prisma.$transaction(async (tx) => {
      const newTemplate = await tx.prompt.create({
        data: {
          title: data.title,
          slug: uniqueSlug,
          description: data.description || null,
          workspaceId: data.workspaceId,
          userId,
          categoryId: data.categoryId || null,
          isTemplate: data.isTemplate ?? true,
          isPublic: data.isPublic ?? true,
          icon: data.icon || null,
          modelConfig: {},
          variables: []
        }
      })

      // Crear versión inicial
      await tx.promptVersion.create({
        data: {
          promptId: newTemplate.id,
          userId,
          version: 1,
          title: data.title,
          content: { blocks: [] },
          modelConfig: {},
          variables: []
        }
      })

      return newTemplate
    })

    return template
  } catch (error) {
    console.error('Error creating template:', error)
    
    if (error instanceof Error && (
      error.message.includes('Access denied') ||
      error.message.includes('not found') ||
      error.message.includes('already exists')
    )) {
      throw error
    }
    
    throw new Error('Failed to create template')
  }
}

// ==================== FUNCIONES DE CONSULTA ====================

/**
 * Obtiene templates públicos con filtros - OPTIMIZADO
 */
export async function getPublicTemplates(filters: import('../types/templates').TemplateFilters = {}) {
  const {
    categoryId,
    search,
    sort = 'popular',
    page = 1,
    limit = 12
  } = filters

  const skip = (page - 1) * limit

  // Construir condiciones WHERE optimizadas
  const where: any = {
    isTemplate: true,
    isPublic: true
  }

  // Filtros condicionales (más eficiente que AND con objetos vacíos)
  if (categoryId) {
    where.categoryId = categoryId
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  // Definir ordenamiento optimizado
  const orderBy: any = 
    sort === 'recent' ? { createdAt: 'desc' }
    : sort === 'favorites' ? { favorites: { _count: 'desc' } }
    : sort === 'alphabetical' ? { title: 'asc' }
    : { useCount: 'desc' } // popular por defecto

  try {
    const [templates, totalCount] = await Promise.all([
      prisma.prompt.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          // Campos esenciales solamente para reducir transferencia de datos
          id: true,
          title: true,
          description: true,
          slug: true,
          useCount: true,
          averageScore: true,
          createdAt: true,
          updatedAt: true,
          // Usuario - solo campos necesarios
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true
            }
          },
          // Workspace - solo campos necesarios
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          // Categoría - solo campos necesarios
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true
            }
          },
          // Tags - reducidos
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            take: 5 // Limitar tags mostrados
          },
          // Blocks - solo para preview
          blocks: {
            select: {
              id: true,
              type: true,
              content: true,
              position: true
            },
            orderBy: {
              position: 'asc'
            },
            take: 3 // Solo primeros 3 bloques para preview
          },
          // Contadores optimizados
          _count: {
            select: {
              comments: true,
              favorites: true,
              forks: true
            }
          }
        }
      }),
      // Query de conteo más simple
      prisma.prompt.count({ where })
    ])

    const hasMore = skip + templates.length < totalCount

    return {
      templates: templates as import('../types/templates').Template[],
      totalCount,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching public templates:', error)
    throw new Error('Failed to fetch templates')
  }
}

/**
 * Obtiene templates destacados - OPTIMIZADO (menos campos, query más simple)
 */
export async function getFeaturedTemplates(): Promise<import('../types/templates').Template[]> {
  try {
    const templates = await prisma.prompt.findMany({
      where: {
        isTemplate: true,
        isPublic: true,
        useCount: {
          gte: 50
        }
      },
      orderBy: {
        useCount: 'desc'
      },
      take: 6,
      select: {
        // Campos mínimos para templates destacados
        id: true,
        title: true,
        description: true,
        slug: true,
        useCount: true,
        averageScore: true,
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
            icon: true
          }
        },
        _count: {
          select: {
            favorites: true
          }
        }
      }
    })

    return templates as import('../types/templates').Template[]
  } catch (error) {
    console.error('Error fetching featured templates:', error)
    return []
  }
}

/**
 * Obtiene categorías con conteo de templates
 */
export async function getTemplateCategories(): Promise<import('../types/templates').TemplateCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        prompts: {
          some: {
            isTemplate: true,
            isPublic: true
          }
        }
      },
      include: {
        _count: {
          select: {
            prompts: {
              where: {
                isTemplate: true,
                isPublic: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories as import('../types/templates').TemplateCategory[]
  } catch (error) {
    console.error('Error fetching template categories:', error)
    return []
  }
}

/**
 * Obtiene estadísticas generales - OPTIMIZADO con queries más simples
 */
export async function getTemplateStats(): Promise<import('../types/templates').TemplateStats> {
  try {
    // Usar aggregaciones más eficientes en una sola query cuando sea posible
    const baseWhere = {
      isTemplate: true,
      isPublic: true
    }

    const [statsAggregation, uniqueAuthors, featuredCount] = await Promise.all([
      // Agregar múltiples métricas en una query
      prisma.prompt.aggregate({
        where: baseWhere,
        _count: true,
        _sum: {
          useCount: true
        }
      }),
      // Query optimizada para autores únicos
      prisma.prompt.groupBy({
        by: ['userId'],
        where: baseWhere
      }).then(results => results.length),
      // Query simple para templates destacados
      prisma.prompt.count({
        where: {
          ...baseWhere,
          useCount: {
            gte: 50
          }
        }
      })
    ])

    return {
      totalTemplates: statsAggregation._count,
      totalAuthors: uniqueAuthors,
      totalUsage: statsAggregation._sum.useCount || 0,
      featuredCount
    }
  } catch (error) {
    console.error('Error fetching template stats:', error)
    return {
      totalTemplates: 0,
      totalAuthors: 0,
      totalUsage: 0,
      featuredCount: 0
    }
  }
}

/**
 * Usar un template (crear copia como prompt)
 */
export async function useTemplate(templateId: string, userId: string) {
  if (!templateId || !userId) {
    throw new Error('Template ID and User ID are required')
  }

  try {
    // Verificar que el template existe y es público
    const template = await prisma.prompt.findFirst({
      where: {
        id: templateId,
        isTemplate: true,
        isPublic: true
      },
      include: {
        blocks: {
          orderBy: {
            position: 'asc'
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        workspace: true
      }
    })

    if (!template) {
      throw new Error('Template not found or not accessible')
    }

    // Obtener el workspace por defecto del usuario
    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        ownerId: userId
      }
    })

    if (!userWorkspace) {
      throw new Error('User workspace not found')
    }

    // Crear slug único para el nuevo prompt
    const baseSlug = template.slug.replace('-template', '') || 'prompt'
    let slug = baseSlug
    let counter = 1

    while (await prisma.prompt.findFirst({ 
      where: { 
        slug, 
        workspaceId: userWorkspace.id 
      } 
    })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear el nuevo prompt usando transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el prompt
      const newPrompt = await tx.prompt.create({
        data: {
          title: template.title.replace(' Template', '') || 'New Prompt',
          slug,
          description: template.description,
          icon: template.icon,
          isTemplate: false,
          isPublic: false,
          isPinned: false,
          aiModel: template.aiModel,
          modelConfig: template.modelConfig as Prisma.InputJsonValue,  
          variables: template.variables as Prisma.InputJsonValue,
          categoryId: template.categoryId,
          userId,
          workspaceId: userWorkspace.id
        }
      })

      // Copiar los bloques
      if (template.blocks.length > 0) {
        await tx.block.createMany({
          data: template.blocks.map(block => ({
            type: block.type,
            content: block.content as Prisma.InputJsonValue,
            position: block.position,
            indentLevel: block.indentLevel,
            promptId: newPrompt.id,
            userId
          }))
        })
      }

      // Copiar los tags
      if (template.tags.length > 0) {
        await tx.promptTag.createMany({
          data: template.tags.map(({ tagId }) => ({
            promptId: newPrompt.id,
            tagId
          }))
        })
      }

      // Incrementar contador de uso del template
      await tx.prompt.update({
        where: { id: templateId },
        data: {
          useCount: {
            increment: 1
          }
        }
      })

      return newPrompt
    })

    return {
      success: true,
      promptId: result.id
    }
  } catch (error) {
    console.error('Error using template:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to use template'
    }
  }
}

/**
 * Obtiene un template por ID
 */
export async function getTemplateById(id: string): Promise<import('../types/templates').Template | null> {
  if (!id) return null

  try {
    const template = await prisma.prompt.findFirst({
      where: {
        id,
        isTemplate: true,
        isPublic: true
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
          select: {
            id: true,
            type: true,
            content: true,
            position: true,
            indentLevel: true,
            createdAt: true
          },
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

    return template as import('../types/templates').Template | null
  } catch (error) {
    console.error('Error fetching template by ID:', error)
    throw new Error('Failed to fetch template')
  }
} 