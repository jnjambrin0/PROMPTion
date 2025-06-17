'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Edit2, Copy, Share2, Star, StarOff, Trash2, Pin, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { duplicatePromptAction, toggleFavoritePromptAction, generateShareLinkAction } from '@/lib/actions/prompt'
import { DeletePromptDialog } from './delete-prompt-dialog'

interface PromptActionsProps {
  promptId: string
  promptSlug: string
  workspaceSlug: string
  isOwner: boolean
  isFavorited?: boolean
  onFavoriteChange?: (isFavorited: boolean) => void
}

export function PromptActions({ 
  promptId, 
  promptSlug, 
  workspaceSlug, 
  isOwner, 
  isFavorited = false,
  onFavoriteChange 
}: PromptActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [favoriteState, setFavoriteState] = useState(isFavorited)
  const router = useRouter()

  const handleDuplicate = async () => {
    setIsLoading(true)
    
    try {
      const result = await duplicatePromptAction(promptId, workspaceSlug)
      
      if (result.success && result.promptSlug && result.workspaceSlug) {
        toast.success("Prompt duplicated successfully", {
          description: "You've been redirected to the duplicated prompt",
        })
        
        // Redirect to the duplicated prompt
        router.push(`/${result.workspaceSlug}/${result.promptSlug}`)
      } else {
        toast.error("Failed to duplicate prompt", {
          description: result.error || "Unknown error occurred",
        })
      }
    } catch (error) {
      console.error('Error duplicating prompt:', error)
      toast.error("Failed to duplicate prompt", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavorite = async () => {
    setIsLoading(true)
    
    try {
      const result = await toggleFavoritePromptAction(promptId)
      
      if (result.success && result.isFavorited !== undefined) {
        setFavoriteState(result.isFavorited)
        onFavoriteChange?.(result.isFavorited)
        
        toast.success(result.isFavorited ? "Added to favorites" : "Removed from favorites", {
          description: result.isFavorited 
            ? "This prompt has been added to your favorites" 
            : "This prompt has been removed from your favorites",
        })
      } else {
        toast.error("Failed to update favorites", {
          description: result.error || "Unknown error occurred",
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error("Failed to update favorites", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    setIsLoading(true)
    
    // 1. Construct URL optimistically on the client
    const shareUrl = `${window.location.origin}/${workspaceSlug}/${promptSlug}`

    try {
      // 2. Try to copy immediately
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")

      // 3. Validate with the server in the background
      const result = await generateShareLinkAction(promptId)

      // 4. If the prompt is not public, inform the user with a second toast.
      if (result.success && !result.isPublic) {
        toast.info("This prompt is not public", {
          description: "Only workspace members will be able to view it.",
        })
      } else if (!result.success) {
        toast.error("Could not verify share link", {
          description: result.error || "The copied link may not work for others.",
        })
      }
    } catch (error) {
      console.error('Error copying share link:', error)
      toast.error("Failed to copy link to clipboard.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    // Navigate to edit mode - this will be implemented in Phase 2
    router.push(`/${workspaceSlug}/${promptSlug}/edit`)
  }

  const handleFork = async () => {
    // Fork functionality - will be implemented in Phase 3
    toast.info("Fork functionality coming soon", {
      description: "This feature will be available in the next update",
    })
  }

  const handlePin = async () => {
    // Pin functionality - will be implemented in Phase 2
    toast.info("Pin functionality coming soon", {
      description: "This feature will be available in the next update",
    })
  }

  const handleSettings = () => {
    // Settings functionality - will be implemented in Phase 2
    router.push(`/${workspaceSlug}/${promptSlug}/settings`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isLoading}
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {/* Owner-only actions */}
        {isOwner && (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit prompt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin} disabled>
              <Pin className="h-4 w-4 mr-2" />
              Pin to top
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Common actions */}
        <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
          <Copy className="h-4 w-4 mr-2" />
          {isLoading ? 'Duplicating...' : 'Duplicate'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleFork} disabled>
          <ExternalLink className="h-4 w-4 mr-2" />
          Fork prompt
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleFavorite} disabled={isLoading}>
          {favoriteState ? (
            <>
              <StarOff className="h-4 w-4 mr-2" />
              Remove from favorites
            </>
          ) : (
            <>
          <Star className="h-4 w-4 mr-2" />
          Add to favorites
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleShare} disabled={isLoading}>
          <Share2 className="h-4 w-4 mr-2" />
          {isLoading ? 'Generating...' : 'Share'}
        </DropdownMenuItem>
        
        {/* Destructive actions - Owner only */}
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DeletePromptDialog promptId={promptId}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()} // Prevent Dropdown from closing
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete prompt
              </DropdownMenuItem>
            </DeletePromptDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 