'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Trash2, Edit2, Check, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ColorBadge } from '@/components/ui/color-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants/categories'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  description: string | null
  icon: string
  color: string
  promptCount: number
  isDefault?: boolean
}

interface BulkActionsDialogProps {
  categories: Category[]
  workspaceSlug: string
  trigger?: React.ReactNode
}

interface BulkUpdateData {
  description?: string
  color?: string
  icon?: string
}

export function BulkActionsDialog({ 
  categories, 
  workspaceSlug,
  trigger 
}: BulkActionsDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState<'select' | 'edit' | 'delete'>('select')
  
  // Bulk edit form data
  const [bulkUpdateData, setBulkUpdateData] = useState<BulkUpdateData>({})
  const [updateFields, setUpdateFields] = useState<Set<keyof BulkUpdateData>>(new Set())

  // Reset state when dialog opens/closes
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedCategories(new Set())
      setCurrentAction('select')
      setBulkUpdateData({})
      setUpdateFields(new Set())
    }
  }, [])

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(categoryId)
      } else {
        newSet.delete(categoryId)
      }
      return newSet
    })
  }, [])

  // Handle select all/none
  const handleSelectAll = useCallback(() => {
    // Seleccionar solo categorías que no son default
    const selectableCategories = categories.filter(cat => !cat.isDefault)
    setSelectedCategories(new Set(selectableCategories.map(cat => cat.id)))
  }, [categories])

  const handleSelectNone = useCallback(() => {
    setSelectedCategories(new Set())
  }, [])

  // Handle field update toggle
  const handleFieldToggle = useCallback((field: keyof BulkUpdateData, checked: boolean) => {
    setUpdateFields(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(field)
      } else {
        newSet.delete(field)
        // Clear the field value if unchecked
        setBulkUpdateData(prev => {
          const newData = { ...prev }
          delete newData[field]
          return newData
        })
      }
      return newSet
    })
  }, [])

  // Bulk update categories
  const handleBulkUpdate = useCallback(async () => {
    if (selectedCategories.size === 0 || updateFields.size === 0) {
      toast.error('Please select categories and fields to update')
      return
    }

    setIsLoading(true)
    try {
      const updateData = Object.fromEntries(
        Array.from(updateFields).map(field => [field, bulkUpdateData[field]])
      )

      const response = await fetch(`/api/workspaces/${workspaceSlug}/categories/bulk`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryIds: Array.from(selectedCategories),
          updates: updateData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update categories')
      }

      const result = await response.json()
      toast.success(`Updated ${result.updatedCount} categories successfully`)
      router.refresh()
      setIsOpen(false)
    } catch (error) {
      console.error('Bulk update error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update categories')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategories, updateFields, bulkUpdateData, workspaceSlug, router])

  // Bulk delete categories
  const handleBulkDelete = useCallback(async () => {
    if (selectedCategories.size === 0) {
      toast.error('Please select categories to delete')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/categories/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryIds: Array.from(selectedCategories)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete categories')
      }

      const result = await response.json()
      toast.success(`Deleted ${result.deletedCount} categories successfully`)
      router.refresh()
      setIsOpen(false)
    } catch (error) {
      console.error('Bulk delete error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete categories')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategories, workspaceSlug, router])

  const selectedCount = selectedCategories.size
  const selectableCategories = categories.filter(cat => !cat.isDefault)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bulk Actions
          </DialogTitle>
          <DialogDescription>
            Select multiple categories to edit or delete them at once
          </DialogDescription>
        </DialogHeader>

        {currentAction === 'select' && (
          <div className="space-y-4">
            {/* Selection Controls */}
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={selectableCategories.length === 0}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectNone}
                  disabled={selectedCount === 0}
                >
                  Select None
                </Button>
              </div>
              <Badge variant="outline">
                {selectedCount} of {selectableCategories.length} selected
              </Badge>
            </div>

            {/* Categories List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Categories</CardTitle>
                <CardDescription>
                  Choose which categories to apply bulk actions to. Default categories cannot be modified.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center gap-3 p-3 border-b border-border last:border-b-0 transition-colors cursor-pointer ${
                        category.isDefault 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        if (!category.isDefault) {
                          const isCurrentlySelected = selectedCategories.has(category.id)
                          handleCategorySelect(category.id, !isCurrentlySelected)
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedCategories.has(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategorySelect(category.id, checked as boolean)
                        }
                        disabled={category.isDefault}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                        <span className="text-sm">{category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{category.name}</p>
                          {category.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {category.description || 'No description'} • {category.promptCount} prompts
                        </p>
                      </div>
                      <ColorBadge color={category.color} size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentAction('edit')}
                disabled={selectedCount === 0}
                className="flex-1"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Selected ({selectedCount})
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentAction('delete')}
                disabled={selectedCount === 0}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCount})
              </Button>
            </div>
          </div>
        )}

        {currentAction === 'edit' && (
          <div className="space-y-4">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentAction('select')}
              className="w-fit"
            >
              ← Back to Selection
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bulk Edit {selectedCount} Categories</CardTitle>
                <CardDescription>
                  Select which fields to update for all selected categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="update-description"
                      checked={updateFields.has('description')}
                      onCheckedChange={(checked) => 
                        handleFieldToggle('description', checked as boolean)
                      }
                    />
                    <Label htmlFor="update-description" className="text-sm font-medium">
                      Update Description
                    </Label>
                  </div>
                  <Textarea
                    placeholder="New description for selected categories"
                    value={bulkUpdateData.description || ''}
                    onChange={(e) => setBulkUpdateData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!updateFields.has('description')}
                    className="min-h-[80px]"
                  />
                </div>

                <Separator />

                {/* Color Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="update-color"
                      checked={updateFields.has('color')}
                      onCheckedChange={(checked) => 
                        handleFieldToggle('color', checked as boolean)
                      }
                    />
                    <Label htmlFor="update-color" className="text-sm font-medium">
                      Update Color
                    </Label>
                  </div>
                  <Select
                    value={bulkUpdateData.color || ''}
                    onValueChange={(value) => setBulkUpdateData(prev => ({ ...prev, color: value }))}
                    disabled={!updateFields.has('color')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded-full border border-muted-foreground/20" 
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="capitalize">{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Icon Field */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="update-icon"
                      checked={updateFields.has('icon')}
                      onCheckedChange={(checked) => 
                        handleFieldToggle('icon', checked as boolean)
                      }
                    />
                    <Label htmlFor="update-icon" className="text-sm font-medium">
                      Update Icon
                    </Label>
                  </div>
                  <Select
                    value={bulkUpdateData.icon || ''}
                    onValueChange={(value) => setBulkUpdateData(prev => ({ ...prev, icon: value }))}
                    disabled={!updateFields.has('icon')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CATEGORY_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{icon}</span>
                            <span className="text-sm text-muted-foreground">Icon</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBulkUpdate}
                disabled={isLoading || updateFields.size === 0}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Updating...' : `Update ${selectedCount} Categories`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentAction('select')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {currentAction === 'delete' && (
          <div className="space-y-4">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setCurrentAction('select')}
              className="w-fit"
            >
              ← Back to Selection
            </Button>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-base text-destructive">
                  Delete {selectedCount} Categories
                </CardTitle>
                <CardDescription>
                  This action cannot be undone. All prompts in these categories will be moved to &quot;Uncategorized&quot;.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(selectedCategories).map(categoryId => {
                    const category = categories.find(cat => cat.id === categoryId)
                    return category ? (
                      <div key={categoryId} className="flex items-center gap-3 p-2 bg-muted rounded">
                        <div className="h-6 w-6 rounded bg-background flex items-center justify-center">
                          <span className="text-sm">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.promptCount} prompts will be uncategorized
                          </p>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Deleting...' : `Delete ${selectedCount} Categories`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentAction('select')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 