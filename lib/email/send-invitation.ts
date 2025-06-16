/**
 * Utilidad para enviar emails de invitación al workspace
 */
export async function sendWorkspaceInvitationEmail(data: {
  workspaceName: string
  inviterName: string
  inviterEmail: string
  recipientEmail: string
  role: string
  message?: string
  invitationToken: string
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/email/send-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send invitation email')
    }

    const result = await response.json()
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending invitation email:', error)
    // No fallar el proceso de invitación si el email falla
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 