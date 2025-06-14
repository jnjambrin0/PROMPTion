import prisma from '../prisma'
import crypto from 'crypto'
import { MemberRole, InvitationStatus } from '../types/members'

// ============================================================================
// WORKSPACE MEMBERS MANAGEMENT
// ============================================================================

/**
 * Obtiene todos los miembros de un workspace con verificación de acceso
 */
export async function getWorkspaceMembers(workspaceId: string, requestingUserId: string) {
  if (!workspaceId || !requestingUserId) {
    throw new Error('Invalid workspace or user ID')
  }

  try {
    // Verificar acceso al workspace
    const hasAccess = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        isActive: true,
        OR: [
          { ownerId: requestingUserId },
          {
            members: {
              some: { userId: requestingUserId }
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
        avatarUrl: true,
        lastActiveAt: true
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
            avatarUrl: true,
            lastActiveAt: true
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
        lastActiveAt: owner.lastActiveAt,
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

/**
 * Obtiene un miembro específico del workspace
 */
export async function getWorkspaceMember(
  workspaceId: string, 
  memberId: string, 
  requestingUserId: string
) {
  if (!workspaceId || !memberId || !requestingUserId) {
    throw new Error('Invalid parameters')
  }

  try {
    // Verificar acceso al workspace
    const hasAccess = await hasWorkspaceAccess(workspaceId, requestingUserId)
    if (!hasAccess) {
      throw new Error('Access denied to workspace')
    }

    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            lastActiveAt: true
          }
        }
      }
    })

    return member
  } catch (error) {
    console.error('Error fetching workspace member:', error)
    throw new Error('Failed to fetch workspace member')
  }
}

/**
 * Obtiene el rol del usuario en el workspace
 */
export async function getUserRole(workspaceId: string, userId: string): Promise<MemberRole | null> {
  if (!workspaceId || !userId) {
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

    return member?.role as MemberRole || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Verifica acceso al workspace
 */
export async function hasWorkspaceAccess(workspaceId: string, userId: string): Promise<boolean> {
  if (!workspaceId || !userId) {
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

// ============================================================================
// WORKSPACE INVITATIONS
// ============================================================================

/**
 * Crea una nueva invitación al workspace
 */
export async function createWorkspaceInvitation(
  workspaceId: string,
  email: string,
  role: MemberRole,
  invitedById: string,
  message?: string,
  permissions: string[] = []
) {
  if (!workspaceId || !email || !role || !invitedById) {
    throw new Error('Missing required parameters')
  }

  try {
    // Verificar que el usuario no ya es miembro
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        user: { email }
      }
    })

    if (existingMember) {
      throw new Error('User is already a member of this workspace')
    }

    // Verificar que no hay invitación pendiente
    const existingInvitation = await prisma.workspaceInvitation.findFirst({
      where: {
        workspaceId,
        email,
        status: 'PENDING'
      }
    })

    if (existingInvitation) {
      throw new Error('User already has a pending invitation')
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expira en 7 días

    const invitation = await prisma.workspaceInvitation.create({
      data: {
        email,
        role,
        permissions: permissions as any,
        message,
        token,
        expiresAt,
        workspaceId,
        invitedById
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        invitedBy: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true
          }
        }
      }
    })

    return invitation
  } catch (error) {
    console.error('Error creating workspace invitation:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to create workspace invitation')
  }
}

/**
 * Acepta una invitación al workspace
 */
export async function acceptWorkspaceInvitation(token: string, userId: string) {
  if (!token || !userId) {
    throw new Error('Invalid token or user ID')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Encontrar invitación válida
      const invitation = await tx.workspaceInvitation.findFirst({
        where: {
          token,
          status: 'PENDING',
          expiresAt: { gt: new Date() }
        },
        include: {
          workspace: true
        }
      })

      if (!invitation) {
        throw new Error('Invalid or expired invitation')
      }

      // Verificar que el usuario no ya es miembro
      const existingMember = await tx.workspaceMember.findFirst({
        where: {
          workspaceId: invitation.workspaceId,
          userId
        }
      })

      if (existingMember) {
        throw new Error('User is already a member of this workspace')
      }

      // Crear membresía
      const member = await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
          permissions: invitation.permissions
        }
      })

      // Marcar invitación como aceptada
      await tx.workspaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          acceptedById: userId
        }
      })

      // Registrar actividad
      await tx.activity.create({
        data: {
          type: 'MEMBER_INVITED',
          description: `Accepted invitation to join workspace`,
          userId,
          metadata: {
            workspaceId: invitation.workspaceId,
            role: invitation.role
          }
        }
      })

      return { member, workspace: invitation.workspace }
    })
  } catch (error) {
    console.error('Error accepting workspace invitation:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to accept workspace invitation')
  }
}

/**
 * Rechaza una invitación al workspace
 */
export async function rejectWorkspaceInvitation(token: string) {
  if (!token) {
    throw new Error('Invalid token')
  }

  try {
    const invitation = await prisma.workspaceInvitation.findFirst({
      where: {
        token,
        status: 'PENDING'
      }
    })

    if (!invitation) {
      throw new Error('Invalid invitation')
    }

    await prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date()
      }
    })

    return invitation
  } catch (error) {
    console.error('Error rejecting workspace invitation:', error)
    throw new Error('Failed to reject workspace invitation')
  }
}

/**
 * Cancela una invitación pendiente
 */
export async function cancelWorkspaceInvitation(
  invitationId: string,
  requestingUserId: string
) {
  if (!invitationId || !requestingUserId) {
    throw new Error('Invalid parameters')
  }

  try {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
      include: { workspace: true }
    })

    if (!invitation) {
      throw new Error('Invitation not found')
    }

    // Verificar permisos
    const userRole = await getUserRole(invitation.workspaceId, requestingUserId)
    if (!userRole || !['OWNER', 'ADMIN'].includes(userRole)) {
      throw new Error('Insufficient permissions')
    }

    await prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: {
        status: 'CANCELLED'
      }
    })

    return invitation
  } catch (error) {
    console.error('Error cancelling workspace invitation:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to cancel workspace invitation')
  }
}

// ============================================================================
// MEMBER OPERATIONS
// ============================================================================

/**
 * Actualiza el rol de un miembro
 */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: MemberRole,
  requestingUserId: string
) {
  if (!workspaceId || !memberId || !newRole || !requestingUserId) {
    throw new Error('Invalid parameters')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Verificar permisos del solicitante
      const requestingUserRole = await getUserRole(workspaceId, requestingUserId)
      if (!requestingUserRole || !['OWNER', 'ADMIN'].includes(requestingUserRole)) {
        throw new Error('Insufficient permissions')
      }

      // Obtener miembro actual
      const member = await tx.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true
            }
          }
        }
      })

      if (!member) {
        throw new Error('Member not found')
      }

      // Verificar que no se intente cambiar el rol del owner
      if (member.role === 'OWNER') {
        throw new Error('Cannot change owner role')
      }

      // ADMIN no puede promover a OWNER
      if (requestingUserRole === 'ADMIN' && newRole === 'OWNER') {
        throw new Error('Admins cannot promote users to owner')
      }

      // Actualizar rol
      const updatedMember = await tx.workspaceMember.update({
        where: { id: memberId },
        data: { role: newRole },
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
        }
      })

      // Registrar actividad
      await tx.activity.create({
        data: {
          type: 'PROMPT_UPDATED',
          description: `Changed ${member.user.fullName || member.user.username}'s role from ${member.role} to ${newRole}`,
          userId: requestingUserId,
          metadata: {
            workspaceId,
            memberId,
            oldRole: member.role,
            newRole,
            targetUserEmail: member.user.email
          } as any
        }
      })

      return updatedMember
    })
  } catch (error) {
    console.error('Error updating member role:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to update member role')
  }
}

/**
 * Remueve un miembro del workspace
 */
export async function removeMemberFromWorkspace(
  workspaceId: string,
  memberId: string,
  requestingUserId: string,
  reason?: string
) {
  if (!workspaceId || !memberId || !requestingUserId) {
    throw new Error('Invalid parameters')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Verificar permisos del solicitante
      const requestingUserRole = await getUserRole(workspaceId, requestingUserId)
      if (!requestingUserRole || !['OWNER', 'ADMIN'].includes(requestingUserRole)) {
        throw new Error('Insufficient permissions')
      }

      // Obtener miembro actual
      const member = await tx.workspaceMember.findFirst({
        where: {
          id: memberId,
          workspaceId
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              email: true
            }
          }
        }
      })

      if (!member) {
        throw new Error('Member not found')
      }

      // Verificar que no se intente remover el owner
      if (member.role === 'OWNER') {
        throw new Error('Cannot remove workspace owner')
      }

      // ADMIN no puede remover otros ADMIN
      if (requestingUserRole === 'ADMIN' && member.role === 'ADMIN') {
        throw new Error('Admins cannot remove other admins')
      }

      // Remover miembro
      await tx.workspaceMember.delete({
        where: { id: memberId }
      })

      // Registrar actividad
      await tx.activity.create({
        data: {
          type: 'MEMBER_REMOVED',
          description: `Removed ${member.user.fullName || member.user.username} from workspace`,
          userId: requestingUserId,
          metadata: {
            workspaceId,
            removedUserEmail: member.user.email,
            removedUserRole: member.role,
            reason
          } as any
        }
      })

      return { success: true, removedMember: member }
    })
  } catch (error) {
    console.error('Error removing member from workspace:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to remove member from workspace')
  }
}

/**
 * Obtiene la actividad de un miembro específico
 */
export async function getMemberActivity(
  workspaceId: string,
  memberId: string,
  requestingUserId: string,
  options: {
    page?: number
    limit?: number
  } = {}
) {
  const { page = 1, limit = 20 } = options

  if (!workspaceId || !memberId || !requestingUserId) {
    throw new Error('Invalid parameters')
  }

  try {
    // Verificar acceso al workspace
    const hasAccess = await hasWorkspaceAccess(workspaceId, requestingUserId)
    if (!hasAccess) {
      throw new Error('Access denied to workspace')
    }

    // Obtener información del miembro
    const member = await prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        }
      }
    })

    if (!member) {
      throw new Error('Member not found')
    }

    // Obtener actividades
    const activities = await prisma.activity.findMany({
      where: {
        userId: member.userId,
        OR: [
          { metadata: { path: ['workspaceId'], equals: workspaceId } },
          { prompt: { workspaceId } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true
          }
        },
        prompt: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    // Contar total
    const total = await prisma.activity.count({
      where: {
        userId: member.userId,
        OR: [
          { metadata: { path: ['workspaceId'], equals: workspaceId } },
          { prompt: { workspaceId } }
        ]
      }
    })

    return {
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching member activity:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Failed to fetch member activity')
  }
} 