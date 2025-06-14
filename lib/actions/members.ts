'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db'
import {
  createWorkspaceInvitation,
  updateMemberRole,
  removeMemberFromWorkspace,
  getMemberActivity,
  getUserRole,
  hasWorkspaceAccess
} from '@/lib/db/members'
import { hasPermission, canPerformAction, isValidRoleTransition } from '@/lib/types/members'
import type {
  InviteMemberData,
  InviteMemberResult,
  UpdateMemberData,
  UpdateMemberResult,
  RemoveMemberData,
  RemoveMemberResult,
  MemberActivityResult,
  MemberRole
} from '@/lib/types/members'

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    throw new Error('Authentication required')
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

// ============================================================================
// MEMBER INVITATION ACTIONS
// ============================================================================

/**
 * Invita un nuevo miembro al workspace
 */
export async function inviteMemberAction(
  workspaceSlug: string,
  data: InviteMemberData
): Promise<InviteMemberResult> {
  try {
    // Validación de entrada
    if (!data.email?.trim() || !data.role) {
      return { success: false, error: 'Email and role are required' }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      return { success: false, error: 'Invalid email format' }
    }

    // Validar rol
    const validRoles: MemberRole[] = ['ADMIN', 'EDITOR', 'MEMBER', 'VIEWER']
    if (!validRoles.includes(data.role)) {
      return { success: false, error: 'Invalid role' }
    }

    // Autenticación
    const user = await getAuthenticatedUser()

    // Obtener workspace ID desde slug (simplificado para el ejemplo)
    // En producción, necesitarías una función para obtener workspace por slug
    const workspaceId = workspaceSlug // Temporal, necesita implementación real

    // Verificar permisos del usuario actual
    const userRole = await getUserRole(workspaceId, user.id)
    if (!userRole) {
      return { success: false, error: 'Access denied to workspace' }
    }

    // Verificar permisos de invitación
    if (!hasPermission(userRole, 'canInviteMembers')) {
      return { success: false, error: 'Insufficient permissions to invite members' }
    }

    // Crear invitación
    const invitation = await createWorkspaceInvitation(
      workspaceId,
      data.email.trim().toLowerCase(),
      data.role,
      user.id,
      data.message?.trim(),
      data.permissions || []
    )

    // TODO: Enviar email de invitación
    // await sendInvitationEmail(invitation)

    // Revalidar cache
    revalidatePath(`/${workspaceSlug}`)
    revalidatePath(`/${workspaceSlug}/members`)

    return {
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role as MemberRole,
        permissions: invitation.permissions as string[],
        message: invitation.message,
        token: invitation.token,
        status: invitation.status as any,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
        expiresAt: invitation.expiresAt,
        acceptedAt: invitation.acceptedAt,
        rejectedAt: invitation.rejectedAt,
        workspace: invitation.workspace,
        invitedBy: invitation.invitedBy
      }
    }
  } catch (error) {
    console.error('Error inviting member:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to invite member' }
  }
}

// ============================================================================
// MEMBER MANAGEMENT ACTIONS
// ============================================================================

/**
 * Actualiza el rol de un miembro
 */
export async function updateMemberRoleAction(
  workspaceSlug: string,
  data: UpdateMemberData
): Promise<UpdateMemberResult> {
  try {
    // Validación de entrada
    if (!data.memberId || !data.role) {
      return { success: false, error: 'Member ID and role are required' }
    }

    // Autenticación
    const user = await getAuthenticatedUser()

    // Obtener workspace ID desde slug
    const workspaceId = workspaceSlug // Temporal

    // Verificar permisos del usuario actual
    const userRole = await getUserRole(workspaceId, user.id)
    if (!userRole) {
      return { success: false, error: 'Access denied to workspace' }
    }

    // Verificar permisos para cambiar roles
    if (!hasPermission(userRole, 'canChangeRoles')) {
      return { success: false, error: 'Insufficient permissions to change member roles' }
    }

    // Verificar transición de rol válida
    // Necesitamos obtener el rol actual del miembro para validar
    // Por simplicidad, asumimos que la validación se hace en la función DB

    // Actualizar rol
    const updatedMember = await updateMemberRole(
      workspaceId,
      data.memberId,
      data.role,
      user.id
    )

    // Revalidar cache
    revalidatePath(`/${workspaceSlug}`)
    revalidatePath(`/${workspaceSlug}/members`)

    return {
      success: true,
      member: {
        id: updatedMember.id,
        role: updatedMember.role as MemberRole,
        permissions: updatedMember.permissions as string[],
        joinedAt: updatedMember.joinedAt,
        lastActiveAt: updatedMember.lastActiveAt,
        user: updatedMember.user
      }
    }
  } catch (error) {
    console.error('Error updating member role:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to update member role' }
  }
}

/**
 * Remueve un miembro del workspace
 */
export async function removeMemberAction(
  workspaceSlug: string,
  data: RemoveMemberData
): Promise<RemoveMemberResult> {
  try {
    // Validación de entrada
    if (!data.memberId) {
      return { success: false, error: 'Member ID is required' }
    }

    // Autenticación
    const user = await getAuthenticatedUser()

    // Obtener workspace ID desde slug
    const workspaceId = workspaceSlug // Temporal

    // Verificar permisos del usuario actual
    const userRole = await getUserRole(workspaceId, user.id)
    if (!userRole) {
      return { success: false, error: 'Access denied to workspace' }
    }

    // Verificar permisos para remover miembros
    if (!hasPermission(userRole, 'canRemoveMembers')) {
      return { success: false, error: 'Insufficient permissions to remove members' }
    }

    // Remover miembro
    await removeMemberFromWorkspace(
      workspaceId,
      data.memberId,
      user.id,
      data.reason
    )

    // Revalidar cache
    revalidatePath(`/${workspaceSlug}`)
    revalidatePath(`/${workspaceSlug}/members`)

    return { success: true }
  } catch (error) {
    console.error('Error removing member:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to remove member' }
  }
}

// ============================================================================
// MEMBER ACTIVITY ACTIONS
// ============================================================================

/**
 * Obtiene la actividad de un miembro
 */
export async function getMemberActivityAction(
  workspaceSlug: string,
  memberId: string,
  page: number = 1,
  limit: number = 20
): Promise<MemberActivityResult> {
  try {
    // Validación de entrada
    if (!memberId) {
      return { success: false, error: 'Member ID is required' }
    }

    if (page < 1 || limit < 1 || limit > 100) {
      return { success: false, error: 'Invalid pagination parameters' }
    }

    // Autenticación
    const user = await getAuthenticatedUser()

    // Obtener workspace ID desde slug
    const workspaceId = workspaceSlug // Temporal

    // Verificar acceso al workspace
    const hasAccess = await hasWorkspaceAccess(workspaceId, user.id)
    if (!hasAccess) {
      return { success: false, error: 'Access denied to workspace' }
    }

    // Obtener actividad del miembro
    const result = await getMemberActivity(
      workspaceId,
      memberId,
      user.id,
      { page, limit }
    )

    return {
      success: true,
      activities: result.activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        metadata: activity.metadata as Record<string, any>,
        createdAt: activity.createdAt,
        user: activity.user
      })),
      pagination: result.pagination
    }
  } catch (error) {
    console.error('Error fetching member activity:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to fetch member activity' }
  }
}

// ============================================================================
// UTILITY ACTIONS
// ============================================================================

/**
 * Verifica los permisos del usuario actual en el workspace
 */
export async function checkUserPermissionsAction(workspaceSlug: string) {
  try {
    const user = await getAuthenticatedUser()
    const workspaceId = workspaceSlug // Temporal

    const userRole = await getUserRole(workspaceId, user.id)
    if (!userRole) {
      return { success: false, error: 'Access denied to workspace' }
    }

    return {
      success: true,
      role: userRole,
      permissions: {
        canInviteMembers: hasPermission(userRole, 'canInviteMembers'),
        canRemoveMembers: hasPermission(userRole, 'canRemoveMembers'),
        canChangeRoles: hasPermission(userRole, 'canChangeRoles'),
        canManageWorkspace: hasPermission(userRole, 'canManageWorkspace'),
        canEditWorkspaceSettings: hasPermission(userRole, 'canEditWorkspaceSettings'),
        canViewAnalytics: hasPermission(userRole, 'canViewAnalytics')
      }
    }
  } catch (error) {
    console.error('Error checking user permissions:', error)
    return { success: false, error: 'Failed to check permissions' }
  }
} 