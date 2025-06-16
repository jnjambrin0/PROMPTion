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