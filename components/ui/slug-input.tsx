'use client'

import { forwardRef, useEffect, useState, useCallback } from 'react'
import { Input } from './input'
import { Label } from './label'
import { Check, X, Loader2 } from 'lucide-react'

interface SlugInputProps {
  value: string
  onChange: (value: string) => void
  title: string
  baseUrl?: string
  onValidation?: (isValid: boolean, error?: string) => void
  isRequired?: boolean
  validateSlug?: (slug: string) => Promise<boolean>
  placeholder?: string
}

export const SlugInput = forwardRef<HTMLInputElement, SlugInputProps>(
  function SlugInput({
    value,
    onChange,
    // title, // Currently unused
    baseUrl = '',
    onValidation,
    isRequired = false,
    validateSlug,
    placeholder = 'my-slug'
  }, ref) {
    const [isValidating, setIsValidating] = useState(false)
    const [validationResult, setValidationResult] = useState<{
      isValid: boolean
      error?: string
    } | null>(null)
    const [lastValidatedSlug, setLastValidatedSlug] = useState<string>('')

    // Generate slug from title
    const generateSlug = useCallback((text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .slice(0, 50)
    }, [])

    // Validate slug with caching to prevent unnecessary API calls
    const validateCurrentSlug = useCallback(async (slugToValidate: string) => {
      // Skip validation if slug hasn't changed
      if (slugToValidate === lastValidatedSlug) {
        return
      }

      if (!slugToValidate) {
        const result = isRequired ? { isValid: false, error: 'Required' } : { isValid: true }
        setValidationResult(result)
        onValidation?.(result.isValid, result.error)
        setLastValidatedSlug(slugToValidate)
        return
      }

      // Basic format validation
      if (!/^[a-z0-9-]+$/.test(slugToValidate)) {
        const error = 'Only lowercase letters, numbers, and hyphens allowed'
        setValidationResult({ isValid: false, error })
        onValidation?.(false, error)
        setLastValidatedSlug(slugToValidate)
        return
      }

      if (slugToValidate.length < 3) {
        const error = 'Must be at least 3 characters'
        setValidationResult({ isValid: false, error })
        onValidation?.(false, error)
        setLastValidatedSlug(slugToValidate)
        return
      }

      // Custom validation with API call
      if (validateSlug) {
        setIsValidating(true)
        try {
          const isAvailable = await validateSlug(slugToValidate)
          if (isAvailable) {
            setValidationResult({ isValid: true })
            onValidation?.(true)
          } else {
            const error = 'This slug is already taken'
            setValidationResult({ isValid: false, error })
            onValidation?.(false, error)
          }
        } catch (error) {
          console.error('Slug validation error:', error)
          const errorMsg = 'Failed to validate slug'
          setValidationResult({ isValid: false, error: errorMsg })
          onValidation?.(false, errorMsg)
        } finally {
          setIsValidating(false)
        }
      } else {
        setValidationResult({ isValid: true })
        onValidation?.(true)
      }
      
      setLastValidatedSlug(slugToValidate)
    }, [isRequired, validateSlug, onValidation, lastValidatedSlug])

    // Debounced validation
    useEffect(() => {
      const debounceTimer = setTimeout(() => {
        validateCurrentSlug(value)
      }, 800) // Increased debounce time to reduce API calls

      return () => clearTimeout(debounceTimer)
    }, [value, validateCurrentSlug])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const slug = generateSlug(rawValue)
      onChange(slug)
    }

    const getValidationIcon = () => {
      if (isValidating) {
        return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      }
      
      if (!validationResult) return null
      
      return validationResult.isValid ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-red-600" />
      )
    }


    const isValid = validationResult?.isValid === true
    const hasError = validationResult?.isValid === false

    return (
      <div className="space-y-2">
        <Label htmlFor="slug">
          URL slug {isRequired && <span className="text-red-500">*</span>}
          {!isRequired && <span className="text-gray-500 text-sm font-normal">(optional)</span>}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            id="slug"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`pr-10 ${
              hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' :
              isValid ? 'border-green-300 focus:border-green-500 focus:ring-green-200' :
              ''
            }`}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getValidationIcon()}
          </div>
        </div>

        {/* URL Preview */}
        {baseUrl && value && (
          <div className="text-sm text-gray-500">
            URL preview: <span className="font-mono">{baseUrl}/{value}</span>
          </div>
        )}

        {/* Help text */}
        {!value && !isRequired && (
          <p className="text-sm text-gray-500">
            Leave empty to auto-generate from title
          </p>
        )}

        {/* Validation Error */}
        {validationResult?.error && (
          <p className="text-sm text-red-600">{validationResult.error}</p>
        )}
      </div>
    )
  }
) 