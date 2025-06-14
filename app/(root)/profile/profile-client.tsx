'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Save, User, Mail, AtSign, FileText, Clock } from 'lucide-react'

// ==================== INTERFACES ====================

interface ProfileData {
  id: string
  email: string
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

interface ProfileClientProps {
  initialProfile: ProfileData
}

// ==================== OPTIMIZED COMPONENT ====================

export default function ProfileClient({ 
  initialProfile 
}: ProfileClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: initialProfile.fullName || '',
    username: initialProfile.username || '',
    bio: initialProfile.bio || ''
  })
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // ==================== FORM HANDLING ====================

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    // Check if there are changes
    const hasChanged = 
      value !== (initialProfile[field] || '') ||
      formData.fullName !== (initialProfile.fullName || '') ||
      formData.username !== (initialProfile.username || '') ||
      formData.bio !== (initialProfile.bio || '')
    
    setHasChanges(hasChanged)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) {
      toast.info('No changes to save')
      return
    }

    startTransition(async () => {
      try {
        // Use Server Action instead of API call
        const result = await updateProfileAction({
          fullName: formData.fullName.trim() || null,
          username: formData.username.trim() || null,
          bio: formData.bio.trim() || null
        })
        
        if (result.success) {
          toast.success('Profile updated successfully!', {
            description: 'Your changes have been saved.'
          })
          
          setHasChanges(false)
          
          // Optionally refresh the page to get updated data
          router.refresh()
        } else {
          toast.error('Failed to update profile', {
            description: result.error || 'Please try again'
          })
          
          // Handle validation errors
          if (result.error?.includes('Username')) {
            setErrors({ username: result.error })
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error('Something went wrong', {
          description: 'Please try again'
        })
      }
    })
  }

  // ==================== RENDER ====================

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture & Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={initialProfile.avatarUrl || undefined} />
                <AvatarFallback className="text-lg">
                  {formData.fullName?.[0] || formData.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {formData.fullName || formData.username || 'User'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  {initialProfile.email}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <AtSign className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
                maxLength={30}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
              <p className="text-xs text-gray-500">
                Only letters, numbers, hyphens, and underscores allowed
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-xs text-gray-500">
                Last updated: {new Date(initialProfile.updatedAt).toLocaleDateString()}
              </div>
              
              <Button
                type="submit"
                disabled={!hasChanges || isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 