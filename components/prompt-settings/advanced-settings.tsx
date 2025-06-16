'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2, Zap, Webhook } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { deletePromptAction } from '@/lib/actions/prompt-settings'
import type { PromptSettingsData } from '@/lib/actions/prompt-settings'

interface AdvancedSettingsProps {
  promptId: string
  settings: PromptSettingsData
  isOwner: boolean
  canEdit: boolean
  workspaceSlug: string
}

export const AdvancedSettings = React.memo(({ 
  promptId, 
  settings, 
  isOwner, 
  canEdit,
  workspaceSlug 
}: AdvancedSettingsProps) => {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleShowDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true)
    try {
      const result = await deletePromptAction(promptId)
      
      if (result.success) {
        toast.success('Prompt deleted successfully')
        if (result.redirectUrl) {
          router.push(result.redirectUrl)
        } else {
          router.push(`/${workspaceSlug}`)
        }
      } else {
        toast.error(result.error || 'Failed to delete prompt')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [promptId, router, workspaceSlug])

  // Dummy handler for webhook since this is a future feature
  const handleWebhookChange = useCallback(() => {
    // This is disabled for now - future feature
    // In the future, this would call onUpdate({ webhookUrl: e.target.value })
  }, [])

  return (
    <div className="space-y-6">
      {/* API Access Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle>API Access</CardTitle>
          </div>
          <CardDescription>
            Configure API access and integrations for this prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="api-access" className="text-sm font-medium text-foreground">
                Enable API Access
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow this prompt to be accessed via API endpoints
              </p>
            </div>
            <Switch
              id="api-access"
              checked={settings.apiAccess}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="webhook-url" className="text-sm font-medium text-foreground">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              type="url"
              value={settings.webhookUrl || ''}
              onChange={handleWebhookChange}
              placeholder="https://your-app.com/webhook"
              disabled={!canEdit}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Receive notifications when this prompt is executed via API
            </p>
          </div>

          <div 
            className="p-4 rounded-lg border border-border bg-muted"
          >
            <div className="flex items-start gap-2">
              <Webhook className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Coming Soon</p>
                <p className="text-muted-foreground">
                  API access and webhook integrations will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {isOwner && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <CardTitle className="text-danger">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible and destructive actions for this prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="rounded-lg border p-4 bg-danger-muted border-danger-border"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-danger-muted-foreground">
                    Delete this prompt
                  </h4>
                  <p className="text-sm text-danger-muted-foreground">
                    This action cannot be undone. All collaborators will lose access.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleShowDeleteConfirm}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Prompt
                </Button>
              </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 mt-0.5 text-danger" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Delete Prompt
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Are you sure you want to delete this prompt? This action cannot be undone.
                        All collaborators will lose access and any integrations will stop working.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelDelete}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleConfirmDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete Prompt'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
})

AdvancedSettings.displayName = 'AdvancedSettings' 