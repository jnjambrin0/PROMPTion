'use server'

import { render } from '@react-email/render'
import { headers } from 'next/headers'
import { z } from 'zod'

import { FeedbackEmail } from '@/components/emails/feedback-email'
import { checkRateLimit } from '@/lib/rate-limit'
import { resend } from '@/lib/resend'

const feedbackSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('El correo electrónico proporcionado no es válido.')
    .max(100, 'El correo electrónico es demasiado largo.')
    .optional()
    .or(z.literal('')),
  message: z.string().trim().min(1, 'El mensaje no puede estar vacío.').max(5000, 'El mensaje es demasiado largo.'),
  url: z.string().url('La URL proporcionada no es válida.').max(2048, 'La URL es demasiado larga.'),
  userAgent: z.string().min(1, 'User agent is required').max(500, 'User agent is too long'),
  timestamp: z.string().datetime('La marca de tiempo no es válida.'),
})

export async function submitFeedbackAction(data: unknown): Promise<{
  type: 'success' | 'error'
  message: string
}> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
  const rateLimitResult = await checkRateLimit(ip, 'feedback')

  if (!rateLimitResult.success) {
    console.warn(`Feedback rate limit exceeded for IP: ${ip}`)
    return {
      type: 'error',
      message: 'Estás enviando feedback demasiado rápido. Por favor, inténtalo de nuevo en unos minutos.',
    }
  }

  const parsed = feedbackSchema.safeParse(data)

  if (!parsed.success) {
    console.error('Invalid feedback data:', parsed.error.flatten().fieldErrors)
    return { type: 'error', message: 'Los datos proporcionados no son válidos. Por favor, revisa el formulario.' }
  }

  const { email } = parsed.data
  const feedbackEmail = process.env.FEEDBACK_EMAIL
  const resendDomain = process.env.RESEND_DOMAIN

  if (!feedbackEmail || !resendDomain) {
    console.error('FEEDBACK_EMAIL or RESEND_DOMAIN environment variable is not set.')
    return { type: 'error', message: 'Error de configuración del servidor.' }
  }

  try {
    const emailComponent = FeedbackEmail({ ...parsed.data })
    const emailHtml = await render(emailComponent)

    await resend.emails.send({
      from: `Feedback <feedback@${resendDomain}>`,
      to: feedbackEmail,
      replyTo: email || `no-reply@${resendDomain}`,
      subject: `Nuevo Feedback Recibido`,
      html: emailHtml,
    })
    return { type: 'success', message: '¡Feedback enviado con éxito!' }
  } catch (error) {
    console.error('Failed to send feedback email:', error)
    return { type: 'error', message: 'No se pudo enviar el feedback. Por favor, inténtalo más tarde.' }
  }
} 