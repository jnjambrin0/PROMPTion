import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId } from '@/lib/db/users'
import { acceptWorkspaceInvitation, rejectWorkspaceInvitation } from '@/lib/db/members'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Users, Calendar, Mail, User } from 'lucide-react'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

interface InvitationPageProps {
  params: Promise<{
    token: string
  }>
}

async function getInvitation(token: string) {
  if (!token) return null

  try {
    const invitation = await prisma.workspaceInvitation.findFirst({
      where: {
        token,
        status: 'PENDING',
        expiresAt: { gt: new Date() }
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logoUrl: true
          }
        },
        invitedBy: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    })

    return invitation
  } catch (error) {
    console.error('Error fetching invitation:', error)
    return null
  }
}

async function InvitationContent({ token }: { token: string }) {
  const invitation = await getInvitation(token)
  
  if (!invitation) {
    return (
      <div className="min-h-screen bg-neutral-25 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid, expired, or has already been used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user is authenticated
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    // Redirect to login with invitation token
    redirect(`/auth/login?invitation=${token}`)
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    redirect('/auth/login')
  }

  // Check if invitation email matches user email
  const emailMatches = user.email.toLowerCase() === invitation.email.toLowerCase()

  async function handleAccept() {
    'use server'
    
    try {
      const supabase = await createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        redirect('/auth/login')
      }

      const user = await getUserByAuthId(authUser.id)
      if (!user) {
        redirect('/auth/login')
      }

      await acceptWorkspaceInvitation(token, user.id)
      redirect(`/${invitation!.workspace.slug}?invited=true`)
    } catch (error) {
      console.error('Error accepting invitation:', error)
      // Handle error - could redirect to error page or show toast
    }
  }

  async function handleReject() {
    'use server'
    
    try {
      await rejectWorkspaceInvitation(token)
      redirect('/?invitation=rejected')
    } catch (error) {
      console.error('Error rejecting invitation:', error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-25 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-lg bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
                     <CardTitle className="text-2xl">You&apos;re Invited!</CardTitle>
           <CardDescription>
             Join {invitation.workspace.name} on Promption
           </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Workspace Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
              <div className="h-12 w-12 rounded-lg bg-neutral-200 flex items-center justify-center flex-shrink-0">
                {invitation.workspace.logoUrl ? (
                  <Image 
                    src={invitation.workspace.logoUrl} 
                    alt={invitation.workspace.name}
                    className="h-8 w-8 rounded"
                  />
                ) : (
                  <span className="text-lg font-semibold text-neutral-600">
                    {invitation.workspace.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900">{invitation.workspace.name}</h3>
                {invitation.workspace.description && (
                  <p className="text-sm text-neutral-600 truncate">{invitation.workspace.description}</p>
                )}
              </div>
              <Badge variant="secondary">{invitation.role}</Badge>
            </div>

            {/* Inviter Info */}
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <User className="h-4 w-4 flex-shrink-0" />
              <span>
                Invited by <strong>{invitation.invitedBy.fullName || invitation.invitedBy.username}</strong>
              </span>
            </div>

            {/* Email verification */}
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 flex-shrink-0 text-neutral-500" />
              <span className={emailMatches ? 'text-green-600' : 'text-amber-600'}>
                {emailMatches ? (
                  <>✓ Invitation sent to {invitation.email}</>
                ) : (
                  <>⚠️ Invitation was sent to {invitation.email}, but you&apos;re logged in as {user.email}</>
                )}
              </span>
            </div>

            {/* Personal message */}
            {invitation.message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 italic">
                  &ldquo;{invitation.message}&rdquo;
                </p>
              </div>
            )}

            {/* Expiration warning */}
            <div className="flex items-center gap-3 text-sm text-amber-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                Expires on {new Date(invitation.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <form action={handleReject} className="flex-1">
              <Button type="submit" variant="outline" className="w-full">
                Decline
              </Button>
            </form>
            <form action={handleAccept} className="flex-1">
              <Button type="submit" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Invitation
              </Button>
            </form>
          </div>

          {!emailMatches && (
            <div className="text-center">
              <p className="text-xs text-neutral-500 mb-2">
                Wrong account? Sign in with the invited email address.
              </p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/logout">Switch Account</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-25 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <InvitationContent token={token} />
    </Suspense>
  )
} 