import prisma from '../prisma'
import type { MemberRole } from '../generated/prisma'

/**
 * Obtiene un workspace por ID con verificación de acceso
 * @param id - ID del workspace
 * @param userId - ID del usuario solicitante
 * @returns Workspace si tiene acceso
 */
export async function getWorkspaceById(id: string, userId: string) {
  if (!id || !userId || typeof id !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid workspace or user ID')
  }

  try {
    // Verificar que el usuario tiene acceso al workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            prompts: true,
            members: true
          }
        }
      }
    })

    return workspace
  } catch (error) {
    console.error('Error fetching workspace:', error)
    throw new Error('Failed to fetch workspace')
  }
}

/**
 * Obtiene un workspace por slug con verificación de acceso
 * @param slug - Slug del workspace
 * @param userId - ID del usuario solicitante
 * @returns Workspace si tiene acceso
 */
export async function getWorkspaceBySlug(slug: string, userId: string) {
  if (!slug || !userId || typeof slug !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid workspace slug or user ID')
  }

  try {
    // Verificar que el usuario tiene acceso al workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            prompts: true,
            members: true,
            categories: true
          }
        }
      }
    })

    return workspace
  } catch (error) {
    console.error('Error fetching workspace by slug:', error)
    throw new Error('Failed to fetch workspace')
  }
}

/**
 * Obtiene workspaces del usuario
 * @param userId - ID del usuario
 * @returns Lista de workspaces accesibles
 */
export async function getUserWorkspaces(userId: string) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID')
  }

  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        plan: true,
        createdAt: true,
        ownerId: true,
        _count: {
          select: {
            prompts: true,
            members: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return workspaces
  } catch (error) {
    console.error('Error fetching user workspaces:', error)
    throw new Error('Failed to fetch workspaces')
  }
}

/**
 * Verifica si un usuario tiene acceso a un workspace
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario
 * @returns true si tiene acceso
 */
export async function hasWorkspaceAccess(workspaceId: string, userId: string): Promise<boolean> {
  if (!workspaceId || !userId || typeof workspaceId !== 'string' || typeof userId !== 'string') {
    return false
  }

  try {
    const access = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },
      select: { id: true }
    })

    return !!access
  } catch (error) {
    console.error('Error checking workspace access:', error)
    return false
  }
}

/**
 * Obtiene el rol del usuario en un workspace
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario
 * @returns Rol del usuario o null
 */
export async function getUserRole(workspaceId: string, userId: string): Promise<MemberRole | null> {
  if (!workspaceId || !userId || typeof workspaceId !== 'string' || typeof userId !== 'string') {
    return null
  }

  try {
    // Verificar si es owner
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
        isActive: true
      },
      select: { id: true }
    })

    if (workspace) {
      return 'OWNER'
    }

    // Verificar rol como miembro
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      },
      select: {
        role: true
      }
    })

    return member?.role || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Crea un nuevo workspace (solo para usuarios autenticados)
 * @param data - Datos del workspace
 * @param ownerId - ID del propietario
 * @returns Workspace creado
 */
export async function createWorkspace(
  data: {
    name: string
    slug: string
    description?: string
  },
  ownerId: string
) {
  if (!ownerId || typeof ownerId !== 'string') {
    throw new Error('Invalid owner ID')
  }

  // Validaciones básicas
  if (!data.name || data.name.length < 3 || data.name.length > 50) {
    throw new Error('Workspace name must be between 3 and 50 characters')
  }

  if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug) || data.slug.length < 3) {
    throw new Error('Invalid workspace slug')
  }

  try {
    // Verificar que el slug no existe
    const existing = await prisma.workspace.findUnique({
      where: { slug: data.slug },
      select: { id: true }
    })

    if (existing) {
      throw new Error('Workspace slug already exists')
    }

    // Crear workspace en transacción
    const workspace = await prisma.$transaction(async (tx) => {
      const newWorkspace = await tx.workspace.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          ownerId
        }
      })

      // Agregar al owner como miembro
      await tx.workspaceMember.create({
        data: {
          userId: ownerId,
          workspaceId: newWorkspace.id,
          role: 'OWNER'
        }
      })

      return newWorkspace
    })

    return workspace
  } catch (error) {
    console.error('Error creating workspace:', error)
    
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error
    }
    
    throw new Error('Failed to create workspace')
  }
}

/**
 * Obtiene miembros de un workspace con verificación de acceso
 * @param workspaceId - ID del workspace
 * @param userId - ID del usuario solicitante
 * @returns Lista de miembros del workspace
 */
export async function getWorkspaceMembers(workspaceId: string, userId: string) {
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
      select: { id: true, ownerId: true }
    })

    if (!hasAccess) {
      throw new Error('Access denied to workspace')
    }

    // Obtener owner por separado
    const owner = await prisma.user.findUnique({
      where: { id: hasAccess.ownerId },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        avatarUrl: true
      }
    })

    // Obtener miembros (excluyendo al owner)
    const members = await prisma.workspaceMember.findMany({
      where: { 
        workspaceId,
        userId: { not: hasAccess.ownerId }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'desc' }
      ]
    })

    // Combinar owner y miembros
    const allMembers = [
      ...(owner ? [{
        id: `owner-${owner.id}`,
        role: 'OWNER' as const,
        permissions: [],
        joinedAt: null, // Owner created the workspace
        lastActiveAt: null,
        user: owner,
        userId: owner.id,
        workspaceId
      }] : []),
      ...members
    ]

    return allMembers
  } catch (error) {
    console.error('Error fetching workspace members:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      throw error
    }
    
    throw new Error('Failed to fetch workspace members')
  }
} 