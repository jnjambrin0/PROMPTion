import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/home'

    if (!token_hash || !type) {
      console.log('❌ Missing required parameters, redirecting to error page.')
      return redirect('/auth/auth-code-error?error=missing_params')
    }

    console.log('📋 Confirm params:', { token_hash: token_hash?.substring(0, 10) + '...', type, next })
    
    const supabase = await createClient()
    console.log('✅ Supabase client created')

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (error) {
      console.error('❌ OTP verification failed:', error.message)
      return redirect(`/auth/auth-code-error?error=verification_failed&message=${encodeURIComponent(error.message)}`)
    }
    
    console.log('✅ Email confirmed successfully, redirecting to:', next)
    return redirect(next)

  } catch (error) {
    // This will catch DB connection errors and NEXT_REDIRECT exceptions.
    // We need to re-throw NEXT_REDIRECT so Next.js can handle it properly.
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    console.error('💥 Unhandled exception in auth confirm:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.'
    return redirect(`/auth/auth-code-error?error=server_error&message=${encodeURIComponent(errorMessage)}`)
  }
} 