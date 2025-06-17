'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Users, Trash2, UserPlus, Mail, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  addCollaboratorAction,
  removeCollaboratorAction,
  updateCollaboratorPermissionAction,
} from '@/lib/actions/prompt-settings'
import type { CollaboratorData } from '@/lib/actions/prompt-settings'
import Image from 'next/image'

interface CollaboratorsSettingsProps {
  promptId: string
  collaborators: CollaboratorData[]
  isOwner: boolean
  canEdit: boolean
  onUpdate: () => void
}

const permissionLabels = {
  VIEW: { label: 'Viewer', color: 'bg-gray-500', description: 'Can view the prompt' },
  COMMENT: { label: 'Commenter', color: 'bg-blue-600', description: 'Can view and comment' },
  EDIT: { label: 'Editor', color: 'bg-green-600', description: 'Can view, comment, and edit' }
} as const

export const CollaboratorsSettings = React.memo(({ 
  promptId,
  collaborators,
  isOwner,
  canEdit,
  onUpdate
}: CollaboratorsSettingsProps) => {
  const [newEmail, setNewEmail] = useState('')
  const [newPermission, setNewPermission] = useState<'VIEW' | 'COMMENT' | 'EDIT'>('VIEW')
  const [isInviting, setIsInviting] = useState(false)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  const canManageCollaborators = useMemo(() => isOwner, [isOwner])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value)
  }, [])

  const handleNewPermissionChange = useCallback((value: 'VIEW' | 'COMMENT' | 'EDIT') => {
    setNewPermission(value)
  }, [])

  const handleInvite = useCallback(async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!canManageCollaborators) {
      toast.error('Only the owner can add collaborators')
      return
    }

    setIsInviting(true)
    try {
      const result = await addCollaboratorAction(promptId, newEmail.trim(), newPermission)
      
      if (result.success) {
        setNewEmail('')
        setNewPermission('VIEW')
        onUpdate()
        toast.success('Collaborator added successfully')
      } else {
        toast.error(result.error || 'Failed to add collaborator')
      }
    } catch {
      toast.error('Failed to add collaborator')
    } finally {
      setIsInviting(false)
    }
  }, [promptId, newEmail, newPermission, canManageCollaborators, onUpdate])

  const handleRemoveCollaborator = useCallback(async (collaboratorId: string) => {
    if (!canManageCollaborators) {
      toast.error('Only the owner can remove collaborators')
      return
    }

    setRemovingIds(prev => new Set(prev).add(collaboratorId))
    try {
      const result = await removeCollaboratorAction(promptId, collaboratorId)
      
      if (result.success) {
        onUpdate()
        toast.success('Collaborator removed')
      } else {
        toast.error(result.error || 'Failed to remove collaborator')
      }
    } catch {
      toast.error('Failed to remove collaborator')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(collaboratorId)
        return newSet
      })
    }
  }, [promptId, canManageCollaborators, onUpdate])

  const handlePermissionChange = useCallback(async (collaboratorId: string, permission: 'VIEW' | 'COMMENT' | 'EDIT') => {
    if (!canManageCollaborators) {
      toast.error('Only the owner can change permissions')
      return
    }
    
    const result = await updateCollaboratorPermissionAction(promptId, collaboratorId, permission)

    if (result.success) {
      toast.success('Permission updated')
      onUpdate()
    } else {
      toast.error(result.error || 'Failed to update permission')
      onUpdate() // Re-fetch to revert optimistic update
    }
  }, [promptId, canManageCollaborators, onUpdate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInvite()
    }
  }, [handleInvite])

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription>
            View who has access to this prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">You don&apos;t have permission to manage collaborators</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborators</CardTitle>
        <CardDescription>
          Manage who can access and edit this prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {canManageCollaborators && (
          <div className="space-y-3 p-4 border border-border rounded-lg bg-muted">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Add Collaborator</span>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  disabled={isInviting}
                />
              </div>
              <Select value={newPermission} onValueChange={handleNewPermissionChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW">Viewer</SelectItem>
                  <SelectItem value="COMMENT">Commenter</SelectItem>
                  <SelectItem value="EDIT">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleInvite}
                disabled={isInviting || !newEmail.trim()}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No collaborators yet</p>
              {isOwner && (
                <p className="text-xs mt-1">Add collaborators to share your prompt</p>
              )}
            </div>
          ) : (
            collaborators.map((collaborator) => (
              <CollaboratorItem
                key={collaborator.id}
                collaborator={collaborator}
                isRemoving={removingIds.has(collaborator.id)}
                canRemove={canManageCollaborators}
                onRemove={handleRemoveCollaborator}
                onPermissionChange={handlePermissionChange}
              />
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <h4 className="text-sm font-medium mb-3">Permission Levels</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            {Object.entries(permissionLabels).map(([key, { label, color, description }]) => (
              <div className="flex items-center gap-2" key={key}>
                <Badge className={`${color} hover:${color}`} variant="secondary">{label}</Badge>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

CollaboratorsSettings.displayName = 'CollaboratorsSettings'

const CollaboratorItem = React.memo(({ 
  collaborator, 
  isRemoving, 
  canRemove, 
  onRemove,
  onPermissionChange
}: {
  collaborator: CollaboratorData
  isRemoving: boolean
  canRemove: boolean
  onRemove: (id: string) => void
  onPermissionChange: (id: string, permission: 'VIEW' | 'COMMENT' | 'EDIT') => void
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemove = useCallback(() => {
    onRemove(collaborator.id)
  }, [collaborator.id, onRemove])

  const handleSelectPermission = useCallback(async (permission: 'VIEW' | 'COMMENT' | 'EDIT') => {
    setIsUpdating(true);
    await onPermissionChange(collaborator.id, permission);
    setIsUpdating(false);
  }, [collaborator.id, onPermissionChange]);

  const isDisabled = isRemoving || isUpdating;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-center gap-3">
        <Image
          src={collaborator.avatarUrl || `https://avatar.vercel.sh/${collaborator.email}.png`}
          alt={collaborator.fullName || collaborator.email}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="text-sm">
          <p className="font-medium text-foreground">
            {collaborator.fullName || collaborator.email}
          </p>
          <p className="text-muted-foreground">
            Added {formatDistanceToNow(collaborator.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Select
          value={collaborator.permission}
          onValueChange={handleSelectPermission}
          disabled={!canRemove || isDisabled}
        >
          <SelectTrigger className="w-32 text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIEW">Viewer</SelectItem>
            <SelectItem value="COMMENT">Commenter</SelectItem>
            <SelectItem value="EDIT">Editor</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={!canRemove || isDisabled}
          className="text-muted-foreground hover:text-danger hover:bg-danger-muted h-8 w-8"
        >
          {isRemoving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
})

CollaboratorItem.displayName = 'CollaboratorItem' 