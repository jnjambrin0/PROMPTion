'use client'

import { useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  MoreHorizontal,
  Mail,
  Crown,
  Shield,
  Edit3,
  Eye,
  User,
  UserPlus,
  Activity,
  Settings,
  Trash2,
  Search,
  Users
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { InviteMemberDialog } from '@/components/workspace/invite-member-dialog'
import { MemberActivityModal } from '@/components/workspace/member-activity-modal'
import { updateMemberRoleAction, removeMemberAction } from '@/lib/actions/members'
import { hasPermission, canPerformAction, getRoleHierarchy } from '@/lib/types/members'
import type { WorkspaceTabProps, WorkspaceMember } from '@/lib/types/workspace'
import type { MemberRole } from '@/lib/types/members'
import { formatLastActive, formatJoinDate } from '@/lib/utils/date-format'

// ============================================================================
// TYPE ALIAS FOR MEMBER DATA
// ============================================================================

// ============================================================================
// ROLE CONFIGURATIONS
// ============================================================================

const roleConfig = {
  OWNER: {
    label: 'Owner',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Full access to workspace'
  },
  ADMIN: {
    label: 'Admin',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Manage workspace and members'
  },
  EDITOR: {
    label: 'Editor',
    icon: Edit3,
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Create and edit all prompts'
  },
  MEMBER: {
    label: 'Member',
    icon: User,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    description: 'Create and collaborate'
  },
  VIEWER: {
    label: 'Viewer',
    icon: Eye,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'View only access'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MembersTab({ workspaceData }: WorkspaceTabProps) {
  const params = useParams()
  const currentWorkspaceSlug = params.workspace as string
  
  const [isPending, startTransition] = useTransition()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null)

  // Get data from workspaceData
  const members = workspaceData?.members || []
  const currentUser = workspaceData?.currentUser
  
  // Get current user role from members list
  const currentUserMember = members.find((m: WorkspaceMember) => m.user.id === currentUser?.id)
  const userRole = currentUserMember?.role || 'VIEWER'

  // ============================================================================
  // PERMISSIONS CHECK
  // ============================================================================

  const canInvite = hasPermission(userRole as MemberRole, 'canInviteMembers')
  const canRemove = hasPermission(userRole as MemberRole, 'canRemoveMembers') 
  const canChangeRoles = hasPermission(userRole as MemberRole, 'canChangeRoles')

  // ============================================================================
  // FILTERING
  // ============================================================================

  const filteredMembers = members.filter((member: WorkspaceMember) => {
    const matchesSearch = !searchQuery || 
      member.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter

    return matchesSearch && matchesRole
  })

  // ============================================================================
  // MEMBER ACTIONS
  // ============================================================================

  const handleRoleChange = async (member: WorkspaceMember, newRole: MemberRole) => {
    if (!canPerformAction(userRole as MemberRole, member.role, 'changeRole')) {
      toast.error('Insufficient permissions', {
        description: 'You cannot change this member\'s role'
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await updateMemberRoleAction(currentWorkspaceSlug, {
          memberId: member.id,
          role: newRole
        })

        if (result.success) {
          toast.success('Role updated successfully', {
            description: `${member.user.fullName || member.user.username} is now ${newRole.toLowerCase()}`
          })
        } else {
          toast.error('Failed to update role', {
            description: result.error || 'Something went wrong'
          })
        }
      } catch (error) {
        console.error('Error updating role:', error)
        toast.error('Unexpected error', {
          description: 'Failed to update member role'
        })
      }
    })
  }

  const handleRemoveMember = (member: WorkspaceMember) => {
    if (!canPerformAction(userRole as MemberRole, member.role, 'remove')) {
      toast.error('Insufficient permissions', {
        description: 'You cannot remove this member'
      })
      return
    }

    setMemberToRemove(member)
    setRemoveDialogOpen(true)
  }

  const confirmRemoveMember = async () => {
    if (!memberToRemove || isRemoving) return

    setIsRemoving(true)

    try {
      const result = await removeMemberAction(currentWorkspaceSlug, {
        memberId: memberToRemove.id,
        reason: 'Removed by workspace admin'
      })

      if (result.success) {
        toast.success('Member removed successfully', {
          description: `${memberToRemove.user.fullName || memberToRemove.user.username} has been removed from the workspace`
        })
        setRemoveDialogOpen(false)
        setMemberToRemove(null)
      } else {
        toast.error('Failed to remove member', {
          description: result.error || 'Something went wrong'
        })
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Unexpected error', {
        description: 'Failed to remove member'
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const handleViewActivity = (member: WorkspaceMember) => {
    setSelectedMember(member)
    setActivityModalOpen(true)
  }

  const handleEmailMember = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  // ============================================================================
  // UTILITY FUNCTIONS - REMOVED AND USING UTILS
  // ============================================================================

  const getAvailableRoles = (targetMemberRole: MemberRole): MemberRole[] => {
    const allRoles = getRoleHierarchy()
    
    // Owner can change anyone to any role except Owner
    if (userRole === 'OWNER') {
      return allRoles.filter(role => role !== 'OWNER')
    }
    
    // Admin can change roles but not to Owner
    if (userRole === 'ADMIN') {
      return allRoles.filter(role => role !== 'OWNER' && targetMemberRole !== 'OWNER')
    }
    
    return []
  }

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderRoleSelect = (member: WorkspaceMember) => {
    const availableRoles = getAvailableRoles(member.role)
    
    if (availableRoles.length === 0 || member.role === 'OWNER') {
      return null
    }

    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Settings className="h-4 w-4 mr-2" />
          Change Role
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {availableRoles.map((role) => {
            const config = roleConfig[role]
            const Icon = config.icon
            
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleChange(member, role)}
                disabled={isPending}
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span>{config.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {config.description}
                  </span>
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )
  }

  const renderMemberActions = (member: WorkspaceMember) => {
    const isOwner = member.role === 'OWNER'
    const isCurrentUser = member.user.id === currentUser?.id
    
    // Don't show actions dropdown for current user or if no actions available
    const hasViewActivity = true // Everyone can view activity
    const hasEmailAction = !!member.user.email
    const hasRoleChange = canChangeRoles && !isOwner && !isCurrentUser && getAvailableRoles(member.role).length > 0
    const hasRemoveAction = canRemove && !isOwner && !isCurrentUser
    
    // If no actions available, don't show dropdown
    if (!hasViewActivity && !hasEmailAction && !hasRoleChange && !hasRemoveAction) {
      return null
    }
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={isPending}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* View Activity - Available for all */}
          {hasViewActivity && (
            <DropdownMenuItem onClick={() => handleViewActivity(member)}>
              <Activity className="h-4 w-4 mr-2" />
              View Activity
            </DropdownMenuItem>
          )}
          
          {/* Email Member - Only if email exists */}
          {hasEmailAction && (
            <DropdownMenuItem onClick={() => handleEmailMember(member.user.email)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
          )}
          
          {/* Separator only if management actions exist */}
          {(hasRoleChange || hasRemoveAction) && <DropdownMenuSeparator />}
          
          {/* Change Role - Only for eligible members */}
          {hasRoleChange && renderRoleSelect(member)}
          
          {/* Remove Member - Only for non-owners, non-self */}
          {hasRemoveAction && (
            <DropdownMenuItem
              onClick={() => handleRemoveMember(member)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Team Members</h2>
          <p className="text-muted-foreground">
            Manage workspace members and their permissions
          </p>
        </div>
        
        {/* Invite Member Button */}
        {canInvite && (
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="EDITOR">Editor</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="VIEWER">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member: WorkspaceMember) => {
              const config = roleConfig[member.role as keyof typeof roleConfig]
              const Icon = config?.icon || User
              
              return (
                <TableRow key={member.id}>
                  {/* Member Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.avatarUrl || ''} />
                        <AvatarFallback>
                          {(member.user.fullName || member.user.username || member.user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {member.user.fullName || member.user.username || 'Unknown User'}
                          {member.user.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell>
                    <Badge variant="outline" className={config?.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config?.label || member.role}
                    </Badge>
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell>
                    <div className="text-sm">
                      {formatJoinDate(member.joinedAt)}
                    </div>
                  </TableCell>

                  {/* Last Active */}
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatLastActive(member.lastActiveAt)}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {renderMemberActions(member)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">
            {searchQuery || roleFilter !== 'all' ? 'No members found' : 'No members yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || roleFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start building your team by inviting members'
            }
          </p>
          {!searchQuery && roleFilter === 'all' && canInvite && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Your First Member
            </Button>
          )}
        </div>
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      {/* Member Activity Modal */}
      {selectedMember && (
        <MemberActivityModal
          open={activityModalOpen}
          onOpenChange={setActivityModalOpen}
          member={selectedMember}
          workspaceSlug={currentWorkspaceSlug}
        />
      )}

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>
                {memberToRemove?.user.fullName || memberToRemove?.user.username}
              </strong>{' '}
              from this workspace? This action cannot be undone and they will lose access 
              to all workspace content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRemoving ? 'Removing...' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 