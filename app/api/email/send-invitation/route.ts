import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db'
import { WorkspaceInvitationEmail } from '@/components/emails/workspace-invitation-email'

// Validación de entrada
const sendInvitationSchema = z.object({
  workspaceName: z.string().min(1).max(100),
  inviterName: z.string().min(1).max(100),
  inviterEmail: z.string().email(),
  recipientEmail: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'MEMBER', 'VIEWER']),
  message: z.string().max(500).optional(),
  invitationToken: z.string().min(10),
})

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Autenticación
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const user = await getUserByAuthId(authUser.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 401 }
      )
    }

    // Validación de entrada
    const body = await request.json()
    const validatedData = sendInvitationSchema.parse(body)

    // Verificar que el usuario autenticado coincide con el inviter
    if (validatedData.inviterEmail !== user.email) {
      return NextResponse.json(
        { error: 'Unauthorized to send invitations' }, 
        { status: 403 }
      )
    }

    // Configurar dominio base para la URL de invitación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const invitationUrl = `${baseUrl}/invitations/${validatedData.invitationToken}`

    // Configurar remitente
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@promption.com'
    const fromName = process.env.RESEND_FROM_NAME || 'Promption'

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [validatedData.recipientEmail],
      subject: `Invitation to join ${validatedData.workspaceName} on Promption`,
      react: await WorkspaceInvitationEmail({
        workspaceName: validatedData.workspaceName,
        inviterName: validatedData.inviterName,
        inviterEmail: validatedData.inviterEmail,
        recipientEmail: validatedData.recipientEmail,
        role: validatedData.role,
        message: validatedData.message,
        invitationUrl,
        expiresInDays: 7,
      }),
    })

    if (error) {
      console.error('Error sending invitation email:', error)
      return NextResponse.json(
        { error: 'Failed to send invitation email' }, 
        { status: 500 }
      )
    }

    // Respuesta exitosa
    return NextResponse.json(
      { 
        success: true, 
        messageId: data?.id,
        invitationUrl 
      },
      { 
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        }
      }
    )

  } catch (error) {
    console.error('Error in send-invitation endpoint:', error)

    // Manejo de errores de validación
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }, 
        { status: 400 }
      )
    }

    // Error genérico del servidor
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
} 