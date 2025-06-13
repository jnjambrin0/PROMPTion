'use client'

import { useState, useCallback } from 'react'
import { Save, Globe, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { type PrivacySettings } from '@/lib/actions/user-settings'

interface PrivacyFormProps {
  settings: PrivacySettings
  onUpdate: () => void
  updateAction: (updates: PrivacySettings) => Promise<{ success: boolean; error?: string }>
  category: 'visibility' | 'discovery' | 'data'
}

const categorySettings = {
  visibility: {
    fields: [
      { key: 'showEmail', label: 'Show Email Address', description: 'Display your email address on your public profile', type: 'switch' },
      { key: 'showActivity', label: 'Show Activity', description: 'Show your recent activity and contributions', type: 'switch' }
    ],
    hasVisibilitySelect: true
  },
  discovery: {
    fields: [
      { key: 'allowDiscovery', label: 'Allow Discovery', description: 'Allow others to find you through search and suggestions', type: 'switch' }
    ],
    hasVisibilitySelect: false
  },
  data: {
    fields: [
      { key: 'allowAnalytics', label: 'Usage Analytics', description: 'Help improve the platform by sharing anonymous usage data', type: 'switch' },
      { key: 'allowMarketing', label: 'Marketing Communications', description: 'Receive updates about new features and improvements', type: 'switch' }
    ],
    hasVisibilitySelect: false
  }
} as const

export function PrivacyForm({ settings, onUpdate, updateAction, category }: PrivacyFormProps) {
  const [formData, setFormData] = useState<PrivacySettings>(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = useCallback((field: keyof PrivacySettings, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Check if there are changes
      const hasChanges = Object.keys(newData).some(
        k => newData[k as keyof PrivacySettings] !== settings[k as keyof PrivacySettings]
      )
      
      setHasChanges(hasChanges)
      return newData
    })
  }, [settings])

  const handleSave = useCallback(async () => {
    if (!hasChanges) return

    setIsLoading(true)
    
    try {
      const result = await updateAction(formData)
      
      if (result.success) {
        toast.success('Privacy settings updated')
        setHasChanges(false)
        onUpdate()
      } else {
        toast.error(result.error || 'Failed to update privacy settings')
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast.error('Failed to update privacy settings')
    } finally {
      setIsLoading(false)
    }
  }, [formData, hasChanges, onUpdate, updateAction])

  const categoryConfig = categorySettings[category]

  return (
    <div className="space-y-4">
      {/* Profile Visibility Select (only for visibility category) */}
      {categoryConfig.hasVisibilitySelect && (
        <div className="space-y-2">
          <Label htmlFor="profileVisibility" className="text-sm font-medium">Who can see your profile</Label>
          <Select 
            value={formData.profileVisibility} 
            onValueChange={(value: 'public' | 'workspace_only' | 'private') => 
              handleChange('profileVisibility', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Public</p>
                    <p className="text-xs text-muted-foreground">Anyone can see your profile</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="workspace_only">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Workspace Members Only</p>
                    <p className="text-xs text-muted-foreground">Only members of your workspaces</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Private</p>
                    <p className="text-xs text-muted-foreground">Only you can see your profile</p>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Category-specific settings */}
      <div className="space-y-2">
        {categoryConfig.fields.map(({ key, label, description, type }) => (
          <div key={key} className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
              <Label htmlFor={key} className="text-sm font-medium text-foreground">
                {label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            {type === 'switch' && (
              <Switch
                id={key}
                checked={formData[key as keyof PrivacySettings] as boolean}
                onCheckedChange={(checked) => handleChange(key as keyof PrivacySettings, checked)}
              />
            )}
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData(settings)
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