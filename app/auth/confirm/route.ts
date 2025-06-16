import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  console.log('🔍 Auth confirm endpoint called')
  
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/home'

  console.log('📋 Confirm params:', { token_hash: token_hash?.substring(0, 10) + '...', type, next })

  if (token_hash && type) {
    try {
      const supabase = await createClient()
      console.log('✅ Supabase client created')

      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      
      console.log('🔐 Verify OTP result:', { data: !!data, error: error?.message })
      
      if (!error) {
        console.log('✅ Email confirmed successfully, redirecting to:', next)
        redirect(next)
      } else {
        console.error('❌ OTP verification failed:', error.message)
      }
    } catch (error) {
      console.error('💥 Exception in auth confirm:', error)
    }
  } else {
    console.log('❌ Missing required parameters')
  }

  // redirect the user to an error page with some instructions
  console.log('🚫 Redirecting to error page')
  redirect('/auth/auth-code-error')
} 