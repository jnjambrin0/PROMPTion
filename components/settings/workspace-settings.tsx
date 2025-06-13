'use client'

import React, { useState, useCallback } from 'react'
import { Building, Crown, Users, ExternalLink, LogOut, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { leaveWorkspaceAction } from '@/lib/actions/user-settings'
import Link from 'next/link'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'
import { WorkspaceActions } from './forms/workspace-actions'

interface WorkspaceData {
  id: string
  name: string
  slug: string
  role: string
  plan: string
}

interface WorkspaceSettingsProps {
  workspaces: WorkspaceData[]
  onUpdate: () => void
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'OWNER':
      return 'default'
    case 'ADMIN':
      return 'secondary' 
    case 'EDITOR':
      return 'outline'
    default:
      return 'outline'
  }
}

function WorkspaceCompactCard({ workspace, onUpdate }: { 
  workspace: WorkspaceData
  onUpdate: () => void 
}) {
  const isOwner = workspace.role === 'OWNER'

  return (
    <CompactCard padding="sm" hover className="group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground truncate text-sm">
                {workspace.name}
              </h4>
              {isOwner && <Crown className="h-3 w-3 text-yellow-600 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">@{workspace.slug}</span>
              <Badge 
                variant={getRoleBadgeVariant(workspace.role)}
                className="text-xs px-1.5 py-0"
              >
                {workspace.role}
              </Badge>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {workspace.plan}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
            <Link href={`/${workspace.slug}`}>
              Open
            </Link>
          </Button>
          
          {!isOwner && (
            <WorkspaceActions 
              workspace={workspace}
              onUpdate={onUpdate}
              leaveAction={leaveWorkspaceAction}
            />
          )}
        </div>
      </div>
    </CompactCard>
  )
}

export function WorkspaceSettings({ workspaces, onUpdate }: WorkspaceSettingsProps) {
  const ownedWorkspaces = workspaces.filter(w => w.role === 'OWNER')
  const memberWorkspaces = workspaces.filter(w => w.role !== 'OWNER')

  return (
    <div className="space-y-6">
      {/* Overview */}
      <CompactCard padding="sm" className="border-l-4 border-l-muted-foreground/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">Workspace Membership</h4>
            <p className="text-xs text-muted-foreground">
              {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} • 
              {ownedWorkspaces.length} owned • {memberWorkspaces.length} member
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {workspaces.length} Total
          </Badge>
        </div>
      </CompactCard>

      {/* Owned Workspaces */}
      {ownedWorkspaces.length > 0 && (
        <SettingsSection
          title="Owned Workspaces"
          description={`You own ${ownedWorkspaces.length} workspace${ownedWorkspaces.length !== 1 ? 's' : ''}`}
          compact
          action={
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground">Owner</span>
            </div>
          }
        >
          <div className="space-y-2">
            {ownedWorkspaces.map(workspace => (
              <WorkspaceCompactCard 
                key={workspace.id}
                workspace={workspace}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </SettingsSection>
      )}

      {/* Member Workspaces */}
      {memberWorkspaces.length > 0 && (
        <SettingsSection
          title="Member Workspaces"
          description={`You're a member of ${memberWorkspaces.length} workspace${memberWorkspaces.length !== 1 ? 's' : ''}`}
          compact
        >
          <div className="space-y-2">
            {memberWorkspaces.map(workspace => (
              <WorkspaceCompactCard 
                key={workspace.id}
                workspace={workspace}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </SettingsSection>
      )}

      {/* Ownership Notice */}
      {ownedWorkspaces.length > 0 && (
        <CompactCard padding="sm" className="bg-muted/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">Workspace Ownership</h4>
              <p className="text-xs text-muted-foreground">
                You cannot leave workspaces you own. Transfer ownership to another member or delete the workspace first.
              </p>
            </div>
          </div>
        </CompactCard>
      )}

      {/* Empty State */}
      {workspaces.length === 0 && (
        <CompactCard padding="md" className="text-center">
          <Building className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-medium text-foreground mb-1">No Workspaces</h4>
          <p className="text-sm text-muted-foreground">
            You haven't joined any workspaces yet.
          </p>
        </CompactCard>
      )}
    </div>
  )
} 