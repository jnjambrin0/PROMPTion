import { Resend } from 'resend'
import { z } from 'zod'
import { MemberRole } from '@/lib/generated/prisma'
import { WorkspaceInvitationEmail } from '@/components/emails/workspace-invitation-email'

/**
 * Utilidad para enviar emails de invitación al workspace
 */

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

// We exclude 'OWNER' as it's not an invitable role.
const invitableRoles = { ...MemberRole }
delete (invitableRoles as Partial<typeof invitableRoles>).OWNER

const sendInvitationSchema = z.object({
  workspaceName: z.string().min(1).max(100),
  inviterName: z.string().min(1).max(100),
  inviterEmail: z.string().email(),
  recipientEmail: z.string().email(),
  role: z.nativeEnum(invitableRoles),
  message: z.string().max(500).optional(),
  invitationToken: z.string().min(10),
})

export type SendInvitationEmailData = z.infer<typeof sendInvitationSchema>

// ============================================================================
// RESEND CONFIGURATION
// ============================================================================

const resend = new Resend(process.env.RESEND_API_KEY)

// ============================================================================
// EMAIL SENDING FUNCTION
// ============================================================================

export async function sendWorkspaceInvitationEmail(data: SendInvitationEmailData) {
  try {
    // 1. Validate input data
    const validatedData = sendInvitationSchema.parse(data)

    // 2. Configure URLs and sender details
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const invitationUrl = `${baseUrl}/invitations/${validatedData.invitationToken}`
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@promption.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'Promption'

    // 3. Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [validatedData.recipientEmail],
      subject: `Invitation to join ${validatedData.workspaceName} on Promption`,
      react: await WorkspaceInvitationEmail({
        ...validatedData,
        invitationUrl,
        expiresInDays: 7,
      }),
    })

    if (error) {
      console.error('Resend API Error:', error)
      throw new Error('Failed to send invitation email via Resend.')
    }

    // 4. Return success response
    return { 
      success: true, 
      messageId: emailData?.id 
    }
  } catch (error) {
    console.error('Error in sendWorkspaceInvitationEmail:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid data provided for invitation email.',
        details: error.flatten(),
      }
    }

    return { 
      success: false, 
      error: 'An unexpected error occurred while sending the invitation.' 
    }
  }
} 