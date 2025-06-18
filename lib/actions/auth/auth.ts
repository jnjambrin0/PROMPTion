'use server'

import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { getRequestIp } from '@/lib/utils/get-request-ip'
import {
  TERMS_AND_CONDITIONS_VERSION,
  PRIVACY_POLICY_VERSION,
} from '@/lib/constants'
import { signUpFormSchema, signInFormSchema } from '@/lib/validation-schemas'

interface AuthResult {
  success: boolean
  message: string
  field?: string // For field-specific errors
  reason?: 'USER_EXISTS'
}

export async function signUpWithConsent(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const headersList = await headers()
  const ipAddress = await getRequestIp()
  const userAgent = headersList.get('user-agent') ?? ''
  const origin = process.env.NEXT_PUBLIC_SITE_URL || headersList.get('origin')

  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    marketingConsent: formData.get('marketingConsent') === 'on',
    termsAccepted: formData.get('termsAccepted') === 'on',
  }

  // Validate form data
  const validation = signUpFormSchema.safeParse(rawFormData)

  if (!validation.success) {
    const firstError = validation.error.errors[0]
    return {
      success: false,
      message: firstError.message,
      field: firstError.path[0]?.toString(),
    }
  }

  const { email, password, marketingConsent } = validation.data
  
  // Check if user already exists in our database
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      success: false,
      message: 'It looks like you already have an account. Please sign in.',
      field: 'email',
      reason: 'USER_EXISTS',
    }
  }

  const supabase = await createClient()

  // 1. Sign up user with Supabase Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (signUpError) {
    // Handle specific Supabase errors
    if (signUpError.message.includes('already registered')) {
      return {
        success: false,
        message: 'It looks like you already have an account. Please sign in.',
        field: 'email',
        reason: 'USER_EXISTS',
      }
    }
    
    if (signUpError.message.includes('Password')) {
      return {
        success: false,
        message: signUpError.message,
        field: 'password',
      }
    }

    return {
      success: false,
      message: signUpError.message || 'Failed to create account. Please try again.',
    }
  }

  if (!authData.user) {
    return { success: false, message: 'User registration failed.' }
  }

  const userId = authData.user.id

  try {
    // 2. Create or Update User and Consent Logs in a single transaction
    await prisma.$transaction(async (tx) => {
      // Use upsert to prevent race conditions with the auth trigger
      const user = await tx.user.upsert({
        where: { authId: userId },
        update: {
          marketingConsent: marketingConsent,
        },
        create: {
          authId: userId,
          email: email,
          marketingConsent: marketingConsent || false,
        },
      })

      // Create consent logs using the internal user ID
      await tx.consentLog.createMany({
        data: [
          {
            userId: user.id,
            type: 'TERMS_AND_CONDITIONS',
            version: TERMS_AND_CONDITIONS_VERSION,
            ipAddress,
            userAgent,
          },
          {
            userId: user.id,
            type: 'PRIVACY_POLICY',
            version: PRIVACY_POLICY_VERSION,
            ipAddress,
            userAgent,
          },
        ],
      })
    })

    return { success: true, message: 'Check your email for the confirmation link!' }
  } catch (dbError) {
    console.error('Database error after sign-up:', dbError)
    
    // Clean up Supabase user if DB transaction fails
    await supabase.auth.admin.deleteUser(userId)
    
    return {
      success: false,
      message: 'A database error occurred. Your registration was not completed.',
    }
  }
}

export async function signIn(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validation = signInFormSchema.safeParse(rawFormData)

  if (!validation.success) {
    const firstError = validation.error.errors[0]
    return {
      success: false,
      message: firstError.message,
      field: firstError.path[0]?.toString(),
    }
  }
  
  const { email, password } = validation.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.',
      }
    }
    
    if (error.message.includes('Email not confirmed')) {
      return {
        success: false,
        message: 'Please check your email and click the confirmation link before signing in.',
      }
    }

    return { success: false, message: error.message }
  }

  return { success: true, message: 'Signed in successfully.' }
} 