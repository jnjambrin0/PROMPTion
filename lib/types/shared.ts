// Shared type definitions with specific, meaningful types instead of generic unknowns

// ============================================================================
// API AND DATABASE TYPES
// ============================================================================

export type ApiResponse<T = never> = {
  success: boolean
  data?: T
  error?: string
}

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

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

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateWorkspaceFormData {
  name: string
  description?: string
  slug?: string
}

export interface CreatePromptFormData {
  title: string
  description?: string
  categoryId?: string
  isTemplate?: boolean
  isPublic?: boolean
}

export interface CreateCategoryFormData {
  name: string
  description?: string
  icon?: string
  color?: string
  parentId?: string
}

export interface ProfileFormData {
  username?: string
  fullName?: string
  bio?: string
  avatarUrl?: string
}

// ============================================================================
// USER TYPES
// ============================================================================

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

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface DetailedError extends Error {
  code?: string
  details?: { [key: string]: string | number | boolean }
  statusCode?: number
}

export type ErrorHandler = (error: Error | DetailedError) => void | Promise<void>

// ============================================================================
// BLOCK CONTENT TYPES
// ============================================================================

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

// Unified Block type that works across all components
export interface Block {
  id: string
  type: 'TEXT' | 'HEADING' | 'PROMPT' | 'CODE' | 'VARIABLE' | 'DIVIDER' | 'TOGGLE' | 'CALLOUT' | 'QUOTE' | 'BULLET_LIST' | 'NUMBERED_LIST' | 'TODO' | 'IMAGE' | 'VIDEO' | 'FILE' | 'EMBED' | 'TABLE' | 'MARKDOWN'
  position: number
  content: BlockContentData
  createdAt?: Date
  indentLevel?: number
}

// Database Block type (from Prisma) for conversion functions
export interface DatabaseBlock {
  id: string
  type: string
  content: JsonValue
  position: number
  indentLevel: number
  createdAt: Date
}

// Conversion helper type
export interface PromptBlockUpdate {
  id: string
  type: string
  content: BlockContentData
  position: number
}

// ============================================================================
// AI MODEL CONFIGURATION
// ============================================================================

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

// ============================================================================
// SERVICE AND ACTION TYPES
// ============================================================================

export interface ServiceResponse<T = never> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ActionResult<T = never> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type AsyncAction<TInput = void, TOutput = void> = (input: TInput) => Promise<ActionResult<TOutput>>

// ============================================================================
// CATEGORY TYPES
// ============================================================================

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function to safely convert unknown Prisma JsonValue to BlockContentData
export function convertToBlockContentData(content: JsonValue): BlockContentData {
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return {}
  }
  
  const obj = content as { [key: string]: JsonValue }
  
  return {
    text: typeof obj.text === 'string' ? obj.text : undefined,
    level: typeof obj.level === 'number' ? obj.level : undefined,
    language: typeof obj.language === 'string' ? obj.language : undefined,
    variable: obj.variable && typeof obj.variable === 'object' ? obj.variable as unknown as BlockVariable : undefined
  }
}

// Helper function to convert database blocks to unified Block type
export function convertDatabaseBlockToBlock(dbBlock: DatabaseBlock): Block {
  return {
    id: dbBlock.id,
    type: dbBlock.type as Block['type'],
    position: dbBlock.position,
    content: convertToBlockContentData(dbBlock.content),
    createdAt: dbBlock.createdAt,
    indentLevel: dbBlock.indentLevel || 0
  }
}

// Helper function to convert unified Block to PromptBlockUpdate for actions
export function convertBlockToPromptBlockUpdate(block: Block): PromptBlockUpdate {
  return {
    id: block.id,
    type: block.type,
    content: block.content,
    position: block.position
  }
}