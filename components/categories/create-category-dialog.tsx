'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
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

type CategoryFormData = {
  name: string
  description?: string
  icon: string
  color: string
}

type CreateCategoryData = CategoryFormData & {
  slug: string
}

interface CreateCategoryDialogProps {
  workspaceSlug: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateCategoryDialog({
  workspaceSlug,
  trigger,
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Use controlled or uncontrolled state
  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  const handleCreateCategory = async (data: CreateCategoryData) => {
    setIsLoading(true)
    try {
      const { createCategoryAction } = await import('@/lib/actions/categories')
      const result = await createCategoryAction(workspaceSlug, data)

      if (!result.success) {
        throw new Error(result.error || 'Failed to create category')
      }
      
      toast.success('Category created successfully')
      setDialogOpen(false)
      router.refresh() // Refresh to show new category
      
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create category')
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline">
      <Plus className="h-4 w-4 mr-2" />
      New Category
    </Button>
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your prompts. Categories help you keep your workspace organized and make it easier to find related prompts.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onSubmit={async (data) => {
            await handleCreateCategory({
              name: data.name,
              icon: data.icon,
              color: data.color,
              description: data.description,
              slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            })
          }}
          isLoading={isLoading}
          submitLabel="Create Category"
          onCancel={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 