import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WorkspaceInvitationEmail } from '@/components/emails/workspace-invitation-email'

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    console.log('🧪 Testing email sending via Resend...')

    // Configurar remitente y destinatario de prueba
    const fromEmail = process.env.RESEND_USER || 'noreply@promption.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'Promption Test'
    const toEmail = process.env.RESEND_USER || 'test@example.com' // Send to self or a test address

    if (toEmail === 'test@example.com') {
      console.warn('⚠️ RESEND_USER is not set. Sending to a placeholder address.')
    }

    // Enviar email de prueba
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      subject: `🧪 Test Email from Promption [${new Date().toLocaleTimeString()}]`,
      react: await WorkspaceInvitationEmail({
        workspaceName: 'Test Workspace',
        inviterName: 'Test Inviter',
        inviterEmail: fromEmail,
        recipientEmail: toEmail,
        role: 'MEMBER',
        message: 'This is a test email to verify Resend configuration.',
        invitationUrl: '#',
        expiresInDays: 1,
      }),
    })

    if (error) {
      console.error('❌ Resend API Error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send test email', details: error },
        { status: 500 }
      )
    }

    console.log('✅ Test email sent successfully! Message ID:', data?.id)

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      from: fromEmail,
      to: toEmail,
    })

  } catch (error) {
    console.error('❌ Test endpoint failed:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 

