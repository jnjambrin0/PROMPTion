import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
    }
    
    console.log('🔧 Environment config:', config)
    
    // Check if we can reach Supabase Auth
    const authUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`
    console.log('🔗 Testing auth endpoint:', authUrl)
    
    const response = await fetch(authUrl, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      }
    })
    
    const authSettings = await response.json()
    console.log('⚙️ Auth settings response:', response.status, authSettings)
    
    return NextResponse.json({
      success: true,
      config,
      authEndpoint: {
        status: response.status,
        settings: authSettings
      }
    })
    
  } catch (error) {
    console.error('💥 Config check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 