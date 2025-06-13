'use client'

import React from 'react'
import { Globe, Lock, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PromptSettingsData } from '@/lib/actions/prompt-settings'

interface GeneralSettingsProps {
  settings: PromptSettingsData
  categories: Array<{
    id: string
    name: string
    color: string | null
    icon: string | null
  }>
  isOwner: boolean
  canEdit: boolean
  onUpdate: (updates: Partial<PromptSettingsData>) => void
}

// ✅ Client Component optimizado - memoizado para prevenir re-renders
export const GeneralSettings = React.memo(({ 
  settings, 
  categories,
  isOwner,
  canEdit,
  onUpdate 
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update the basic details of your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter prompt title"
              disabled={!canEdit}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value || null })}
              placeholder="Describe what this prompt does"
              rows={3}
              className="resize-none"
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={settings.categoryId || ''} 
              onValueChange={(value) => onUpdate({ categoryId: value === 'none' ? null : value })}
              disabled={!canEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility & Access</CardTitle>
          <CardDescription>
            Control who can see and use your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="public">Public</Label>
              </div>
              <p className="text-xs text-#6b7280">
                Allow anyone to view and use this prompt
              </p>
            </div>
            <Switch
              id="public"
              checked={settings.isPublic}
              onCheckedChange={(checked) => onUpdate({ isPublic: checked })}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-#6b7280" />
                <Label htmlFor="template">Template</Label>
              </div>
              <p className="text-xs text-#6b7280">
                Make available in the template library
              </p>
            </div>
            <Switch
              id="template"
              checked={settings.isTemplate}
              onCheckedChange={(checked) => onUpdate({ isTemplate: checked })}
              disabled={!canEdit}
            />
          </div>

          {isOwner && (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-#6b7280" />
                  <Label htmlFor="pinned">Pinned</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pin to the top of your workspace
                </p>
              </div>
              <Switch
                id="pinned"
                checked={settings.isPinned}
                onCheckedChange={(checked) => onUpdate({ isPinned: checked })}
                disabled={!canEdit}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

GeneralSettings.displayName = 'GeneralSettings' 