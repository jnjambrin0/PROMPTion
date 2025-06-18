'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { getPasswordStrength } from '@/lib/validation-schemas'

interface PasswordInputProps {
  id: string
  name: string
  label: string
  value?: string
  onChange?: (value: string) => void
  onValidityChange?: (isValid: boolean) => void
  autoComplete?: string
  placeholder?: string
  showStrengthIndicator?: boolean
  required?: boolean
}

export function PasswordInput({
  id,
  name,
  label,
  value = '',
  onChange,
  onValidityChange,
  autoComplete,
  placeholder,
  showStrengthIndicator = false,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const [strength, setStrength] = useState(getPasswordStrength(''))
  const [hasStartedTyping, setHasStartedTyping] = useState(false)

  useEffect(() => {
    const newStrength = getPasswordStrength(localValue)
    setStrength(newStrength)
    
    // Notify parent of validity change if callback provided
    if (onValidityChange) {
      const isValid = newStrength.strength >= 1 // All checks must pass
      onValidityChange(isValid)
    }
  }, [localValue, onValidityChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(newValue)
    
    // Mark that user has started typing
    if (!hasStartedTyping && newValue.length > 0) {
      setHasStartedTyping(true)
    }
  }

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'strong': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'fair': return 'bg-yellow-500'
      case 'weak': return 'bg-orange-500'
      default: return 'bg-red-500'
    }
  }

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'strong': return 'Strong'
      case 'good': return 'Good'
      case 'fair': return 'Fair'
      case 'weak': return 'Weak'
      default: return 'Very Weak'
    }
  }

  // Only show strength indicator if user has started typing and field has content
  const shouldShowStrengthIndicator = showStrengthIndicator && hasStartedTyping && localValue.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={localValue}
          onChange={handleChange}
          autoComplete={autoComplete}
          required={required}
          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 pr-12"
          placeholder={placeholder}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>

      {/* Dynamic strength indicator - only appears when needed */}
      {shouldShowStrengthIndicator && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Strength Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Password strength</span>
              <span className={`font-medium transition-colors duration-200 ${
                strength.level === 'strong' ? 'text-green-600' :
                strength.level === 'good' ? 'text-blue-600' :
                strength.level === 'fair' ? 'text-yellow-600' :
                strength.level === 'weak' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {getStrengthText(strength.level)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.level)}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="space-y-1">
            <p className="text-xs text-gray-600 font-medium">Password must contain:</p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className={`flex items-center gap-2 transition-colors duration-200 ${
                strength.checks.length ? 'text-green-600' : 'text-gray-500'
              }`}>
                {strength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>At least 8 characters</span>
              </div>
              
              <div className={`flex items-center gap-2 transition-colors duration-200 ${
                strength.checks.lowercase ? 'text-green-600' : 'text-gray-500'
              }`}>
                {strength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>One lowercase letter (a-z)</span>
              </div>
              
              <div className={`flex items-center gap-2 transition-colors duration-200 ${
                strength.checks.uppercase ? 'text-green-600' : 'text-gray-500'
              }`}>
                {strength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>One uppercase letter (A-Z)</span>
              </div>
              
              <div className={`flex items-center gap-2 transition-colors duration-200 ${
                strength.checks.number ? 'text-green-600' : 'text-gray-500'
              }`}>
                {strength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>One number (0-9)</span>
              </div>
              
              <div className={`flex items-center gap-2 transition-colors duration-200 ${
                strength.checks.special ? 'text-green-600' : 'text-gray-500'
              }`}>
                {strength.checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>One special character (!@#$%^&*)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 