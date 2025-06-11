import { AuthForm } from '@/components/auth-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | Promption',
  description: 'Create your Promption account to start organizing your prompts.',
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
} 