'use client'

import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'
import { signUpWithConsent, signIn } from '@/lib/actions/auth/auth'
import { LegalConsent } from '@/components/auth/legal-consent'
import { PasswordInput } from '@/components/auth/password-input'
import { SubmitButton } from '@/components/auth/submit-button'
import { GoogleButton } from '@/components/auth/google-button'
import { signUpFormSchema } from '@/lib/validation-schemas'
import { useDebounce } from '@/hooks/use-debounce'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

const initialState = {
  success: false,
  message: '',
  field: undefined,
  reason: undefined,
}

export function AuthForm({ mode }: AuthFormProps) {
  const [effectiveMode, setEffectiveMode] = useState(mode)

  const [signInState, signInAction] = useActionState(signIn, initialState)
  const [signUpState, signUpAction] = useActionState(signUpWithConsent, initialState)
  
  const state = effectiveMode === 'sign-up' ? signUpState : signInState
  const formAction = effectiveMode === 'sign-up' ? signUpAction : signInAction

  const [marketingConsent, setMarketingConsent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [passwordValid, setPasswordValid] = useState(false)
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // Debounce form data to prevent excessive validation
  const debouncedFormData = useDebounce(formData, 300)

  useEffect(() => {
    // On sign-in success, redirect
    if (signInState.success) {
      router.push('/home')
    }

    // On user-exists error, switch to sign-in mode
    if (signUpState.reason === 'USER_EXISTS') {
      setEffectiveMode('sign-in')
    }
  }, [signInState, signUpState, router])

  // Smart validation that only shows errors when appropriate
  useEffect(() => {
    if (effectiveMode === 'sign-up') {
      const result = signUpFormSchema.safeParse({
        email: debouncedFormData.email,
        password: debouncedFormData.password,
        confirmPassword: debouncedFormData.confirmPassword,
        termsAccepted: true, // We'll validate this separately
        marketingConsent,
      })

      const newErrors: Record<string, string> = {}
      
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const field = error.path[0]?.toString()
          if (field && field !== 'termsAccepted') {
            // Only show error if field has been touched and has content or user has tried to submit
            if (fieldTouched[field] && (debouncedFormData[field as keyof typeof debouncedFormData] || state.message)) {
              newErrors[field] = error.message
            }
          }
        })
      }

      // Special handling for password confirmation
      if (
        fieldTouched.confirmPassword && 
        debouncedFormData.password && 
        debouncedFormData.confirmPassword && 
        debouncedFormData.password !== debouncedFormData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords don't match"
      }

      setFormErrors(newErrors)
    }
  }, [debouncedFormData, passwordValid, marketingConsent, effectiveMode, fieldTouched, state.message])

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFieldBlur = (field: string) => {
    setFieldTouched(prev => ({ ...prev, [field]: true }))
  }

  const getFieldError = (field: string) => {
    return formErrors[field] || (state.field === field ? state.message : '')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-25 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-brand-gradient shadow-lg">
            <span className="text-xl font-bold text-white">P</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {effectiveMode === 'sign-up' ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {effectiveMode === 'sign-up'
              ? 'Start organizing your prompts with Promption'
              : 'Welcome back to Promption'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <GoogleButton isSignUp={effectiveMode === 'sign-up'} marketingConsent={marketingConsent} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-25 px-3 text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email')(e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 ${
                  getFieldError('email') ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                }`}
                placeholder="Enter your email"
              />
              {/* Error message with smooth transition */}
              {getFieldError('email') && (
                <div className="mt-1 animate-in slide-in-from-top-1 duration-200">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('email')}
                  </p>
                </div>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                onValidityChange={setPasswordValid}
                autoComplete={effectiveMode === 'sign-up' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                showStrengthIndicator={effectiveMode === 'sign-up'}
                required
              />
              {/* Error message with smooth transition */}
              {getFieldError('password') && fieldTouched.password && (
                <div className="mt-1 animate-in slide-in-from-top-1 duration-200">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('password')}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field - Always visible in sign-up */}
            {effectiveMode === 'sign-up' && (
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 pr-12 ${
                      getFieldError('confirmPassword') ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                    } ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300 focus:border-green-500' : ''}`}
                    placeholder="••••••••"
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                
                {/* Dynamic feedback */}
                {getFieldError('confirmPassword') ? (
                  <div className="mt-1 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('confirmPassword')}
                    </p>
                  </div>
                ) : formData.confirmPassword && formData.password === formData.confirmPassword ? (
                  <div className="mt-1 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Passwords match
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Legal Consent - Always visible in sign-up */}
            {effectiveMode === 'sign-up' && (
              <LegalConsent onMarketingChange={setMarketingConsent} />
            )}

            {/* General Error Message */}
            {!state.success && state.message && !state.field && (
              <div className="animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {state.message}
                </div>
              </div>
            )}

            {/* Success Message */}
            {state.success && effectiveMode === 'sign-up' && (
              <div className="animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Check className="h-4 w-4" />
                  {state.message}
                </div>
              </div>
            )}
            
            <SubmitButton mode={effectiveMode} />

            {effectiveMode !== 'sign-up' && (
              <div className="text-center text-sm">
                <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-600">
          {effectiveMode === 'sign-up' ? (
            <>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setEffectiveMode('sign-in')}
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setEffectiveMode('sign-up')}
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
} 