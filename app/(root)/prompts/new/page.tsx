import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreatePromptForm } from './create-prompt-form'

interface PageProps {
  searchParams: Promise<{ workspace?: string; category?: string }>
}

export default async function NewPromptPage({ searchParams }: PageProps) {
  // Ensure user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  const params = await searchParams
  return (
    <CreatePromptForm 
      defaultWorkspaceId={params.workspace}
      defaultCategoryId={params.category}
    />
  )
} 