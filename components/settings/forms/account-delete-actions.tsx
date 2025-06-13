'use client'

import { useState, useCallback } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface AccountDeleteActionsProps {
  deleteAction: () => Promise<{ success: boolean; error?: string }>
  onUpdate: () => void
}

export function AccountDeleteActions({ deleteAction, onUpdate }: AccountDeleteActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    
    try {
      const result = await deleteAction()
      
      if (result.success) {
        toast.success('Account deleted successfully')
        // Redirect to homepage or sign-in
        window.location.href = '/'
      } else {
        toast.error(result.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }, [deleteAction])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-7 px-3"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you absolutely sure you want to delete your account? This action is irreversible and will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Permanently delete all your prompts and data</li>
              <li>Remove you from all workspaces (except owned ones)</li>
              <li>Cancel any active subscriptions</li>
              <li>Make your username available for others</li>
            </ul>
            <p className="text-sm font-medium text-destructive">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Yes, Delete My Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 