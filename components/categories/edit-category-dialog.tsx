'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CategoryForm } from './category-form'

interface Category {
  id: string
  name: string
  description?: string | null
  icon: string
  color: string
  promptCount?: number
  isDefault?: boolean
}

interface EditCategoryDialogProps {
  category: {
    id: string
    name: string
    icon: string | null
    color: string | null
    description?: string | null
  }
  isOpen: boolean
  onClose: () => void
  onEditCategory: (data: {
    name: string
    icon: string
    color: string
    description?: string
  }) => Promise<void>
  isLoading?: boolean
}

export function EditCategoryDialog({
  category,
  workspaceSlug,
  trigger,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Use controlled or uncontrolled state
  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  const handleUpdateCategory = async (data: any) => {
    setIsLoading(true)
    try {
      const { updateCategoryAction } = await import('@/lib/actions/categories')
      const result = await updateCategoryAction(workspaceSlug, category.id, data)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update category')
      }
      
      toast.success('Category updated successfully')
      setDialogOpen(false)
      router.refresh() // Refresh to show updated category
      
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update category')
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
      <Edit2 className="h-3 w-3" />
    </Button>
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to <strong>{category.name}</strong>. This will update how this category appears across your workspace.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={{
            name: category.name,
            description: category.description || '',
            icon: category.icon,
            color: category.color,
          }}
          onSubmit={handleUpdateCategory}
          isLoading={isLoading}
          submitLabel="Update Category"
          onCancel={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 