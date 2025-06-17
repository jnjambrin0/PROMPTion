'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { deletePromptAction } from '@/lib/actions/prompt'
import { Loader2 } from 'lucide-react'

interface DeletePromptDialogProps {
  promptId: string
  children: React.ReactNode
  onSuccess?: (redirectTo: string) => void
}

export function DeletePromptDialog({ promptId, children, onSuccess }: DeletePromptDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePromptAction(promptId)
      if (result.success && result.redirectTo) {
        toast.success('Prompt deleted successfully.')
        // Allow parent to handle redirection if needed, otherwise redirect directly
        if (onSuccess) {
          onSuccess(result.redirectTo)
        } else {
          router.push(result.redirectTo)
        }
        setIsOpen(false)
      } else {
        toast.error('Failed to delete prompt.', {
          description: result.error || 'An unexpected error occurred.',
        })
      }
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the prompt
            and all of its associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Prompt'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 