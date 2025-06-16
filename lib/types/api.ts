// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// Form Types
export interface FormState<T = unknown> {
  data: T | null;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormData {
  [key: string]: string | number | boolean | File | null | undefined;
}

// Event Handler Types
export interface ChangeEvent {
  target: {
    name: string;
    value: string | number | boolean;
  };
}

export interface SubmitEvent {
  preventDefault: () => void;
}

// Database Record Types
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

// User Context Types
export interface UserContextData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

// Request Types
export interface RequestParams {
  [key: string]: string | string[] | undefined;
}

export interface SearchParams {
  q?: string;
  page?: string;
  limit?: string;
  sort?: string;
  filter?: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps extends BaseComponentProps {
  onSubmit?: (data: FormData) => void | Promise<void>;
  initialData?: FormData;
  isLoading?: boolean;
}

// Notification Types
export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

// Template Types
export interface TemplateMetadata {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  author?: string;
  version?: string;
}

// Category Types
export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  slug: string;
}

// Member Types
export interface MemberData {
  id: string;
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_by?: string;
  joined_at?: string;
  permissions?: string[];
}

// Activity Types
export interface ActivityData {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// Statistics Types
export interface StatsData {
  total: number;
  active: number;
  recent: number;
  growth?: number;
}

// Pagination Types
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filter Types
export interface FilterOptions {
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
} 