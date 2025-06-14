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
  category: Category
  workspaceSlug: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
      const response = await fetch(`/api/workspaces/${workspaceSlug}/categories/${category.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update category')
      }

      const result = await response.json()
      
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