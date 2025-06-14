import React from 'react'
import { CreateFormLayout } from './create-form-layout'
import { FieldGroup } from './field-group'
import { SlugInput } from './slug-input'
import { IconPicker } from './icon-picker'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Switch } from './switch'
import { Badge } from './badge'

// ==================== TYPES ====================

interface BaseFormProps {
  title: string
  subtitle: string
  backHref: string
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isSubmitting: boolean
  canSubmit: boolean
  submitLabel?: string
  children: React.ReactNode
}

interface FormFieldProps {
  label: string
  name: string
  required?: boolean
  error?: string
  children: React.ReactNode
  description?: string
}

interface SlugFieldProps {
  value: string
  onChange: (value: string) => void
  title: string
  baseUrl?: string
  isCustomSlug: boolean
  onValidation?: (isValid: boolean, error?: string) => void
  validateSlug?: (slug: string) => Promise<boolean>
  error?: string
}

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  loading?: boolean
}

// ==================== COMPONENTS ====================

export function BaseForm({
  title,
  subtitle,
  backHref,
  onSubmit,
  onCancel,
  isSubmitting,
  canSubmit,
  submitLabel = 'Create',
  children
}: BaseFormProps) {
  const actions = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="min-w-[140px]"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{submitLabel.includes('Create') ? 'Creating...' : 'Saving...'}</span>
          </div>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  )

  return (
    <CreateFormLayout
      title={title}
      subtitle={subtitle}
      backHref={backHref}
      actions={actions}
    >
      <form onSubmit={onSubmit} className="mb-4">
        {children}
      </form>
    </CreateFormLayout>
  )
}

export function FormField({
  label,
  name,
  required = false,
  error,
  children,
  description
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {description && !error && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}

export function SlugField({
  value,
  onChange,
  title,
  baseUrl,
  isCustomSlug,
  onValidation,
  validateSlug,
  error
}: SlugFieldProps) {
  return (
    <FieldGroup
      title="Advanced options"
      description="Customize URL slug and other advanced settings."
      isAdvanced={true}
      isLast={true}
    >
      <SlugInput
        value={value}
        onChange={(slug) => onChange(slug)}
        title={title}
        baseUrl={baseUrl}
        onValidation={onValidation}
        validateSlug={validateSlug}
        placeholder="my-custom-slug"
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </FieldGroup>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  required = false,
  error,
  loading = false
}: SelectFieldProps) {
  return (
    <FormField label={label} name={label.toLowerCase()} required={required} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-300' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>Loading...</SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </FormField>
  )
}

interface BasicInfoFieldsProps {
  icon: string
  onIconChange: (icon: string) => void
  title: string
  onTitleChange: (title: string) => void
  description: string
  onDescriptionChange: (description: string) => void
  titleError?: string
  descriptionError?: string
  maxDescriptionLength?: number
}

export function BasicInfoFields({
  icon,
  onIconChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  titleError,
  descriptionError,
  maxDescriptionLength = 500
}: BasicInfoFieldsProps) {
  return (
    <FieldGroup
      title="Basic information"
      description="Give your item a clear title and comprehensive description."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <IconPicker
            value={icon}
            onChange={onIconChange}
            placeholder="🎯"
          />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <FormField label="Title" name="title" required error={titleError}>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter a descriptive title..."
              className={titleError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
            />
          </FormField>

          <FormField 
            label="Description" 
            name="description" 
            required 
            error={descriptionError}
            description={`${description.length}/${maxDescriptionLength} characters`}
          >
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Provide a detailed description..."
              rows={4}
              className="resize-none"
            />
          </FormField>
        </div>
      </div>
    </FieldGroup>
  )
}

interface VisibilityFieldsProps {
  isPublic: boolean
  onPublicChange: (isPublic: boolean) => void
  isTemplate?: boolean
  onTemplateChange?: (isTemplate: boolean) => void
  showTemplateOption?: boolean
  publicLabel?: string
  publicDescription?: string
}

export function VisibilityFields({
  isPublic,
  onPublicChange,
  isTemplate,
  onTemplateChange,
  showTemplateOption = false,
  publicLabel = "Public",
  publicDescription = "Make this discoverable in the community library"
}: VisibilityFieldsProps) {
  return (
    <FieldGroup
      title="Visibility & sharing"
      description="Control who can discover and use your content."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium text-gray-900">{publicLabel}</h4>
            <p className="text-sm text-gray-600">{publicDescription}</p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={onPublicChange}
          />
        </div>

        {showTemplateOption && (
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium text-gray-900">Save as template</h4>
              <p className="text-sm text-gray-600">
                Allow others to use this as a starting point
              </p>
            </div>
            <Switch
              checked={isTemplate}
              onCheckedChange={onTemplateChange}
            />
          </div>
        )}

        {isPublic && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-medium text-blue-900">Community Guidelines</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Provide clear descriptions and examples</p>
                  <p>• Use appropriate categories and tags</p>
                  <p>• Follow community guidelines</p>
                  <p>• Include usage instructions if needed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FieldGroup>
  )
}

interface PreviewFieldProps {
  icon: string
  title: string
  description: string
  badges?: Array<{ label: string; variant: 'outline' | 'secondary' }>
  stats?: Array<{ label: string; value: string | number }>
}

export function PreviewField({
  icon,
  title,
  description,
  badges = [],
  stats = [
    { label: '0 uses', value: '' },
    { label: '0 favorites', value: '' },
    { label: 'Just created', value: '' }
  ]
}: PreviewFieldProps) {
  return (
    <FieldGroup
      title="Preview"
      description="See how your content will appear in the library."
    >
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-25">
        <div className="flex items-start gap-4">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                {title || 'Item title'}
              </h3>
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant} className="text-xs capitalize">
                  {badge.label}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {description || 'Description will appear here...'}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <span>{stat.label}</span>
                  {index < stats.length - 1 && <span>•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FieldGroup>
  )
} 