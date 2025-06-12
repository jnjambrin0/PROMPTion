'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateFormLayout } from '@/components/ui/create-form-layout'
import { FieldGroup } from '@/components/ui/field-group'
import { SlugInput } from '@/components/ui/slug-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createWorkspaceAction, validateWorkspaceSlug } from '@/lib/actions/workspace'
import type { CreateWorkspaceInput } from '@/lib/validation-schemas'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

export function CreateWorkspaceForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<CreateWorkspaceInput>({
    name: '',
    slug: '',
    description: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSlugValid, setIsSlugValid] = useState(true)
  const [isCustomSlug, setIsCustomSlug] = useState(false)

  // Auto-generate slug from name unless user has customized it
  useEffect(() => {
    if (!isCustomSlug && formData.name) {
      const generatedSlug = generateSlug(formData.name)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, isCustomSlug])

  const isFormValid = formData.name.length >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) return

    startTransition(async () => {
      const result = await createWorkspaceAction(formData)
      
      if (result.success && result.workspaceSlug) {
        router.push(`/dashboard/${result.workspaceSlug}`)
      } else {
        setErrors({ name: result.error || 'Error creating workspace' })
      }
    })
  }

  const handleSlugValidation = (isValid: boolean, error?: string) => {
    setIsSlugValid(isValid)
    if (error) {
      setErrors(prev => ({ ...prev, slug: error }))
    } else {
      setErrors(prev => ({ ...prev, slug: '' }))
    }
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
      >
        {isPending ? 'Creating...' : 'Create workspace'}
      </Button>
    </div>
  )

  return (
    <CreateFormLayout
      title="Create workspace"
      subtitle="A workspace is a shared environment where your team can collaborate on prompts and AI content."
      backHref="/dashboard"
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <FieldGroup
          title="Basic information"
          description="Give your workspace a name that your team will recognize."
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Workspace name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My Team Workspace"
              className={errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A workspace for our AI prompts and templates..."
              rows={3}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {formData.description?.length || 0}/200 characters
            </p>
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
            baseUrl="promption.com"
            onValidation={handleSlugValidation}
            validateSlug={validateWorkspaceSlug}
            placeholder="my-team-workspace"
          />
        </FieldGroup>
      </form>
    </CreateFormLayout>
  )
} 