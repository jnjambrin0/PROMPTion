import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateCollectionForm } from './create-collection-form'

interface PageProps {
  searchParams: Promise<{ workspace?: string }>
}

export default async function NewCollectionPage({ searchParams }: PageProps) {
  // Ensure user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  const params = await searchParams
  return <CreateCollectionForm defaultWorkspaceId={params.workspace} />
} 