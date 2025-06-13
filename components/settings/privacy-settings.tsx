'use client'

import React, { useState, useCallback } from 'react'
import { Shield, Eye, EyeOff, Globe, Users, Lock, Save, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { updatePrivacySettingsAction, type PrivacySettings as PrivacySettingsType } from '@/lib/actions/user-settings'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'
import { PrivacyForm } from './forms/privacy-form'
import { Badge } from '@/components/ui/badge'

interface PrivacySettingsProps {
  settings: PrivacySettingsType
  onUpdate: () => void
}

function getVisibilityInfo(visibility: string) {
  switch (visibility) {
    case 'public':
      return { icon: Globe, label: 'Public', description: 'Anyone can see your profile', variant: 'default' as const, color: 'text-blue-600' }
    case 'workspace_only':
      return { icon: Users, label: 'Workspace Only', description: 'Only workspace members can see', variant: 'secondary' as const, color: 'text-yellow-600' }
    case 'private':
      return { icon: Lock, label: 'Private', description: 'Only you can see your profile', variant: 'outline' as const, color: 'text-green-600' }
    default:
      return { icon: Shield, label: 'Unknown', description: 'Unknown visibility setting', variant: 'destructive' as const, color: 'text-gray-600' }
      }
}

export function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps) {
  const visibilityInfo = getVisibilityInfo(settings.profileVisibility)
  const VisibilityIcon = visibilityInfo.icon

  return (
    <div className="space-y-6">
      {/* Privacy Status Overview */}
      <CompactCard padding="sm" className="border-l-4 border-l-purple-500/50">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
        <div>
              <h4 className="font-medium text-foreground text-sm">Privacy & Visibility</h4>
              <p className="text-xs text-muted-foreground">
                Control your profile and data privacy
          </p>
            </div>
          </div>
          <Badge variant={visibilityInfo.variant} className="text-xs">
            {visibilityInfo.label}
          </Badge>
        </div>
      </CompactCard>

      {/* Current Privacy Overview */}
      <SettingsSection
        title="Current Settings"
        description="Quick view of your privacy configuration"
        compact
      >
        <div className="space-y-1">
          <SettingsRow
            label="Profile Visibility"
            value={visibilityInfo.label}
            description={visibilityInfo.description}
            badge={<VisibilityIcon className={`h-3 w-3 ${visibilityInfo.color}`} />}
            compact
          />
          
          <SettingsRow
            label="Show Email Address"
            badge={
              settings.showEmail ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            value={settings.showEmail ? "Visible" : "Hidden"}
            compact
          />
          
          <SettingsRow
            label="Show Activity"
            badge={
              settings.showActivity ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            value={settings.showActivity ? "Visible" : "Hidden"}
            compact
          />
          
          <SettingsRow
            label="Allow Discovery"
            badge={
              settings.allowDiscovery ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
            ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
              )
            }
            value={settings.allowDiscovery ? "Enabled" : "Disabled"}
            compact
          />
        </div>
      </SettingsSection>

      {/* Profile Visibility */}
      <SettingsSection
        title="Profile Visibility"
        description="Control who can see your profile and information"
        compact
        action={
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Visibility</span>
          </div>
        }
      >
        <PrivacyForm 
          settings={settings}
          onUpdate={onUpdate}
          updateAction={updatePrivacySettingsAction}
          category="visibility"
        />
      </SettingsSection>

      {/* Discovery Settings */}
      <SettingsSection
        title="Discovery & Searchability"
        description="Control how others can find and interact with you"
        compact
        action={
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Discovery</span>
          </div>
        }
      >
        <PrivacyForm 
          settings={settings}
          onUpdate={onUpdate}
          updateAction={updatePrivacySettingsAction}
          category="discovery"
        />
      </SettingsSection>

      {/* Data Privacy */}
      <SettingsSection
        title="Data Privacy"
        description="Information sharing and data collection preferences"
        compact
        action={
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Data</span>
          </div>
        }
      >
        <PrivacyForm 
          settings={settings}
          onUpdate={onUpdate}
          updateAction={updatePrivacySettingsAction}
          category="data"
        />
      </SettingsSection>

      {/* Privacy Notice */}
      <CompactCard padding="sm" className="bg-muted/50">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">Data Protection</h4>
            <p className="text-xs text-muted-foreground">
              Your privacy settings are applied immediately. We respect your choices about data sharing 
              and visibility. Advanced privacy controls will be available in future updates.
                </p>
          </div>
                </div>
      </CompactCard>
    </div>
  )
}

PrivacySettings.displayName = 'PrivacySettings' 