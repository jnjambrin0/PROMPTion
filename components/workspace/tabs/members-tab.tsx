'use client'

import React, { useState, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Users, 
  Crown, 
  Shield, 
  Edit3, 
  Eye, 
  MoreHorizontal,
  Search,
  Plus,
  Mail,
  ArrowRight,
  UserMinus,
  Settings2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InviteMemberDialog } from '@/components/workspace/invite-member-dialog'
import type { WorkspaceTabProps } from '@/lib/types/workspace'

const roleConfig = {
  OWNER: { label: 'Owner', icon: Crown, color: 'default' },
  ADMIN: { label: 'Admin', icon: Shield, color: 'secondary' },
  EDITOR: { label: 'Editor', icon: Edit3, color: 'outline' },
  VIEWER: { label: 'Viewer', icon: Eye, color: 'outline' }
}

// Server Component for better performance
function StatCard({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}

// Compact member row instead of large cards
function MemberRow({ member, workspaceSlug }: { member: any; workspaceSlug: string }) {
  const roleInfo = roleConfig[member.role as keyof typeof roleConfig] || { 
    label: member.role, 
    icon: Users,
    color: 'outline'
  }
  const RoleIcon = roleInfo.icon

  const handleEmailMember = () => {
    if (member.user.email) {
      window.location.href = `mailto:${member.user.email}`
    }
  }

  const handleMemberAction = (action: string) => {
    console.log(`${action} member:`, member.id)
    // TODO: Implement actual member actions
    switch (action) {
      case 'change-role':
        // TODO: Show change role dialog
        break
      case 'remove':
        // TODO: Show remove member confirmation
        break
      case 'view-activity':
        // TODO: Show member activity
        break
      default:
        break
    }
  }

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.user.avatarUrl || undefined} />
          <AvatarFallback className="text-xs">
            {(member.user.fullName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">
              {member.user.fullName || member.user.username || 'Unknown User'}
            </p>
            <Badge variant={roleInfo.color as any} className="flex items-center gap-1">
              <RoleIcon className="h-3 w-3" />
              <span className="text-xs">{roleInfo.label}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>@{member.user.username || 'no-username'}</span>
            {member.joinedAt && (
              <>
                <span>•</span>
                <span>Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {member.user.email && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={handleEmailMember}
            title="Send email"
          >
            <Mail className="h-3 w-3" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleMemberAction('view-activity')}>
              <Eye className="h-4 w-4 mr-2" />
              View Activity
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMemberAction('change-role')}>
              <Settings2 className="h-4 w-4 mr-2" />
              Change Role
            </DropdownMenuItem>
            {!['OWNER'].includes(member.role) && (
              <DropdownMenuItem 
                onClick={() => handleMemberAction('remove')}
                className="text-red-600 focus:text-red-600"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove Member
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Alternative: Compact card for grid view
function CompactMemberCard({ member, workspaceSlug }: { member: any; workspaceSlug: string }) {
  const roleInfo = roleConfig[member.role as keyof typeof roleConfig] || { 
    label: member.role, 
    icon: Users,
    color: 'outline'
  }
  const RoleIcon = roleInfo.icon

  const handleEmailMember = () => {
    if (member.user.email) {
      window.location.href = `mailto:${member.user.email}`
    }
  }

  return (
    <div className="border border-border rounded-lg p-3 hover:shadow-sm transition-all hover:border-border group">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.user.avatarUrl || undefined} />
          <AvatarFallback className="text-xs">
            {(member.user.fullName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {member.user.fullName || member.user.username || 'Unknown User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            @{member.user.username || 'no-username'}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Activity
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2 className="h-4 w-4 mr-2" />
              Change Role
            </DropdownMenuItem>
            {!['OWNER'].includes(member.role) && (
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <UserMinus className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant={roleInfo.color as any} className="flex items-center gap-1">
          <RoleIcon className="h-3 w-3" />
          <span className="text-xs">{roleInfo.label}</span>
        </Badge>
        {member.user.email && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={handleEmailMember}
          >
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>
        )}
      </div>
    </div>
  )
}

function EmptyState({ 
  searchQuery, 
  selectedRole, 
  onClearFilters,
  workspaceSlug 
}: {
  searchQuery: string
  selectedRole: string
  onClearFilters: () => void
  workspaceSlug: string
}) {
  const hasFilters = searchQuery || selectedRole !== 'all'

  return (
    <div className="text-center py-8">
      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      {hasFilters ? (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No members found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-foreground mb-2">No members yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Invite team members to collaborate on this workspace
          </p>
          <InviteMemberDialog workspaceSlug={workspaceSlug} />
        </>
      )}
    </div>
  )
}

export default function MembersTab({ workspaceSlug, workspaceData }: WorkspaceTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const { members, stats } = workspaceData

  // Filter members
  const filteredMembers = useMemo(() => {
    if (!members || members.length === 0) return []
    
    return members.filter(member => {
      const matchesSearch = searchQuery === '' || 
        (member.user.fullName && member.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.user.username && member.user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.user.email && member.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesRole = selectedRole === 'all' || member.role === selectedRole

      return matchesSearch && matchesRole
    })
  }, [members, searchQuery, selectedRole])

  // Calculate role counts
  const roleCounts = useMemo(() => {
    if (!members) return { admins: 0, editors: 0, viewers: 0 }
    
    return {
      admins: members.filter(m => ['OWNER', 'ADMIN'].includes(m.role)).length,
      editors: members.filter(m => m.role === 'EDITOR').length,
      viewers: members.filter(m => m.role === 'VIEWER').length
    }
  }, [members])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Members</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage workspace members and their permissions
          </p>
        </div>
        <InviteMemberDialog 
          workspaceSlug={workspaceSlug}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          }
        />
      </div>

      {/* Search and Filters - Improved with Select component */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="EDITOR">Editor</SelectItem>
            <SelectItem value="VIEWER">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        >
          {viewMode === 'list' ? 'Grid' : 'List'}
        </Button>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Members"
          value={stats.totalMembers}
        />
        <StatCard
          icon={Crown}
          label="Admins"
          value={roleCounts.admins}
        />
        <StatCard
          icon={Edit3}
          label="Editors"
          value={roleCounts.editors}
        />
        <StatCard
          icon={Eye}
          label="Viewers"
          value={roleCounts.viewers}
        />
      </div>

      {/* Members List/Grid */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          searchQuery={searchQuery}
          selectedRole={selectedRole}
          workspaceSlug={workspaceSlug}
          onClearFilters={() => {
            setSearchQuery('')
            setSelectedRole('all')
          }}
        />
      ) : viewMode === 'list' ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Team Members ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredMembers.map((member) => (
              <MemberRow key={member.id} member={member} workspaceSlug={workspaceSlug} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredMembers.map((member) => (
            <CompactMemberCard key={member.id} member={member} workspaceSlug={workspaceSlug} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MembersTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-9 bg-muted rounded animate-pulse" />
        <div className="h-9 w-40 bg-muted rounded animate-pulse" />
        <div className="h-9 w-16 bg-muted rounded animate-pulse" />
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1" />
            <div className="h-5 w-8 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Members list skeleton */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="space-y-1 flex-1">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 