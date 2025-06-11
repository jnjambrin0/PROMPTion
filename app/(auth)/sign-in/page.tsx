import { AuthForm } from '@/components/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Promption',
  description: 'Sign in to your Promption account to organize your prompts.',
}

export default function SignInPage() {
  return <AuthForm mode="sign-in" />
} 