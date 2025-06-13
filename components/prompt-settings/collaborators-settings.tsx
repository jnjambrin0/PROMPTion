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
import { addCollaboratorAction, removeCollaboratorAction } from '@/lib/actions/prompt-settings'
import type { CollaboratorData } from '@/lib/actions/prompt-settings'

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

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value)
  }, [])

  const handlePermissionChange = useCallback((value: 'VIEW' | 'COMMENT' | 'EDIT') => {
    setNewPermission(value)
  }, [])

  const handleInvite = useCallback(async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!isOwner) {
      toast.error('Only the owner can add collaborators')
      return
    }

    setIsInviting(true)
    try {
      const result = await addCollaboratorAction(promptId, newEmail.trim(), newPermission)
      
      if (result.success) {
        setNewEmail('')
        setNewPermission('VIEW')
        onUpdate() // Refresh the data
        toast.success('Collaborator added successfully')
      } else {
        toast.error(result.error || 'Failed to add collaborator')
      }
    } catch (error) {
      toast.error('Failed to add collaborator')
    } finally {
      setIsInviting(false)
    }
  }, [promptId, newEmail, newPermission, isOwner, onUpdate])

  const handleRemoveCollaborator = useCallback(async (collaboratorId: string) => {
    if (!isOwner) {
      toast.error('Only the owner can remove collaborators')
      return
    }

    setRemovingIds(prev => new Set(prev).add(collaboratorId))
    try {
      const result = await removeCollaboratorAction(promptId, collaboratorId)
      
      if (result.success) {
        onUpdate() // Refresh the data
        toast.success('Collaborator removed')
      } else {
        toast.error(result.error || 'Failed to remove collaborator')
      }
    } catch (error) {
      toast.error('Failed to remove collaborator')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(collaboratorId)
        return newSet
      })
    }
  }, [promptId, isOwner, onUpdate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInvite()
    }
  }, [handleInvite])

  const canManageCollaborators = useMemo(() => isOwner && canEdit, [isOwner, canEdit])

  if (!isOwner && !canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
          <CardDescription>
            View who has access to this prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-#6b7280">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">You don't have permission to view collaborators</p>
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
        {/* Add new collaborator - only for owners */}
        {canManageCollaborators && (
          <div className="space-y-3 p-4 border border-#e5e7eb rounded-lg bg-#f9fafb">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-#6b7280" />
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
              <Select value={newPermission} onValueChange={handlePermissionChange}>
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

        {/* Current collaborators */}
        <div className="space-y-2">
          {collaborators.length === 0 ? (
            <div className="text-center py-8 text-#6b7280">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No collaborators yet</p>
              {isOwner && (
                <p className="text-xs mt-1">Add collaborators to share your prompt</p>
              )}
            </div>
          ) : (
            collaborators.map((collaborator) => {
              const permission = permissionLabels[collaborator.permission]
              const isRemoving = removingIds.has(collaborator.id)
              
              return (
                <CollaboratorItem
                  key={collaborator.id}
                  collaborator={collaborator}
                  permission={permission}
                  isRemoving={isRemoving}
                  canRemove={canManageCollaborators}
                  onRemove={handleRemoveCollaborator}
                />
              )
            })
          )}
        </div>

        {/* Permission explanations */}
        <div className="mt-6 p-4 bg-#f9fafb border border-#e5e7eb rounded-lg">
          <h4 className="text-sm font-medium mb-3">Permission Levels</h4>
          <div className="space-y-2 text-xs text-#6b7280">
            <div className="flex items-center gap-2">
              <Badge className={permissionLabels.VIEW.color} variant="secondary">{permissionLabels.VIEW.label}</Badge>
              <span>{permissionLabels.VIEW.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={permissionLabels.COMMENT.color} variant="secondary">{permissionLabels.COMMENT.label}</Badge>
              <span>{permissionLabels.COMMENT.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={permissionLabels.EDIT.color} variant="secondary">{permissionLabels.EDIT.label}</Badge>
              <span>{permissionLabels.EDIT.description}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

const CollaboratorItem = React.memo(({ 
  collaborator, 
  permission, 
  isRemoving, 
  canRemove, 
  onRemove 
}: {
  collaborator: CollaboratorData
  permission: typeof permissionLabels[keyof typeof permissionLabels]
  isRemoving: boolean
  canRemove: boolean
  onRemove: (id: string) => void
}) => {
  const handleRemove = useCallback(() => {
    onRemove(collaborator.id)
  }, [collaborator.id, onRemove])

  return (
    <div className="flex items-center justify-between p-3 border border-#e5e7eb rounded-md hover:bg-#f9fafb transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-#e5e7eb flex items-center justify-center">
          {collaborator.avatarUrl ? (
            <img 
              src={collaborator.avatarUrl} 
              alt={collaborator.fullName || collaborator.email}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-#6b7280">
              {(collaborator.fullName || collaborator.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* User info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {collaborator.fullName || collaborator.email}
            </p>
            <Badge className={permission.color} variant="secondary">
              {permission.label}
            </Badge>
          </div>
                     <p className="text-xs text-#6b7280">
             {collaborator.email}
             {collaborator.createdAt && (
               <span className="ml-2">
                 Added {formatDistanceToNow(new Date(collaborator.createdAt), { addSuffix: true })}
               </span>
             )}
           </p>
        </div>
      </div>
      
      {/* Actions */}
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {isRemoving ? (
            <div className="h-4 w-4 animate-spin rounded-full border border-red-600 border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
})

CollaboratorsSettings.displayName = 'CollaboratorsSettings'
CollaboratorItem.displayName = 'CollaboratorItem' 