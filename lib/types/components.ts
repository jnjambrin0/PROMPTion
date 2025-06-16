import { ReactNode } from 'react'

// Base Component Interfaces
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Dialog Component Types
export interface DialogProps extends BaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

// Form Component Types
export interface FormFieldProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export interface FormProps extends BaseProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isLoading?: boolean
  initialData?: Record<string, unknown>
}

// Table Component Types
export interface TableColumn<T = unknown> {
  key: string
  header: string
  render?: (value: unknown, row: T) => ReactNode
  sortable?: boolean
  width?: string
}

export interface TableProps<T = unknown> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onChange: (page: number) => void
  }
  onRowClick?: (row: T) => void
}

// Modal Component Types
export interface ModalProps extends BaseProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  showCloseButton?: boolean
}

// Input Component Types
export interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
}

export interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  rows?: number
  required?: boolean
}

// Select Component Types
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
}

// Button Component Types
export interface ButtonProps extends BaseProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Card Component Types
export interface CardProps extends BaseProps {
  title?: string
  description?: string
  footer?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Notification Component Types
export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

// Loading Component Types
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary'
  text?: string
}

// Avatar Component Types
export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

// Badge Component Types
export interface BadgeProps extends BaseProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

// Dropdown Component Types
export interface DropdownItem {
  key: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  onClick: () => void
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
}

// Tabs Component Types
export interface TabItem {
  key: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

// Search Component Types
export interface SearchProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  showButton?: boolean
  loading?: boolean
}

// Pagination Component Types
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  siblingCount?: number
} 