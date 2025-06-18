'use client'

import { useState, useRef, useLayoutEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { submitFeedbackAction } from '@/lib/actions/feedback'
import { toast } from 'sonner'

interface FeedbackWidgetProps {
  className?: string
}

interface FeedbackFormData {
  email: string
  message: string
}

export function FeedbackWidget({ className = '' }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FeedbackFormData>({ email: '', message: '' })

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragInfo = useRef({
    isDragging: false,
    hasDragged: false,
    offsetX: 0,
    offsetY: 0
  })

  useLayoutEffect(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const initialTop = window.innerHeight - buttonRect.height - 24 // 24px = 1.5rem (bottom-6)
      const initialLeft = window.innerWidth - buttonRect.width - 24  // 24px = 1.5rem (right-6)
      setPosition({ top: initialTop, left: initialLeft })
    }
  }, [])

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || !buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    dragInfo.current = {
      isDragging: true,
      hasDragged: false,
      offsetX: e.clientX - buttonRect.left,
      offsetY: e.clientY - buttonRect.top,
    }
    
    buttonRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragInfo.current.isDragging) return
    
    e.preventDefault()
    
    const newTop = e.clientY - dragInfo.current.offsetY
    const newLeft = e.clientX - dragInfo.current.offsetX
    
    if (!dragInfo.current.hasDragged) {
      if (position) {
        const dTop = newTop - position.top;
        const dLeft = newLeft - position.left;
        if (Math.sqrt(dTop * dTop + dLeft * dLeft) > 5) {
            dragInfo.current.hasDragged = true
        }
      }
    }

    setPosition({ top: newTop, left: newLeft })
  }

  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    dragInfo.current.isDragging = false
    buttonRef.current.releasePointerCapture(e.pointerId)
  }

  const handleClick = () => {
    if (!dragInfo.current.hasDragged) {
      setIsOpen(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      toast.error('Please enter your feedback message')
      return
    }

    setIsSubmitting(true)

    const maxRetries = 2
    const retryDelay = 2000 // 2 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await submitFeedbackAction({
          email: formData.email.trim() || undefined,
          message: formData.message.trim(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })

        if (result.type === 'success') {
          toast.success(result.message || "Thank you for your feedback! We've received your message.")
          setFormData({ email: '', message: '' })
          setIsOpen(false)
          setIsSubmitting(false)
          return // Success, exit the loop
        }

        // If the server-side action failed but didn't throw, and it's the last attempt, show error
        if (attempt === maxRetries) {
          toast.error(result.message || 'Failed to submit feedback. Please try again.')
          break // Exit loop
        }

      } catch (error) {
        // This catches network errors or unexpected exceptions.
        console.error(`Feedback submission attempt ${attempt + 1} failed:`, error)
        if (attempt === maxRetries) {
          toast.error('Failed to connect to the server. Please check your connection and try again.')
          break // Exit loop
        }
      }
      
      // Wait before retrying
      await new Promise(res => setTimeout(res, retryDelay))
    }
    
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <button
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className={`fixed z-50 flex items-center gap-2 h-11 px-4 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-colors duration-200 select-none touch-none ${className}`}
        style={{
          visibility: position ? 'visible' : 'hidden',
          top: `${position?.top ?? 0}px`,
          left: `${position?.left ?? 0}px`,
          cursor: dragInfo.current.isDragging ? 'grabbing' : 'grab'
        }}
        title="Send feedback"
      >
        <MessageCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">Feedback</span>
      </button>

      {/* Feedback Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="relative w-full max-w-md bg-white border border-gray-200 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Send Feedback</h3>
                  <p className="text-sm text-gray-600">Help us improve Promption</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="feedback-email" className="text-sm font-medium text-gray-700">
                    Email (optional)
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We&apos;ll only use this to follow up if needed
                  </p>
                </div>
                <div>
                  <Label htmlFor="feedback-message" className="text-sm font-medium text-gray-700">
                    Your feedback *
                  </Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Tell us what you think, report a bug, or suggest a feature..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1 min-h-[100px] border-gray-200 focus:border-gray-400 focus:ring-gray-400 resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.message.trim()}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  )
} 