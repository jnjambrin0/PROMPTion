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

// Unified icons for all entities (prompts, categories, etc.)
export const ENTITY_ICONS = [
  '📝', '🎯', '🚀', '💡', '⚡', '🔥', '✨', '🎨', '🧠', '🔧',
  '📊', '📈', '🎪', '🎭', '🎵', '🎲', '📁', '📂', '📚', '📋',
  '📌', '📍', '📎', '📏', '📐', '📑', '⭐', '🌟', '💫', '💥',
  '🎆', '🎇', '🌈', '☀️', '📉', '🗂️', '🗃️', '🔖', '🏷️', '✅',
  '❌', '⚙️', '🛠️', '🔍', '🔎', '📤', '📥', '📦', '🗄️', '💼',
  '🖼️', '📷'
] as const

export type EntityIcon = typeof ENTITY_ICONS[number]

// Unified color options for categories
export const CATEGORY_COLORS = [
  { name: 'gray', value: 'gray', hex: '#6b7280' },
  { name: 'blue', value: 'blue', hex: '#3b82f6' },
  { name: 'green', value: 'green', hex: '#22c55e' },
  { name: 'yellow', value: 'yellow', hex: '#eab308' },
  { name: 'red', value: 'red', hex: '#ef4444' },
  { name: 'purple', value: 'purple', hex: '#a855f7' },
  { name: 'pink', value: 'pink', hex: '#ec4899' },
  { name: 'indigo', value: 'indigo', hex: '#6366f1' },
] as const

export type CategoryColor = typeof CATEGORY_COLORS[number]['value'] 