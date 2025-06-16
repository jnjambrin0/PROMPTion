import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// ==================== SUPABASE MIDDLEWARE CLIENT ====================
// Designed specifically for middleware where cookie setting is allowed

export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options = {}) {
          // Apply secure cookie settings in middleware
          const secureOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            maxAge: name.includes('access') ? 3600 : 86400, // 1 hour for access, 24h for refresh
            ...options
          }
          
          response.cookies.set(name, value, secureOptions)
        },
        remove(name: string, options = {}) {
          const secureOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
            ...options
          }
          
          response.cookies.set(name, '', { 
            ...secureOptions,
            expires: new Date(0),
            maxAge: 0
          })
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
      }
    }
  )
}

