'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SubmitButton({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full h-12 bg-brand-gradient text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-brand hover:shadow-brand-hover"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : null}
      {mode === 'sign-up' ? 'Create Account' : 'Sign In'}
    </Button>
  )
} 