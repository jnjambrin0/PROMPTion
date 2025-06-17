import { getAuthenticatedUser } from '@/lib/actions/auth/auth-helpers'
import { redirect } from 'next/navigation'
import { CreatePromptForm } from './create-prompt-form'

interface PageProps {
  searchParams: Promise<{ workspace?: string; category?: string }>
}

export default async function NewPromptPage({ searchParams }: PageProps) {
  // Ensure user is authenticated using the centralized helper
  const user = await getAuthenticatedUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const params = await searchParams
  return (
    <CreatePromptForm 
      defaultWorkspaceId={params.workspace}
      defaultCategoryId={params.category}
    />
  )
} 