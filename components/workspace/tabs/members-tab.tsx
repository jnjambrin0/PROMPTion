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
  Mail
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { WorkspaceTabProps } from '@/lib/types/workspace'

const roleConfig = {
  OWNER: { label: 'Owner', icon: Crown, color: 'purple' },
  ADMIN: { label: 'Admin', icon: Shield, color: 'blue' },
  EDITOR: { label: 'Editor', icon: Edit3, color: 'green' },
  VIEWER: { label: 'Viewer', icon: Eye, color: 'gray' }
}

export default function MembersTab({ workspaceSlug, workspaceData }: WorkspaceTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')

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
          <h2 className="text-2xl font-bold text-gray-900">Members</h2>
          <p className="text-gray-600 mt-1">
            Manage workspace members and their permissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
            </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="all">All Roles</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Members</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.totalMembers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Admins</span>
            </div>
            <p className="text-2xl font-bold mt-1">{roleCounts.admins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Editors</span>
            </div>
            <p className="text-2xl font-bold mt-1">{roleCounts.editors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Viewers</span>
            </div>
            <p className="text-2xl font-bold mt-1">{roleCounts.viewers}</p>
          </CardContent>
        </Card>
          </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {searchQuery || selectedRole !== 'all' ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedRole('all')
                }}
              >
                Clear filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
              <p className="text-gray-600 mb-4">
                Invite team members to collaborate on this workspace
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite your first member
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const roleInfo = roleConfig[member.role as keyof typeof roleConfig] || { label: member.role, icon: Users }
            const RoleIcon = roleInfo.icon

  return (
              <Card key={member.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {(member.user.fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {member.user.fullName || member.user.username || 'Unknown User'}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          @{member.user.username || 'no-username'}
                        </p>
        </div>
      </div>
            <Button 
              variant="ghost" 
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <RoleIcon className="h-3 w-3" />
                        {roleInfo.label}
                      </Badge>
                      {member.user.email && (
                        <Button variant="ghost" size="sm" className="h-6 px-2">
              <Mail className="h-3 w-3" />
            </Button>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      {member.joinedAt && (
                        <div>
                          Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                        </div>
                      )}
                      {member.lastActiveAt && (
                        <div>
                          Last active {formatDistanceToNow(new Date(member.lastActiveAt), { addSuffix: true })}
                        </div>
        )}
      </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function MembersTabSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Members grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 