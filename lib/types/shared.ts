// Shared type definitions to replace 'any' types across the codebase

export type DatabaseRecord = Record<string, unknown>
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}
export type FormData = Record<string, unknown>
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
export type ModelConfig = Record<string, unknown>
export type BlockContent = Record<string, unknown>
export type QueryParams = Record<string, unknown>
export type ComponentProps = Record<string, unknown>
export type EventHandler = (...args: unknown[]) => void | Promise<void>
export type ValidationResult = {
  isValid: boolean
  error?: string
}
export type PaginationParams = {
  page?: number
  limit?: number
  offset?: number
}
export type SortParams = {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
export type FilterParams = Record<string, unknown>

// User types for auth and actions
export interface AuthenticatedUser {
  id: string
  email: string
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
  authId: string
  emailVerified: boolean
  isActive: boolean
  lastActiveAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// Error handling types
export interface DetailedError extends Error {
  code?: string
  details?: Record<string, unknown>
  statusCode?: number
}

export type ErrorHandler = (error: unknown) => void | Promise<void>

// Block content types for prompt editor
export interface BlockVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string
  options?: string[]
}

export interface BlockContentData {
  text?: string
  level?: number
  language?: string
  variable?: BlockVariable
}

// Form handling types
export interface FormSubmitEvent extends Event {
  target: HTMLFormElement
}

export type FormFieldValue = string | number | boolean | null | undefined

// API and service types
export interface ServiceResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
}

// Configuration types
export interface AIModelConfig {
  model: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface WorkspaceConfig {
  defaultModel?: string
  allowPublicPrompts?: boolean
  requireApproval?: boolean
  enableCollaborations?: boolean
  features?: string[]
}

// Generic data transformation types
export type DataTransformer<T, U> = (input: T) => U
export type AsyncDataTransformer<T, U> = (input: T) => Promise<U>

// Event and action types
export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type AsyncAction<T = unknown> = (...args: unknown[]) => Promise<ActionResult<T>>

// Category and workspace types
export interface CategoryData {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
  promptCount?: number
  childrenCount?: number
}