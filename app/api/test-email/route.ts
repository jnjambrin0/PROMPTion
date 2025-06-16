import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    console.log('🧪 Testing email configuration...')
    
    const supabase = await createClient()
    
    // Test basic connection
    const { data: { user } } = await supabase.auth.getUser()
    console.log('👤 Current user:', user?.id || 'None')
    
    // Try to get session info
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔐 Current session:', !!session)
    
    // Test a simple signup to see what happens with a VALID email
    const testEmail = `testuser${Date.now()}@gmail.com`
    console.log('📧 Testing signup with valid email:', testEmail)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/confirm?next=/home`,
      },
    })
    
    console.log('📊 Signup result:', {
      user: !!data.user,
      session: !!data.session,
      userEmail: data.user?.email,
      emailConfirmed: data.user?.email_confirmed_at,
      error: error?.message || 'No error'
    })
    
    // If signup worked, check what Supabase returned
    if (data.user) {
      console.log('✅ User created successfully')
      console.log('📧 Email confirmation required:', !data.user.email_confirmed_at)
      console.log('🎯 User ID:', data.user.id)
    }
    
    return NextResponse.json({
      success: true,
      config: {
        environment: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      },
      testResult: {
        userCreated: !!data.user,
        hasSession: !!data.session,
        needsConfirmation: !!data.user && !data.user.email_confirmed_at,
        error: error?.message
      }
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 

