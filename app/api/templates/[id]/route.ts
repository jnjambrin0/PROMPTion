import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/lib/db/templates'
import { z } from 'zod'

// ==================== TIPOS Y ESQUEMAS ====================

interface TemplateParams {
  params: Promise<{
    id: string
  }>
}

// Esquema de validación para parámetros
const templateIdSchema = z.string().uuid('Invalid template ID format')

// ==================== UTILIDADES ====================

async function validateTemplateId(id: string) {
  const validation = templateIdSchema.safeParse(id)
  if (!validation.success) {
    return {
      error: NextResponse.json(
        { error: 'Invalid template ID format' },
        { status: 400 }
      )
    }
  }
  return { error: undefined }
}

// ==================== HANDLERS ====================

export async function GET(
  request: NextRequest,
  { params }: TemplateParams
) {
  try {
    const { id } = await params

    // 1. Validar parámetros
    const validation = await validateTemplateId(id)
    if (validation.error) return validation.error

    // 2. Obtener template
    const template = await getTemplateById(id)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or not accessible' },
        { status: 404 }
      )
    }

    // 3. Respuesta exitosa
    const response = NextResponse.json({
      success: true,
      template
    })

    // 4. Headers de seguridad y cache
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600') // 5 min cache
    
    return response

  } catch (error) {
    console.error('Get template error:', error)
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      
      if (error.message.includes('access denied')) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 