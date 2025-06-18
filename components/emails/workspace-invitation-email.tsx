import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react'

interface WorkspaceInvitationEmailProps {
  workspaceName: string
  inviterName: string
  inviterEmail: string
  recipientEmail: string
  role: string
  message?: string
  invitationUrl: string
  expiresInDays: number
}

export const WorkspaceInvitationEmail: React.FC<Readonly<WorkspaceInvitationEmailProps>> = ({
  workspaceName,
  inviterName,
  inviterEmail,
  recipientEmail,
  role,
  message,
  invitationUrl,
  expiresInDays,
}) => {
  const previewText = `Join ${workspaceName} on Promption`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded-lg border border-gray-200 bg-white shadow-sm">
            
            {/* Header */}
            <Section className="px-12 py-6">
              <Row>
                <Column>
                  <Row>
                    <Column className="w-10">
                       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                        <span className="text-2xl font-bold text-white">P</span>
                      </div>
                    </Column>
                    <Column>
                      <Text className="m-0 pl-3 text-xl font-semibold tracking-tighter text-black">
                        Promption
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Content */}
            <Section className="px-12 py-6">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <span className="text-2xl">🎉</span>
              </div>
              
              <Text className="m-0 text-3xl font-bold text-black">
                You&apos;re invited to join {workspaceName}
              </Text>
              
              <Text className="m-0 text-base text-gray-600">
                {inviterName} has invited you to collaborate on Promption.
              </Text>
              
              {/* Invitation Details */}
              <Section className="mb-6 rounded-md bg-gray-50 p-5">
                <Row className="pb-3">
                  <Column>
                    <Text className="m-0 text-sm text-gray-500">Invited by</Text>
                    <Text className="m-0 pt-1 text-base font-medium text-gray-800">{inviterName}</Text>
                    <Text className="m-0 pt-1 text-sm text-gray-500">{inviterEmail}</Text>
                  </Column>
                </Row>
                <Hr className="my-3 border-gray-200" />
                <Row className="pt-3">
                  <Column>
                    <Text className="m-0 text-sm text-gray-500">Your role</Text>
                    <div className="mt-1 inline-block rounded-md bg-blue-100 px-2 py-1">
                      <Text className="m-0 text-sm font-medium text-blue-800">{role}</Text>
                    </div>
                  </Column>
                </Row>
              </Section>
              
              {/* Personal Message */}
              {message && (
                <Section className="mb-6 rounded-md border-l-4 border-indigo-500 bg-gray-50 p-4">
                  <Text className="m-0 mb-1 text-xs font-semibold uppercase text-gray-500">Personal Message</Text>
                  <Text className="m-0 text-base italic text-gray-700">
                    &ldquo;{message}&rdquo;
                  </Text>
                </Section>
              )}
              
              {/* CTA Button */}
              <Button
                href={invitationUrl}
                className="mb-8 block w-full rounded-md bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white"
              >
                Accept Invitation
              </Button>
              
              {/* Expiration Warning */}
              <Section className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4">
                <Row>
                  <Column className="w-6 align-top pt-1">
                     <Text className="m-0 text-base">⏰</Text>
                  </Column>
                  <Column>
                    <Text className="m-0 font-semibold text-amber-900">Time-sensitive invitation</Text>
                    <Text className="m-0 text-sm text-amber-800">
                      This invitation expires in {expiresInDays} days. After that, you&apos;ll need to request a new invitation.
                    </Text>
                  </Column>
                </Row>
              </Section>
              
              {/* What you'll get */}
              <Section className="mt-8">
                 <Text className="font-semibold text-gray-800">What you&apos;ll get access to:</Text>
                 <ul className="m-0 list-disc pl-5 text-sm text-gray-600">
                  <li className="mb-2">All shared prompts and templates in the workspace</li>
                  <li className="mb-2">Collaboration tools for team feedback</li>
                  <li className="mb-2">Performance analytics and insights</li>
                  <li>Version history and prompt iterations</li>
                </ul>
              </Section>

              {/* Alternative Link */}
              <Section className="mt-8 border-t border-gray-200 pt-6 text-center">
                 <Text className="text-sm text-gray-600">Having trouble? Copy and paste this link:</Text>
                 <Link href={invitationUrl} className="break-all text-xs text-indigo-600">
                   {invitationUrl}
                 </Link>
                 <Text className="mt-4 text-xs text-gray-500">
                   This invitation was sent to <strong>{recipientEmail}</strong>
                 </Text>
              </Section>
            </Section>
            
            {/* Footer */}
            <Section className="border-t border-gray-200 bg-gray-50 px-12 py-6 text-center">
              <Text className="m-0 text-xs text-gray-500">
                © {new Date().getFullYear()} Promption. The developer-first prompt management platform.
              </Text>
               <Text className="m-0 text-xs text-gray-500">
                  <Link href="https://promption.com/docs" className="text-gray-600">Documentation</Link> · 
                  <Link href="https://promption.com/privacy" className="text-gray-600">Privacy</Link> · 
                  <Link href="https://promption.com/security" className="text-gray-600">Security</Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WorkspaceInvitationEmail; 