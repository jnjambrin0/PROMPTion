'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
  description?: string | null
  icon: string
  color: string
  promptCount?: number
  isDefault?: boolean
}

interface DeleteCategoryDialogProps {
  category: Category
  workspaceSlug: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteCategoryDialog({
  category,
  workspaceSlug,
  trigger,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Use controlled or uncontrolled state
  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  const handleDeleteCategory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/categories/${category.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      const result = await response.json()
      toast.success('Category deleted successfully')
      setDialogOpen(false)
      router.refresh() // Refresh to remove deleted category
      
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
      <Trash2 className="h-3 w-3" />
    </Button>
  )

  // Don't show delete option for default categories
  if (category.isDefault) {
    return null
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <div>
              Are you sure you want to delete <strong>"{category.name}"</strong>? This action cannot be undone.
            </div>
            
            {category.promptCount && category.promptCount > 0 && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Impact Warning
                  </span>
                </div>
                <div className="text-sm text-yellow-700">
                  This category contains <Badge variant="outline" className="mx-1">
                    {category.promptCount} {category.promptCount === 1 ? 'prompt' : 'prompts'}
                  </Badge>. 
                  These prompts will be moved to "Uncategorized" and remain accessible.
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Category details:
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
              <span className="text-base">{category.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-muted-foreground">{category.description}</div>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {category.color}
              </Badge>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCategory}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Deleting...' : 'Delete Category'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 