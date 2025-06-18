import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface FeedbackEmailProps {
  email?: string;
  message: string;
  url: string;
  userAgent: string;
  timestamp: string;
}

export const FeedbackEmail = ({
  email,
  message,
  url,
  userAgent,
  timestamp,
}: FeedbackEmailProps) => {
  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  const previewText = `New Feedback from ${email || 'Anonymous'}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            fontFamily: {
              mono: [
                'SF Mono',
                'Monaco',
                'Inconsolata',
                'Fira Code',
                'Courier New',
                'monospace',
              ],
            },
          },
        }}
      >
        <Body className="bg-slate-900 font-mono text-slate-300">
          <Container className="mx-auto my-10 max-w-xl rounded-lg border border-slate-700 bg-slate-800 p-6">
            <Section className="border-b border-slate-700 pb-4">
              <Row>
                <Column>
                  <Text className="m-0 flex items-center text-base font-semibold">
                    <span className="mr-2 text-lg text-green-400">●</span>
                    <span className="text-slate-50">NEW FEEDBACK RECEIVED</span>
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-xs text-slate-400">
                    {formattedDate}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="py-5">
              <div className="rounded-md border border-slate-700 bg-slate-900 p-4">
                <Row className="pb-2">
                  <Column className="w-24 text-slate-400">FROM:</Column>
                  <Column className="font-semibold text-slate-200">
                    {email || 'Anonymous User'}
                  </Column>
                </Row>
                <Row>
                  <Column className="w-24 align-top text-slate-400">
                    PAGE:
                  </Column>
                  <Column>
                    <Link
                      href={url}
                      className="break-all text-blue-400 no-underline"
                    >
                      {url}
                    </Link>
                  </Column>
                </Row>
              </div>
            </Section>

            <Section className="py-5">
              <Text className="mb-2 text-xs font-semibold uppercase text-slate-400">
                MESSAGE:
              </Text>
              <div className="whitespace-pre-wrap break-words rounded-md border border-slate-700 bg-slate-900 p-4 font-mono text-sm text-slate-50">
                {message}
              </div>
            </Section>
            
            <Section className="py-5">
              <details>
                <summary className="cursor-pointer text-xs font-semibold uppercase text-slate-400 outline-none">
                  ▶ TECHNICAL DETAILS
                </summary>
                <div className="mt-2 whitespace-pre-wrap break-words rounded-md border border-slate-700 bg-slate-900 p-3 text-xs text-slate-400">
                  User Agent: {userAgent}
                </div>
              </details>
            </Section>

            <Section className="mt-5 rounded-b-lg border-t border-slate-700 bg-slate-900 p-5 text-center">
                <Text className="mb-3 text-xs uppercase text-slate-400">
                  QUICK ACTIONS
                </Text>
                {email && (
                  <Button
                    href={`mailto:${email}?subject=Re: Your Promption Feedback`}
                    className="mr-2 rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 no-underline"
                  >
                    📧 Reply
                  </Button>
                )}
                <Button
                  href={url}
                  className="rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 no-underline"
                >
                  🔗 View Page
                </Button>
            </Section>
          </Container>
          
          <Text className="text-center text-xs text-slate-600">
            This is an automated internal notification from Promption Feedback
            System
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FeedbackEmail; 