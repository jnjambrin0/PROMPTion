import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ==================== SUPABASE SERVER CLIENT ====================
// Simplified to prevent cookie setting errors in Server Components

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Use default options - don't override for Server Components
              cookieStore.set(name, value, options)
            })
          } catch {
            // Silently ignore cookie setting errors in Server Components
            // This is expected behavior when Supabase tries to refresh tokens
          }
        },
      },
      auth: {
        // Disable auto refresh to prevent cookie setting in Server Components
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}