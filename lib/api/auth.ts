import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'

/**
 * Utilidad común para autenticar usuarios en endpoints
 * @returns Usuario autenticado o error
 */
export async function authenticateUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return { 
      error: NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      ) 
    }
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    return { 
      error: NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      ) 
    }
  }

  return { user, authUser, error: undefined }
}

/**
 * Aplica headers de seguridad comunes a las respuestas
 * @param response - Response de Next.js
 * @returns Response con headers de seguridad
 */
export function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

/**
 * Crea una respuesta de error estandarizada
 * @param message - Mensaje de error
 * @param status - Código de estado HTTP
 * @returns Response con error
 */
export function createErrorResponse(message: string, status: number = 500) {
  const response = NextResponse.json({ error: message }, { status })
  return addSecurityHeaders(response)
}

/**
 * Crea una respuesta de éxito estandarizada
 * @param data - Datos de respuesta
 * @param options - Opciones adicionales (cache, etc.)
 * @returns Response con datos
 */
export function createSuccessResponse(
  data: Record<string, unknown>, 
  options: {
    cache?: string
    status?: number
  } = {}
) {
  const { cache, status = 200 } = options
  const response = NextResponse.json(data, { status })
  
  addSecurityHeaders(response)
  
  if (cache) {
    response.headers.set('Cache-Control', cache)
  }
  
  return response
} 