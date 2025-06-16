'use client'

import { User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { updateUserProfileAction, type UserProfileData } from '@/lib/actions/user-settings'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'
import { ProfileForm } from './forms/profile-form'
import Image from 'next/image'

interface ProfileSettingsProps {
  profile: UserProfileData
  onUpdate: () => void
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Profile Overview */}
      <CompactCard padding="sm" className="border-l-4 border-l-muted-foreground/20">
        <div className="flex items-center gap-3">
          {/* Compact Avatar */}
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {profile.avatarUrl ? (
                <Image 
                  src={profile.avatarUrl} 
                  alt="Profile" 
                className="h-full w-full object-cover rounded-full"
                />
              ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          {/* Compact Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground truncate">
                {profile.fullName || 'No name set'}
              </h4>
              {profile.username && (
                <span className="text-sm text-muted-foreground">
                  @{profile.username}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {profile.bio || 'No bio added yet'}
            </p>
          </div>
          
              <Badge variant="secondary" className="text-xs">
            {profile.email ? 'Verified' : 'Incomplete'}
              </Badge>
            </div>
      </CompactCard>

      {/* Basic Information Form */}
      <SettingsSection
        title="Personal Information"
        description="Update your basic profile information"
        compact
      >
        <ProfileForm 
          profile={profile} 
          onUpdate={onUpdate}
          updateAction={updateUserProfileAction}
        />
      </SettingsSection>

      {/* Account Details - Read Only */}
      <SettingsSection
        title="Account Details"
        description="Your account information and verification status"
        compact
      >
        <div className="space-y-1">
          <SettingsRow
            label="Email Address"
            value={profile.email}
            badge={<Badge variant="secondary" className="text-xs">Verified</Badge>}
            compact
          />
          
          <SettingsRow
            label="User ID"
            value={`${profile.id.slice(0, 8)}...`}
            description="Unique identifier for your account"
            compact
          />
          
          <SettingsRow
            label="Profile Picture"
            description="Upload feature coming soon"
            badge={<Badge variant="outline" className="text-xs">Coming Soon</Badge>}
            compact
              disabled
            />
          </div>
      </SettingsSection>
    </div>
  )
}

ProfileSettings.displayName = 'ProfileSettings' 