import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateWorkspaceForm } from './create-workspace-form'

export default async function NewWorkspacePage() {
  // Ensure user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return <CreateWorkspaceForm />
} 