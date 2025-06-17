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
    
    try {
      const result = await generateShareLinkAction(promptId)
      
      if (result.success && result.shareUrl) {
        toast.success("Share link generated", {
          description: "Anyone with the link can view the prompt.",
          action: {
            label: "Copy Link",
            onClick: () => {
              navigator.clipboard.writeText(result.shareUrl!)
              toast.success("Link copied to clipboard!")
            },
          },
        })
      } else {
        toast.error("Failed to generate share link", {
          description: result.error || "Unknown error occurred",
        })
      }
    } catch (error) {
      console.error('Error generating share link:', error)
      toast.error("Failed to generate share link", {
        description: "An unexpected error occurred",
      })
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      return
    }

    // Delete functionality - will be implemented in Phase 2 with proper Server Action
    toast.info("Delete functionality coming soon", {
      description: "This feature will be available in the next update",
    })
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
            <DropdownMenuItem 
              onClick={handleDelete}
              disabled
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete prompt
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 