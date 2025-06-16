'use client'

import { useState, useCallback } from 'react'
import { LogOut } from 'lucide-react'
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

interface WorkspaceData {
  id: string
  name: string
  slug: string
  role: string
  plan: string
}

interface WorkspaceActionsProps {
  workspace: WorkspaceData
  onUpdate: () => void
  leaveAction: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function WorkspaceActions({ workspace, onUpdate, leaveAction }: WorkspaceActionsProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  
  const handleLeave = useCallback(async () => {
    setIsLeaving(true)
    
    try {
      const result = await leaveAction(workspace.id)
      
      if (result.success) {
        toast.success(`Left ${workspace.name} successfully`)
        onUpdate()
      } else {
        toast.error(result.error || 'Failed to leave workspace')
      }
    } catch (error) {
      console.error('Error leaving workspace:', error)
      toast.error('Failed to leave workspace')
    } finally {
      setIsLeaving(false)
    }
  }, [workspace.id, workspace.name, onUpdate, leaveAction])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isLeaving}
        >
          {isLeaving ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-destructive border-t-transparent" />
          ) : (
            <LogOut className="h-3 w-3" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Workspace</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave &quot;{workspace.name}&quot;? You will lose access to all prompts and data in this workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className="bg-destructive hover:bg-destructive/90"
          >
            Leave Workspace
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 