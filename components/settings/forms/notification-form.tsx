'use client'

import { useState, useCallback } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { type NotificationPreferences } from '@/lib/actions/user-settings'

interface NotificationFormProps {
  preferences: NotificationPreferences
  onUpdate: () => void
  updateAction: (updates: NotificationPreferences) => Promise<{ success: boolean; error?: string }>
  category: 'email' | 'workspace' | 'system'
}

const categorySettings = {
  email: [
    { key: 'comments', label: 'Comments', description: 'Get notified when someone comments on your prompts' },
    { key: 'mentions', label: 'Mentions', description: 'Get notified when someone mentions you' },
    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of activities' }
  ],
  workspace: [
    { key: 'emailWorkspaceInvites', label: 'Workspace Invites', description: 'Invitations to join workspaces' },
    { key: 'emailPromptShared', label: 'Prompt Shared', description: 'When someone shares a prompt with you' }
  ],
  system: [
    { key: 'emailSystemUpdates', label: 'System Updates', description: 'Platform updates and maintenance' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Real-time browser notifications' }
  ]
} as const

export function NotificationForm({ preferences, onUpdate, updateAction, category }: NotificationFormProps) {
  const [formData, setFormData] = useState<NotificationPreferences>(preferences)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = useCallback((key: keyof NotificationPreferences, value: boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: value }
      
      // Check if there are changes
      const hasChanges = Object.keys(newData).some(
        k => newData[k as keyof NotificationPreferences] !== preferences[k as keyof NotificationPreferences]
      )
      
      setHasChanges(hasChanges)
      return newData
    })
  }, [preferences])

  const handleSave = useCallback(async () => {
    if (!hasChanges) return

    setIsLoading(true)
    
    try {
      const result = await updateAction(formData)
      
      if (result.success) {
        toast.success('Notification preferences updated')
        setHasChanges(false)
        onUpdate()
      } else {
        toast.error(result.error || 'Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      toast.error('Failed to update preferences')
    } finally {
      setIsLoading(false)
    }
  }, [formData, hasChanges, onUpdate, updateAction])

  const settings = categorySettings[category]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {settings.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <Label htmlFor={key} className="text-sm font-medium text-foreground">
                {label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            <Switch
              id={key}
              checked={formData[key as keyof NotificationPreferences] as boolean}
              onCheckedChange={(checked) => handleToggle(key as keyof NotificationPreferences, checked)}
            />
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData(preferences)
              setHasChanges(false)
            }}
            disabled={isLoading}
            className="h-7 px-3"
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="h-7 px-3"
          >
            {isLoading ? (
              <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
            ) : (
              <Save className="h-3 w-3 mr-1" />
            )}
            Save
          </Button>
        </div>
      )}
    </div>
  )
} 