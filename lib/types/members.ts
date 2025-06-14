// ============================================================================
// MEMBER MANAGEMENT TYPES - Complete type system
// ============================================================================

export type MemberRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'MEMBER' | 'VIEWER'
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED'

// ============================================================================
// PERMISSION SYSTEM
// ============================================================================

export interface MemberPermissions {
  // Workspace permissions
  canManageWorkspace: boolean
  canEditWorkspaceSettings: boolean
  canDeleteWorkspace: boolean
  
  // Member permissions
  canInviteMembers: boolean
  canRemoveMembers: boolean
  canChangeRoles: boolean
  
  // Content permissions
  canCreatePrompts: boolean
  canEditAllPrompts: boolean
  canDeleteAllPrompts: boolean
  canCreateCategories: boolean
  canManageCategories: boolean
  
  // System permissions
  canManageIntegrations: boolean
  canViewAnalytics: boolean
  canExportData: boolean
}

export const ROLE_PERMISSIONS: Record<MemberRole, MemberPermissions> = {
  OWNER: {
    canManageWorkspace: true,
    canEditWorkspaceSettings: true,
    canDeleteWorkspace: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canCreatePrompts: true,
    canEditAllPrompts: true,
    canDeleteAllPrompts: true,
    canCreateCategories: true,
    canManageCategories: true,
    canManageIntegrations: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  ADMIN: {
    canManageWorkspace: false,
    canEditWorkspaceSettings: true,
    canDeleteWorkspace: false,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canCreatePrompts: true,
    canEditAllPrompts: true,
    canDeleteAllPrompts: true,
    canCreateCategories: true,
    canManageCategories: true,
    canManageIntegrations: true,
    canViewAnalytics: true,
    canExportData: true,
  },
  EDITOR: {
    canManageWorkspace: false,
    canEditWorkspaceSettings: false,
    canDeleteWorkspace: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canCreatePrompts: true,
    canEditAllPrompts: true,
    canDeleteAllPrompts: false,
    canCreateCategories: true,
    canManageCategories: false,
    canManageIntegrations: false,
    canViewAnalytics: false,
    canExportData: false,
  },
  MEMBER: {
    canManageWorkspace: false,
    canEditWorkspaceSettings: false,
    canDeleteWorkspace: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canCreatePrompts: true,
    canEditAllPrompts: false,
    canDeleteAllPrompts: false,
    canCreateCategories: false,
    canManageCategories: false,
    canManageIntegrations: false,
    canViewAnalytics: false,
    canExportData: false,
  },
  VIEWER: {
    canManageWorkspace: false,
    canEditWorkspaceSettings: false,
    canDeleteWorkspace: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canCreatePrompts: false,
    canEditAllPrompts: false,
    canDeleteAllPrompts: false,
    canCreateCategories: false,
    canManageCategories: false,
    canManageIntegrations: false,
    canViewAnalytics: false,
    canExportData: false,
  },
}

// ============================================================================
// DATA TYPES
// ============================================================================

export interface WorkspaceMember {
  id: string
  role: MemberRole
  permissions: string[] // Additional custom permissions
  joinedAt: Date | null
  lastActiveAt: Date | null
  user: {
    id: string
    username: string | null
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export interface WorkspaceInvitation {
  id: string
  email: string
  role: MemberRole
  permissions: string[]
  message: string | null
  token: string
  status: InvitationStatus
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  acceptedAt: Date | null
  rejectedAt: Date | null
  workspace: {
    id: string
    name: string
    slug: string
  }
  invitedBy: {
    id: string
    fullName: string | null
    username: string | null
    email: string
  }
}

export interface MemberActivity {
  id: string
  type: string
  description: string
  metadata: Record<string, any>
  createdAt: Date
  user: {
    id: string
    fullName: string | null
    username: string | null
  }
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export interface InviteMemberData {
  email: string
  role: MemberRole
  message?: string
  permissions?: string[]
}

export interface UpdateMemberData {
  memberId: string
  role?: MemberRole
  permissions?: string[]
}

export interface RemoveMemberData {
  memberId: string
  reason?: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface InviteMemberResult {
  success: boolean
  error?: string
  invitation?: WorkspaceInvitation
}

export interface UpdateMemberResult {
  success: boolean
  error?: string
  member?: WorkspaceMember
}

export interface RemoveMemberResult {
  success: boolean
  error?: string
}

export interface MemberActivityResult {
  success: boolean
  error?: string
  activities?: MemberActivity[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function hasPermission(
  userRole: MemberRole, 
  permission: keyof MemberPermissions
): boolean {
  return ROLE_PERMISSIONS[userRole][permission]
}

export function canPerformAction(
  currentUserRole: MemberRole,
  targetMemberRole: MemberRole,
  action: 'invite' | 'remove' | 'changeRole'
): boolean {
  const permissions = ROLE_PERMISSIONS[currentUserRole]
  
  switch (action) {
    case 'invite':
      return permissions.canInviteMembers
    case 'remove':
      return permissions.canRemoveMembers && (
        currentUserRole === 'OWNER' || 
        (currentUserRole === 'ADMIN' && targetMemberRole !== 'OWNER')
      )
    case 'changeRole':
      return permissions.canChangeRoles && (
        currentUserRole === 'OWNER' || 
        (currentUserRole === 'ADMIN' && targetMemberRole !== 'OWNER')
      )
    default:
      return false
  }
}

export function getRoleHierarchy(): MemberRole[] {
  return ['OWNER', 'ADMIN', 'EDITOR', 'MEMBER', 'VIEWER']
}

export function isValidRoleTransition(
  currentUserRole: MemberRole,
  fromRole: MemberRole,
  toRole: MemberRole
): boolean {
  // Solo OWNER puede cambiar desde/hacia OWNER
  if (fromRole === 'OWNER' || toRole === 'OWNER') {
    return currentUserRole === 'OWNER'
  }
  
  // ADMIN puede cambiar cualquier rol excepto OWNER
  if (currentUserRole === 'ADMIN') {
    return true
  }
  
  return false
} 