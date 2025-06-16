'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateFormLayout } from '@/components/ui/create-form-layout'
import { FieldGroup } from '@/components/ui/field-group'
import { SlugInput } from '@/components/ui/slug-input'
import { IconPicker } from '@/components/ui/icon-picker'
import { ColorPicker } from '@/components/ui/color-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  createCategorySchema, 
  type CreateCategoryInput, 
  getFieldError 
} from '@/lib/validation-schemas'
import type { z } from 'zod'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

interface CreateCollectionFormProps {
  defaultWorkspaceId?: string
}

export function CreateCollectionForm({ defaultWorkspaceId }: CreateCollectionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    slug: '',
    description: '',
    workspaceId: defaultWorkspaceId || '',
    parentId: undefined,
    icon: '📁',
    color: 'gray'
  })
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  // const [isSlugValid] = useState(true)
  const [isCustomSlug, setIsCustomSlug] = useState(false)

  // Auto-generate slug from name unless user has customized it
  useEffect(() => {
    if (!isCustomSlug && formData.name) {
      const generatedSlug = generateSlug(formData.name)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, isCustomSlug])

  const validateForm = useCallback(() => {
    const result = createCategorySchema.safeParse(formData)
    setErrors(result.error || null)
    return result.success
  }, [formData])

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const result = createCategorySchema.safeParse(formData)
    setErrors(result.error || null)
    setIsFormValid(result.success)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    startTransition(async () => {
      try {
        // Here would go the actual API call
        // await createCategory(formData)
        router.push(`/dashboard`)
      } catch (error) {
        console.error('Failed to create collection:', error)
      }
    })
  }

  const handleSlugValidation = (isValid: boolean) => {
    console.log('Slug validation:', isValid)
  }

  const getError = (field: keyof CreateCategoryInput) => {
    return errors ? getFieldError(errors, field) : undefined
  }

  const actions = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className={isPending ? 'button-disabled' : ''}
      >
        {isPending ? 'Creating...' : 'Create collection'}
      </Button>
    </div>
  )

  return (
    <CreateFormLayout
      title="Create collection"
      subtitle="Organize your prompts into collections for better management and discovery."
      backHref="/dashboard"
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <FieldGroup
          title="Basic information"
          description="Give your collection a name that clearly describes what prompts it contains."
        >
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-1">
              <IconPicker
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ColorPicker
                value={formData.color}
                onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
            </div>
            
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Collection name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Blog Writing"
                  className={getError('name') ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                />
                {getError('name') && (
                  <p className="text-sm text-red-600">{getError('name')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || undefined }))}
                  placeholder="Prompts for creating various types of blog content..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  {formData.description?.length || 0}/200 characters
                </p>
                {getError('description') && (
                  <p className="text-sm text-red-600">{getError('description')}</p>
                )}
              </div>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Organization"
          description="Choose which workspace this collection belongs to and its hierarchy."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspace">
                Workspace <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.workspaceId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, workspaceId: value }))}
              >
                <SelectTrigger className={getError('workspaceId') ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select workspace..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temp">Personal Workspace</SelectItem>
                </SelectContent>
              </Select>
              {getError('workspaceId') && (
                <p className="text-sm text-red-600">{getError('workspaceId')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent collection (optional)</Label>
              <Select 
                value={formData.parentId || 'none'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === 'none' ? undefined : value }))}
                disabled={!formData.workspaceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top level)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Create sub-collections by selecting a parent collection
              </p>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Preview"
          description="See how your collection will appear in the interface."
        >
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-25">
            <div className="flex items-center gap-3">
              <span className="text-lg">{formData.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {formData.name || 'Collection name'}
                  </h3>
                  <div 
                    className="h-4 w-4 rounded-full"
                    style={{ 
                      backgroundColor: {
                        gray: '#f9fafb',
                        blue: '#f0f9ff',
                        green: '#dcfce7',
                        yellow: '#fffbeb',
                        red: '#fef2f2',
                        purple: '#faf5ff',
                        pink: '#fdf2f8',
                        indigo: '#f0f9ff'
                      }[formData.color || 'gray'] || '#f9fafb',
                      borderWidth: '1px',
                      borderColor: {
                        gray: '#d1d5db',
                        blue: '#bae6fd',
                        green: '#86efac',
                        yellow: '#fcd34d',
                        red: '#fca5a5',
                        purple: '#c084fc',
                        pink: '#e879f9',
                        indigo: '#93c5fd'
                      }[formData.color || 'gray'] || '#d1d5db'
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Collection description will appear here'}
                </p>
              </div>
              <span className="text-sm text-gray-500">0 prompts</span>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup
          title="Advanced options"
          description="Customize URL slug and other advanced settings."
          isAdvanced={true}
          isLast={true}
        >
          <SlugInput
            value={formData.slug || ''}
            onChange={(slug) => {
              setFormData(prev => ({ ...prev, slug }))
              setIsCustomSlug(true)
            }}
            title={formData.name}
            baseUrl="workspace/collections"
            onValidation={handleSlugValidation}
            placeholder="blog-writing"
          />
        </FieldGroup>
      </form>
    </CreateFormLayout>
  )
} 