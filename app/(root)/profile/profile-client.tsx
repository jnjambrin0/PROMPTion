'use client'

import { useState, useTransition, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit3, Save, Camera, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface UserStats {
  promptsCreated: number
  templatesShared: number
  workspacesJoined: number
  joinedDate: string
}

interface User {
  id: string
  email: string
  username?: string | null
  fullName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
}

interface AuthUser {
  id: string
  email?: string
}

interface ProfileClientProps {
  user: User
  authUser: AuthUser
  userStats: UserStats
}

interface ProfileFormData {
  fullName: string
  username: string
  bio: string
  website: string
  location: string
}

// Loading states interface
interface LoadingState {
  saving: boolean
  uploading: boolean
}

// Validation interface
interface ValidationErrors {
  fullName?: string
  username?: string
  bio?: string
  website?: string
}

export function ProfileClient({ user, authUser, userStats }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loadingState, setLoadingState] = useState<LoadingState>({
    saving: false,
    uploading: false
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  
  // Form data state
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user.fullName || '',
    username: user.username || '',
    bio: user.bio || '',
    website: '',
    location: ''
  })

  // Memoized computed values
  const displayName = useMemo(() => 
    user.fullName || user.username || 'Anonymous User',
    [user.fullName, user.username]
  )

  const initials = useMemo(() => 
    displayName.split(' ').map(n => n[0]).join('').toUpperCase(),
    [displayName]
  )

  const hasChanges = useMemo(() => {
    return formData.fullName !== (user.fullName || '') ||
           formData.username !== (user.username || '') ||
           formData.bio !== (user.bio || '')
  }, [formData, user])

  // Validation function
  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (formData.fullName && formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }

    if (formData.username) {
      if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters'
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, hyphens, and underscores'
      }
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters'
    }

    if (formData.website && formData.website) {
      try {
        new URL(formData.website)
      } catch {
        errors.website = 'Please enter a valid URL'
      }
    }

    return errors
  }, [formData])

  const handleSave = useCallback(() => {
    // Validate form
    const errors = validateForm()
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors')
      return
    }

    startTransition(async () => {
      setLoadingState(prev => ({ ...prev, saving: true }))

      try {
        const response = await fetch('/api/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName || null,
            username: formData.username || null,
            bio: formData.bio || null
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update profile')
        }
        
        toast.success('Profile updated successfully')
        setIsEditing(false)
        setValidationErrors({})
      } catch (error: any) {
        console.error('Failed to update profile:', error)
        
        // Handle specific errors
        if (error.message.includes('Username already exists')) {
          setValidationErrors({ username: 'This username is already taken' })
        } else {
          toast.error(error.message || 'Failed to update profile')
        }
      } finally {
        setLoadingState(prev => ({ ...prev, saving: false }))
      }
    })
  }, [formData, validateForm])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setValidationErrors({})
    // Reset form data to original values
    setFormData({
      fullName: user.fullName || '',
      username: user.username || '',
      bio: user.bio || '',
      website: '',
      location: ''
    })
  }, [user])

  const updateFormData = useCallback((updates: Partial<ProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear validation errors for updated fields
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(updates).forEach(key => {
        delete newErrors[key as keyof ValidationErrors]
      })
      return newErrors
    })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-25">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/home"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
              <p className="text-neutral-600">
                Manage your public profile and personal information
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    disabled={loadingState.saving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={loadingState.saving || !hasChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loadingState.saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 rounded-full">
                      <AvatarImage src={user.avatarUrl || undefined} className="rounded-full object-cover" />
                      <AvatarFallback className="text-2xl bg-neutral-200 text-neutral-700 font-semibold rounded-full">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                        disabled={loadingState.uploading}
                      >
                        {loadingState.uploading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {displayName}
                    </h3>
                    <p className="text-neutral-600">@{user.username || 'no-username'}</p>
                    <p className="text-sm text-neutral-500">Member since {userStats.joinedDate}</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData({ fullName: e.target.value })}
                      disabled={!isEditing}
                      className={validationErrors.fullName ? 'border-red-500' : ''}
                    />
                    {validationErrors.fullName && (
                      <p className="text-xs text-red-600">{validationErrors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => updateFormData({ username: e.target.value })}
                      disabled={!isEditing}
                      className={validationErrors.username ? 'border-red-500' : ''}
                    />
                    {validationErrors.username && (
                      <p className="text-xs text-red-600">{validationErrors.username}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled={true}
                    className="bg-neutral-50"
                  />
                  <p className="text-xs text-neutral-500">
                    Email cannot be changed here. Go to account settings to update.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => updateFormData({ bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className={validationErrors.bio ? 'border-red-500' : ''}
                  />
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    {validationErrors.bio ? (
                      <span className="text-red-600">{validationErrors.bio}</span>
                    ) : (
                      <span>{formData.bio.length}/500 characters</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateFormData({ website: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                      className={validationErrors.website ? 'border-red-500' : ''}
                    />
                    {validationErrors.website && (
                      <p className="text-xs text-red-600">{validationErrors.website}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Prompts Created</span>
                    <Badge variant="secondary">{userStats.promptsCreated}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Templates Shared</span>
                    <Badge variant="secondary">{userStats.templatesShared}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Workspaces</span>
                    <Badge variant="secondary">{userStats.workspacesJoined}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity - TODO: Implement with real data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-center py-8">
                    <p className="text-neutral-500">No recent activity</p>
                    <p className="text-xs text-neutral-400">Start creating prompts to see your activity here</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    href="/settings" 
                    className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Account Settings
                  </Link>
                  <Link 
                    href="/settings/privacy" 
                    className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Privacy Settings
                  </Link>
                  <Link 
                    href="/workspaces" 
                    className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    My Workspaces
                  </Link>
                  <Link 
                    href="/support" 
                    className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Help & Support
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 