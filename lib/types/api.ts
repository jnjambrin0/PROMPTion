// API Response Types
export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError | string
  metadata?: PaginationMetadata
}

// Request/Response Bodies
export interface CategoryRequestBody {
  name: string
  description?: string
  color?: string
  icon?: string
  workspaceId: string
}

export interface PromptRequestBody {
  title: string
  content: string
  description?: string
  categoryId?: string
  workspaceId: string
  isPublic?: boolean
  tags?: string[]
}

export interface WorkspaceRequestBody {
  name: string
  description?: string
  slug: string
  visibility?: 'private' | 'public'
}

export interface MemberInviteBody {
  email: string
  role: 'ADMIN' | 'MEMBER' | 'VIEWER'
  workspaceId: string
}

// Form Data Types
export interface FormData {
  [key: string]: string | number | boolean | File | null | undefined
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Database Operation Results
export interface DatabaseResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

// Event Handler Types
export interface FormSubmitHandler {
  (data: FormData): Promise<ApiResponse>
}

export interface ClickHandler {
  (event: React.MouseEvent): void
}

export interface ChangeHandler {
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void
}

// Component Props Base Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface BaseFormProps extends BaseComponentProps {
  onSubmit?: FormSubmitHandler
  onCancel?: () => void
  isLoading?: boolean
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  author?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// File Upload Types
export interface FileUploadResult {
  url: string
  filename: string
  size: number
  type: string
}

export interface UploadProgress {
  percentage: number
  isUploading: boolean
  error?: string
} 