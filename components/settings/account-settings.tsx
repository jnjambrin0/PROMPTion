'use client'

import React, { useState, useCallback } from 'react'
import { Shield, AlertTriangle, Key, Clock, Smartphone, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { deleteAccountAction } from '@/lib/actions/user-settings'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'
import { AccountDeleteActions } from './forms/account-delete-actions'

interface AccountSettingsProps {
  userEmail: string
  onUpdate: () => void
}

export function AccountSettings({ userEmail, onUpdate }: AccountSettingsProps) {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleDeleteAccount = useCallback(async () => {
    setIsDeletingAccount(true)
    
    try {
      const result = await deleteAccountAction()
      
      if (result.success) {
        toast.success('Account deleted successfully')
        // Redirect to homepage or sign-in
        window.location.href = '/'
      } else {
        toast.error(result.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeletingAccount(false)
    }
  }, [])

  // Use the variables to avoid unused warnings
  void isDeletingAccount
  void handleDeleteAccount

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <CompactCard padding="sm" className="border-l-4 border-l-yellow-500/50">
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-yellow-500/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Security Status</h4>
              <p className="text-xs text-muted-foreground">
                Basic protection • 2FA recommended
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">Needs Improvement</Badge>
        </div>
      </CompactCard>

      {/* Account Information */}
      <SettingsSection
        title="Account Information"
        description="Your account details and verification status"
        compact
      >
              <div className="space-y-1">
          <SettingsRow
            label="Email Address"
            value={userEmail}
            badge={<Badge variant="secondary" className="text-xs">Verified</Badge>}
            compact
          />
          
          <SettingsRow
            label="Account Status"
            value="Active"
            description="Account is in good standing"
            badge={
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Active</span>
              </div>
            }
            compact
          />
          
          <SettingsRow
            label="Account Type"
            value="Personal"
            description="Individual user account"
            compact
          />
            </div>
      </SettingsSection>

      {/* Authentication & Security */}
      <SettingsSection
        title="Authentication & Security"
        description="Login credentials and security features"
        compact
        action={
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Basic</span>
          </div>
        }
      >
              <div className="space-y-1">
          <SettingsRow
            label="Password"
            description="Last updated: 30 days ago"
            badge={<Badge variant="outline" className="text-xs">Coming Soon</Badge>}
            action={
              <div className="flex items-center gap-1">
                <Key className="h-3 w-3 text-muted-foreground" />
                </div>
            }
            compact
            disabled
          />
          
          <SettingsRow
            label="Two-Factor Authentication"
            description="Add extra security to your account"
            badge={<Badge variant="outline" className="text-xs">Not Enabled</Badge>}
            action={
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3 text-muted-foreground" />
              </div>
            }
            compact
            disabled
          />
          
          <SettingsRow
            label="Login Sessions"
            description="1 active session (current device)"
            badge={<Badge variant="secondary" className="text-xs">1 Active</Badge>}
            action={
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
            }
            compact
            disabled
          />
            </div>
      </SettingsSection>

      {/* Coming Soon Notice */}
      <CompactCard padding="sm" className="bg-muted/50">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">Security Features</h4>
            <p className="text-xs text-muted-foreground">
              Password management, two-factor authentication, and session management will be available in a future update.
            </p>
          </div>
            </div>
      </CompactCard>

      {/* Current Session Details */}
      <SettingsSection
        title="Current Session"
        description="Your active login session information"
        compact
      >
        <CompactCard padding="sm" className="bg-green-500/5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Web Browser</span>
                <Badge variant="secondary" className="text-xs">Current</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Active now • This device</p>
            </div>
          </div>
        </CompactCard>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        description="Permanent and irreversible account actions"
        compact
        action={
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-destructive">Dangerous</span>
          </div>
        }
      >
        <CompactCard padding="sm" className="border-destructive/50 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                <h4 className="text-sm font-medium text-destructive">Delete Account</h4>
                <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>

            <AccountDeleteActions 
              deleteAction={deleteAccountAction}
              onUpdate={onUpdate}
            />
          </div>
        </CompactCard>
      </SettingsSection>
    </div>
  )
}

AccountSettings.displayName = 'AccountSettings' 