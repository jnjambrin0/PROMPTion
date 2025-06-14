import { useState, useTransition, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'

// ==================== TYPES ====================

interface UseFormOptions<T extends Record<string, any>> {
  initialData: T
  schema?: z.ZodSchema<T>
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string; redirectTo?: string }>
  generateSlug?: boolean
  slugField?: keyof T
  titleField?: keyof T
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}

interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
  hasInteracted: boolean
  isCustomSlug: boolean
}

// ==================== UTILITIES ====================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
    .trim()
}

export function getFieldError<T>(errors: z.ZodError | null, field: keyof T): string | undefined {
  if (!errors) return undefined
  const fieldError = errors.errors.find(error => error.path.includes(field as string))
  return fieldError?.message
}

// ==================== MAIN HOOK ====================

export function useForm<T extends Record<string, any>>({
  initialData,
  schema,
  onSubmit,
  generateSlug: shouldGenerateSlug = false,
  slugField = 'slug' as keyof T,
  titleField = 'title' as keyof T,
  onSuccess,
  onError
}: UseFormOptions<T>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isValid: false,
    hasInteracted: false,
    isCustomSlug: false
  })

  // Auto-generate slug when title changes (if enabled)
  useEffect(() => {
    if (shouldGenerateSlug && !state.isCustomSlug && state.data[titleField]) {
      const generatedSlug = generateSlug(String(state.data[titleField]))
      setState(prev => ({
        ...prev,
        data: { ...prev.data, [slugField]: generatedSlug }
      }))
    }
  }, [state.data[titleField], state.isCustomSlug, shouldGenerateSlug, slugField, titleField])

  // Validate form whenever data changes (after interaction)
  useEffect(() => {
    if (!schema || !state.hasInteracted) return

    const result = schema.safeParse(state.data)
    setState(prev => ({
      ...prev,
      errors: result.success ? {} : result.error.errors.reduce((acc, err) => {
        const field = err.path[0] as keyof T
        acc[field] = err.message
        return acc
      }, {} as Partial<Record<keyof T, string>>),
      isValid: result.success
    }))
  }, [state.data, state.hasInteracted, schema])

  // Computed properties
  const hasErrors = useMemo(() => Object.keys(state.errors).length > 0, [state.errors])
  const canSubmit = useMemo(() => 
    state.isValid && !isPending && state.hasInteracted, 
    [state.isValid, isPending, state.hasInteracted]
  )

  // ==================== ACTIONS ====================

  const updateField = useCallback((field: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      hasInteracted: true,
      // Mark as custom slug if user manually edits slug
      isCustomSlug: field === slugField ? true : prev.isCustomSlug,
      // Clear error for this field
      errors: { ...prev.errors, [field]: undefined }
    }))
  }, [slugField])

  const updateData = useCallback((updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      hasInteracted: true
    }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error }
    }))
  }, [])

  const clearFieldError = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined }
    }))
  }, [])

  const setIsCustomSlug = useCallback((isCustom: boolean) => {
    setState(prev => ({
      ...prev,
      isCustomSlug: isCustom
    }))
  }, [])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!canSubmit) return

    startTransition(async () => {
      setState(prev => ({ ...prev, isSubmitting: true }))
      
      try {
        const result = await onSubmit(state.data)
        
        if (result.success) {
          onSuccess?.(result)
          if (result.redirectTo) {
            router.push(result.redirectTo)
          }
        } else {
          const error = result.error || 'An error occurred'
          onError?.(error)
          // Try to set field-specific error if possible
          if (error.toLowerCase().includes('title')) {
            setFieldError(titleField, error)
          } else if (error.toLowerCase().includes('slug')) {
            setFieldError(slugField, error)
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred'
        onError?.(message)
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }))
      }
    })
  }, [canSubmit, onSubmit, state.data, onSuccess, onError, router, setFieldError, titleField, slugField])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: {},
      isSubmitting: false,
      isValid: false,
      hasInteracted: false,
      isCustomSlug: false
    })
  }, [initialData])

  // ==================== RETURN ====================

  return {
    // State
    data: state.data,
    errors: state.errors,
    isSubmitting: isPending || state.isSubmitting,
    isValid: state.isValid,
    hasErrors,
    canSubmit,
    hasInteracted: state.hasInteracted,
    isCustomSlug: state.isCustomSlug,

    // Actions
    updateField,
    updateData,
    setFieldError,
    clearFieldError,
    setIsCustomSlug,
    handleSubmit,
    reset,

    // Utilities
    getFieldError: (field: keyof T) => state.errors[field]
  }
} 