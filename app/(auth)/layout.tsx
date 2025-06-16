import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to home if user is already authenticated
  if (user) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen bg-gray-25">
      {children}
    </div>
  )
} 