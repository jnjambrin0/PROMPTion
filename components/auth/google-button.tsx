'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { type SignInWithOAuthCredentials } from '@supabase/supabase-js'

interface GoogleButtonProps {
  isSignUp: boolean
  marketingConsent?: boolean
}

export function GoogleButton({ isSignUp, marketingConsent }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleAuth = async () => {
    setLoading(true)
    
    const options: SignInWithOAuthCredentials = {
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {},
      },
    }

    if (isSignUp && options.options?.queryParams) {
      options.options.queryParams = {
        marketing_consent: marketingConsent?.toString() ?? 'false',
      }
    }

    await supabase.auth.signInWithOAuth(options)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-brand hover:shadow-brand-hover"
      onClick={handleGoogleAuth}
      disabled={loading}
    >
      {loading ? (
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
  )
} 