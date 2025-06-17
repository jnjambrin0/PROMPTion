'use client'

import React, { useCallback } from 'react'
import { AlertTriangle, Trash2, Zap, Webhook } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DeletePromptDialog } from '@/components/prompt/delete-prompt-dialog'
import type { PromptSettingsData } from '@/lib/actions/prompt-settings'

interface AdvancedSettingsProps {
  promptId: string
  settings: PromptSettingsData
  isOwner: boolean
  canEdit: boolean
  workspaceSlug: string
  onUpdate: (updates: Partial<PromptSettingsData>) => void
}

export const AdvancedSettings = React.memo(({ 
  promptId, 
  settings, 
  isOwner, 
  canEdit,
  onUpdate
}: AdvancedSettingsProps) => {
  // Dummy handler for webhook since this is a future feature
  const handleWebhookChange = useCallback(() => {
    // This is disabled for now - future feature
    // In the future, this would call onUpdate({ webhookUrl: e.target.value })
  }, [])

  const handleApiAccessChange = useCallback((checked: boolean) => {
    onUpdate({ apiAccess: checked })
  }, [onUpdate])

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
              onCheckedChange={handleApiAccessChange}
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
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-danger-muted-foreground">
                    Delete this prompt
                  </h4>
                  <p className="text-sm text-danger-muted-foreground">
                    This action cannot be undone. All collaborators will lose access.
                  </p>
                </div>
                <DeletePromptDialog promptId={promptId}>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Prompt
                  </Button>
                </DeletePromptDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

AdvancedSettings.displayName = 'AdvancedSettings' 