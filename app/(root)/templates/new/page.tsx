import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateTemplateForm } from './create-template-form'

interface PageProps {
  searchParams: Promise<{ workspace?: string; category?: string }>
}

export default async function NewTemplatePage({ searchParams }: PageProps) {
  // Ensure user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  const params = await searchParams
  return (
    <CreateTemplateForm 
      defaultWorkspaceId={params.workspace}
      defaultCategoryId={params.category}
    />
  )
} 