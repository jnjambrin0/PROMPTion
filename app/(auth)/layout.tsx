import { getAuthenticatedUser } from '@/lib/actions/auth/auth-helpers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()

  // Redirect to home if user is already authenticated
  if (user) {
    redirect('/home')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 p-4">
      {children}
    </div>
  )
} 