'use client'

import { useState, useTransition } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { inviteMemberAction } from '@/lib/actions/members'
import type { MemberRole } from '@/lib/types/members'

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const inviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  role: z.enum(['ADMIN', 'EDITOR', 'MEMBER', 'VIEWER'], {
    required_error: 'Role is required',
  }),
  message: z
    .string()
    .max(500, 'Message is too long')
    .optional(),
})

type InviteMemberForm = z.infer<typeof inviteMemberSchema>

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

const roleOptions = [
  {
    value: 'ADMIN' as const,
    label: 'Admin',
    description: 'Can manage workspace settings and all members',
  },
  {
    value: 'EDITOR' as const,
    label: 'Editor',
    description: 'Can create and edit all prompts',
  },
  {
    value: 'MEMBER' as const,
    label: 'Member',
    description: 'Can create prompts and collaborate',
  },
  {
    value: 'VIEWER' as const,
    label: 'Viewer',
    description: 'Can only view prompts and workspace content',
  },
]

// ============================================================================
// COMPONENT
// ============================================================================

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const params = useParams()
  const workspaceSlug = params.workspace as string
  
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
      message: '',
    },
  })

  const handleInviteMember = async (data: InviteMemberForm) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)

    try {
      startTransition(async () => {
        const result = await inviteMemberAction(workspaceSlug, {
          email: data.email,
          role: data.role as MemberRole,
          message: data.message || undefined,
        })

        if (result.success) {
          // Success toast
          toast.success('Invitation sent successfully!', {
            description: `Invited ${data.email} as ${data.role.toLowerCase()}`,
            duration: 5000,
          })

          // Reset form and close dialog
          form.reset()
          onOpenChange(false)
        } else {
          // Error toast
          toast.error('Failed to send invitation', {
            description: result.error || 'Something went wrong. Please try again.',
            duration: 6000,
          })
        }
      })
    } catch (error) {
      console.error('Error inviting member:', error)
      
      // Critical error toast
      toast.error('Unexpected error occurred', {
        description: 'Unable to send invitation. Please refresh and try again.',
        duration: 8000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (isSubmitting) return
    
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to this workspace. 
            They'll receive an email with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleInviteMember)} 
            className="space-y-6"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Email address of the person you want to invite
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Role determines what actions the member can perform
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal message to the invitation..."
                      disabled={isSubmitting}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional message to include with the invitation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting || isPending}
              >
                {isSubmitting || isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 