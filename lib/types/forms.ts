// Form types for creation screens
export interface CreateWorkspaceData {
  name: string
  slug?: string
  description?: string
  logoUrl?: string
}

export interface CreatePromptData {
  title: string
  slug?: string
  description?: string
  workspaceId: string
  categoryId?: string
  isTemplate?: boolean
  isPublic?: boolean
  icon?: string
}

export interface CreateCategoryData {
  name: string
  slug?: string
  description?: string
  workspaceId: string
  parentId?: string
  icon?: string
  color?: string
}

export interface CreateTemplateData {
  title: string
  slug?: string
  description?: string
  workspaceId: string
  categoryId?: string
  isPublic?: boolean
  icon?: string
  templateType?: 'prompt' | 'workflow' | 'agent'
}

// Form step interface for progressive disclosure
export interface FormStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  isCompleted: boolean
  isActive: boolean
}

// Form validation states
export interface FieldValidation {
  isValid: boolean
  error?: string
  isChecking?: boolean
}

// Shared form state
export interface FormState {
  isSubmitting: boolean
  errors: Record<string, string>
  isValid: boolean
}

// Available icons for entities
export const ENTITY_ICONS = [
  '📝', '🎯', '🚀', '💡', '⚡', '🔥', '✨', '🎨', '🧠', '🔧',
  '📊', '📈', '🎪', '🎭', '🎵', '🎲', '🎯', '🎨', '🎪', '🎭',
  '📁', '📂', '📚', '📋', '📌', '📍', '📎', '📏', '📐', '📑',
  '⭐', '🌟', '💫', '✨', '🔥', '💥', '🎆', '🎇', '🌈', '☀️'
] as const

export type EntityIcon = typeof ENTITY_ICONS[number]

// Color options for categories
export const CATEGORY_COLORS = [
  'gray', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo'
] as const

export type CategoryColor = typeof CATEGORY_COLORS[number] 