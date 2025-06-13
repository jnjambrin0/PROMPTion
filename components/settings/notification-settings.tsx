'use client'

import React, { useState, useCallback } from 'react'
import { Bell, Mail, Smartphone, Save, Users, Settings, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { updateNotificationPreferencesAction, type NotificationPreferences } from '@/lib/actions/user-settings'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'
import { NotificationForm } from './forms/notification-form'
import { Badge } from '@/components/ui/badge'

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onUpdate: () => void
}

function getNotificationStatusBadge(preferences: NotificationPreferences) {
  const totalEnabled = Object.values(preferences).filter(Boolean).length
  const totalSettings = Object.keys(preferences).length
  
  if (totalEnabled === 0) {
    return { text: 'All Disabled', variant: 'destructive' as const }
  }
  if (totalEnabled === totalSettings) {
    return { text: 'All Enabled', variant: 'default' as const }
  }
  return { text: `${totalEnabled}/${totalSettings} Enabled`, variant: 'secondary' as const }
}

export function NotificationSettings({ preferences, onUpdate }: NotificationSettingsProps) {
  const statusBadge = getNotificationStatusBadge(preferences)

  return (
    <div className="space-y-6">
      {/* Notification Status Overview */}
      <CompactCard padding="sm" className="border-l-4 border-l-blue-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Notification Preferences</h4>
              <p className="text-xs text-muted-foreground">
                Email and system notification settings
              </p>
            </div>
          </div>
          <Badge variant={statusBadge.variant} className="text-xs">
            {statusBadge.text}
          </Badge>
        </div>
      </CompactCard>

      {/* Quick Overview */}
      <SettingsSection
        title="Current Settings"
        description="Quick view of your notification preferences"
        compact
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <SettingsRow
            label="Comments"
            badge={
              preferences.comments ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            compact
          />
          
          <SettingsRow
            label="Mentions"
            badge={
              preferences.mentions ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            compact
          />
          
          <SettingsRow
            label="Weekly Digest"
            badge={
              preferences.weeklyDigest ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            compact
          />
          
          <SettingsRow
            label="Push Notifications"
            badge={
              preferences.pushNotifications ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            compact
          />
        </div>
      </SettingsSection>

      {/* Email Notifications */}
      <SettingsSection
        title="Email Notifications"
        description="Receive email notifications for activities"
        compact
        action={
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Email</span>
          </div>
        }
      >
        <NotificationForm 
          preferences={preferences}
          onUpdate={onUpdate}
          updateAction={updateNotificationPreferencesAction}
          category="email"
        />
      </SettingsSection>

      {/* Workspace Notifications */}
      <SettingsSection
        title="Workspace Activities"
        description="Notifications for workspace-related events"
        compact
        action={
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Team</span>
          </div>
        }
      >
        <NotificationForm 
          preferences={preferences}
          onUpdate={onUpdate}
          updateAction={updateNotificationPreferencesAction}
          category="workspace"
        />
      </SettingsSection>

      {/* System Notifications */}
      <SettingsSection
        title="System Notifications"
        description="Platform updates and system messages"
        compact
        action={
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">System</span>
          </div>
        }
      >
        <NotificationForm 
          preferences={preferences}
          onUpdate={onUpdate}
          updateAction={updateNotificationPreferencesAction}
          category="system"
        />
      </SettingsSection>

      {/* Summary Card */}
      <CompactCard padding="sm" className="bg-muted/50">
        <div className="flex items-start gap-2">
          <Bell className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">Notification Delivery</h4>
            <p className="text-xs text-muted-foreground">
              Notifications are delivered via email to your registered address. 
              Push notifications will be available in a future update.
            </p>
          </div>
        </div>
      </CompactCard>
    </div>
  )
}

NotificationSettings.displayName = 'NotificationSettings' 