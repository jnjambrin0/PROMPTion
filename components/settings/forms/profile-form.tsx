'use client'

import { useState, useCallback } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { type UserProfileData } from '@/lib/actions/user-settings'

interface ProfileFormProps {
  profile: UserProfileData
  onUpdate: () => void
  updateAction: (updates: any) => Promise<{ success: boolean; error?: string }>
}

export function ProfileForm({ profile, onUpdate, updateAction }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    fullName: profile.fullName || '',
    bio: profile.bio || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Check if there are changes
      const hasChanges = 
        newData.username !== (profile.username || '') ||
        newData.fullName !== (profile.fullName || '') ||
        newData.bio !== (profile.bio || '')
      
      setHasChanges(hasChanges)
      return newData
    })
  }, [profile])

  const handleSave = useCallback(async () => {
    if (!hasChanges) return

    setIsLoading(true)
    
    try {
      const updates: any = {}
      
      if (formData.username !== (profile.username || '')) {
        updates.username = formData.username || null
      }
      if (formData.fullName !== (profile.fullName || '')) {
        updates.fullName = formData.fullName || null
      }
      if (formData.bio !== (profile.bio || '')) {
        updates.bio = formData.bio || null
      }

      const result = await updateAction(updates)
      
      if (result.success) {
        toast.success('Profile updated successfully')
        setHasChanges(false)
        onUpdate()
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }, [formData, profile, hasChanges, onUpdate, updateAction])

  const handleReset = useCallback(() => {
    setFormData({
      username: profile.username || '',
      fullName: profile.fullName || '',
      bio: profile.bio || ''
    })
    setHasChanges(false)
  }, [profile])

  return (
    <div className="space-y-4">
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="@username"
            maxLength={50}
            className="h-9"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          rows={2}
          className="resize-none"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Brief description about yourself</span>
          <span>{formData.bio.length}/500</span>
        </div>
      </div>

      {/* Actions */}
      {hasChanges && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
} 