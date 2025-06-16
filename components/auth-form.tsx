'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Eye, EyeOff, Mail, Chrome, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const isSignUp = mode === 'sign-up'

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    return null
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isSignUp) {
        // Validate password strength
        const passwordError = validatePassword(password)
        if (passwordError) {
          setError(passwordError)
          return
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=/home`,
          },
        })

        if (error) throw error

        setMessage('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/home')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
      setGoogleLoading(false)
    }
  }

  const isFormDisabled = loading || googleLoading

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-25 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-brand-gradient shadow-lg">
            <span className="text-xl font-bold text-white">P</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Start organizing your prompts with Promption' 
              : 'Welcome back to Promption'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="mt-8 space-y-6">
          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-brand hover:shadow-brand-hover"
            onClick={handleGoogleAuth}
            disabled={isFormDisabled}
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-gray-600" />
                <span className="text-gray-700">Connecting to Google...</span>
              </>
            ) : (
              <>
                <Chrome className="mr-3 h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Continue with Google</span>
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-25 px-3 text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormDisabled}
                  aria-describedby={error ? 'error-message' : undefined}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className="pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isFormDisabled}
                  aria-describedby={isSignUp ? 'password-requirements' : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 p-1 rounded-md hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignUp && (
                <p id="password-requirements" className="mt-2 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isFormDisabled}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isFormDisabled}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div 
                id="error-message"
                className="flex items-start space-x-3 text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg animate-in fade-in duration-200"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div 
                className="text-sm text-green-700 bg-green-50 border border-green-200 p-4 rounded-lg animate-in fade-in duration-200"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start space-x-3">
                  <div className="h-4 w-4 rounded-full bg-green-500 flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="leading-relaxed">{message}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 bg-brand-gradient hover:opacity-90 text-white font-medium transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-brand hover:shadow-brand-hover rounded-lg border-0"
              disabled={isFormDisabled}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </div>
              ) : (
                isSignUp ? 'Create account' : 'Sign in'
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <Link
                href={isSignUp ? '/sign-in' : '/sign-up'}
                className="font-medium text-brand hover:text-blue-700 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>

          {/* Forgot Password Link (Sign In Only) */}
          {!isSignUp && (
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 